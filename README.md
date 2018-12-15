# Database examples using Node and MySQL

These examples illustrate the handling of asynchronous database queries using the npm `mysql` package. In the examples, database tables are created and data is inserted into one of the tables. The data to be inserted is obtained by reading it from an external JSON file.

## 1-db-naive.js

This example shows how failing to recognize the asynchronous nature of the database queries leads to an error caused by prematurely closing the database connection.

## 2-db-callback.js

This example correctly closes the connection when all queries have finished. It uses traditional callbacks.

## 3-db-promise.js

Here, the callbacks are replaced by promises. The functions returning promises are hand-coded.

## 4-db-async.js

This final version uses async/await and `util.promisify()`.
