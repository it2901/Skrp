# Usage
You will need leiningen to build and run the project. Refer to
[leiningen](https://github.com/technomancy/leiningen) for setup guide.

To run the project just run

`lein run` or `lein run -- [options] [args]`

# Linting
Check out [eastwood](https://github.com/jonase/eastwood) for more information.
You can lint your code with

`lein eastwood`

# Format checking
Check out [cljfmt](https://github.com/weavejester/cljfmt) for more information.

To find or correct bad code formatting run

`lein cljfmt check` or `lein cljfmt fix` respectively.

# Testing
Tests are located under the `test` folder. The directory is meant to
emulate the structure of the `src` directory. Clojure specs are also
registered as a test path since they are used in some of the tests.

To run the tests simply run

`lein test`

# Code coverage
To calculate the code coverage run

`lein cloverage`
