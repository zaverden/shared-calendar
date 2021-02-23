@app
begin-app

@http
get /auth/google
get /auth/google/callback
get /auth/email/callback
get /api/event/:publicId
put /api/event/:publicId
post /api/event/:publicId/join
get /api/calendars/list
get /api/calendars/shared/:publicId
post /api/calendars/shared/:publicId/event
put /api/calendars/shared/:publicId/add-permissions
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