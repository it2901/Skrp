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

(ns backend.routes.networkgraph-handler-test
  (:require [clojure.data.json :refer [read-str]]
            [clojure.test :refer :all]
            [backend.routes.core :refer [app-routes]]
            [ring.mock.request :as mock]
            [clojure.spec.alpha :as spec]))

(deftest dummy-route
  (testing "dummy route for networkgraph data"
    (let [response (app-routes (mock/request :get "/networkgraph"))
          data (read-str (:body response) :key-fn keyword)]
      (is (= (:status response) 200))
      (is (spec/valid? :backend.networkgraph-spec/networkgraph data)))))
