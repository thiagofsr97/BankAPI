/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Error as errMongo } from 'mongoose';
import User from '../models/user';
import { signIn } from '../helpers/jwtAuth';

const getToken = (userName, id) => {
  const payload = {
    userName,
    id,
  };
  return signIn(payload);
};

const create = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  try {
    const result = {};
    const {
      name, password, registrationNumber, initialWallet,
    } = req.body;
    if (await User.findOne({ registrationNumber })) {
      return next(createError(403, `Registration Number ${registrationNumber} has already been taken.`));
    }

    console.log(initialWallet);
    const user = new User({
      name,
      password,
      registrationNumber,
      ...(initialWallet && { wallet: initialWallet }),
    });

    const userCreated = await user.save();
    const token = getToken(userCreated.name, userCreated._id);

    const userReturn = Object.assign({}, userCreated._doc);
    delete userReturn.password;
    result.token = token;
    result.result = userReturn;
    result.message = 'User has been successfully created and logged in.';
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const authenticate = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }
  try {
    const { registrationNumber, password } = req.body;
    const result = {};

    const user = await User.findOne({ registrationNumber });
    if (!user) {
      return next(createError(404), 'User not found.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = getToken(user.name, user._id);

      result.token = token;
      result.message = 'User has been successfully authenticated.';
      res.status(200).send(result);
    } else {
      return next(createError(401, 'Authentication Error.'));
    }
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const result = {};
    const users = await User.find().select('-password').exec();
    if (users.length) {
      result.result = users;
      result.message = 'Users have been successfully found.';
      res.status(200).send(result);
    } else {
      return next(createError(404, 'There are not users.'));
    }
  } catch (err) {
    next(err);
  }
};

const getById = async function (req, res, next) {
  try {
    const { id } = req.decoded;
    const result = {};
    const user = await User.findById(id).select('-password').exec();
    if (user) {
      result.message = 'User has been successfully found.';
      result.result = user;
      res.status(200).send(result);
    } else {
      return next(createError(404, 'User not found.'));
    }
  } catch (err) {
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'User not found \'cause id is not processable.'));
    }
    next(err);
  }
};

const getWallet = async function (req, res, next) {
  try {
    const result = {};
    const { id } = req.decoded;

    const userWallet = await User.findById(id).select('wallet').exec();
    result.message = 'User wallet has been successfully found.';
    result.wallet = userWallet;

    res.status(200).send(result);
  } catch (err) {
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'User not found \'cause id is not processable.'));
    }
    next(err);
  }
};

export {
  create, authenticate, getAll, getById, getWallet,
};
