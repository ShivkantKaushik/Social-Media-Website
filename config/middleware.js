module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash("success"),
        'error': req.flash("error")
    }

    next();
}


// SO how it is working , here any syntax with app.use() is middleware, means every request
//  from browser goes to controller, but before sending response this request goes to all
//   the middlewares, these middleware have access to req, and the res, they can manipulate
//    the response also, then that res is again sent further to browser, after next() is called.


// In cotrollers when request comes, it sets the flash function, with
//  req.flash("success", "You have logged out!"), it means there is one function 
//  flash that takes key and value arguments 
// so when we call req.flash("success") , it would return "You have logged out!", 
// then in middleware we use this req.flash("success"), set it to a property a object req.locals.flash,
// and sent it to locals, so that we can use it in views


// Now what is the use of library connect-flash, it stores those flash messages in session-cookies
// , and let them go the next time