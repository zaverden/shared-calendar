@app
begin-app

@http
any  /auth/:service/:method
get  /api/e/:publicId
get  /api/c/list
get  /api/c/s/:publicId
post /api/c/s/:publicId/e
post /api/c/s/:gid
post /api/e/:publicId/join
put  /api/c/s/:publicId/p
put  /api/e/:publicId

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@static
folder public
spa true