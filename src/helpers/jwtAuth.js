/* eslint-disable func-names */
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../config/enviroments/enviroment';


const SECRET = `${env.SECRET}`;

const options = {
  expiresIn: parseInt(`${env.EXPIRATION_TIME}`, 10),
};

// eslint-disable-next-line consistent-return
const validateToken = function (req, res, next) {
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

    try {
      // verify makes sure that the token hasn't expired and has been issued by us
      result = jwt.verify(token, SECRET, options);
      // Let's pass back the decoded token to the request object
      req.decoded = result;
      // We call next to pass execution to the subsequent middleware
      next();
    } catch (err) {
      // Throw an error just in case anything goes wrong with verification
      if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
        return next(createError(401, ' Authentication error. Token is invalid.'));
      }
      return next(err);
    }
  } else {
    return next(createError(401, 'Authentication error. Token required.'));
  }
};

const signIn = (payload) => {
  const token = jwt.sign(payload, SECRET, options);
  return token;
};


export { validateToken, signIn };
