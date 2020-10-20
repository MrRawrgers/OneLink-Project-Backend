const { addUser, sendUser, removeUser, indexUser, addLinksToUser, removeLinkFromUser, signIn } = require('../controllers/User');
const { getLinks, addLink, deleteLink, idLink, updateLinkDetails, deleteAllLinks } = require('../controllers/Link');

const apiRouter = require('express').Router();

apiRouter.route('/users')
    .post(addUser)
    .get(indexUser)

apiRouter.route('/users/signin')
    .post(signIn)

apiRouter.route('/users/:username')
    .get(sendUser)
    .delete(removeUser)
    
// apiRouter.route('/links/:id')
//     .get(idLink)
//     .delete(deleteLink)
//     .patch(updateLinkDetails)
  





// Confirmed needed and used (09/09/2020 - MW)
// ===========================================

apiRouter.route('/links')
    .get(getLinks)
    .post(addLink)
    .delete(deleteAllLinks) /* this should really be under admin route */

apiRouter.route('/links/:id') /* change to body transferring data not params */
    .delete(deleteLink) /* this should really be under /links route above*/

module.exports = apiRouter;