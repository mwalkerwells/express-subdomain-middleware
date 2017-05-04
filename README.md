# express-subdomain-middleware
Express subdomain middleware support for arbitrary hostnames. It allows for the composition of subdomain routers with variable nesting.

```js
http://level1.level2.level3.levelN.localhost:8080
```

#### Example
```js
// @flow

import express, { Router } from 'express'
import subdomain from 'express-subdomain-middleware'

// Flow Types
import {
  type $Request,
  type $Response,
  type NextFunction,
} from 'express'

// Routers

// DEV (Level 1)
// http://__1__.____.____.localhost:8080
const devRouter = Router()

devRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // imap.mwalkerwells.localhost:8080
  console.log(request.subdomains) // [ 'imap', 'mwalkerwells' ]
})

// PROD (Level 1)
// http://__1__.____.____.localhost:8080
const prodRouter = Router()

prodRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // imap.mwalkerwells.localhost:8080
  console.log(request.subdomains) // [ 'imap', 'mwalkerwells' ]
})

// IMAP (Level 2)
// http://____.__2__.____.localhost:8080
const imapRouter = Router()

// Mounting on dev & prod subdomains
devRouter.use(subdomain('imap', imapRouter))
prodRouter.use(subdomain('imap', imapRouter))

imapRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // mwalkerwells.localhost:8080
  console.log(request.subdomains) // [ 'mwalkerwells' ]
})

// USER (Level 3)
// http://____.____.__3__.localhost:8080
imapRouter.use(subdomain(
  'mwalkerwells',
  (request: $Request, response: $Response, next: NextFunction) => { // Using middleware instead of router
    console.log(request.headers.host) // localhost:8080
    console.log(request.subdomains) // []
  }
))

// COMPOSITION
// http://intern.secret.subdomain.test.localhost:8080
const composedSubdomains =
  subdomain('intern',
    subdomain('secret',
      subdomain('subdomain',
        subdomain('test', (request: $Request, response: $Response, next: NextFunction) => {
          console.log(request.headers.host) // localhost:8080
          console.log(request.subdomains) // []
          next()
        })
  )))

// SETUP

// This Express server handles 3 subdomain levels:
// • http://__1__.__2__.__3__.localhost:8080
const app = express()

// Setup level 1 subdomain
// http://__1__.____.____.localhost:8080
app.use(subdomain('dev', devRouter))
app.use(subdomain('prod', prodRouter))
app.use(composedSubdomains)



// Example Request

//...
// curl dev.carddav.mwalkerwells.localhost:8080
//...
```
