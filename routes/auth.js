const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/userSchema')
const bcrypt = require("bcrypt");
const authenticate = require("../middleware/authenticate")

router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword, option, country} = req.body;

    if (!email || !password || !username || !confirmPassword || !option || !country) {
        return res.status(422).json({ error: "Please fill in all the fields" });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }
        else if(password != confirmPassword){
            return res.status(422).json({error:"Passwords are not matching"})
        }
        else{

            const user = new User({ email, password, username, confirmPassword, option, country });
            await user.save();
            res.status(201).json({ message: "User registered" });
        }

    } catch (error) {
        console.log(error);
        res.status(422).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
      const { password, email } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Please fill in all the fields" });
        return;
      }
  
      const userLogin = await User.findOne({ email: email });
      if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          res.status(400).json({ error: "Invalid credentials" });
          return;
        }
  
        if (userLogin.option !== "Student") {
          res.status(400).json({ error: "Access denied" });
          return;
        }
  
        const token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwtoken", token, {
          httpOnly: true,
          maxAge: 258943000000, 
          path: "/dashboard", 
        });
        
        res.json({ message: "User login successful" });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/dashboard", authenticate, (req, res) => {
    res.send(req.rootUser);
  });

  router.get("/residents", async (req, res) => {
    try {
      const residents = await User.find({ option: "Resident" });
      res.json(residents);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;
