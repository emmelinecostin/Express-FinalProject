var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');
var Sequelize = require('sequelize');


// GET -- CREATED POST 

router.get('/createPosts', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.posts.findAll({
            where: {
              UserId: user.UserId, 
              Deleted: false 
            }
          }).then(postsFound => {
            console.log(postsFound); 
            res.render('createPosts', { postData: postsFound, loggedIn: true  })
          })
        } else {
          res.send('Cookie is invalid, please login')
        }
      })
  } else {
    res.send("User doesn't exist, please Login")
  }
})

/// POST ---- CREATED POST

router.post('/createPosts', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.posts.findOrCreate({
            where: {
              PostTitle: req.body.title
            },
            defaults: {
              PostBody: req.body.body,
              UserId: user.UserId,
              Deleted: false
            },
          }).spread(function (result, created) {
            if (created) {
              res.redirect('/users/profile');
            } else {
              console.log(result)
              res.send('Unable to create post, please use a different title');
            }
          });
        } else {
          res.send('Invalid User. Please Login.');
        }
      });
  } else {
    res.send("Please login or Sign Up");
  }
});


// GET -- EDIT Page

router.get('/edit/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let postId = parseInt(req.params.id);

  console.log(postId);

  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.posts.findOne(
            {
              where: {
                PostId: postId
              }
            }).then(result => {
              //console.log(result);
              if (result) {
                res.render('editPost', { postData: result })
              } else {
                res.send('Unable to update.')
              }

            })
        } else {
          res.send('Invalid User. Please Login')
        }
      })
  } else {
    res.send("Please login or Sign Up")
  }
})

/////// PUT -- EDIT 

router.post('/edit/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let postId = parseInt(req.params.id);

  console.log('edit route called');

  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.posts.update(
            {
              PostBody: req.body.body,
              PostTitle: req.body.title
            },
            {
              where: { PostId: postId },
            })
            .then(updatedPost => {
              //console.log(postId);
              if (updatedPost) {
                res.redirect('/users/profile');
              } else {
                res.send('Unable to update.')
              }
            });
        } else {
          res.send('Invalid User. Please Login')
        }
      })
  } else {
    res.send("Please login or Sign Up")
  }
});


// PUT DELETE --- USER 

router.post('/delete/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let postId = parseInt(req.params.id);

  console.log(postId)

  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.posts.update(
            { Deleted : true }, 
            {
              where: { PostId: postId }
            })
            .then(result => {
              console.log(postId);
              if (result) {
                console.log(postId); 
                res.redirect('/users/profile/')
              } else {
                res.send('There was a problem deleting the user')
              };
            });
        } else {
          res.send('Invalid User. Please Login')
        }
      })
  } else {
    res.send("Please login or Sign Up")
  }
})





module.exports = router;