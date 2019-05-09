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

(ns backend.routes.logadaption
  "Functions for handling the /logadaption endpoint"
  (:require [backend.logging :refer [insert-syslog
                                     get-device-from-id
                                     set-device-id
                                     get-adaption-id
                                     get-syslog]]
            [backend.routes.util :refer [error-handler-rep
                                         run-db]]))

(defn device-registered?
  "Returns true if device is registered in the database, false otherwise"
  [device_id]
  (if-not (= nil (get-device-from-id device_id))
    true
    false))

(defn adaption-handler
  "Inserts an adaption into the database.
  If the device_id is not yet registered in the db, a registration will be made"
  [{params :query-params :as req}]
  (cond
    (= 503 (:status (run-db (get-syslog)))) {:status 503
                                             :header {"Content-Type" "application/json"}
                                             :body "Cant connect to the database"}
    (and
     (contains? params "adaption_type")
     (contains? params "device_id")
     (contains? params "description"))
    (if (= nil (get-adaption-id (params "adaption_type")))
      (error-handler-rep 503 (str "adaption_type: '" (params "adaption_type") "' is not"
                                  " registered in the database."))
      (let [device_id (Integer/parseInt (params "device_id"))
            adaption_id (get-adaption-id (params "adaption_type"))
            description (params "description")]
        (if-not (device-registered? device_id)
          (set-device-id device_id))
        (let [res (first (insert-syslog {:device_id device_id
                                         :adaption_id adaption_id
                                         :description description}))]
          {:status 200
           :header {"Content-Type" "application/json"}
           :body res})))

    :else (error-handler-rep 503 "Invalid query")))

