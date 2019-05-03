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

(ns backend.routes.config
  (:require [backend.configuration :refer [write-config, read-config]]
            [backend.routes.util :refer [error-handler-rep, run-db]]))

(defn config-check
  "Returns correct HTTP response according to configuration result"
  {:arglist '([query-result])}
  [result]
  ;; TODO: Find a way to handle db connection error
  (let [[status body] (if (= [] result)
                        [404 {"Error" "No query results found"}]
                        [200 result])]
    {:status status
     :headers {"Content-Type" "application/json"}
     :body body}))

(defn config-handler
  "Handle configuration parameters.
  Input: GET request with all configuration parameters
  Action: Inserts configuration in database if it fits the schema."
  [{params :query-params :as req}]
  (cond (empty? params) (run-db (config-check (read-config)))
        (contains? params "device_id") (let [res (run-db (write-config (get params "device_id") (dissoc params "device_id")))]
                                         {:status 200
                                          :header {"Content-Type" "application/json"}
                                          :body (first res)})
        :else (error-handler-rep 503 "You must supply 'device_id' as a parameter in order to write a configuration.")))
