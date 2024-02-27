//const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Ledger = require("../models/ledger");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].message);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const sponsor = req.body.spn;
  const mail = req.body.mail;
  const pass = req.body.pass;
  let keyId = Math.floor(100000 + Math.random() * 900000);
  // get sponsor team
  let spnTeam;
  let NewspnTeam;
  User.findOne({ keyid: sponsor }).then((spnData) => {
    console.log(spnData.uplines);
    spnTeam = [...spnData.uplines];
    if (spnTeam.length > 0) {
      NewspnTeam = spnTeam.map((items) => {
        return { keyid: items.keyid, lvl: (items.lvl += 1) };
      });
    }
  });

  let sendData;
  bcrypt
    .hash(pass, 12)
    .then((hashPass) => {
      const user = new User({
        keyid: keyId,
        mail: mail,
        password: hashPass,
        sponsor: sponsor,
        date: Date.now(),
        uplines: [],
      });
      return user.save();
    })
    .then((userData) => {
      sendData = userData;
      NewspnTeam.push({ keyid: sponsor, lvl: 1 });
      return User.findOneAndUpdate(
        { _id: userData._id },
        { uplines: NewspnTeam }
      );
    })
    .then((updateResult) => {
      const ledger = new Ledger({
        user: sendData._id,
        folio: "Opening",
        details: "Opening",
        credit: 0,
        debit: 0,
        balance: 0,
      });
      return ledger.save();
    })
    .then((ledData) => {
      res.status(200).json({ message: "OK", data: sendData });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.mail;
  const password = req.body.pass;
  let loadedUser;
  User.findOne({ mail: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.mail,
          userId: loadedUser._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, user: loadedUser });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.addMoney = (req, res, next) => {
  const bal = req.body.amount;
  // console.log(bal);
  let tot;
  Ledger.find({ user: req.userId })
    .sort({ _id: -1 })
    .limit(1)
    .then((balData) => {
      console.log(balData);
      tot = +balData[0].balance + bal;
      console.log(tot);
      const ledger = new Ledger({
        user: balData[0]._id,
        folio: "Add Balance",
        details: "Add Balance By User",
        credit: 0,
        debit: 0,
        balance: tot,
      });
      return ledger.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Balance Added successfully!",
        data: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
