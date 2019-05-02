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
            [backend.routes.util :refer [error-handler-rep]]))

;; 1: compare all GeoLocations with NetworkGraphs and remove shit nodes
;; 2: remove all links that don't have two nodes for all NetworkGraphs

(defn- coll-filter
  "Filters nested NetworkCollections based on their type"
  [coll-type]
  (fn [netcoll] (= coll-type (:type (first (:collection netcoll))))))

(defn- filter-nodes
  "Filters the nodes based on ip addresses in geolocations"
  [origin-ips nodes]
  (filter (fn [node] (some #(= :id node %) origin-ips)) nodes))

(defn- update-nodes
  "Updates the key node in the NetworkGraph map"
  [origin-ips networkgraph]
  (update networkgraph :nodes filter-nodes origin-ips))

(defn- remove-nodes
  "Removes all nodes in the NetworkGraphs which
  don't contain corresponding geolocations"
  [network]
  (let [coll (:collection network)
        geofilter (coll-filter "GeoLocation")
        graphfilter (coll-filter "NetworkGraph")
        geocoll (:collection (first (filter geofilter coll)))
        graphnetcoll (first (filter graphfilter coll))
        ;;care with this capital O in keyword
        origin-ips (map :Originator geocoll)]
    (update graphnetcoll :collection map (partial update-nodes origin-ips))))

(defn network-handler
  [req]
  (let [network (get-network-collection :latest)]
    {:status 200
     :headers {"Content Type" "application/json"}
     :body "hello world"}))
