# express-subdomain-middleware
Express subdomain middleware support for arbitrary hostnames.

```js
import express, { Router } from 'express'
import subdomain from 'express-subdomain-middleware'

const imapRouter = Router()
imapRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // localhost:8080
})

const devRouter = Router()
devRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // imap.localhost:8080
})

const prodRouter = Router()
devRouter.use((request: $Request, response: $Response, next: NextFunction) => {
  console.log(request.headers.host) // imap.localhost:8080
})

// Express server handles two subdomain levels:
// • http://__A__.__B__.localhost:8080
const app = express()

// Setup second level subdomain (B)
// http://_____.__B__.localhost:8080
devRouter.use(subdomain('imap', imapRouter)) 
prodRouter.use(subdomain('imap', imapRouter))

// Setup first level subdomain (A)
// http://__A__._____.localhost:8080
app.use(subdomain('dev', devRouter))
app.use(subdomain('prod', prodRouter))


router.use(subdomain('user', userRouter))

//...
// curl dev.carddav.localhost:8080
//...
```
