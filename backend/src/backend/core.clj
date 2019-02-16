(ns backend.core
  (:require [org.httpkit.server :refer [run-server]]))

(defn app [req]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    (str "Hello, World")})

(defn -main [& args]
  (run-server app {:port 8080})
  (println "Server started on port 8080"))
