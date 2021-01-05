const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxLength: 160
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true});

messageSchema.pre('remove', async function(next){
    try{
        // Find a user
        let user = await User.findById(this.userId);
        // Remove the id of the message from their messages list
        user.message.remove(this.id);
        // Save the user
        await user.save();
        // Got to the next document
        return next();
    } catch(err){
        return next(err);
    }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;