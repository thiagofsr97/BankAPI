/* eslint-disable func-names */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import env from '../config/enviroments/enviroment';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  wallet: { type: Number, default: 0.0 },
  deleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    next();
  } else {
    bcrypt.hash(user.password, parseInt(`${env.SALTING_ROUNDS}`, 10), (err, hash) => {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});


const User = mongoose.model('User', userSchema);


export default User;
