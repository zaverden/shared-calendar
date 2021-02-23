@app
begin-app

@http
get /auth/google
get /auth/google/callback
get /auth/email/callback
get /api/event/:publicId
post /api/event/:publicId/join
get /api/calendars/list
get /api/calendars/shared/:publicId
post /api/calendars/share/:gid
delete /api/calendars/share/:gid

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@static
folder public
spa true