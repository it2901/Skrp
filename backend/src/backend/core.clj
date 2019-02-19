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
;;;; along with SKRP.  If not, see <https://www.gnu.org/licenses/>.

(ns backend.core
  (:require [org.httpkit.server :refer [run-server]]
            [clojure.java.jdbc :as jdbc]
            [backend.routes.netjson-route :refer [app-routes]]))

(def pg-db {:dbtype "postgres"
            :dbname (System/getenv "PGDATABASE")
            :host   "localhost"})

(jdbc/query pg-db
            ["select now();"])

(defn -main
  "Starts a http-server"
  [& args]
  (run-server app-routes {:port 8080})
  (println "Server started on port 8080"))
