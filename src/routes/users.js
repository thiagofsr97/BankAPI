import { Router } from 'express';
import { body } from 'express-validator/check';
import { validateToken } from '../helpers/jwtAuth';
import {
  ERROR_MISSING, ERROR_FLOAT_VALUE, ERROR_MIN_LENGTH, ERROR_VALID_REG, REG_NUMBER_REGEX,
} from '../helpers/constants';
import {
  create, authenticate, getAll, getById, getWallet,
} from '../controllers/users';

const router = Router();

router.post('/register',
  [body('name').not().isEmpty().withMessage(ERROR_MISSING),
    body('password').not().isEmpty().withMessage(ERROR_MISSING)
      .matches(/^[a-zA-Z0-9]{8,}$/, 'i')
      .withMessage(ERROR_MIN_LENGTH),
    body('registrationNumber').not().isEmpty().withMessage(ERROR_MISSING)
      .matches(REG_NUMBER_REGEX, 'i')
      .withMessage(ERROR_VALID_REG),
    body('initialWallet').optional().isFloat().withMessage(ERROR_FLOAT_VALUE)], create);

router.post('/login', [
  body('registrationNumber').not().isEmpty().withMessage(ERROR_MISSING)
    .matches(REG_NUMBER_REGEX, 'i')
    .withMessage(ERROR_VALID_REG),
  body('password').not().isEmpty().withMessage(ERROR_MISSING),
], authenticate);

router.get('/', validateToken, getAll);

router.get('/id', validateToken, getById);

router.get('/id/wallet', validateToken, getWallet);


export default router;
