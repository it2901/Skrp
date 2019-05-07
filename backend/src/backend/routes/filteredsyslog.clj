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
            [backend.routes.util :refer [error-handler-rep, run-db]]))

(defn- str-or-nil
  "Casts arg to string or returns nil"
  [arg]
  (when arg (str arg)))

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
                       "adaption_type"
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
  {:device_id (str-or-nil (params "device_id"))
   :adaption_type (str-or-nil (params "adaption_type"))
   :description (str-or-nil (params "description"))
   :date (str-or-nil (params "date"))
   :date_from (str-or-nil (params "date_from"))
   :date_to (str-or-nil (params "date_to"))})

(defn filtered-syslog-handler
  "HTTP get handler to filter data from the database table 'system_log'.
  Passes a map to the fetch-function, containing info about which
  variables to filter by. If no parameter i passed, the whole log will be retrieved.
  Date, date_from and date_to have to be ISO-formatted yyyy-mm-dd"
  [{params :query-params :as req}]
  (cond
    (empty? params) (run-db (filtered-syslog-check (get-syslog)))
    (params-check? params) (run-db (filtered-syslog-check (get-filtered-syslog (create-filter-map params))))
    :else (error-handler-rep 400 "Invalid query")))
