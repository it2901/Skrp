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

(ns backend.spec-test
  (:require [clojure.test :refer :all]
            [clojure.java.io :as io]
            [clojure.data.json :refer [read-str]]
            [clojure.spec.alpha :as spec]))
(deftest specs
  (testing "Spec and data should match"
    (is (spec/valid? :backend.deviceconfiguration-spec/deviceconfiguration (read-str (slurp (io/resource "deviceconfiguration.json"))
                                                                                     :key-fn keyword)))
    (is (spec/valid? :backend.devicemonitoring-spec/devicemonitoring (read-str (slurp (io/resource "devicemonitoring.json"))
                                                                               :key-fn keyword)))
    (is (spec/valid? :backend.networkgraph-spec/networkgraph (read-str (slurp (io/resource "networkgraph.json"))
                                                                       :key-fn keyword)))
    (is (spec/valid? :backend.networkroutes-spec/networkroutes (read-str (slurp (io/resource "networkroutes.json"))
                                                                         :key-fn keyword)))
    (is (spec/valid? :backend.networkcollection-spec/networkcollection (read-str (slurp (io/resource "networkcollection.json"))
                                                                                 :key-fn keyword)))))
