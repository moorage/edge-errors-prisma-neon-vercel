# ewujo-nextjs-extracted

## Getting Started

```sh
corepack enable
yarn install
```

## Setup your .env file

```sh
# Use `openssl rand -base64 32` for the secret
AUTH_SECRET=
# The following are from neon
DATABASE_URL=
DIRECT_URL=
# Whatever the `test` group id is
DEFAULT_GROUP_ID=
# Setup a github app and use the client id and secret
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
# The following is for the `/api/sender/deliveries/attempt` endpoint
# Use keyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521"}, true, ["sign", "verify"])
# JSON.stringify(await window.crypto.subtle.exportKey("jwk", keyPair.publicKey))
SENDER_PUBLIC_KEY=
# JSON.stringify(await window.crypto.subtle.exportKey("jwk", keyPair.privateKey))
SENDER_PRIVATE_KEY=
BASE_URL_NO_TRAILING_SLASH=http://localhost:3000
```

## Migrate the database

`export $(grep -v '^#' .env | xargs)`
`yarn prisma migrate dev`

## Seed the database with user, group, and messages

* Sign in at the app using `yarn dev` and create a user.
* Go to the groups table in the database and add a group with the handle `test`, `creatorId` to the user's ID
* In `.env`, set `DEFAULT_GROUP_ID` to the id of the group.
* In the database, create messages in the group sent by the user.  Content can be anything, but is required.

## Deploy to vercel

The errors only happen on the `vercel` platform, not on localhost.
