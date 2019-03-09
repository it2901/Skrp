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

(ns backend.deviceconfiguration-spec
  (:require [clojure.spec.alpha :as spec]))

(spec/def ::deviceconfiguration
  (spec/keys :req-un [::type]
             :opt-un [::general ::hardware ::operating_system
                      ::interfaces ::radios ::routes ::dns_servers
                      ::dns_search]))
(spec/def ::type #(= % "DeviceConfiguration"))
(spec/def ::general
  (spec/keys
   ::opt-un
   [::hostname ::timezone ::maintainer ::description ::ula_prefix]))
(spec/def ::hostname string?)
(spec/def ::timezone string?) ; must be a value present in the timezone database IANA
(def email-regex #"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$")
(spec/def ::maintainer (spec/and string? #(re-matches email-regex %)))
(spec/def ::description string?)
(spec/def ::ula_prefix string?) ;IPv6 address
(spec/def ::hardware (spec/map-of keyword? string?))
(spec/def ::operating_system (spec/map-of keyword? string?))
(spec/def ::interfaces (spec/coll-of ::interface :kind vector?))
(spec/def ::interface (spec/keys :req-un [::name ::interface-type]
                                 :opt-un [::mac ::mtu ::txqueuelen
                                          ::autostart ::disabled
                                          ::bridge_members ::addresses
                                          ::wireless]))
(spec/def ::name #(and string? (>= 15 (count? %))))
(def names
  #{"ethernet" "wireless" "bridge" "virtual" "loopback" "other"})
(spec/def ::interface-type #(contains? names %))
(spec/def ::mac string?) ; mac address
(spec/def ::mtu int?)
(spec/def ::txqueuelen int?)
(spec/def ::autostart boolean?)
(spec/def ::disabled boolean?)
(spec/def ::bridge_members (spec/coll-of ::name :kind vector?))
(spec/def ::addresses (spec/coll-of ::address-obj :kind vector?))
(spec/def ::address-obj (spec/keys :req-un [::proto ::family]
                                   :opt-un [::address ::mask ::gateway]))
(def protocols #{"dhcp" "static"})
(spec/def ::proto #(and string? #(contains? protocols %)))
(def protocol-type #{"ipv4" "ipv6"})
(spec/def ::family #(and string? #(contains? protocol-type %)))
(spec/def ::address string?)
(spec/def ::mask int?)
(spec/def ::gateway string?)
(spec/def ::wireless (spec/keys :req-un [::radio ::mode ::ssid]
                                :opt-un [::bssid ::hidden ::ack_distance
                                         ::rts_threshold ::frag_threshold
                                         ::encryption]))
(spec/def ::radio (spec/keys :req-un [::radio-name ::radio-protocol
                                      ::channel ::channel_width]
                             :opt-un [::phy ::country
                                      ::tx_power ::disabled]))
(spec/def ::radio-name string?)
(def radio-protocols
  #{"802.11ac" "802.11n" "802.11b" "802.11g" "802.11a"})
(spec/def ::radio-protocol #(and string? (contains? radio-protocols %)))
(spec/def ::channel int?)
(spec/def ::channe_width int?)
(spec/def ::phy string?)
(spec/def ::country #(and string? (= (count %) 2)))
(spec/def ::tx_power int?)
(spec/def ::disabled boolean?)
(def modes #{"access_point" "station" "adhoc" "wds" "monitor" "802.11s"})
(spec/def ::mode #(and string? (contains? modes %)))
(spec/def ::ssid #(and string? (>= 32 (count %))))
(spec/def ::bssid string?)
(spec/def ::hidden boolean?)
(spec/def ::ack_distance int?)
(spec/def ::rts_threshold int?)
(spec/def ::frag_threshold #(and int? (and (< 0 %) (> 2346 %))))
(spec/def ::encryption (spec/keys :req-un [::enc-protocol ::key]
                                  :opt-un [::cipher ::disabled]))
(def encryption-protocols #{"wep_open" "wep_shared" "wpa_personal" "wpa2_personal" "wpa_personal_mixed" "wpa_enterprise" "wpa2_enterprise" "wpa_enterprise_mixed" "wps"})
(spec/def ::enc-protocol
  #(and string? (contains? encryption-protocols %)))
(spec/def ::key string?)
(def ciphers #{"auto" "ccmp" "tkip" "tkip+ccmp"})
(spec/def ::cipher #(and string? (contains? ciphers %)))
(spec/def ::routes (spec/coll-of ::route :kind vector?))
(spec/def ::route (spec/map-of string? string?))
(spec/def ::dns_servers (spec/coll-of string? :kind vector?))
(spec/def ::dns_search (spec/coll-of string?))
