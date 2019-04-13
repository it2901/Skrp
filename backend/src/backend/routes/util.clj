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

(ns backend.routes.util
  (:require [clojure.java.io :as io]))

(defn index-handler
  "HTTP GET response returning hello world in an
  html heading tag on the root endpoint"
  [_]
  {:status  200
   :headers {"Content-Type" "text/html"}
   :body    "<h1>Hello World!</h1>"})

(defn dummy-data-handler
  "HTTP response for dummy networkgraph json data
  on the /networkgraph endpoint"
  [_]
  {:status  200
   :headers {"Content-Type" "application/json"}
   :body    (slurp (io/resource "networkgraph.json"))})

(defn error-handler-rep
  "HTTP error response template function"
  ([status msg]
   (fn [_]
     {:status  status
      :headers {"Content-Type" "application/json"}
      :body    {"Error" msg}}))
  ([status msg req]
   {:status  status
    :headers {"Content-Type" "application/json"}
    :body    {"Error" msg}}))

(defmacro run-db
  "Runs db, however if an exception is thrown it it will be returned."
  ([db]
   `(try ~db
         (catch Exception e# (error-handler-rep 503 (:via (Throwable->map e#)) "TODO: Remove this param")))))
