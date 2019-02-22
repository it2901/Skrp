(ns backend.netjson.networkgraph-test
  (:require [cheshire.core :refer [parse-string]]
            [clojure.test :refer :all]
            [clojure.spec.alpha :as spec]
            [clojure.java.io :as io]))

(spec/def ::networkgraph
  (spec/keys :req-un [::type ::general ::interfaces]))
(spec/def ::type string?)
(spec/def ::general (spec/keys :req-un [::hostname ::uptime]))
(spec/def ::hostname string?)
(spec/def ::uptime int?)
(spec/def ::interfaces (spec/coll-of ::interface :kind vector?))
(spec/def ::interface (spec/keys :req-un [::name ::uptime ::statistics]))
(spec/def ::name string?)
(spec/def ::statistics (spec/map-of keyword? int?))

(deftest is-networkgraph-valid
  (def networkgraph
    (parse-string (slurp (io/resource "networkgraph.json")) #(keyword %)))
  (spec/valid? ::networkgraph networkgraph))