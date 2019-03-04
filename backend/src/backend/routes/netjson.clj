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
            [clojure.data.json :as json]
            [clojure.java.jdbc :as jdbc]
            [clojure.java.io :as io]))

; Must extend the sql.timestap type so
; it can be written by json/write-str.
; This should be moved somewhere else.
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
    (json/-write (str date) out)))

(defn index-handler
  "Says hello, world"
  [_]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    (str "Hello, World")})

(defn dummy-data-handler
  "HTTP response for dummy networkgraph data"
  [_]
  {:status  200
   :headers {"Content-Type" "application/json"}
   :body    (slurp (io/resource "networkgraph.json"))})

; TODO: Remove the hardcoded values when we have solved the
;       namespace of config problem.
(defn syslog-handler
  "HTTP response for dummy networkgraph data"
  [_]
  {:status  200
   :headers {"Content-Type" "application/json"}
   :body    (json/write-str (jdbc/query {:dbtype "postgres" :user "postgres", :dbname "netjson_dev", :password "password", :host "localhost"} "SELECT * FROM system_log"))})

(defn error-handler-rep
  "HTTP error response"
  [_]
  {:status  404
   :headers {"Content-Type" "application/json"}
   :body    {"Error" "Could not find route"}})

(defroutes app-routes
  "Defines all the routes and their respective route handlers"
  (GET "/" [] index-handler)
  (GET "/networkgraph" [] dummy-data-handler)
  (GET "/syslog" [] syslog-handler)
  (route/not-found error-handler-rep))
