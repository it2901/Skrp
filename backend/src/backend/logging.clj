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
            [clj-time.core :as t]
            [clj-time.jdbc]
            [clj-time.local :as l]
            [clojure.java.jdbc :as j]))

(defn get-syslog
  ([]
   (j/query db "SELECT * FROM system_log"))
  ([date]
   (j/query db ["SELECT * FROM system_log WHERE created = ? " date]))
  ([from to]
   (j/query db ["SELECT * FROM system_log WHERE created from ? to ?" from to])))

(defn insert-syslog
  [{:keys [device-id adaptation-id description]}]
  (j/insert! db :system_log
    {:device_id device-id
     :adaptation_id adaptation-id
     :description description
     :created (t/to-time-zone (l/local-now) (t/default-time-zone))}))
