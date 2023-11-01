const models = require('../models');

const { Domo } = models;
/**
 * This function loads the domo maker page along with the domos created by the logged in user.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const makerPage = async (req, res) => {
  try {
    //Load up domos from the user's account.
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age').lean().exec();
    return res.render('app', { domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured when retrieving the domos!' });
  }
};
/**
 * This function handles the creation of a new Domo.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }
  //Put this new Domo under the account of the user who created it.
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    //Save the new Domo and redirect to the maker page.
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    //Catch and throw errors.
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }
    return res.status(500).json({ error: 'An error occured' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
};
