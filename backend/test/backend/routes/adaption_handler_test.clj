(ns backend.routes.adaption-handler-test
  (:require [clojure.data.json :refer [read-str
                                       write-str]]
            [clojure.test :refer :all]
            [backend.routes.core :refer [app-routes]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.mock.request :as mock]))

(def dummy-coll
  {:type "NetworkCollection"
   :collection
   [{:type "NetworkGraph"
     :protocol "OSVL"}]})

(def dummy-db-req
  [55
   {:type "NetworkCollection"
    :collection
    [{:type "NetworkGraph"
      :protocol "TCP"}]}
   "sometimestamp"])

(defn mock-db-query
  "Mock the database query in the adaption request handler"
  [param-map]
  (with-redefs
    [backend.logging/get-network-collection (constantly dummy-db-req)]
    (as-> param-map m
      (mock/request :get "/adaption" m)
      ((wrap-params app-routes) m)
      (update m :body read-str))))
    

(deftest adaption-dummy-request
  (testing "Dummy route for adaption commenad request"
    (let [response (mock-db-query {:device-id 300
                                   :collection (write-str dummy-coll)})
          body (:body response)]
      (is (= (:status response) 200))
      (is (= (:device-id body) (get-in dummy-coll [:collection 0 :protocol]))))))
