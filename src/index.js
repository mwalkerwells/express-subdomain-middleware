// @flow
import { Router, type $Request, type $Response, type NextFunction } from 'express'

type Middleware = (req: $Request, res: $Response, next: NextFunction) => mixed

export default (targetSubdomain: string, handler: express$Router | Middleware): Middleware => (
  request: $Request,
  response: $Response,
  next: NextFunction,
) => {
  const { subdomains } = request
  const [subdomain, ...rest] = subdomains.reverse()
  if (subdomain === targetSubdomain) {
    // When router middleware checks the 'host' value, the matched subdomain is excluded.
    // Request Mutation: This allows for further routing if necessary.
    request.headers.host = request.headers.host.split(`${subdomain}.`)[1]
    if (handler instanceof Router) {
      handler.handle(request, response, next)
    }
    handler(request, response, next)
  }
  next()
}
