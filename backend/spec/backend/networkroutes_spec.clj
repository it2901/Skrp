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

(ns backend.networkroutes-spec
  (:require [clojure.spec.alpha :as spec]))

(spec/def ::networkroutes
  (spec/keys :req-un [::type ::protocol ::version ::metric ::routes]
             :opt-un [::revision ::topology_id ::router_id]))
(spec/def ::type #(= % "NetworkRoutes"))
(spec/def ::protocol string?)
(spec/def ::version string?)
(spec/def ::metric string?)
(spec/def ::routes (spec/coll-of ::route :kind vector?))
(spec/def ::revision string?)
(spec/def ::topology_id string?)
(spec/def ::router_id string?)
(spec/def ::route
  (spec/keys :req-un [::destination ::next ::device ::cost]
             :opt-un [::cost_text ::source]))
(spec/def ::destination string?)
(spec/def ::next string?)
(spec/def ::device string?)
(spec/def ::cost int?)
(spec/def ::cost_text string?)
(spec/def ::source string?)
