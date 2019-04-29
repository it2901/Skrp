(ns backend.routes.adaption
  :require [backend.logging :refer [get-network-collection]
            backend.routes.util :refer [error-handler-rep]])

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
          :new req-proto}))
      (error-handler-rep 400 "Bad Request"))))

(defn command-builder
  "Builds the response map"
  [{:keys [eq-proto? protos]}]
  {:name "Adaption Command"
   :type "Change Protocol"
   :options {:protocol (if eq-proto?
                         (:current protos)
                         (:new protos))}})
