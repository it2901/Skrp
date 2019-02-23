# Usage
You will need leiningen to build and run the project. Refer to
[leiningen](https://github.com/technomancy/leiningen) for setup guide.

To run the project just run

`lein run`

# Linting
Refer to [eastwood](https://github.com/jonase/eastwood) for setup guide.
Once eastwood is configured, you can lint your code with

`lein eastwood`

# Testing

Tests are located under the `test` folder. The directory is meant to
emulate the structure of the `src` directory. Clojure specs are also
registered as a test path since they are used in some of the tests.

To run the tests simply run

`lein test`