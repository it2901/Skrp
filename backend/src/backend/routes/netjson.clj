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
            [backend.logging :refer [get-syslog, insert-syslog, get-adaption-from-id, set-device-id, get-device-from-id]]
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
  ([status msg]
   (fn [_]
     {:status  status
      :headers {"Content-Type" "application/json"}
      :body    {"Error" msg}}))
  ([status msg req]
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
    :else (error-handler-rep 400 "Invalid query" req)))

(defn adaption-check-if-exist
  "Returns true if the adaption is registered, false otherwise"
  [adaption_id]
  (if (= [] (get-adaption-from-id adaption_id))
    false
    true))

(defn device-check-if-exist
  "Returns true if device is registered, false otherwise."
  [device_id]
  (if (= [] (get-device-from-id device_id))
    false
    true))

(defn adaption-handler
  "POST request to log adaption"
  [{params :query-params :as req}]
  (cond
    (and
     (contains? params "adaption_id")
     (contains? params "device_id")
     (contains? params "description")) (let [[adaption_id device_id description] [(read-string (params "adaption_id")) (read-string (params "device_id")) (params "description")]]
                                         (if (false? (device-check-if-exist (read-string (params "device_id"))))
                                           (set-device-id device_id))
                                         (cond
                                           (false? (adaption-check-if-exist adaption_id)) (let [[status body] [404 {"Error" "Invalid adaption_id"}]]
                                                                                            {:status status
                                                                                             :headers {"Content-Type" "application/json"}
                                                                                             :body body})
                                           (and
                                            (true? (adaption-check-if-exist adaption_id))
                                            (true? (device-check-if-exist device_id))) (let [[status body] [200 (insert-syslog {:device_id device_id
                                                                                                                                :adaption_id adaption_id
                                                                                                                                :description description})]]
                                                                                         {:status status
                                                                                          :headers {"Content-Type" "application/json"}
                                                                                          :body body})
                                           :else (error-handler-rep 400 "?")))
    :else (error-handler-rep 400 "Invalid query")))

(defroutes app-routes
  "Defines all the routes and their respective route handlers"
  (GET "/" [] index-handler)
  (GET "/networkgraph" [] (wrap-json-response dummy-data-handler))
  (GET "/syslog" request (wrap-json-response syslog-handler))
  (POST "/logadaption" request (wrap-json-response adaption-handler))
  (route/not-found (wrap-json-response
                    (error-handler-rep 404
                                       "Could not find route"))))
