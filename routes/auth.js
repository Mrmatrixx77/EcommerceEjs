const express = require('express');
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");


router.get("/register",(req,res)=>{
    res.render("auth/signup");
   
})

router.post("/register",async(req,res)=>{
    const {email,username,password,role} = req.body;
    const user = new User({email,username,role});
    const newUser = await User.register(user,password);
    res.send(newUser);
})

router.get("/login",async(req,res)=>{
    res.render("auth/login")
})
router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureMessage: true,
    }),
    function (req, res) {
      // console.log(req.user);
      req.flash("success", `welcome back ${req.user.username}`);
      res.redirect("/products");
    }
  );

module.exports = router;