# NodeJS GraphQL API Template

This repo contains a folder structure and example files for a user to kick-start a server using NodeJS, Express, MongoDB and GraphQL.

# Functionalities

- GraphQL/Apollo
  - Great standard for APIs that solves some issues regarding REST APIs, like overfetching, underfetching and multiple requests to render a single screen. Check https://www.howtographql.com/basics/1-graphql-is-the-better-rest/ for further explanation.
  - The API has a single endpoint `/gql` that may be accessed via GET or POST http verbs, or via libraries like Apollo-Client. To use GET, send the query in the URL parameter `/gql?query=ASCII_ENCODED_QUERY`. To use POST, put the query in a JSON as the value of the key "Query".
  - Because it is database agnostic, you need to determine the types of data that can be received or sent, and that is done through TypeDefs in the folder `./src/typedefs`.
  - Also because it is database agnostic, you need to determine the business rules that follow each query, and that is done through Resolvers in the folder `./src/resolvers`.
  - Ships with GraphQL Playground for quickly testing queries against your server (access your server domain + `/gql`).

- Auth Middleware
  - Uses JWT self-encoding tokens for authorization logic without requiring database storage and lookups.
  - The auth middleware will check if the access token verifies with the public key (set the path to it in `./src/utils/config.js`), and also if it has expired. If everything is OK, the token's payload is inserted in the request object (more specifically `req.auth`) to be consumed by the resolver. It means that it is the resolver's responsibility to determine what data should or should not be exposed in a specific request, based on the user id, the scope, and the other variables in the token's payload.
  - If the request does not contain an Authorization header, the middleware will let it pass to the GraphQL API, because it assumes that the client wants to collect public information. In this case, the resolver will not receive a `req.auth`. REPEATING: it is the resolver that must determine what data should or should not be exposed in a specific request.
  - In an OAuth2 implementation, this template represents the Resource Server. OAuth2 requires the Resource Server to be decoupled from the Authorization Server (which contains the passwords and the private key to sign tokens). That's why you will not see any password storage or token creation logic in this code, just the token verifying logic present in `./src/utils/auth.js`.
  - To test this API without an authorization server, you can manually sign tokens with https://jwt.io/ and insert them in the header of your requests `{ "Authorization": "Bearer TOKEN_HERE" }`. This can be done in the GraphQL Playground in HTTP HEADERS tab at the bottom left side.
  - To generate a private/public key pair, type in a terminal:

        cd PATH/TO/STORE/KEYS
        ssh-keygen -t rsa -b 1024 -f jwtRS256.key
        openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

- MongoDB
  - Database choice is highly dependant on your project and your team expertise. A implementation of MongoDB is in this template just for the sake of making it work out of the box.
  - In case you decide to go on with MongoDB, your collections can be managed by importing `./src/utils/mongodb.js` and using it in an async function (see example in `./src/resolvers/user.js`).
  - Mongoose was not my choice since the GraphQL API ships with input validation and that should be enough to guarantee consistency to the database.

# VSCode and ESLint development tools

- Write ES8 with linting and standardization
  - Execute `npm run build` to transpile your code into ES5 so it supports all versions of NodeJS.
  - Linting and standardization will warn you about double-quotes, bad indentation, etc, to make your code clean and tidy.
  - ESLint rules are set to endorse async/await over promises and callbacks, throwing errors. Those can be changed in `package.json`.
- Live reload debugging in VSCode
  - For this to work you need to open a terminal and execute `npm run debug-build`.
  - If you want live reload with no debug, simply run `npm run dev`.
- Babel Wildcard Plugin
  - This plugin imports all files from a specific path. So when you want to create a new schema or resolver for the API, you can just add the file to the right folder and don't need to import it at `./src/app.js`.
- Babel Module Resolver
  - This plugin allows imports from files inside the src folder to be done without relative pathing (example: use `utils/mongodb` instead of `../../../utils/mongodb`)
