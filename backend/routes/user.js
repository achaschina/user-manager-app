const express = require("express");
// const multer = require("multer");

const User = require("../models/User");

const router = express.Router();

router.get("/all", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find();
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUsers,
        // maxUsers: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id)
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});

router.delete("/delete/:id", (req, res, next) => {
  console.log(req.params.id)
  User.findByIdAndDelete(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});

router.delete("/deleteAddress/:id/:addressId", (req, res, next) => {
  // let id = req.body.id;
  // delete req.body.id;
  // let addressId = "1239203"
  // update( { _id: "5cda99d0222d8e1a7c04f07a" }, { $pull: { "address.addressId": "1239203" } } )
  console.log(req.params, 'body')

  User.update( { _id: req.params.id },   { $pull: { address: { addressId: req.params.addressId } } },
  { multi: true } )
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});

router.post("/addAddress", (req, res, next) => {
  let id = req.body.id;
  delete req.body.id;
  User.findByIdAndUpdate(id, { $push: { address: req.body.adressInfo }})
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});

router.post("/updateAddress", (req, res, next) => {
  User.update({"_id": req.body.id, "address.addressId": req.body.addressId},
              {
                $set: {
                        "address.$.addressType": req.body.addressType,
                        "address.$.country":  req.body.country,
                        "address.$.city": req.body.city,
                        "address.$.postalCode": req.body.postalCode,
                        "address.$.addressLine": req.body.addressLine,
                      }
              },
              (err, doc) => {
                if(err) throw err;
                res.status(200).json({ message: "Update successful!", address: doc });
              });
});

router.post("/updateUser", (req, res, next) => {
  const user = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    phone: req.body.phone,
    password: req.body.password,
  };
  User.findOneAndUpdate({_id: req.body._id}, {$set: user}, {new: true}, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }
    res.status(200).json({ message: "Update successful!", user: doc });
  });
});

// router.post("/updateUsersAddress", (req, res, next) => {
//   const user = {
//     email: req.body.email,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     username: req.body.username,
//     phone: req.body.phone,
//     password: req.body.password,
//   };
//   User.findOneAndUpdate({_id: req.body._id}, {$set: user}, {new: true}, (err, doc) => {
//     if (err) {
//       console.log("Something wrong when updating data!");
//     }
//     res.status(200).json({ message: "Update successful!", user: doc });
//   });
// });

router.post('/findUsers', (req, res, next) => {
  var query = {};

  if (req.body.firstName) {
      query.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
      query.lastName = req.body.lastName;
  }

  if (req.body.username) {
      query.username = req.body.username;
  }

  if (req.body.phone) {
      query.phone = req.body.phone;
  }

  if (req.body.email) {
      query.email = req.body.email;
  }

  if (query.firstName || query.lastName || query.username || query.phone || query.email) {
    User.find(query,  (err, docs) => {
      if (err) throw err;
      res.status(200).json(docs);
    });
  }
});

router.post("/add", (req, res, next) => {
    const user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      phone: req.body.phone,
      password: req.body.password,
    });
    user.save().then(createdUser => {
      res.status(201).json({
        message: "User added successfully",
        user: {
          ...createdUser,
          id: createdUser._id
        }
      });
    });
  }
);

module.exports = router;

