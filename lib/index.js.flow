// @flow
import { Router, type $Request, type $Response, type NextFunction } from 'express'

type Middleware = (req: $Request, res: $Response, next: NextFunction) => mixed

export default (targetSubdomain: string, handler: express$Router | Middleware): Middleware => {
  return (request: $Request, response: $Response, next: NextFunction) => {
    if (request.headers.host) {
      const { host } = request.headers
      if (typeof host === 'string') {
        if (hasSubdomain(host)) {
          // Only checks the "first" subdomain. Subsequent subdomain checks are done by middleware.
          const [subdomain, ...rest] = host.split('.').filter(pipe(prop('length'), greaterThan(0)))
          if (subdomain === targetSubdomain) {
            // When router middleware checks the 'host' value, the matched subdomain is excluded.
            // This allows for further routing if necessary.
            unafeMutateObj(request.headers, 'host', rest.join('.'))
            if (handler instanceof Router) {
              handler.handle(request, response, next)
            }
            handler(request, response, next)
          }
        }
      }
    }
    next()
  }
}

// prettier-ignore
type UnaryFn<A,R> = (a: A) => R

// Inline declaration required to model the type for pipe
// prettier-ignore
declare var pipe:
    & (<A,B,C>(ab: UnaryFn<A,B>, bc: UnaryFn<B,C>, ...rest: Array<void>) => UnaryFn<A,C>)
    & (<A,B>(ab: UnaryFn<A,B>, ...rest: Array<void>) => UnaryFn<A,B>)

function pipe(...fns) {
  return function(...args) {
    return fns.reduce((acc, fn) => {
      return Array.isArray(acc) ? fn.call({}, ...acc) : fn.call({}, acc)
    }, args)
  }
}

const prop = key => map => map[key]

function unafeMutateObj<T: {}, U: T, K: $Keys<U>, V>(obj: U, key: K, value: V): T {
  obj[key] = value
  return obj
}

function hasSubdomain(hostname: string): boolean {
  return hostname.split('.').length > 0
}

const greaterThan = (num: number) => (value: number): boolean => value > num
