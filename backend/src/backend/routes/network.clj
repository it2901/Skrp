;;;; This file is part of SKRP.
;;;;
;;;; SKRP is free software: you can redistribute it and/or modify
;;;; it under the terms of the GNU Lesser General Public License as published
;;;; by the Free Software Foundation, either version 3 of the License, or
;;;; (at your option) any later version.
;;;;
;;;; SKRP is distributed in the hope that it will be useful,
;;;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;;;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;;; GNU Lesser General Public License for more details.
;;;;
;;;; You should have received a copy of the GNU Lesser General Public License
;;;; along with SKRP. If not, see <https://www.gnu.org/licenses/>.

(ns backend.routes.network
  "Functions for handling the /network endpoint"
  (:require [backend.logging :refer [get-network-collection]]
            [backend.deviceconfiguration-spec]
            [backend.devicemonitoring-spec]
            [backend.geolocation-spec]
            [backend.networkcollection-spec]
            [backend.networkgraph-spec]
            [backend.networkroutes-spec]
            [backend.routes.util :refer [error-handler-rep]]
            [clojure.spec.alpha :refer [conform explain]]))

;; 1: compare all GeoLocations with NetworkGraphs and remove shit nodes
;; 2: remove all links that don't have two nodes for all NetworkGraphs

(defn- coll-filter
  "Filters nested NetworkCollections based on their type"
  [coll-type]
  (fn [netcoll] (= coll-type (:type (first (:collection netcoll))))))

(defn- filter-nodes
  "Filters the nodes based on ip addresses in geolocations"
  [origin-ips nodes]
  (filterv (fn [node] (some #(= (:id node) %) origin-ips)) nodes))

(defn- update-nodes
  "Updates the key node in the NetworkGraph map"
  [origin-ips networkgraph]
  (update networkgraph :nodes (partial filter-nodes origin-ips)))

(defn- filter-links
  "Filters the links based on the node ips"
  [links nodes]
  (filterv
   (fn [link]
     (and (some #(= (:source link) (:id %)) nodes)
          (some #(= (:target link) (:id %)) nodes)))
   links))

(defn- update-links
  "Updates the links based on the nodes"
  [{:keys [nodes] :as networkgraph}]
  (update networkgraph :links filter-links nodes))

(defn- remove-nodes
  "Removes all nodes in the NetworkGraphs which don't contain
  corresponding geolocations"
  [coll]
  (let [geofilter (coll-filter "GeoLocation")
        graphfilter (coll-filter "NetworkGraph")
        geocoll (:collection (first (filter geofilter coll)))
        graphnetcoll (first (filter graphfilter coll))
        ;;care with this capital O in keyword
        origin-ips (map :Originator geocoll)]
    (update graphnetcoll :collection
            (partial mapv (partial update-nodes origin-ips)))))

(defn- remove-links
  "Removes all links that don't have bothcorresponding nodes"
  [netcollgraph]
  (update netcollgraph :collection (partial mapv update-links)))

(defn- update-netcol
  "Updates the root NetworkCollection"
  [{coll :collection :as root-netcoll}]
  (-> root-netcoll
      (update :collection #(vector (remove-links (remove-nodes %))))
      ;; Quick and dirty, should make removal functions non lossy
      (assoc-in [:collection 1] (first (filterv (coll-filter "GeoLocation") coll)))))

(defn network-handler
  "Handles HTTP GET requests to the api and returns the
  cleaned NetworkCollection json objects"
  [req]
  (let [[{data :collection}] (get-network-collection :latest)
        res (try (update-netcol (clojure.walk/keywordize-keys data))
                 (catch Exception e
                   (str "caught exception: " (.getMessage e))))
        verified (conform :backend.networkcollection-spec/networkcollection res)]
    (cond
      (empty? data) (error-handler-rep 404 "NetworkCollection table is empty")
      (not (map? res)) (error-handler-rep 500 res)
      (= :clojure.spec.alpha/invalid
         verified) (error-handler-rep 500 "Could not clean data")
      :else {:status 200
             :headers {"Content Type" "application/json"}
             :body res})))
