const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const signupPage = (req, res) => res.render('signup');

const logout = (req, res) => res.redirect('/');
/**
 * This handles the login process for the Domomaker app.
 * @param {*} req 
 * @param {*} res 
 * @returns the account page if successful, or an error if unsuccessful.
 */
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  //Ensure all text fields are filled in.
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  //Check if username and password are correct.
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return res.json({ redirect: '/maker' });
  });
};
/**
 * This handles the signup process for the Domomaker app.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  //Ensure all text fields are filled in.
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  //Ensure passwords match.
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    //Create new account from data. Open new account page when successful.
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    //If username is already in use, return error.
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  loginPage,
  signupPage,
  login,
  logout,
  signup,
};
