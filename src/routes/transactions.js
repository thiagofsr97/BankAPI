import { Router } from 'express';
import { body, query } from 'express-validator/check';
import moment from 'moment';
import { validateToken } from '../helpers/jwtAuth';
import {
  ERROR_MISSING, ERROR_ACTION_VALUES, ERROR_FLOAT_VALUE,
  ERROR_ABSOLUTE_VALUE, ERROR_DATE_FORMAT, DATE_FORMAT,
} from '../helpers/constants';
import { transact, getAll, getAllByUser } from '../controllers/transactions';

const router = Router();


router.post('/transact', validateToken, [
  body('action').not().isEmpty().withMessage(ERROR_MISSING)
    .matches(/^withdraw$|^deposit$/)
    .withMessage(ERROR_ACTION_VALUES),
  body('ammount').not().isEmpty().withMessage(ERROR_MISSING)
    .isFloat()
    .withMessage(ERROR_FLOAT_VALUE)
    .custom((ammount, { req }) => {
      if (parseFloat(ammount) < 0) {
        throw new Error(ERROR_ABSOLUTE_VALUE);
      }
      return true;
    }),
], transact);

router.get('/', validateToken, [
  query('dateStart').optional().custom((date, { req }) => {
    const start = moment(date, DATE_FORMAT, true);
    if (!start.isValid()) {
      throw new Error(ERROR_DATE_FORMAT);
    }
    req.query.dateStart = start;
    return true;
  }),
  query('dateEnd').optional().custom((date, { req }) => {
    const end = moment(date, DATE_FORMAT, true);
    if (!end.isValid()) {
      throw new Error(ERROR_DATE_FORMAT);
    }
    req.query.dateEnd = end;
    return true;
  }),
], getAll);

router.get('/id', validateToken, [
  query('dateStart').optional().custom((date, { req }) => {
    const start = moment(date, DATE_FORMAT, true);
    if (!start.isValid()) {
      throw new Error(ERROR_DATE_FORMAT);
    }
    req.query.dateStart = start;
    return true;
  }),
  query('dateEnd').optional().custom((date, { req }) => {
    const end = moment(date, DATE_FORMAT, true);
    if (!end.isValid()) {
      throw new Error(ERROR_DATE_FORMAT);
    }
    req.query.dateEnd = end;
    return true;
  }),
], getAllByUser);

export default router;
