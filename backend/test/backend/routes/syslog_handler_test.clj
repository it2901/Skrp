(ns backend.routes.syslog-handler-test
  (:require [clojure.data.json :refer [read-str]]
            [clojure.test :refer :all]
            [ring.middleware.params :refer [wrap-params]]
            [ring.mock.request :as mock]))

(def mock-data {:status 200
                :headers {"Content-Type" "application/json"}
                :body
                [{"system_log_id" 3
                  "device_id" 111222
                  "adaption_id" 1
                  "description" "This is a meme test"
                  "created" "2019-03-22T14:02:12Z"}
                 {"system_log_id" 4
                  "device_id" 888999
                  "adaption_id" 2
                  "description" "This is a test boissssssssssssss"
                  "created" "2019-03-22T14:15:58Z"}]})

(defn mock-syslog
  ([] nil)
  ([_] nil)
  ([_ _] nil))

(defn run-mock
  "Mocking syslog handler so it doesn't query the database"
  [req-str]
  (with-redefs
   [backend.routes.syslog/syslog-check (fn [_] mock-data)
    backend.logging/get-syslog mock-syslog]
    (as-> req-str s
      (mock/request :get s)
      ((wrap-params backend.routes.core/app-routes) s)
      (update s :body read-str))))

(deftest syslog-test
  (testing "system log query"
    (let [bad-rep (run-mock "/syslog?datefrom=2019-01-01")
          good-rep (run-mock "/syslog")]
      (is (= {:status 400
              :headers {"Content-Type" "application/json"}
              :body {"Error" "Invalid query"}}
             bad-rep))
      (is (= mock-data good-rep)))))
