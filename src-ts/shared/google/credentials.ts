export const credentials = {
  web: {
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientId: process.env.GOOGLE_CLIENT_ID,
    projectId: process.env.GOOGLE_PROJECT_ID,
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    redirectUri: (domainName?: string): string =>
      [
        domainName ? "https://" : "http://",
        domainName ?? "localhost:3333",
        "/auth/google/callback",
      ].join(""),
  },
};
