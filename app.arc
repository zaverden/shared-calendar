@app
begin-app

@http
get /
get /auth/google
get /auth/google/callback
get /api/calendars/list
post /api/calendars/share/:gid

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
