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
  (:require [backend.configuration :refer [write-conf, read-conf]]
            [backend.routes.util :refer [error-handler-rep]]))

(defn conf-handler
  "Handle configuration parameters.
  Input: GET request with all configuration parameters
  Action: Inserts configuration in database if it fits the schema."
  [{params :query-params :as req}]
  (if (empty? params)
    (try
      (read-conf)
      (catch Exception _
        (error-handler-rep 503 "Can't read from the database" req)))
    (try
      (write-conf params)
      (catch Exception _
        (error-handler-rep 503 "Can't connect to the database" req)))))
