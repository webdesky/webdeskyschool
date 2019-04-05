var express = require('express');
var router =  express.Router();

//router.use('/',require('../controller/adminlogin'));
/* website Routing  */

//console.log('Hello how are you')
 

router.use('/',require('./default')); 
//router.use('/panchavatividyalaya',require('../panchavatividyalaya/config/routes')); 
//router.use('/vedahighschool',require('../vedahighschool/config/routes')); 
//router.use('/divinegraceschool',require('../divinegraceschool/config/routes')); 
//router.use('/frontlineschool',require('../frontlineschool/config/routes')); 
//router.use('/panchavatividyalaya',require('../panchavatividyalaya/config/routes')); 



  
// router.use('/veda',require('../veda/config/routes')); 



 function backdoor(req, res, next) {
   if (req.session) {
   	 console.log('$$$$$$$$$',req.session);
    	return res.redirect('/admin/dashboard/');
   } 	

  // if (req.session) {
    
  //   req.session.destroy(function(err) {
  //     if(err) {
  //       return next(err);
  //     } else {
  //       return res.redirect('/');
  //     }
  //   });
  // }
}




// router.use('/about',require('../controller/websiteController'));
// router.use('/events',require('../controller/websiteController'));
// router.use('/noticeboard',require('../controller/websiteController'));
// router.use('/teachers',require('../controller/websiteController'));
// router.use('/gallery',require('../controller/websiteController'));
// router.use('/gallerydetail',require('../controller/websiteController'));
// router.use('/admission',require('../controller/websiteController'));
// router.use('/login',require('../controller/websiteController'));
// router.use('/forgot_password',require('../controller/websiteController'));
// /*******************/

// router.use('/admin',require('../controller/adminlogin'));



router.use('/student',require('../controller/studentController'));
router.use('/parent',require('../controller/parentController'));
router.use('/teacher',require('../controller/teacherController'));
router.use('/login',require('../controller/loginController'));

// router.use('/panchvati',require('../panchvati/config/routes'));

module.exports=router;
