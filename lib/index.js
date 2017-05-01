'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (targetSubdomain, router) => {
  return (request, response, next) => {
    if (request.headers.host) {
      const { host } = request.headers;
      if (typeof host === 'string') {
        if (hasSubdomain(host)) {
          // Only checks the "first" subdomain. Subsequent subdomain checks are done by middleware.
          const [subdomain, ...rest] = host.split('.').filter(pipe(prop('length'), greaterThan(0)));
          if (subdomain === targetSubdomain) {
            // When router middleware checks the 'host' value, the matched subdomain is excluded.
            // This allows for further routing if necessary.
            unafeMutateObj(request.headers, 'host', rest.join('.'));
            router.handle(request, response, next);
          }
        }
      }
    }
    next();
  };
};

// prettier-ignore


// Inline declaration required to model the type for pipe
// prettier-ignore


function pipe(...fns) {
  return function (...args) {
    return fns.reduce((acc, fn) => {
      return Array.isArray(acc) ? fn.call({}, ...acc) : fn.call({}, acc);
    }, args);
  };
}

const prop = key => map => map[key];

function unafeMutateObj(obj, key, value) {
  obj[key] = value;
  return obj;
}

function hasSubdomain(hostname) {
  return hostname.split('.').length > 0;
}

const greaterThan = num => value => value > num;