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

(ns backend.core
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [clojure.java.jdbc :as jdbc]
            [clojure.data.json :as json]
            [aero.core :refer (read-config)]
            [backend.routes.netjson :refer [app-routes]]))

(def cfg (read-config "config.edn"))

(def json (json/read (clojure.java.io/reader "resources/backend/networkgraph.json")))

(def pg-db {:dbtype   "postgres"
            :dbname   (get-in cfg [:database :name])
            :user     (get-in cfg [:database :user])
            :password (get-in cfg [:database :pass])
            :host     (get-in cfg [:database :host])})

(jdbc/query pg-db
            ["select now();"])

(defn -main
  "Starts a http-server"
  [& args]
  (run-jetty app-routes (get cfg :webserver))
  (println "Server started on port" (get-in cfg [:webserver :port])))