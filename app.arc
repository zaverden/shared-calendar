@app
begin-app

@http
get /
get /auth/google
get /auth/google/callback
get /api/calendars/list
get /api/calendars/shared/:publicId
post /api/calendars/share/:gid
delete /api/calendars/share/:gid

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
