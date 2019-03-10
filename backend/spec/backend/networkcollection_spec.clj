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
(spec/def ::type #(and string? (= "NetworkCollection" %)))
(spec/def ::collection (spec/coll-of ::NetJsonObject :kind vector?))
(def objects #{:backend.networkgraph-spec/networkgraph
               :backend.deviceconfiguration-spec/deviceconfiguration
               :backend.devicemonitoring-spec/devicemonitoring
               :backend.networkroutes-spec/networkroutes})
(spec/def ::NetJsonObject #(contains? objects %))
