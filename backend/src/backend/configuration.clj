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

(ns backend.configuration
  "Functions for handling the configuration endpoint."
  (:require [backend.database :refer [db]]
            [clojure.algo.generic.functor :refer [fmap]]
            [postgre-types.json :refer [add-jsonb-type]]
            [clojure.java.jdbc :as j]))

(defn write-config
  "Writes a map into the config table of the database.
  The key corresponds to the column name and the value will be inserted in this column.
  The keys used must match with the database schema of the config table."
  [id params]
  ;(println params))
  (j/insert! db "config" {"device_id" (read-string id), "config" (fmap read-string params)}))

;; Add support for Postgres JSONB
(add-jsonb-type clojure.data.json/write-str clojure.data.json/read-str)

(defn read-config
  "Reads the latest configuration from the database"
  []
  (j/query db "SELECT * FROM config ORDER BY config_id DESC LIMIT 1;"))
