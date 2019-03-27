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
            [backend.logging :refer [get-syslog, insert-syslog, get-adaption-from-id]]
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

(defn adaption-check
  "Logs adaption if adaption is valid"
  [{:keys [device_id adaption_id description]}]
  (let [[status body] (if (= [] (get-adaption-from-id adaption_id))
                        [404 {"Error" "Invalid adaptionID"}]
                        [200 (insert-syslog {:device_id device_id
                                             :adaption_id adaption_id
                                             :description description})])]
    {:status status
     :headers {"Content-Type" "application/json"}
     :body body}))

(defn adaption-handler
  "Check if an adaption is valid"
  [{params :query-params :as req}]
  (cond
    (empty? params) (get-syslog)
    (and
     (contains? params "adaption_id")
     (contains? params "device_id")
     (contains? params "description")) (adaption-check {:device_id (parse-int (params "device_id"))
                                                        :adaption_id (parse-int (params "adaption_id"))
                                                        :description (params "description")})
    :else (error-handler-rep 400 "invalid query")))

(defroutes app-routes
  "Defines all the routes and their respective route handlers"
  (GET "/" [] index-handler)
  (GET "/networkgraph" [] (wrap-json-response dummy-data-handler))
  (GET "/syslog" request (wrap-json-response syslog-handler))
  (POST "/logadaption" request (wrap-json-response adaption-handler))
  (route/not-found (wrap-json-response
                    (error-handler-rep 404
                                       "Could not find route"))))
