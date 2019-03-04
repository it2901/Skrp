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
             [::type ::label ::protocol ::version ::metric ::nodes ::links]))
(spec/def ::type string?)
(spec/def ::label string?)
(spec/def ::protocol string?)
(spec/def ::version string?)
(spec/def ::metric string?)
(spec/def ::nodes
  (spec/coll-of ::node :kind vector?))
(spec/def ::node (spec/map-of keyword? string?))
(spec/def ::links
  (spec/coll-of ::link :kind vector?))
(spec/def ::link
  (spec/keys :req-un [::source ::target ::cost]))
(spec/def ::source string?)
(spec/def ::target string?)
(spec/def ::cost double?)