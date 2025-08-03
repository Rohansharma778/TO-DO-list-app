import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Uncompleted'],
        default: 'Uncompleted'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true  
});

export default mongoose.model('Task', TaskSchema);