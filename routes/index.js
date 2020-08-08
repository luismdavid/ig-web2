var express = require("express");
var router = express.Router();
const PDFDocument = require("pdfkit");
var userRoutes = require("./users");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/post");
});

router.post("/genPDF", function (request, response) {
  const doc = new PDFDocument({
    margins: {
      top: 20,
      bottom: 20,
      left: 40,
      right: 40,
    },
  });
  const { items, user } = JSON.parse(request.query.body);
  if (!items || !user) {
    response.status(400).send({
      msg: "Please send items to purchase.",
    });
    response.end();
    return;
  }

  response.setHeader("Content-Type", "application/pdf");
  doc.pipe(response);
  doc.font("Times-Roman");
  doc.fontSize(50);
  doc.text("GRACIAS POR SU COMPRA", 50, 25);
  doc.fontSize(15);

  let linepos = 150;
  items.forEach((item) => {
    doc.text(`${item.name} x ${item.quantity}`, 100, linepos);
    doc.text(
      ` - ${item.total}`,
      doc.widthOfString(item.name) + (500 - doc.widthOfString(item.name)),
      linepos
    );
    linepos += 25;
  });

  linepos += 25;
  doc.text(user.name, 50, linepos);
  linepos += 15;
  doc.text(user.email, 50, linepos);
  linepos += 15;
  doc.text(user.phoneNumber, 50, linepos);
  linepos += 40;
  const totalString = `Total:  ${items.reduce((acc, item) => {
    return acc + item.total;
  }, 0)}$$`;
  doc.text(
    totalString,
    doc.widthOfString(totalString) + (500 - doc.widthOfString(totalString)),
    linepos
  );
  doc.end();
  const y_img = 100;
  const x_img = 10;

  const m = 20;
  const xb = 420;
  functions.logger.info("Hello logs!", { structuredData: true });
});

router.use(userRoutes);

module.exports = router;
