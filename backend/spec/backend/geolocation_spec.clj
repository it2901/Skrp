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

(ns backend.geolocation-spec
  (:require [clojure.spec.alpha :as spec]))

(spec/def ::geolocation (spec/keys :req-un [::type ::Originator ::Position ::Time]
                                   :opt-un [::Movement]))
(spec/def ::type "GeoLocation")
(spec/def ::Originator string?)
(spec/def ::Position (spec/keys :req-un [::Latitude ::Longitude]
                                :opt-un [::AboveSeaLevel]))
(spec/def ::Latitude double?)
(spec/def ::Longitude double?)
(spec/def ::AboveSeaLevel int?)
(spec/def ::Time (spec/keys :req-un [::Year4Digit ::MonthNumeric
                                     ::Day ::HourTime
                                     ::MinuteTime ::SecondTime]))
(spec/def ::Year4Digit int?)
(spec/def ::MonthNumeric int?)
(spec/def ::Day int?)
(spec/def ::HourTime int?)
(spec/def ::MinuteTime int?)
(spec/def ::SecondTime int?)
(spec/def ::Movement (spec/keys :req-un [::Bearing ::Speed]
                                :opt-un [::VerticalChange]))
(spec/def ::Bearing #(and number? (and (>= % 0) (< % 360))))
(spec/def ::Speed #(and number? (>= % 0)))
(spec/def ::VerticalChange number?)
