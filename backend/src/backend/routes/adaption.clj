(ns backend.routes.adaption
  (:require [backend.logging :refer [get-network-collection]]
            [backend.routes.util :refer [error-handler-rep]]))

(defn command-builder
  "Builds the response map"
  [{:keys [eq-proto? protos device-id]}]
  {:name "Adaption Command"
   :type "Change Protocol"
   :device-id device-id
   :options {:protocol (if eq-proto?
                         (:current protos)
                         (:new protos))
             :keep-alive-period 10
             :max-retries 3
             :waiting-time 10}})


(defn adaption-request-handler
  "HTTP GET handler for requesting network adaptions. This endpoint
  will log the data it recieves and respond with a suitable adaption."
  [{params :query-params :as req}]
  (let [netcoll (:collection params)
        get-proto (fn [nc]
                    (:protocol
                     (first (filter
                             #((= "NetworkGraph" (:type %)))
                             nc))))]
    (if netcoll
      (let [[_ data _] (get-network-collection :latest)
            db-proto (get-proto data)
            req-proto (get-proto netcoll)]
        (command-builder
         (= req-proto db-proto)
         {:current db-proto
          :new req-proto}
         (:device-id params)))        
      (error-handler-rep 400 "Bad Request"))))
