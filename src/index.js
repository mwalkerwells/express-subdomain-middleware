// @flow
import { Router, type $Request, type $Response, type NextFunction } from 'express'

type Middleware = (req: $Request, res: $Response, next: NextFunction) => mixed

export default (target: string, handler: express$Router | Middleware): Middleware => (
  request: $Request,
  response: $Response,
  next: NextFunction,
) => {
  const { headers, subdomains } = request
  const [first, ...rest] = hostnameToArray(headers.host)

  if (first === target) {
    // When router middleware checks the 'host' value, the matched subdomain is excluded.
    // Request Mutation: This allows for further routing if necessary.
    mutateHost(headers, rest)
    if (handler instanceof Router) {
      handler.handle(request, response, next)
    } else {
      handler(request, response, next)
    }
  }
}

function mutateHost(headers: { host: string }, hostnameArray: Array<string>): void {
  headers.host = hostnameArray.join('.')
}

const hostnameToArray = <T: string>(hostname: T): Array<T> => hostname.split('.')
