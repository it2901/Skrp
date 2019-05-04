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

(ns backend.routes.adaption
  (:require [backend.logging :refer [get-network-collection
                                     insert-network-collection]]
            [backend.routes.util :refer [error-handler-rep]]
            [ring.middleware.json :only [wrap-json-body]]))

(defn command-builder
  "Builds the response map"
  [{:keys [eq-proto? protos device-id]}]
  {:status 200
   :headers {"Content-Type" "application/json"}
   :body {:name "Adaption Command"
          :type "Change Protocol"
          :options {:protocol (if eq-proto?
                                (:current protos)
                                (:new protos))
                    :keep-alive-period 10
                    :max-retries 3
                    :waiting-time 10}}})

(defn get-protocol
  "Gets the protocol of a NetworkGraph from a nested
  NetworkCollection. Will pick the first object it finds"
  [nc]
  (as-> nc nc
    (:collection nc)
    (filter #(= (:type (first (:collection %)))
                "NetworkGraph") nc)
    (first nc)
    (get-in nc [:collection 0 :protocol])))

(defn adaption-request-handler
  "HTTP GET handler for requesting network adaptions. This endpoint
  will log the data it recieves and respond with a suitable adaption.
  The endpoint accepts a json body with a type string, device-id number
  and a collection array of NetJSON objects."
  [{netcoll :body :as req}]
  (if netcoll
    (let [[{data :collection}] (get-network-collection :latest)
          db-proto (get-protocol (clojure.walk/keywordize-keys data))
          req-proto (get-protocol netcoll)]
      (insert-network-collection netcoll)
      (command-builder
       {:eq-proto? (= req-proto db-proto)
        :protos {:current db-proto
                 :new req-proto}}))
    (error-handler-rep 400 "Bad Request")))
