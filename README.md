# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/products/docker-desktop/).

## Downloading

```
git clone -b authentication git@github.com:vermilion2020/nodejs2025Q2-service.git
```

## Change directory

```
cd nodejs2025Q2-service
```

## Installing NPM modules

```
npm install
```

## Creating env file

```
cp .env.example .env
```

## Running application in docker

```
npm run docker:start
```

## Application launching

Wait until the app is loaded. After all resources are mapped, the application will send log `Nest application successfully started` in the console.

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running using local db

PostgreSQL is installed on your mashine (latest version is recommended)
[PostgreSQL Installation Tutorial](https://www.postgresql.org/docs/current/tutorial-install.html).

update .env file
At least setup

```
POSTGRES_HOST=localhost
POSTGRES_PORT={Your local pg port}
POSTGRES_USER={Your local pg user name}
POSTGRES_PASSWORD={Your local pg password}
POSTGRES_DB={Your local pg db name}
```

You can also add specific shema name to DATABASE_URL (it should exist in your local db)
`DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema={Your local schema name}"`

## Migrate local db

```
npm run db:setup
```

## Start the app locally in dev mode

```
npm run start:dev
```

## Testing with authorization

After application running open new terminal and enter:

To run all tests with authorization

```
npm run test:auth
```

To run refresh tests

```
npm run test:refresh
```

# Logging

Logs are created by default in folder `logs`<br>
`LOG_MAX_FILE_SIZE` and `LOG_LEVEL` could be configured in .env file.<br>
Logs are separated between 2 files: log\_{index}.txt and error\_{index}.txt.<br>

- 500 + response codes (errors) logs are sent to error\_{index}.txt file with prefix [ERROR], and also `uncaughtException` and `unhandledRejection` events are logged there
- 400 + response codes are logged in log\_{index}.txt file with prefix [WARN].
- Request data and response data of successful requests are logged in log\_{index}.txt file with prefix [LOG].
  New files of logs/errors are created when previos file reaches maximum size.<br>
  `LOG_LEVEL` allow to configure how much logs will be written. For example 0 value will set only error logs in error\_{index}.txt file to be collected. Value 1 will add warning logs to be collected in log\_{index}.txt and 2 will set basic logs to be collected in log\_{index}.txt (logged request and response data).

## Logging in Docker

Logs are saved in the volume `app_logs`. It is available in section volumes in docker ui in folder nodejs2025q2-service_app_logs.

# Application Resources

## Auth

- **POST /auth/signup**: Create a new user
- **POST /auth/login**: Sign in using login and password (retrieve accessToken and refreshToken for using bearer authorization header)
- **POST /auth/refresh**: Retrieve a new pair of accessToken and refreshToken using previous valid refreshToken

## Users

- **GET /user**: Retrieve all users.
- **GET /user/:id**: Retrieve a user by ID.
- **POST /user**: Create a new user.
- **PATCH /user/:id**: Update a user by ID.
- **DELETE /user/:id**: Delete a user by ID.

## Albums

- **GET /album**: Retrieve all albums.
- **GET /album/:id**: Retrieve an album by ID.
- **POST /album**: Create a new album.
- **PATCH /album/:id**: Update an album by ID.
- **DELETE /album/:id**: Delete an album by ID.

## Artists

- **GET /artist**: Retrieve all artists.
- **GET /artist/:id**: Retrieve an artist by ID.
- **POST /artist**: Create a new artist.
- **PATCH /artist/:id**: Update an artist by ID.
- **DELETE /artist/:id**: Delete an artist by ID.

## Tracks

- **GET /track**: Retrieve all tracks.
- **GET /track/:id**: Retrieve a track by ID.
- **POST /track**: Create a new track.
- **PATCH /track/:id**: Update a track by ID.
- **DELETE /track/:id**: Delete a track by ID.

## Favorites

- **GET /favs**: Retrieve all favorites.
- **POST /favs/track/:id**: Add a track to favorites.
- **DELETE /favs/track/:id**: Remove a track from favorites.
- **POST /favs/album/:id**: Add an album to favorites.
- **DELETE /favs/album/:id**: Remove an album from favorites.
- **POST /favs/artist/:id**: Add an artist to favorites.
- **DELETE /favs/artist/:id**: Remove an artist from favorites.
