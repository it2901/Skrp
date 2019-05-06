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
  (:require [aero.core :as ac]
            [backend.configuration :refer [write-config, read-config]]
            [backend.routes.util :refer [error-handler-rep, run-db]]))

(defn config-check
  "Returns correct HTTP response according to configuration result"
  {:arglist '([query-result])}
  [result]
  (let [[status body] (if (empty? result)
                        [404 {"Error" "No query results found"}]
                        [200 result])]
    {:status status
     :headers {"Content-Type" "application/json"}
     :body body}))

(defn get-config-handler
  "Retrieve latest config entry in the table
  Input: GET request with no params
  Action: Retrieves the latest config entry in the table"
  [req]
  (run-db (config-check (first (read-config)))))

(defn post-config-handler
  "Handle configuration parameters.
  Input: POST request with all configuration parameters in a json body
  Action: Inserts configuration in database if it fits the schema and
  the same data you posted with a config_id and a timestamp"
  [{body :body :as req}]
  (if (contains? body "device_id")
    (let [res (run-db (first (write-config (get body "device_id")
                                           (dissoc body "device_id"))))]
      (if-not (= 503 (:status res))
        {:status 200
         :header {"Content-Type" "application/json"}
         :body res}
        res))
    (error-handler-rep
     503
     "You must supply a 'device_id' parameter to write a configuration")))

(defn server-config-handler
  "HTTP GET handler for exposing the server configuration file"
  [req]
  (let [cfg (ac/read-config "config.edn")]
    (if-not cfg
      (error-handler-rep 500 "Cannot retrieve server configuration file")
      {:status 200
       :content-type {"Content-Type" "application-json"}
       :body cfg})))

