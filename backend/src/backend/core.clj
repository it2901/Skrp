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
            [clojure.tools.cli :as cli]
            [aero.core :refer (read-config)]
            [backend.routes.netjson :refer [app-routes]])
  (:gen-class))

(def cfg (read-config "config.edn"))

(def cli-options
  [["-c" "--config FILE" "Path to configuration file"
    :default "config.edn"
    :default-desc "config.edn"]
   ["-h" "--help" "Print this help screen"]])

(defn usage
  [summary]
  (println (str "Usage: skrpend [options]\n\nOptions:\n" summary
                "\n\nPlease refer to the user guide for more information."))
  (System/exit 0))

(defn -main
  "Reads CLI args and starts a http-server"
  [& args]
  (let [opt (cli/parse-opts args cli-options)]
    (when (get-in opt [:options :help])
      (usage (:summary opt)))

    (alter-var-root
     #'cfg
     (constantly
      (read-config (get-in opt [:options :config])))))

  (run-jetty app-routes (get cfg :webserver))
  (println "Server started on port" (get-in cfg [:webserver :port])))
