//user 

router.post('/login', function (req, res, next) {
  let token = req.cookies.jwt; 
  if (token) {
    authService.verifyUser(token) 
      .then(user => {
        if (user) {
            
        } else {
          res.send('Cookie is invalid, please login')
        }
      })
  } else {
    res.send("User doesn't exist, please Login")
  }
})


//admin

router.post('/admin', function (req, res, next) {
  let token = req.cookies.jwt; 
  if (token) {
    authService.verifyUser(token) 
      .then(user => {
        if (user) {
            if (user.Admin) {

            }
        } else {
        
        }
      })
  }
})

