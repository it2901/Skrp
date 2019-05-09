(ns backend.routes.logadaption-handler-test
  (:require [clojure.data.json :refer [read-str
                                       write-str]]
            [clojure.test :refer :all]
            [backend.routes.core :refer [app-routes]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.mock.request :as mock]
            [backend.routes.logadaption :refer [adaption-handler]]
            [cheshire.core :as cheshire]
            [cheshire.core :as json]))

(def dummy-response
  {"system_log_id" "5"
   "device_id"     "24"
   "adaption_id" "4"
   "description"   "desc"
   "created"       "2019-05-03T17:01:10Z"})

(def full-dummy-response
  {:status 200
   :headers {"Content-Type" "application/json"}
   :body {"system_log_id" "5"
          "device_id"     "24"
          "adaption_id" "4"
          "description"   "desc"
          "created"       "2019-05-03T17:01:10Z"}})

(def bad-dummy
  {:status 503
   :headers {"Content-Type" "application/json"}
   :body {"Error" "Invalid query"}})

(defn mock-db-query
  "Mock the database query in the handler for the /logadaption endpoint"
  [req-str]
  (with-redefs
   [backend.logging/get-adaption-id (constantly 2)
    backend.routes.logadaption/device-registered? (constantly true)
    backend.logging/insert-syslog (constantly dummy-response)]
    (as-> req-str m
      (mock/request :post m)
      ((wrap-params backend.routes.core/app-routes) m)
      (update m :body read-str))))

(deftest adaption-dummy-request
  (testing "Dummy route for adaption command request"
    (let [good-rep (mock-db-query "/logadaption?device_id=1&adaption_type=adapType&description=desc")
          bad-rep (mock-db-query "/logadaption?rep=bad&device_id=x")]
      (is (= (:status good-rep) 200))
      (is (= good-rep (update full-dummy-response :body first)))
      (is (= bad-rep bad-dummy)))))
