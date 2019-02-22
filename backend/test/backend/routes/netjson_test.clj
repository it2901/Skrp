(ns backend.routes.netjson-test
  (:require [clojure.test :refer :all]
            [clojure.spec.alpha :as spec]))

(spec/def :networkgraph
  (spec/keys :type ))
