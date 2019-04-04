(defproject backend "0.1.0-SNAPSHOT"
  :description "Backend server for SKRP"
  :url "https://github.com/it2901/Skrp"
  :license {:name "LGPL-3.0"
            :url "https://www.gnu.org/licenses/lgpl-3.0.en.html"}
  :dependencies [[aero "1.1.3"]
                 [clj-time "0.15.0"]
                 [compojure "1.6.1"]
                 [http-kit "2.3.0"]
                 [org.clojure/clojure "1.10.0"]
                 [org.clojure/data.json "0.2.6"]
                 [org.clojure/java.jdbc "0.7.8"]
                 [org.clojure/tools.cli "0.4.1"]
                 [org.postgresql/postgresql "42.2.5"]
                 [ring "1.7.1"]
                 [ring/ring-json "0.4.0"]
                 [ring/ring-mock "0.3.2"]]
  :repl-options {:init-ns backend.core}
  :main backend.core
  :plugins [[lein-codox "0.10.6"] [lein-cljfmt "0.6.4"]
            [lein-cloverage "1.0.13"] [jonase/eastwood "0.3.5"]]
  :codox {:metadata {:doc/format :markdown}
          :namespaces [backend.routes.syslog backend.routes.util]}
  :resource-paths ["resources/backend"]
  :test-paths ["test" "spec"])
