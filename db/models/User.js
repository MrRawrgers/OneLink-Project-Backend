const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
let SALT = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
        select: false
    },
    links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Links' }],
});

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (password, cb) {
    User.findOne({ username: this.username }).select('password').exec(function (err, user) {
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) return cb(err)
            cb(null, isMatch)
        })
    })
}

const User = (module.exports = mongoose.model('User', userSchema));

module.exports.get = function (callback, limit) {
    User.find(callback).populate({ path: 'links', model: 'Link' }).limit(limit);
};

module.exports.getUser = function (username) {
    return User.findOne({ username }).populate({ path: 'links', model: 'Link' })
        .then((user) => {
            return user;
        });
};

module.exports.insertLinks = function (user, link) {
    return User.findOneAndUpdate({ username: user }, { $push: { links: link } }, { new: true });
};

module.exports.extractLinks = function (user, link) {
    return User.findOneAndUpdate({ username: user }, { $pull: { links: link } }, { new: true });
};