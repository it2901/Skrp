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

(ns backend.networkcollection-spec
  (:require [clojure.spec.alpha :as spec]))

(spec/def ::networkcollection (spec/keys :req-un [::type ::collection]))
(spec/def ::type #(= "NetworkCollection" %))
(spec/def ::collection (spec/coll-of ::NetJsonObject :kind vector?))
(spec/def ::NetJsonObject
  (spec/or :networkgraph :backend.networkgraph-spec/networkgraph
           :deviceconfiguration :backend.deviceconfiguration-spec/deviceconfiguration
           :devicemonitoring :backend.devicemonitoring-spec/devicemonitoring
           :networkroutes :backend.networkroutes-spec/networkroutes
           :geolocation :backend.geolocation-spec/geolocation
           :networkcollection ::networkcollection))
