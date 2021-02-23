@app
begin-app

@http
get /auth/google
get /auth/google/callback
get /auth/email/callback
get /api/e/:publicId
put /api/e/:publicId
post /api/e/:publicId/join
get /api/c/list
get /api/c/s/:publicId
post /api/c/s/:publicId/e
put /api/c/s/:publicId/p
post /api/c/s/:gid
delete /api/c/s/:gid

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@static
folder public
spa true