(ns backend.routes.filtered-syslog-handler-test
  (:require [clojure.data.json :refer [read-str]]
            [clojure.test :refer :all]
            [ring.middleware.params :refer [wrap-params]]
            [ring.mock.request :as mock]))

(def mock-data {:status 200
                :headers {"Content-Type" "application/json"}
                :body
                [{"system_log_id" 1
                  "device_id" 5
                  "adaption_id" 1
                  "description" "test description"
                  "created" "2019-05-03T18:02:52Z"
                  "adaption_type" "Compress"
                  "adaption_id_2" 1}
                 {"system_log_id" 2
                  "device_id" 10
                  "adaption_id" 2
                  "description" "test description"
                  "created" "2019-05-03T18:02:52Z"
                  "adaption_type" "Compress"
                  "adaption_id_2" 1}]})

(defn mock-filtered-syslog [{}] (constantly nil))

(defn run-mock
  "Mocking syslog handler so it doesn't query the database"
  [req-str]
  (with-redefs
   [backend.routes.filteredsyslog/filtered-syslog-check (constantly mock-data)
    backend.filterlog/get-filtered-syslog mock-filtered-syslog]
    (as-> req-str s
      (mock/request :get s)
      ((wrap-params backend.routes.core/app-routes) s)
      (update s :body read-str))))

(deftest filtered-syslog-test
  (testing "system log query"
    (let [bad-rep (run-mock "/filtersyslog?invalidparam=ok")
          good-rep (run-mock "/filtersyslog?description=test")]
      (is (= {:status 400
              :headers {"Content-Type" "application/json"}
              :body {"Error" "Invalid query"}}
             bad-rep))
      (is (= mock-data good-rep)))))
