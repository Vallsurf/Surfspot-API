const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    savedspots: [{ 
        type: mongoose.Schema.Types.Mixed, ref: 'Spots' }]
});

UserSchema.methods.serialize = function () {
    return {
        id: this._id,
        username: this.username || '',
        savedspots: this.savedspots
    };
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

UserSchema.methods.comparePassword = function userComparePassword(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };