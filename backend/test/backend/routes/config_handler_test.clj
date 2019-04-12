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
              :body {"Error" "Can't connect to the database"}}
          e2 {:status 200
              :headers {"Content-Type" "application/json"}
              :body {"test" 1}}]
      (is (= e1 t1))
      (is (= (backend.routes.config/config-check []) {:status 404, :headers {"Content-Type" "application/json"}, :body {"Error" "No query results found"}}))
      (is (= (backend.routes.config/config-check "test") {:status 200, :headers {"Content-Type" "application/json"}, :body "test"}))
      (is (= (e2 :body) (t2 :body))))))
