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

(ns backend.routes.config-handler-test
  (:require [clojure.data.json :refer [read-str]]
            [clojure.test :refer :all]
            [backend.routes.config :refer [config-check]]
            [backend.configuration :refer [read-config]]
            [backend.routes.core :refer [app-routes]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.mock.request :as mock]))

(defn mock-config [] (constantly nil))

(def mock-data "{\"test\": 1}")

(defn run-mock
  "Mocking config handler so it doesn't query the database"
  [req-str]
  (with-redefs
   [config-check (constantly mock-data)
    read-config mock-config]
    (as-> req-str s
      (mock/request :get s)
      ((wrap-params app-routes) s)
      (update s :body read-str))))

(deftest config-test
  (testing "config query"
    (let [t1 (run-mock "/configure?athotn=123")
          t2 (run-mock "/configure")
          e1 {:status 503
              :headers {"Content-Type" "application/json"}
              :body {"Error" [{"type" "org.postgresql.util.PSQLException", "message" "Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.", "at" ["org.postgresql.core.v3.ConnectionFactoryImpl" "openConnectionImpl" "ConnectionFactoryImpl.java" 280]} {"type" "java.net.ConnectException", "message" "Connection refused (Connection refused)", "at" ["java.net.PlainSocketImpl" "socketConnect" "PlainSocketImpl.java" -2]}]}}
          e2 {:status 200
              :headers {"Content-Type" "application/json"}
              :body {"test" 1}}]
      (is (= (keys (:body e1)) (keys (:body t1))))
      (is (= (backend.routes.config/config-check []) {:status 404, :headers {"Content-Type" "application/json"}, :body {"Error" "No query results found"}}))
      (is (= (backend.routes.config/config-check "test") {:status 200, :headers {"Content-Type" "application/json"}, :body "test"}))
      (is (= (keys (:body e2)) (keys (:body t2)))))))
