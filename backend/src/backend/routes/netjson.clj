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
            [backend.logging :refer [get-syslog, set-device-id, insert-adaption]]
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

#_(defn adaption-handler
      ""
      [{params :query-params :as req}]
      (cond
        (empty? params) (error-handler-rep 400 "Make at least one adaption.")
        (contains? params "adaption1") (update adaption 1)
        (contains? params "adaption2") (up)
        :else (error-handler-rep 400 "Invalid adaptions")))

;;TODO get real device id (mac/ip), + adaption id
(defn adaption-check
  "Insert adaption-data"
  [{params :query-params :as req}]

  (def device-id (rand-int 1000))
  (set-device-id device-id)
  (def adaption-id (rand-int 1000))
  (and
    (contains? params "adaption1")
    (contains? params "adaption2")
    (contains? params "adaption3")
    (contains? params "adaption4")
    (contains? params "adaption5")) (adaption-handler
                                      (params {:adaption1 params "adaption1",
                                               :adaption2 params "adaption2",
                                               :adaption3 params "adaption3",
                                               :adaption4 params "adaption4",
                                               :adaption5 params "adaption5",
                                               :device-id device-id,
                                               :adaption-id adaption-id,
                                               :description "desctest"}))
  :else (error-handler-rep 400 "Invalid adaption"))

(defn adaption-handler
  [{:keys [adaption1, adaption2, adaption3, adaption4, adaption5, device-id, adaption-id, description]}]
  (insert-adaption
    ({:adaption1 "adaption1",
      :adaption2 "adaption2",
      :adaption3 "adaption3",
      :adaption4 "adaption4",
      :adaption5 "adaption5"}))
  (insert-syslog ({:device_id device-id,
                   :adaption_id adaption-id,
                   :description description})))


(defroutes app-routes
  "Defines all the routes and their respective route handlers"
  (GET "/" [] index-handler)
  (GET "/networkgraph" [] (wrap-json-response dummy-data-handler))
  (GET "/syslog" request (wrap-json-response syslog-handler))
  (GET "/adaptiontest" request adaption-check)
  (route/not-found (wrap-json-response
                    (error-handler-rep 404
                                       "Could not find route"))))
