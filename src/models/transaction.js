import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['withdraw', 'deposit'],
  },
  currentBalance: {
    type: Number,
    required: true,
  },
  ammountTransact: {
    type: Number,
    required: true,
  },
}, { timestamps: true, versionKey: false });

transactionSchema.set('toJSON', { virtuals: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
