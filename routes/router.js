const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const athenticate = require("../middleware/authenticate");

router.get("/getproducts", async (req, res) => {
  try {
    const productdata = await Products.find();
    // console.log("console the data"+productdata);
    res.status(201).json(productdata);
  } catch (error) {
    console.log("Error" + error.message);
  }
});

// get individual data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const individuadata = await Products.findOne({ id: id });
    console.log(individuadata);
    res.status(201).json(individuadata);
  } catch (error) {
    res.status(400).json(individuadata);
    console.log("Error" + error.message);
  }
});

// Register Data

router.post("/register", async (req, res) => {
  // console.log("req.body");
  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "filll the all details" });
    console.log("Not data available");
  }
  try {
    const preuser = await USER.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This email is already exist" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "password are not matching" });
    } else {
      const finaluser = new USER({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });

      // yaha pe hasing krenge

      const storedata = await finaluser.save();
      console.log(storedata + "user successfully added");
      res.status(201).json(storedata);
    }
  } catch (error) {
    console.log(
      "error the bhai catch ma for registratoin time" + error.message
    );
    res.status(422).send(error);
  }
});
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "fill the details" });
  }

  try {
    const userlogin = await USER.findOne({ email: email });
    console.log(userlogin);
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      console.log(isMatch);

      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential pass" });
      } else {
        const token = await userlogin.generatAuthtoken();
        console.log(token);

        res.cookie("Amazonweb", token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.status(201).json(userlogin);
      }
    } else {
      res.status(400).json({ error: "user not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: "invalid crediential pass" });
    console.log("error the bhai catch ma for login time" + error.message);
  }
});
router.post("/addcart/:id", athenticate, async (req, res) => {
  try {
    console.log("perfect 6");
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    console.log(cart + "cart milta hain");

    const UserContact = await USER.findOne({ _id: req.userID });
    console.log(UserContact + "user milta hain");

    if (UserContact) {
      const cartData = await UserContact.addcartdata(cart);

      await UserContact.save();
      console.log(cartData + " thse save wait kr");
      console.log(UserContact + "userjode save");
      res.status(201).json(UserContact);
    }
  } catch (error) {
    console.log(error);
  }
});
// get carts details
router.get("/cartdetails", athenticate, async (req, res) => {
  try {
    const buyuser = await USER.findOne({ _id: req.userID });
    res.status(201).json(buyuser);
  } catch (error) {
    console.log("Error" + error);
  }
});

// get valid user
router.get("/validuser", athenticate, async (req, res) => {
  try {
    const validuser = await USER.findOne({ _id: req.userID });
    res.status(201).json(validuser);
  } catch (error) {
    console.log("Error" + error);
  }
});

router.get("/remove/:id", athenticate, async (req, res) => {
  try {
    const { id } = req.params;

    req.rootUser.carts = req.rootUser.carts.filter((curel) => {
      return curel.id != id;
    });

    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("item remove");
  } catch (error) {
    console.log(error + "jwt provide then remove");
    res.status(400).json(error);
  }
});
//for user logout
router.get("/logout", athenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("Amazonweb", { path: "/" });
    req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("user logout");
  } catch (error) {
    console.log(error + "jwt provide then logout");
  }
});
module.exports = router;
// "proxy":"http://localhost:8005/",
