(defproject backend "0.1.0-SNAPSHOT"
  :description "Backend server for SKRP"
  :url "https://github.com/it2901/Skrp"
  :license {:name "LGPL-3.0"
            :url "https://www.gnu.org/licenses/lgpl-3.0.en.html"}
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [http-kit "2.3.0"]
                 [compojure "1.6.1"]
                 [org.postgresql/postgresql "42.2.5"]
                 [aero "1.1.3"]
                 [org.clojure/java.jdbc "0.7.8"]]

  :repl-options {:init-ns backend.core}
  :main backend.core
  :plugins [[lein-codox "0.10.6"]]
  :codox {:metadata {:doc/format :markdown}}
  :resource-paths ["resources/backend"])
