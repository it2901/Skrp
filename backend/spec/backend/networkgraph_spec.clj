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

(ns backend.networkgraph-spec
  (:require [clojure.spec.alpha :as spec]))

(spec/def ::networkgraph
  (spec/keys :req-un
             [::type ::protocol ::version ::metric ::nodes ::links]
             :opt-un
             [::revision ::topology_id ::router_id ::label]))
(spec/def ::type #(and string? (= "NetworkGraph" %)))
(spec/def ::protocol string?)
(spec/def ::version #(or (= nil %) string?))
(spec/def ::metric #(or (= nil %) string?))
(spec/def ::nodes
  (spec/coll-of ::node :kind vector?))
(spec/def ::node (spec/keys :req-un [::id]
                            :opt-un [::label ::local_addresses ::properties]))
(spec/def ::id string?)
(spec/def ::label string?)
(spec/def ::local_addresses (spec/coll-of string? :kind vector?))
(spec/def ::properties (spec/map-of any? any?))
(spec/def ::links
  (spec/coll-of ::link :kind vector?))
(spec/def ::link
  (spec/keys :req-un [::source ::target ::cost]
             :opt-un [::cost_text ::properties]))
(spec/def ::source string?)
(spec/def ::target string?)
(spec/def ::cost #(or (double? %) (int? %)))
(spec/def ::cost_text string?)
(spec/def ::properties (spec/map-of any? any?))
(spec/def ::revision string?)
(spec/def ::topology_id string?)
(spec/def ::router_id string?)
