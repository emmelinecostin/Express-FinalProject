var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');
var Sequelize = require('sequelize');

//////////////// USERS PAGE ///////////////////////




// GET --- SIGNUP 

router.get('/signup', function (req, res, next) {
  res.render('signup', { loggedIn: false });
});

///// POST ---- SIGNUP 

router.post('/signup', function (req, res, next) {
  models.users.findOrCreate({
    where: {
      Username: req.body.username
    },
    defaults: {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Email: req.body.email,
      Password: authService.hashPassword(req.body.password)
    }
  }).spread(function (result, created) {
    if (created) {
      res.redirect('login');

    } else {
      res.send('This user already exists');
    }
  });
});





// GET -- LOGIN 

router.get('/login', function (req, res, next) {
  res.render('login', { loggedIn: false });
});

///// POST ----- LOGIN

router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      res.status(401);
      res.send('Unvalid Login')
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie('jwt', token);
        res.redirect('/users/profile');
      } else {
        res.send('Wrong Password');
      }
    }
  });
});






// GET -- LOGOUT 

router.get('/logout', function (req, res, next) {
  res.cookie('jwt', '', { expires: new Date(0) });
  res.redirect('/users/login');
})



// GET -- PROFILE 

router.get('/profile', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.users.findOne({
            where: {
              UserId: user.UserId
            }
          }).then(userFound => {
            if (userFound) {
              res.render('profile', { postData: userFound, loggedIn: true });
            } else {
              res.send('Invalid Login');
            }
          });
        } else {
          res.status(401);
          res.send('Please Login');
        }
      })
  } else {
    res.send("User doesn't exist, please Login");
  }
});





///////////////// ADMIN PAGE //////////////////////



// GET -- ADMIN PAGE - LIST USERS

router.get('/admin', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          if (user.Admin) {
            models.users.findAll({
              Deleted: false 
            })
              .then(allUsers => {
                if (allUsers) {
                  res.render('admin', { users: allUsers, loggedIn: true  });
                } else {
                  res.send('Unauthorized to access');
                }
              })
          }
        } else {
          res.send('Unathorized to access');
        }
      });
  } else {
    res.send('Unathorized to access');
  }
});


///// DELETE USERS 

router.post('/admin/editUser/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let userId = parseInt(req.params.id); 

  console.log(userId)

  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          if (user.Admin) {
            models.users.update(
              { Deleted: true },
              { where: { UserId: userId } })
              .then(deleted => {
                console.log(deleted);
                if (deleted) {
                  res.redirect('/users/admin');
                } else {
                  res.send('Deletion Unsuccessful');
                }
              })
          }
        } else {
          res.send('Unauthorized to delete.')
        }
      });
  }
})


/// GET -- ADMIN --- SPECIFIC USER PROFILE

router.get('/admin/editUser/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let userId = parseInt(req.params.id);

  console.log(userId);

  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          if (user.Admin) {
            models.users.findOne({
              where: {
                UserId: userId,
                Deleted: false
              }
            })
              .then(oneUser => {
                models.posts
                console.log(oneUser);
                if (oneUser) {
                  res.render('adminUserView', { user: oneUser, loggedIn: true });
                } else {
                  res.send('Unauthorized to access');
                }
              })
          }
        } else {
          res.send('Unathorized to access');
        }
      });
  }
});


/////// DELETE ---- ADMIN -- USER POST -- 

router.post('/admin/deletePost/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let userId = parseInt(req.params.id);

  console.log(userId);

  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          if (user.Admin) {
            models.posts.update(
              { Deleted: true },
              {
                where: { UserId: userId },
                include: [{
                  model: models.posts
                }],
              })
              .then(oneUser => {
                if (oneUser) {
                  console.log(userId);
                  res.render('adminUserView', { user: oneUser });
                } else {
                  res.send('Unauthorized to access');
                }
              })
          }
        } else {
          res.send('Unathorized to access');
        }
      });
  }
});


module.exports = router;
