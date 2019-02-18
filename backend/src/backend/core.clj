(ns backend.core
  (:require [org.httpkit.server :refer [run-server]]
            [clojure.java.jdbc :as jdbc]))

(def pg-db {:dbtype "postgres"
            :dbname "netjson_dev"
            :host "localhost"})

(jdbc/query pg-db
  ["select now();"])

(defn app 
  "Says hello, world"
  [req]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    (str "Hello, World")})

(defn -main 
  "Starts a http-server"
  [& args]
  (run-server app {:port 8080})
  (println "Server started on port 8080"))
