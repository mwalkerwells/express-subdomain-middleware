# express-subdomain-middleware
Express subdomain middleware support for arbitrary hostnames. It allows for the composition of subdomain routers with variable nesting.

```js
http://level1.level2.level3.levelN.localhost:8080
```

#### Example
```js
// @flow

import typeof express, { Router } from 'express'
import subdomain from 'express-subdomain-middleware'

// Flow Types
import {
  type $Request,
  type $Response,
  type NextFunction,
} from 'express'

// Routers
const devRouter = Router()
devRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // imap.localhost:8080
})

const prodRouter = Router()
devRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // imap.localhost:8080
})

const imapRouter = Router()
imapRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // localhost:8080
})

// App Setup

// Express server handles two subdomain levels:
// • http://__A__.__B__.localhost:8080
const app = express()

// Setup second level subdomain (B)
// http://____.__B__.localhost:8080
devRouter.use(subdomain('imap', imapRouter))
prodRouter.use(subdomain('imap', imapRouter))

// Setup first level subdomain (A)
// http://__A__.____.localhost:8080
app.use(subdomain('dev', devRouter))
app.use(subdomain('prod', prodRouter))


router.use(subdomain('user', userRouter))

// Example Request

//...
// curl dev.carddav.localhost:8080
//...
```
