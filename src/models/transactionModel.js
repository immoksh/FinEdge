const mongoose = require('mongoose');

const TYPES = Object.freeze({ income: 'income', expense: 'expense' });

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: Object.values(TYPES)
    },
    category: {
        type: String,
        default: 'uncategorized',
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: String,
        default: () => new Date().toISOString().slice(0, 10)
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
Transaction.TYPES = TYPES;
module.exports = Transaction;
