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

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};



// ========================================================================== //
// Shoot an email
// ========================================================================== //
const { jsPDF } = require('jspdf')
const nodemailer = require('nodemailer') 

// ========================================================================== //
// sendEmail
// ========================================================================== //
app.post('/api/sendEmail', async (req, res) => {
  console.log(req)
  const { message, recipient } = req.body

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST || 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    debug: true,
    logger: true,
    auth: {
      user: process.env.MAIL_SENDER || '',
      pass: process.env.MAIL_P || ''
    }
  })
  // method to parse string from body

  console.log(`Sending PDF report to ${recipient}`)

  const report = Buffer.from(
    new jsPDF()
      .text(JSON.stringify(message, null, 2), 10, 10)
      .output('arraybuffer')
  )
  const invoice = await transporter.sendMail(
    {
      from: process.env.MAIL_SENDER,
      to: recipient,
      subject: 'Socialert - fix forgotten password',
      text: '',
      attachments: [
        report && {
          filename: `report-${new Date().toDateString()}.pdf`,
          content: report,
          contentType: 'application/pdf'
        }
      ],
      message
    },
    (err, info) => {
      if (err) console.log(err)
      console.log(info)
    }
  )
 
  res.send({
    statusCode: 200,
    body: JSON.stringify({ message: JSON.stringify(invoice) }),
    isBase64Encoded: false,
    multiValueHeaders: {
      'Content-Type': 'application/json'
    }
  })
})

