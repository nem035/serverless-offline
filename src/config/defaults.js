'use strict'

module.exports = {
  cacheInvalidationRegex: '/node_modules/',
  corsAllowCredentials: true, // TODO no CLI option
  corsAllowHeaders: 'accept,content-type,x-api-key,authorization',
  corsAllowOrigin: '*',
  corsExposedHeaders: 'WWW-Authenticate,Server-Authorization',
  disableCookieValidation: false,
  enforceSecureCookies: false,
  hideStackTraces: false,
  host: 'localhost',
  httpsProtocol: '',
  noAuth: false,
  noTimeout: false,
  port: 3000,
  prefix: '/',
  preserveTrailingSlash: false,
  printOutput: false,
  resourceRoutes: false,
  skipCacheInvalidation: false,
  useSeparateProcesses: false,
  useWorkerThreads: false,
  websocketPort: 3001,
}
