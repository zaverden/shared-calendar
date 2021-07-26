# ShaCal

[About the project](https://shacal.app.zaverden.com/about-project.html)

## Getting started

Restore `package.json` in the `client` folder (run in repo root):
```bash
cp ./client/package_.json ./client/package.json
```

Install packages (run in repo root):
```
npm install
pushd ./client
npm install
popd
```

Create `local.env` file at the project root with variables:
```
NODE_ENV=testing
JWT_SECRET=local
GOOGLE_CLIENT_ID=**************.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=**************
GOOGLE_PROJECT_ID=shared-**************
SENDGRID_FROM_ADDRESS=shacal@localhost
SENDGRID_AUTH_EMAIL_TEMPLATE=none
```

and then run the app with
```bash
docker-compose up
```

## Design

[Figma](https://www.figma.com/file/KaLPq29QkjkdJRnq5lzcpd/)

## Reference

Head to [docs.begin.com](https://docs.begin.com/) to learn more!
