'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

exports.default = (targetSubdomain, handler) => (request, response, next) => {
  const { subdomains } = request;
  const [subdomain, ...rest] = subdomains.reverse();
  if (subdomain === targetSubdomain) {
    // When router middleware checks the 'host' value, the matched subdomain is excluded.
    // Request Mutation: This allows for further routing if necessary.
    request.headers.host = request.headers.host.split(`${subdomain}.`)[1];
    if (handler instanceof _express.Router) {
      handler.handle(request, response, next);
    }
    handler(request, response, next);
  }
  next();
};