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
            [clojure.java.jdbc :as j]
            [backend.logging :refer [get-adaption-id]]))

(defn adaption-filter
  [adaption_type queryStr]
  (if-not adaption_type
    queryStr
    (let [basicQueryString "SELECT system_log.*, adaption.adaption_type, adaption.adaption_id
    FROM system_log INNER JOIN adaption ON adaption.adaption_id = system_log.adaption_id"]
      (if-not (= queryStr basicQueryString)
        (str queryStr " AND LOWER(adaption.adaption_type) = LOWER('" adaption_type "')")
        (str queryStr " WHERE LOWER(adaption.adaption_type) = LOWER('" adaption_type "')")))))

(defn device-filter
  [device_id queryStr]
  (if-not device_id
    queryStr
    (let [basicQueryString "SELECT system_log.*, adaption.adaption_type, adaption.adaption_id
    FROM system_log INNER JOIN adaption ON adaption.adaption_id = system_log.adaption_id"]
      (if-not (= queryStr basicQueryString)
        (str queryStr " AND device_id IN (" device_id ")")
        (str queryStr " WHERE device_id IN (" device_id ")")))))

(defn description-filter
  [description queryStr]
  (if-not description
    queryStr
    (let [basicQueryString "SELECT system_log.*, adaption.adaption_type, adaption.adaption_id
    FROM system_log INNER JOIN adaption ON adaption.adaption_id = system_log.adaption_id"]
      (if-not (= queryStr basicQueryString)
        (str queryStr " AND LOWER(description) ~ LOWER('" description "')")
        (str queryStr " WHERE LOWER(description) ~ LOWER('" description "')")))))

(defn date-filter
  [date queryStr]
  (if-not date
    queryStr
    (let [basicQueryString "SELECT system_log.*, adaption.adaption_type, adaption.adaption_id
    FROM system_log INNER JOIN adaption ON adaption.adaption_id = system_log.adaption_id"]
      (if-not (= queryStr basicQueryString)
        (str queryStr " AND DATE(created) = '" date "'")
        (str queryStr " WHERE DATE(created) = '" date "'")))))

(defn date-from-to-filter
  [date_from date_to queryStr]
  (if-not (and date_from date_to)
    queryStr
    (let [basicQueryString "SELECT system_log.*, adaption.adaption_type, adaption.adaption_id
    FROM system_log INNER JOIN adaption ON adaption.adaption_id = system_log.adaption_id"]
      (if-not (= queryStr basicQueryString)
        (str queryStr " AND DATE(created) between '" date_from "' and '" date_to "'")
        (str queryStr " WHERE DATE(created) between '" date_from "' and '" date_to "'")))))

(defn get-filtered-syslog
  "Returns filtered data from the database table 'system_log' based on filter input.
      Valid filter keys are
      * device_id
      * adaption_type
      * description
      * date
      * date_from
      * date_to"
  [{:keys [device_id adaption_type description date date_from date_to]}]
  (let [queryStr (str "SELECT system_log.*, adaption.adaption_type, adaption.adaption_id
  FROM system_log INNER JOIN adaption ON adaption.adaption_id = system_log.adaption_id")]
    (let [finalQuery (date-from-to-filter date_from date_to
                                          (date-filter date
                                                       (description-filter description
                                                                           (device-filter device_id
                                                                                          (adaption-filter adaption_type queryStr)))))]
      (j/query db [finalQuery]))))
