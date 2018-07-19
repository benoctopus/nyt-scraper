const db = require('../models');
const crypto = require('crypto');

// i seem to have stubled upon a case in which node is behind es6/7 syntax
// arrow function method declarations on a class may not use the myfunc = () => notation
// this is valid in react and babel compiled js
module.exports = class Odm {
  constructor() {
    this._hashString = str => crypto.createHash('md5').update(str).digest('hex');

    this._generateToken = () => (
      new Promise(resolve => crypto.randomBytes(48, (err, buffer) => {
        if (err) throw err;
        resolve(buffer.toString('hex'));
      })));

    this._updateToken = (uid) => {
      const token = this._generateToken();
      db.User.findOneAndUpdate(
        { uid },
        {
          token,
          tokenExpr: new Date().now + (96 * 60 * 60 * 1000),
        }
      );
      return token;
    };

    this.createUser = async ({ user, pass }) => {
      if (await db.User.findOne({ user })) {
        return { err: 'username exists already' };
      }
      const newUser = {
        user,
        pass: this._hashString(pass),
        token: await this._generateToken(),
      };
      console.log('token', typeof newUser.token);
      try {
        const User = await db.User.create(newUser);
        console.log(JSON.stringify(User, null, 2));
        if (!User) {
          throw new Error('new user object not returned');
        }
        return { token: User.token };
      } catch (err) {
        console.log(err);
        return { err: 'user creation failed' };
      }
    };

    this.authenticate = async ({ user, pass }) => {
      if (typeof user !== 'string' || typeof pass !== 'string') {
        throw new Error('odm.authenticate expects { user: String, pass: String }');
      }

      let User;

      try {
        User = await db.User.findOne({ user }, ['pass']);
        if (!User) throw new Error();
      } catch (err) {
        return { token: null, err: 'account not found' };
      }

      if (this._hashString(pass) === User.pass) {
        const token = this._updateToken(User.uid);
        return { token, err: null };
      }
      return { token: null, err: 'password is incorrect' };
    };

    this.validateToken = async (token) => {
      const User = await db.User.findOne({ token });
      console.log(new Date().getTime() - User.tokenExpr);
      if (!User) {
        console.log('no user');
        return { loggedIn: false };
      }
      // console.log(User);
      if (User.user && User.tokenExpr > parseInt(new Date().getTime(), 10)) {
        return { loggedIn: true, user: User.user };
      }
      return { loggedIn: false };
    };

    this.saveArticle = async ({ token, article }) => {
      try {
        await db.User.update(
          { token },
          { $push: { saved_articles: article } },
        );
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
      return true;
    };

    this.getSavedArticles = async ({ token }) => {
      const articles = await db.User.findOne(
        { token },
        ['saved_articles']
      );
      return [...articles.saved_articles];
    };
  }
};
