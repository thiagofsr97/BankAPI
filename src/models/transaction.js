import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['withdraw', 'deposit'],
  },
  previousBalance: {
    type: Number,
    required: true,
  },
  postBalance: {
    type: Number,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true, versionKey: false });

transactionSchema.set('toJSON', { virtuals: true });

const Transaction = mongoose.Model('Transaction', transactionSchema);

export default Transaction;
