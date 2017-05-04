'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

exports.default = (target, handler) => (request, response, next) => {
  const { headers, subdomains } = request;
  const [first, ...rest] = hostnameToArray(headers.host);

  if (first === target) {
    // When router middleware checks the 'host' value, the matched subdomain is excluded.
    // Request Mutation: This allows for further routing if necessary.
    mutateHost(headers, rest);
    if (handler instanceof _express.Router) {
      handler.handle(request, response, next);
    } else {
      handler(request, response, next);
    }
  }
};

function mutateHost(headers, hostnameArray) {
  headers.host = hostnameArray.join('.');
}

const hostnameToArray = hostname => hostname.split('.');