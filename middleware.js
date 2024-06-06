const { productSchema } = require("./Schema");
const { reviewSchema } = require("./Schema");

const validateProduct = (req, res, next) => {
  const { name, img, price, desc } = req.body;
  const { error } = productSchema.validate({ name, img, price, desc });
  if (error) {
    return res.render("error");
  }
  next();
};

const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const { error } = reviewSchema.validate({ rating, comment });
  // console.log("review validated")

  if (error) {
    //   const msg = error.details.map((err) => err.message).join(",");
    return res.render("error");
  }
  next();
};

module.exports = { validateProduct, validateReview };
