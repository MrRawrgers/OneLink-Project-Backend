const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        enum: ['memes', 'travel', 'music', 'books', 'movies', 'articles', 'food', 'games', 'artwork', 'business', 'lifestyle', 'education', 'other'],
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

const Link = (module.exports = mongoose.model('Link', linkSchema));

module.exports.get = function (callback, limit) {
    Link.find(callback).limit(limit);
};

module.exports.getLink = function (name) {
    return Link.findOne({ name })
        .then((link) => {
            return link;
        });
};

module.exports.updateLink = async (id, updateBody) => {
    const linkExists = await Link.exists({ id: id })
    if (!linkExists) {
        return new Promise(resolve => {
            resolve(null)
        })
    } else {
        return Link.findOneAndUpdate({ id: id }, { $set: updateBody }, { new: true }, function (
            err,
            link
        ) {
            return link;
        });
    };
}