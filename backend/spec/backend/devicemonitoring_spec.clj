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

(ns backend.devicemonitoring-spec
  (:require [clojure.spec.alpha :as spec]))

(spec/def ::devicemonitoring
  (spec/keys :req-un [::type ::general ::interfaces]))
(spec/def ::type #(= % "DeviceMonitoring"))
(spec/def ::general (spec/keys :req-un [::hostname ::uptime]))
(spec/def ::hostname string?)
(spec/def ::uptime int?)
(spec/def ::interfaces (spec/coll-of ::interface :kind vector?))
(spec/def ::interface (spec/keys :req-un [::name ::uptime ::statistics]))
(spec/def ::name string?)
(spec/def ::statistics (spec/map-of keyword? int?))
