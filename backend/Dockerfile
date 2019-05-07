FROM clojure:lein-alpine
WORKDIR /app
COPY . /app
RUN lein deps
CMD ["lein", "run"]
