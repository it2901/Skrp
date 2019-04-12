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

(ns backend.routes.filteredsyslog
  "Functions for handling the /filtersyslog endpoint"
  (:require [backend.logging :refer [get-syslog]]
            [backend.filterlog :refer [get-filtered-syslog]]
            [backend.routes.util :refer [error-handler-rep]]))

(defn filtered-syslog-check
  "Returns correct HTTP response according to system log database query result"
  {:arglist '([query-result])}
  [result]
  (let [[status body] (if (= [] result)
                        [404 {"Error" "No query results found"}]
                        [200 result])]
    {:status status
     :headers {"Content-Type" "application/json"}
     :body body}))

(defn params-check?
  "Returns true if the parameters passed is a subset of allowed parameters,
  false otherwise"
  [currentParams]
  (def allowedParams #{"device_id"
                       "adaption_id"
                       "description"
                       "date"
                       "date_from"
                       "date_to"})
  (if-not (clojure.set/subset? (set (keys currentParams)) allowedParams)
    false
    true))

(defn create-filter-map
  "Creates a map with what variables to filter by"
  [params]
  (def logFilter {:device_id nil
                  :adaption_id nil
                  :description nil
                  :date nil
                  :date_from nil
                  :date_to nil})
  (if (contains? params "device_id")
    (def logFilter (update logFilter :device_id #(str (params "device_id") %))))
  (if (contains? params "adaption_id")
    (def logFilter (update logFilter :adaption_id #(str (params "adaption_id") %))))
  (if (contains? params "description")
    (def logFilter (update logFilter :description #(str (params "description") %))))
  (if (contains? params "date")
    (def logFilter (update logFilter :date #(str (params "date") %))))
  (if (contains? params "date_from")
    (def logFilter (update logFilter :date_from #(str (params "date_from") %))))
  (if (contains? params "date_to")
    (def logFilter (update logFilter :date_to #(str (params "date_to") %))))
  logFilter)

(defn filtered-syslog-handler
  "HTTP get handler to filter data from the database table 'system_log'.
  Passes a map to the fetch-function, containing info about which
  variables to filter by. If no parameter i passed, the whole log will be retrieved.
  Date, date_from and date_to have to be ISO-formatted yyyy-mm-dd"
  [{params :query-params :as req}]
  (cond
    (empty? params) (try
                      (filtered-syslog-check (get-syslog))
                      (catch Exception _
                        (error-handler-rep 503 "Cant connect to the database" req)))
    (params-check? params) (try
                             (filtered-syslog-check (get-filtered-syslog (create-filter-map params)))
                             (catch Exception _
                               (error-handler-rep 503 "Cant connect to the database" req)))
    :else (error-handler-rep 400 "Invalid query" req)))
