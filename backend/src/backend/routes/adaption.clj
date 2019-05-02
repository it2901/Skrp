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
          :device-id device-id
          :options {:protocol (if eq-proto?
                                (:current protos)
                                (:new protos))
                    :keep-alive-period 10
                    :max-retries 3
                    :waiting-time 10}}})

(defn adaption-request-handler
  "HTTP GET handler for requesting network adaptions. This endpoint
  will log the data it recieves and respond with a suitable adaption.
  The endpoint accepts a device-id param and a json body with a type
  string and a collection array of NetJSON objects."
  [{netcoll :body :as req}]
  (let [get-proto (fn [nc]
                    (as-> nc nc
                      (filter #(= "NetworkGraph" (:type %)) nc)
                      (first nc)
                      (:protocol nc)))]
    (if netcoll
      (let [[_ data _] (get-network-collection :latest)
            db-proto (get-proto (:collection data))
            req-proto (get-proto (:collection netcoll))]
        (insert-network-collection netcoll)
        (command-builder
         {:eq-proto? (= req-proto db-proto)
          :protos {:current db-proto
                   :new req-proto}
          :device-id (:device-id netcoll)}))
      (error-handler-rep 400 "Bad Request"))))
