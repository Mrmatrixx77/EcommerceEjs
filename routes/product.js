const express = require('express');
const router = express.Router();
const Product = require("../models/Product");
const {validateProduct} = require("../middleware")


router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.get("/products/new", (req, res) => {
  try {
    res.render("products/new");
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.post("/products",validateProduct,async(req,res)=>{
  try{

    let {name,img,price,desc} = req.body;
    await Product.create({name,img,price,desc});
    req.flash("success", "Successfully added a new product!");
    res.redirect("/products");
  }catch(e){
    res.status(500).render("error",{err: e.message})
  }
})

//route to show a particular product
router.get("/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("reviews");
      res.render("products/show", { product });
    } catch (e) {
      res.status(500).render("error", { err: e.message });
    }
  });

//form to edit the product 

router.get("/products/:id/edit", async(req,res)=>{
  let {id} = req.params;
  let product = await Product.findById(id);

  res.render("products/edit",{product});
})

router.patch("/products/:id",async(req,res)=>{
  try {
    let {id} = req.params;
    const {name,price,img,desc} = req.body;
    await Product.findByIdAndUpdate(id,{name,price,img,desc});
  req.flash('success', 'edited successfully');

    res.redirect(`/products/${id}`)
  
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
})
router.delete("/products/:id", async(req,res)=>{
  let {id} = req.params;
  await Product.findByIdAndDelete(id);
  req.flash('success', 'deleted successfully');

  res.redirect("/products");
})

module.exports = router;