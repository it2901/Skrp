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

(ns backend.routes.netjson-route
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.java.io :as io]))

(defn index-handler
  "Says hello, world"
  [_]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    (str "Hello, World")})

(defn dummy-data-handler
  "HTTP response for dummy networkgraph data"
  [_]
  {:status  200
   :headers {"Content-Type" "application/json"}
   :body    (slurp (io/resource "networkgraph.json"))})

(defn error-handler
  "HTTP error response"
  [_]
  {:status  404
   :headers {"Content-Type" "application/json"}
   :body    {"Error" "Could not find route"}})

(defroutes app-routes
           "Defines all the route handlers"
           (GET "/" [] index-handler)
           (GET "/networkgraph" [] dummy-data-handler)
           (route/not-found error-handler))
