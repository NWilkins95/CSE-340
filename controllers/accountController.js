const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
 *  Build login view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build account management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
  *  Build update account view
  * *************************************** */
async function buildUpdate(req, res) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;
  if (!accountData) {
    req.flash("notice", "Please log in to update your account.");
    return res.redirect("/account/login");
  }
  const accountDetails = await accountModel.getAccountById(accountData.account_id);
  if (!accountDetails) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/login");
  }
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountDetails.account_id,
    account_firstname: accountDetails.account_firstname,
    account_lastname: accountDetails.account_lastname,
    account_email: accountDetails.account_email,
  });
}

/* ****************************************
 *  Process update account request
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  // Update the account information
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Your account has been successfully updated!");
    req.flash("notice", "First name: " + account_firstname)
    req.flash("notice", "Last name: " + account_lastname)
    req.flash("notice", "Email: " + account_email);
    req.session.accountData = {
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    };
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Process update password request
 * ************************************ */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  // Hash the new password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password update.");
    return res.status(500).render("account/update", {
      title: "Update Password",
      nav,
      errors: null,
    });
  }

  // Update the account password
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Your password has been successfully updated.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    return res.status(500).render("account/update", {
      title: "Update Password",
      nav,
      errors: null,
      account_id,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.session.accountData = accountData
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildUpdate, updateAccount, updatePassword };