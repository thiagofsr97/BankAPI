/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Error as errMongo } from 'mongoose';
import User from '../models/user';
import { signIn } from '../helpers/jwtAuth';

const getToken = (user, id) => {
  const payload = {
    user,
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
      name, password, registrationNumber,
    } = req.body;
    if (await User.findOne({ registrationNumber })) {
      return next(createError(403, `Registration Number ${registrationNumber} has already been taken.`));
    }

    const user = new User({
      name,
      password,
      registrationNumber,
    });

    const userCreated = Object.assign({}, await user.save());
    delete userCreated.password;
    const token = getToken(userCreated.name, userCreated._id);

    result.token = token;
    result.result = userCreated;
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
    const { id } = req.params;
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

export {
  create, authenticate, getAll, getById,
};
