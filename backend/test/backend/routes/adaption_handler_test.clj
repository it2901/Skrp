(ns backend.routes.adaption-handler-test
  (:require [clojure.data.json :refer [read-str
                                       write-str]]
            [clojure.test :refer :all]
            [backend.routes.core :refer [app-routes]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.mock.request :as mock]))

(def dummy-coll
  {:type "Collector"
   :device-id 300
   :collection
   [{:type "NetworkGraph"
     :protocol "OSVL"}]})

(def dummy-db-req
  [55
   {:type "Collector"
    :collection
    [{:type "NetworkGraph"
      :protocol "TCP"}]}
   "sometimestamp"])

(defn mock-db-query
  "Mock the database query in the adaption request handler"
  []
  (with-redefs
   [backend.logging/get-network-collection (constantly dummy-db-req)
    backend.logging/insert-network-collection (constantly nil)]
    (as-> (mock/request :post "/lognetwork") m
      (mock/json-body m dummy-coll) ;;wrap json body
      ((wrap-params app-routes) m)
      (update m :body read-str :key-fn keyword))))

(deftest adaption-dummy-request
  (testing "Dummy route for adaption command request"
    (let [response (mock-db-query)
          body (:body response)]
      (is (= (:status response) 200))
      (is (= (get-in body [:options :protocol]) (get-in dummy-coll [:collection 0 :protocol])))
      (is (= 300 (:device-id body))))))
