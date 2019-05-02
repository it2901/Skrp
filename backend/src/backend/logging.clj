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

(ns backend.logging
  (:require [backend.database :refer [db]]
            [clojure.data.json :as json]
            [clojure.java.jdbc :as j]))

(defn get-syslog
  "Returns entries from the system_log table"
  ([]
   (j/query db "SELECT * FROM system_log INNER JOIN adaption ON system_log.adaption_id=adaption.adaption_id"))
  ([date]
   (j/query db [(str "SELECT * FROM system_log INNER JOIN adaption ON system_log.adaption_id=adaption.adaption_id WHERE DATE(created) = '" date "'")]))
  ([from to]
   (j/query db [(str "SELECT * FROM system_log INNER JOIN adaption ON system_log.adaption_id=adaption.adaption_id WHERE DATE(created) between '" from "' and '" to "'")])))

(defn insert-syslog
  "Takes a map of values for the system log and inserts them into the database"
  [{:keys [device_id adaption_id description]}]
  (j/insert! db :system_log
             {:device_id     device_id
              :adaption_id   adaption_id
              :description   description}))

(defn get-device-from-id
  "Queries the database for devices with input as id"
  [device_id]
  (j/get-by-id db :device device_id :device_id))

(defn set-device-id
  "Inserts a device into database"
  [device_id]
  (j/insert! db :device
             {:device_id device_id}))

(defn get-adaption-id
  "Queries the database for an adaption with the specified adaption_type, returns id of result"
  [adaption_type]
  (let [adaptionID (j/query db [(str "SELECT adaption_id FROM adaption WHERE LOWER(adaption_type) = LOWER('" adaption_type "')")])]
    (get (first adaptionID) :adaption_id)))

(defn get-network-collection
  "Returns a network collection"
  ([]
   (j/query db "SELECT * FROM network_collection"))
  ([latest]
   (when (= latest :latest)
     (j/query db
              "SELECT * FROM network_collection
       ORDER BY created
       DESC LIMIT 1"))))

(defn insert-network-collection
  "Insert a network collection into the database"
  [coll]
  (j/insert! db :network_collection
             {:collection coll}))

; The timestamp type must be extended in order to handle the timestamps from
; Postgres
(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
    (json/-write (str date) out)))
