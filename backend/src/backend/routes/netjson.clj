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

(ns backend.routes.netjson
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.java.io :as io]
            [backend.logging :refer [get-syslog, set-device-id, insert-adaption, insert-syslog,]]
                                     ;;testreturn, test-parse]]
            [ring.middleware.json :refer [wrap-json-response]]))

(defn index-handler
  "Says hello world"
  [_]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    "<h1>Hello World!</h1>"})

(defn dummy-data-handler
  "HTTP response for dummy networkgraph data"
  [_]
  {:status  200
   :headers {"Content-Type" "application/json"}
   :body    (slurp (io/resource "networkgraph.json"))})

(defn error-handler-rep
  "HTTP error response template"
  [status msg]
  (fn [_]
    {:status  status
     :headers {"Content-Type" "application/json"}
     :body    {"Error" msg}}))

(defn syslog-check
  "Returns correct HTTP response according to system log query result"
  [result]
  ;; TODO: Find a way to handle db connection error
  (let [[status body] (if (= [] result)
                        [404 {"Error" "No query results found"}]
                        [200 result])]
    {:status status
     :headers {"Content-Type" "application/json"}
     :body body}))

(defn syslog-handler
  "HTTP GET response for system log"
  [{params :query-params :as req}]
  (cond
    (empty? params) (syslog-check (get-syslog))
    (contains? params "date") (syslog-check (get-syslog (params "date")))
    (and
     (contains? params "datefrom")
     (contains? params "dateto")) (syslog-check
                                   (get-syslog
                                    (params "datefrom")
                                    (params "dateto")))
    :else (error-handler-rep 400 "Invalid query")))

(defn parse-int [s]
  (Integer. (re-find  #"\d+" s)))

;;TODO replace dummy-adaptions
;;TODO get/set real device_id
;;TODO return something else
;;TODO error-handling
(defn adaption-handler
  [{:keys [adaption1 adaption2 adaption3 adaption4 adaption5 device_id description]}]
  (let [adaption_id (parse-int (apply str (insert-adaption {:adaption1 adaption1
                                                            :adaption2 adaption2
                                                            :adaption3 adaption3
                                                            :adaption4 adaption4
                                                            :adaption5 adaption5})))]
    (insert-syslog {:device_id 990
                    :adaption_id adaption_id
                    :description description})))


;;TODO get real device id (mac/ip), + adaption id
(defn adaption-check
  "Insert adaption-data"
  [{params :query-params :as req}]
  (def device-id (rand-int 1000))
  (set-device-id device-id)
  (cond
    (and
      (contains? params "adaption1")
      (contains? params "adaption2")
      (contains? params "adaption3")
      (contains? params "adaption4")
      (contains? params "adaption5")
      (contains? params "description")) (adaption-handler {:adaption1 (parse-int (params "adaption1"))
                                                           :adaption2 (parse-int (params "adaption2"))
                                                           :adaption3 (parse-int (params "adaption3"))
                                                           :adaption4 (parse-int (params "adaption4"))
                                                           :adaption5 (parse-int (params "adaption5"))
                                                           :description (params "description")})
                                                           ;;:device_id device-id})
    :else (error-handler-rep 400 "Invalid adaption")))

;;tester fn btw
;; XTODO  param to int?
;; TODO return
;; TODO wrap?
#_(defn test-set-device-and-adaption-id
    [{params :query-params :as req}]
    (contains? params "n") ((def deviceid (rand-int 1000))
                            (def adaptionid (rand-int 10000))
                            ;(set-device-id deviceid)
                            ;;(def adaptionint (parse-int (params "n")))
                            ;;(def z (params "n"))
                            ;;(parse-int (params "n"))
                            ;;(println "TYPE: "(type (params "n")))
                            ;;(println "TYPE: " (type adaptionint))
                            (insert-adaption {:adaption_id (parse-int (params "n"))
                                              :adaption1 1
                                              :adaption2 2
                                              :adaption3 3
                                              :adaption4 4
                                              :adaption5 5})))


#_(defn testfunc
    [{params :query-params :as req}]
    (contains? params "n") (insert-adaption {:adaption_id (parse-int (params "n"))}))

#_(defn returntest [_]
    {:body (str (parse-int (apply str (insert-adaption {:adaption1 1
                                                        :adaption2 2
                                                        :adaption3 3
                                                        :adaption4 4
                                                        :adaption5 5}))))})

(defroutes app-routes
  "Defines all the routes and their respective route handlers"
  (GET "/" [] index-handler)
  (GET "/networkgraph" [] (wrap-json-response dummy-data-handler))
  (GET "/syslog" request (wrap-json-response syslog-handler))
  (GET "/adaptiontest" request adaption-check)
  #_(GET "/testid" request (wrap-json-response test-set-device-and-adaption-id))
  #_(GET "/returntest" [] returntest)
  (route/not-found (wrap-json-response
                    (error-handler-rep 404
                                       "Could not find route"))))
