# BALANCE TON BUG
BTB API built in JS

# TODO
- email verification

# ONGOING
- Image sharing : need more tools to handle validation

# To be improved
- Cascade deletes 

# Done
- Rooms
- Tickets mechanics
- Use env variable for secret keys etc

# Dropped
- Separate app and server : not really useful

# Installation guide

## Requirements

### Required
- NodeJS
- npm
- mongoDB 

### Useful 
- Postman (for dev)
- mongo Compass

## Start guide
- Clone the project : https://github.com/pidakichi/btb_app.git
- Create ".env" at the root of the project

Required fields :
APP_NAME= _name of the app_
NODE_ENV= _environment_
PORT= _port number_

ENDPOINT= _endpoint, if in local, use http://localhost

JWT_SECRET= _secret key for JWT creation_

DB_CONNEXION= _db used, by default, use "mongo"_
DB_HOST= _db host, if in local use "localhost"_
DB_PORT= _your mongodb port, by default 27017_
DB_DATABASE= _name of your database_

CLOUDINARY_NAME= _not used yet, enter whatever_
CLOUDINARY_API_KEY= _not used yet, enter whatever_
CLOUDINARY_API_SECRET= _not used yet, enter whatever_
CLOUDINARY_URL= _not used yet, enter whatever_

- Open command line at the root, run "npm install"
- Run "npm start" or "npm run start-dev" for development (using Nodemon and auto server refresh)
- done, you can now curl or use postman to use the API

