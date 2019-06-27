const dotenv = require ("dotenv");
dotenv.config();


module.exports = {
    "PORT": process.env.PORT,
    "appEndpoint": "http://localhost:8000",
    "API_ENDPOINT": `${process.env.ENDPOINT}:${process.env.PORT}`,
    "environment": process.env.NODE_ENV,

    "DB_URI" : `${process.env.DB_CONNEXION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,

    "jwt_secret": `${process.env.JWT_SECRET}`,
    "jwt_expiration_time": "2h",

    "CLOUDINARY_NAME" : `${process.env.CLOUDINARY_NAME}`,
    "CLOUDINARY_API_KEY" : `${process.env.CLOUDINARY_API_KEY}`,
    "CLOUDINARY_API_SECRET" : `${process.env.CLOUDINARY_API_SECRET}`,

    "MAIL_SERVICE": `${process.env.MAIL_SERVICE}`,
    "MAIL_USERNAME" : `${process.env.MAIL_USERNAME}`,
    "MAIL_PASSWORD" : `${process.env.MAIL_PASSWORD}`,

    "permissionLevels":{
        "ADMIN": 1,
        "STAFF": 2,
        "USER":3
    }
};