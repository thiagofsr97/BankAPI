import { Router } from 'express';
import { body, query } from 'express-validator/check';
import moment from 'moment';
import { validateToken } from '../helpers/jwtAuth';
import { ERROR_MISSING, ERROR_ACTION_VALUES, ERROR_FLOAT_VALUE } from '../helpers/constants';
import { transact, getAll, getAllByUser } from '../controllers/transactions';

const router = Router();
const dateFormat = 'YYYY-MM-DD';

router.post('/transact', validateToken, [
  body('action').not().isEmpty().withMessage(ERROR_MISSING)
    .matches(/^withdraw$|^deposit$/)
    .withMessage(ERROR_ACTION_VALUES),
  body('ammount').not().isEmpty().withMessage(ERROR_MISSING)
    .isFloat()
    .withMessage(ERROR_FLOAT_VALUE),
], transact);

router.get('/', validateToken, [
  query('dateStart').optional().custom((date, { req }) => {
    const start = moment(date, dateFormat, true);
    if (!start.isValid()) {
      throw new Error('Query dateStart parameter is not following the format YYYY-MM-DD.');
    }
    req.query.dateStart = start;
    return true;
  }),
  query('dateEnd').optional().custom((date, { req }) => {
    const end = moment(date, dateFormat, true);
    if (!end.isValid()) {
      throw new Error('Query date_end parameter is not following the format YYYY-MM-DD.');
    }
    req.query.dateEnd = end;
    return true;
  }),
], getAll);
router.get('/user', validateToken, [
  query('dateStart').optional().custom((date, { req }) => {
    const start = moment(date, dateFormat, true);
    if (!start.isValid()) {
      throw new Error('Query dateStart parameter is not following the format YYYY-MM-DD.');
    }
    req.query.dateStart = start;
    return true;
  }),
  query('dateEnd').optional().custom((date, { req }) => {
    const end = moment(date, dateFormat, true);
    if (!end.isValid()) {
      throw new Error('Query date_end parameter is not following the format YYYY-MM-DD.');
    }
    req.query.dateEnd = end;
    return true;
  }),
], getAllByUser);

export default router;
