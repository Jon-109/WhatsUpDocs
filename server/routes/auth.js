const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./../models/models').User;
const Doc = require('./../models/models').Doc;

module.exports = function(passport) {

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
      if (!validateReq(req.body)) {
          throw 'Passwords do not match'
      }
      console.log(req.body);
      var u = new User({
        // Note: Calling the email form field 'username' here is intentional,
        //    passport is expecting a form field specifically named 'username'.
        //    There is a way to change the name it expects, but this is fine.
          name: req.body.firstname,
          email: req.body.username,
          password: req.body.password,
      });

      u.save().then(saved => res.json(saved)).catch(err=>{console.error(err)});
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    User.findOne({email:req.body.username})
        .then(found=>{console.log(req.user); return res.json(found)}).catch(err=>{console.log('not found')});
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send('loggedout');
  });

  // POST New document
  router.post('/new', function(req, res) {
      var d = new Doc({
        // Note: Calling the email form field 'username' here is intentional,
        //    passport is expecting a form field specifically named 'username'.
        //    There is a way to change the name it expects, but this is fine.
          title: req.body.title,
          author: req.body.author._id,
          password: req.body.password,
          collaborators: req.body.collaborators,
      });

      d.save().then(saved => {
        let tempDocsArr = req.body.author.docs.slice();
        tempDocsArr.push(saved._id);
        User.findByIdAndUpdate(req.body.author, {docs: tempDocsArr})
            .then(updated => {console.log(updated); return res.json(saved)})})
        .catch(err=>{console.error(err)});
  });

  router.post('/add', function(req, res) {
    Doc.findById(req.body.doc).then(doc => {
      if (doc.password === req.body.password){
        let tempDocsArr = req.body.user.docs.slice();
        tempDocsArr.push(doc._id);
        User.findByIdAndUpdate(req.body.user._id, { docs: tempDocsArr }).then(user=>console.log(user));
      }
    })
  });

  router.get('/doc/:id', function(req, res) {
      Doc.findById(req.params.id).lean().populate("author").exec()
          .then(doc => res.json(doc)). catch(err=>{console.error(err)})
  });

  router.get('/user/:id', function(req, res) {
      User.findById(req.params.id)
          .then(user => res.json(user)). catch(err=>{console.error(err)})
  });

  //   router.post('/profile/edit', function(req, res) {
  //     const updates = {
  //         name: req.body.name,
  //         email: req.body.email,
  //         imgUrl: req.body.imgUrl
  //     };
  //     console.log(updates);
  //     User.findByIdAndUpdate(req.body.id, updates)
  //         .then(found=>res.json(found)).catch(err=>{console.log(err)});
  //   })
  //
  // router.get('/users', function(req,res) {
  //   User.find().then(found=>res.json(found)).catch(err=>{console.log(err)})
  // })
  //
  // router.post('/addUser', function(req,res){
  //   User.findById(req.body.self).then(self=>{
  //     User.findById(req.body.id).then(toAdd=>{
  //         let tempArr = toAdd.requests.slice();
  //         tempArr.push(self);
  //         const updates = {
  //             requests: tempArr
  //         }
  //         User.findByIdAndUpdate(req.body.id, updates)
  //             .then(saved=>res.json(saved)).catch(err=>{console.log(err)})
  //     })
  //   })
  // })
  //
  // router.post('/accept', function(req,res){
  //   User.findById(req.body.toAdd._id).then(toAdd=>{
  //     let toAddFriends = toAdd.friends.slice();
  //     toAddFriends.push(req.body.self);
  //     console.log(toAddFriends);
  //     let updates = {
  //       friends: toAddFriends,
  //     }
  //     User.findByIdAndUpdate(req.body.toAdd._id, updates, {new: true}).then(saved=>{"saved", console.log(saved)}).then(()=>{
  //       User.findById(req.body.self._id)
  //       .then(self=>{
  //         console.log("self", self)
  //         let selfFriends = self.friends.slice();
  //         selfFriends.push(req.body.toAdd);
  //         let selfRequests = self.requests.filter(obj=>obj._id!==req.body.toAdd._id);
  //         let updates = {
  //           friends: selfFriends,
  //           requests: selfRequests,
  //         }
  //         console.log(updates);
  //         User.findByIdAndUpdate(req.body.self_id, updates, {new: true}).then(saved=>res.json(saved))
  //       })
  //     })
  //   }).catch(err=>{console.log(err);});
  // })
  //
  // // GET Logout page
  // router.get('/logout', function(req, res) {
  //   req.logout();
  //   res.redirect('/login');
  // });

  return router;
};
