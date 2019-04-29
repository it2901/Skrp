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

(ns backend.filterlog
  (:require [backend.database :refer [db]]
            [clojure.java.jdbc :as j]))

(defn get-filtered-syslog
  "Returns filtered data from the database table 'system_log' based on filter input.
  Valid filter keys are 
  * device_id
  * adaption_id
  * description
  * date
  * date_from
  * date_to"
  [{:keys [device_id adaption_id description date date_from date_to]}]
  (def querystr "SELECT * FROM system_log WHERE")
  (def firstParam true)

  (if-not (= device_id nil)
    (do (if (true? firstParam)
          (do (def newstr (str " device_id IN (" device_id ")"))
              (def firstParam false))
          (def newstr (str " AND device_id IN (" device_id ")")))
        (def querystr (str querystr newstr))))

  (if-not (= adaption_id nil)
    (do (if (true? firstParam)
          (do (def newstr (str " adaption_id IN (" adaption_id ")"))
              (def firstParam false))
          (def newstr (str " AND adaption_id IN (" adaption_id ")")))
        (def querystr (str querystr newstr))))

  (if-not (= description nil)
    (do (if (true? firstParam)
          (do (def newstr (str " LOWER(description) ~ LOWER('" description "')"))
              (def firstParam false))
          (def newstr (str " AND LOWER(description) ~ LOWER('" description "')")))
        (def querystr (str querystr newstr))))

  (if-not (= date nil)
    (do (if (true? firstParam)
          (do (def newstr (str " DATE(created) = '" date "'"))
              (def firstParam false))
          (def newstr (str " AND DATE(created) = '" date "'")))
        (def querystr (str querystr newstr))))

  (if-not (or (= date_from nil) (= date_to nil))
    (do (if (true? firstParam)
          (do (def newstr (str " DATE(created) between '" date_from "' and '" date_to "'"))
              (def firstParam false))
          (def newstr (str " AND DATE(created) between '" date_from "' and '" date_to "'")))
        (def querystr (str querystr newstr))))
  (j/query db [querystr]))
