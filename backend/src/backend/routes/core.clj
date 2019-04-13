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

(ns backend.routes.core
  (:require [backend.routes.syslog :refer [syslog-handler]]
            [backend.routes.logadaption :refer [adaption-handler]]
            [backend.routes.config :refer [config-handler]]
            [backend.routes.util :refer [index-handler
                                         dummy-data-handler
                                         error-handler-rep]]
            [backend.routes.filteredsyslog :refer [filtered-syslog-handler]]
            [compojure.core :refer :all]
            [compojure.route :refer [not-found]]
            [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.json :refer [wrap-json-response]]))

(defroutes app-routes
  "Defines all the routes and their respective route handlers"
  (GET "/" [] index-handler)
  (GET "/networkgraph" [] (wrap-json-response dummy-data-handler))
  (GET "/syslog" request (wrap-json-response syslog-handler))
  (POST "/logadaption" request (wrap-json-response adaption-handler))
  (GET "/configure" request (wrap-json-response config-handler))
  (GET "/filtersyslog" request (wrap-json-response filtered-syslog-handler))
  (not-found (wrap-json-response
              (constantly (error-handler-rep 404 "Could not find route")))))

(def reloadable-app
  (wrap-reload #'app-routes))
