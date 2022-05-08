const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(`${process.env.API_URL}all`, controller.allAccess);

  app.get(`${process.env.API_URL}user`, [authJwt.verifyToken], controller.userBoard);

  app.get(`${process.env.API_URL}mod` [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard );

  app.get(`${process.env.API_URL}admin`,[authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};