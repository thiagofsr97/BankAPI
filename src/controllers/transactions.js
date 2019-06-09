/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import mongoose from 'mongoose';
// import db from '../db';
import { ACTION_DEPOSIT, ACTION_WITHDRAW } from '../helpers/constants';
import User from '../models/user';
import Transaction from '../models/transaction';


const transact = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  /**
     * Setting up transaction so operation is made atomic.
     */

  const sessionDB = await mongoose.startSession();

  sessionDB.startTransaction();

  try {
    const result = {};
    const { action } = req.body;
    let { ammount } = req.body;
    ammount = parseFloat(ammount);
    const { id } = req.decoded;

    const user = await User.findById(id);
    user.wallet += (action === ACTION_WITHDRAW ? -ammount : ammount);

    if (user.wallet < 0) {
      throw createError(403, `User has insufficient funds to perform '${action}'. Funds: '${(user.wallet + ammount)}'`);
    }

    user.save({ sessionDB });

    const transactionModel = new Transaction({
      user: id,
      action,
      currentBalance: user.wallet + (action === ACTION_WITHDRAW ? ammount : -ammount),
      ammountTransact: ammount,
    });

    const transaction = await transactionModel.save({ sessionDB });

    await sessionDB.commitTransaction();
    sessionDB.endSession();

    const userReturn = Object.assign({}, user._doc);
    delete userReturn.password;

    result.user = userReturn;
    result.transaction = transaction;
    result.message = 'Transaction has been sucessfully perfomed.';

    res.status(200).send(result);
  } catch (err) {
    await sessionDB.abortTransaction();
    sessionDB.endSession();
    if (err instanceof mongoose.Error.CastError) {
      return next(createError(404, 'User not found \'cause id is not processable.'));
    }
    next(err);
  }
};


const getAll = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }
  try {
    const result = {};

    const {
      dateStart, dateEnd,
    } = req.query;

    let dateQuery;
    if (dateStart) {
      const start = dateStart;
      let end = start.clone();
      if (dateEnd) {
        end = dateEnd;
      }
      end.add(1, 'days');

      dateQuery = {
        createdAt: {
          $gte: start.toDate(),
          $lte: end.toDate(),
        },
      };
    }

    const query = {
      ...(dateQuery && dateQuery),
    };

    const transactions = await Transaction.find(query);
    if (transactions.length) {
      result.result = transactions;
      result.message = 'Transactions have been successfully found.';
      res.status(200).send(result);
    } else {
      return next(createError(404, 'There are no transactions.'));
    }
  } catch (err) {
    next(err);
  }
};

const getAllByUser = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }
  try {
    const result = {};
    const { id } = req.decoded;
    const {
      dateStart, dateEnd,
    } = req.query;

    let dateQuery;
    if (dateStart) {
      const start = dateStart;
      let end = start.clone();
      if (dateEnd) {
        end = dateEnd;
      }
      end.add(1, 'days');

      dateQuery = {
        createdAt: {
          $gte: start.toDate(),
          $lte: end.toDate(),
        },
      };
    }

    const query = {
      ...(dateQuery && dateQuery),
      user: id,
    };
    const transactions = await Transaction.find(query);
    if (transactions.length) {
      result.result = transactions;
      result.message = 'Transactions have been successfully found.';
      res.status(200).send(result);
    } else {
      return next(createError(404, 'There are no transactions for this user.'));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(createError(404, 'User not found \'cause id is not processable.'));
    }
    next(err);
  }
};

export {
  transact, getAll, getAllByUser,
};
