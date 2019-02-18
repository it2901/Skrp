(ns backend.core
  (:require [org.httpkit.server :refer [run-server]]))

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
