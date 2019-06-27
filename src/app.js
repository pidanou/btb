//Packages
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require("./swagger.json");

//config
const config = require("./config/env.config");
const db = require("./config/db.conn");

//routers
const loginRouter = require("./routes/login.routes");
const userRouter = require("./routes/users.routes");
const ticketRouter = require("./routes/tickets.routes");
const roomRouter = require("./routes/rooms.route");

//setup
db.connect();
const app = express();

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

loginRouter.authRoutesConfig(app);
ticketRouter.ticketRoutesConfig(app);
userRouter.userRoutesConfig(app);
roomRouter.roomsRouteConfig(app);


app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));

module.exports = app;
