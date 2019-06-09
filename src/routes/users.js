import { Router } from 'express';
import { body, param } from 'express-validator/check';
import { validateToken } from '../helpers/jwtAuth';
import { ERROR_MISSING, ERROR_FLOAT_VALUE } from '../helpers/constants';
import {
  create, authenticate, getAll, getById, getWallet,
} from '../controllers/users';


const router = Router();

router.post('/register',
  [body('name').not().isEmpty().withMessage(ERROR_MISSING),
    body('password').not().isEmpty().withMessage(ERROR_MISSING)
      .matches(/^[a-zA-Z0-9]{8,}$/, 'i')
      .withMessage('Password requires at least 8 alphanumeric characters'),
    body('registrationNumber').not().isEmpty().withMessage(ERROR_MISSING)
      .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'i')
      .withMessage('Parameter does not contain a valid CPF.'),
    body('initialWallet').optional().isFloat().withMessage(ERROR_FLOAT_VALUE)], create);

router.post('/login', [
  body('registrationNumber').not().isEmpty().withMessage(ERROR_MISSING)
    .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'i')
    .withMessage('Parameter does not contain a valid CPF.'),
  body('password').not().isEmpty().withMessage(ERROR_MISSING),
], authenticate);

router.get('/', validateToken, getAll);

router.get('/id', validateToken, getById);

router.get('/id/wallet', validateToken, getWallet);


export default router;
