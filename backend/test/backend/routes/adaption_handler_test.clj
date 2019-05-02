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
   [{:type "NetworkCollection"
     :collection [{:type "NetworkGraph"
                   :protocol "olsrv2"}
                  {:type "NetworkGraph"
                   :protocol "olsvr1"}]}
    {:type "NetworkCollection"
     :collection [{:type "GeoLocation"
                   :Originator "192.178.1.100"}
                  {:type "GeoLocation"
                   :Originator "192.177.1.100"}]}]})

(def dummy-db-req
  '(23901
    {:type "NetworkCollection"
     :collection
     [{:type "NetworkCollection"
       :collection [{:type "NetworkGraph"
                     :protocol "olsrv2"}
                    {:type "NetworkGraph"
                     :protocol "olsvr1"}]}
      {:type "NetworkCollection"
       :collection [{:type "GeoLocation"
                     :Originator "192.178.1.100"}
                    {:type "GeoLocation"
                     :Originator "192.177.1.100"}]}]}
    "sometimestamp"))

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
      (is (= (get-in body [:options :protocol])
             (get-in dummy-coll [:collection 0 :collection 0 :protocol]))))))
