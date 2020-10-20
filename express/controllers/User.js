const { getUser, updateUser, insertLinks, extractLinks } = require('../../db/models/User');
const User = require('../../db/models/User');

exports.addUser = function (req, res, next) {
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err) return next(err);
        if (user)
            res.json({ message: { msgBody: "Username is already taken" } });
        else {
            const user = new User({ username, password });
            user.save(err => {
                if (err) return next(err)
                else
                    res.status(201).json({ message: { msgBody: "Account successfully created" } });
            })
        }
    });
}

exports.signIn = function (req, res, next) {
    User.findOne({ 'username': req.body.username }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.json({ message: 'User not found' })
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return next(err);
            if (!isMatch) return res.json({
                message: 'Wrong password'
            });
            res.status(200).json({
                message: "Logged in successfully"
            });
        })
    })
}

exports.indexUser = function (req, res, next) {
    User.get(function (err, users) {
        if (err) return next(err);
        res.json({
            status: "success",
            message: "Users retrieved successfully",
            data: users
        });
    });
};

exports.sendUser = function (req, res, next) {
    getUser(req.params.username)
        .then(user => {
            if (user === null) {
                res.status(400).send({ msg: 'Invalid username' })
            } else {
                res.status(200).send({ user });
            }
        })
        .catch(next)
}

exports.removeUser = async (req, res, next) => {
    const userExists = await User.exists({ username: req.params.username })
    if (!userExists) {
        res.status(400).send({ msg: 'User does not exist' })
    } else {
        User.findOneAndRemove({ username: req.params.username }, function (err) {
            if (err) return res.status(400).send({ msg: 'Invalid username' });
            res.json({
                status: "success",
                message: "User successfully deleted"
            });
        });
    }
}

exports.addLinksToUser = function (req, res, next) {
    const username = req.params.username;
    const link = req.body.link_id;

    if ("link_id" in req.body) {
        insertLinks(username, link)
            .then((user) => {
                if (user === null) {
                    res.status(400).send({ msg: "Error when trying to add links" });
                } else {
                    res.status(200).send({ msg: "Links successfully added", data: user });
                }
            })
            .catch(next);
    } else {
        res.status(400).send({ msg: "No links included" });
    }
};

exports.removeLinkFromUser = function (req, res, next) {
    const username = req.params.username;
    const link = req.body.link_id;

    if ("link_id" in req.body) {
        extractLinks(username, link)
            .then((user) => {
                if (user === null) {
                    res.status(400).send({ msg: "Error when trying to delete links" });
                } else {
                    res.status(200).send({ msg: "Links successfully deleted", data: user });
                }
            })
            .catch(next);
    } else {
        res.status(400).send({ msg: "No links included" });
    }
};