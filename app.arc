@app
begin-app

@http
get /
get /auth/google

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
