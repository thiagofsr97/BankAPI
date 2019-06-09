import { Router } from 'express';
import { body, query } from 'express-validator/check';
import moment from 'moment';
import { validateToken } from '../helpers/jwtAuth';

const router = Router();
const dateFormat = 'YYYY-MM-DD HH:mm';

// router.post('transact', validateToken, )