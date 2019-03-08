
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
  "Retrieves all entries in the system log table"
  ([]
   (j/query db "SELECT * FROM system_log"))
  ([date]
   (j/query db ["SELECT * FROM system_log WHERE created = ? " date]))
  ([from to]
   (j/query db ["SELECT * FROM system_log WHERE created from ? to ?" from to])))

(defn insert-syslog
  "Takes a map of values for the system log and inserts them into the database"
  [{:keys [device_id adaptation_id description]}]
  (j/insert! db :system_log
             {:device_id     device_id
              :adaption_id   adaptation_id
              :description   description}))

(extend-type java.sql.Timestamp
  json/JSONWriter
  (-write [date out]
    (json/-write (str date) out)))
