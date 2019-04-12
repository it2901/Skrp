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

(ns backend.routes.syslog
  "Functions for handling the /syslog endpoint"
  (:require [backend.logging :refer [get-syslog]]
            [backend.routes.util :refer [error-handler-rep]]))

(defn syslog-check
  "Returns correct HTTP response according to system log database
  query result"
  {:arglist '([query-result])}
  [result]
  (let [[status body] (if (= [] result)
                        [404 {"Error" "No query results found"}]
                        [200 result])]
    {:status status
     :headers {"Content-Type" "application/json"}
     :body body}))

(defn syslog-handler
  "HTTP GET handler for system log. Retrieves data from the systemlog
  database table. Endpoint accepts three different sets of query
  paramsters on the GET request:
  
  |          Description         |   query params  |
  |:----------------------------:|:---------------:|
  |       get entire syslog      |                 |
  |  get syslog on specific date |       date      |
  | get syslog between two dates | datefrom dateto |

  Date has to be ISO formatted: yyyy-mm-dd"
  [{params :query-params :as req}]
  (cond
    (empty? params) (try
                      (syslog-check (get-syslog))
                      (catch Exception _
                        (error-handler-rep 503 "Cant connect to the database" req)))
    (contains? params "date") (try
                                (syslog-check (get-syslog (params "date")))
                                (catch Exception _
                                  (error-handler-rep 503 "Cant connect to the database")))
    (and
     (contains? params "datefrom")
     (contains? params "dateto")) (try
                                    (syslog-check
                                     (get-syslog
                                      (params "datefrom")
                                      (params "dateto")))
                                    (catch Exception _
                                      (error-handler-rep 503 "Cant connect to the database" req)))
    :else (error-handler-rep 400 "Invalid query" req)))
