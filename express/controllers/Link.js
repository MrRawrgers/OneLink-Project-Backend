const { getLink, updateLink } = require('../../db/models/Link');
const Link = require('../../db/models/Link');

exports.sendLink = function (req, res, next) {
    getLink(req.params.name)
        .then(link => {
            if (link === null) {
                res.status(400).send({ msg: 'Link does not exist' })
            } else {
                res.status(200).send({ link });
            }
        })
        .catch(next)
}

exports.idLink = function (req, res, next) {
    let id = req.params.id;
    Link.findById(id, function (err, link) {
        res.json(link)
    });
};

exports.updateLinkDetails = function (req, res, next) {
    const { name, url, tag } = req.params;
    updateLink(name, req.body, res)
    updateLink(url, req.body, res)
    updateLink(tag, req.body, res)
        .then((link) => {
            if (link === null) {
                res.status(400).send({ msg: "Invalid link" });
            } else {
                res.status(200).send({ link });
            }
        })
        .catch(next);
};




// Confirmed needed and used (09/09/2020 - MW)
// ===========================================

exports.addLink = (req, res, next) => {
    const { name, url, tag, user } = req.body;
    const newLink = new Link({ name, url, tag, user });
    newLink.save(err => {
        if (err) {
            return next(err)
        } else {
            res.status(201).json({ message: { msgBody: "Link successfully added", msgError: false } });
        }
    })
}

exports.deleteAllLinks = async (req, res) => {
    await Link.deleteMany({}, err => { })
    res.send({
        message: "all links deleted"
    });
}

exports.getLinks = (req, res, next) => {
    const { user } = req.query;
    Link.find({ user }, (err, links) => {
        if (err) {
            return next(err);
        }
        res.json({
            message: "Links retrieved successfully",
            data: links
        });
    });
};

exports.deleteLink = function (req, res, next) {
    Link.findByIdAndRemove(req.params.id, (err, link) => {
        if (!link) {
            res.status(404).send("data is not found");
        } else {
            res.send(link)
        }
    })
}
