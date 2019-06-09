/**
 *
 * Author: Thiago Filipe Soares da Rocha
 * Email: thiago.filipe@lavid.ufpb.br
 *
 */

/**
  * Module dependenciess
  */


 import express from 'express';
 import createError from 'http-errors';
 import logger from 'morgan';
 import cookieParser from 'cookie-parser';
 import cors from 'cors';
 import helmet from 'helmet';
 import env from './config/enviroments/enviroment';

 const app = express();

 app.use(helmet());
 app.use(cors());
 app.use(logger(`${env.LOGGER_FORMAT}`));
 app.use(express.json());
 app.use(express.urlencoded({ extended:true}));
 app.use(cookieParser());

 /**
  * Used when next is called with no parameters
  */
app.use((req, res, next) => {
    next(createError(404));
  });
  
  /**
    * Error handler
    */
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (app.get('env') === 'dev') {
      console.error('\x1b[2m', err);
      res.json({ error: err });
    } else {
      res.json({ error: err });
    }
  });
  



 export default app;