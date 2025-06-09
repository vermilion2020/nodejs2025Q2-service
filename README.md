# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/products/docker-desktop/).

## Downloading

```
git clone -b containerization-database-orm git@github.com:vermilion2020/nodejs2025Q2-service.git
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

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

## Security scanning

```
npm run docker:security-scan
```

## Docker images listing

```
npm run docker:list-images
```

# Application Resources

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
