var express = require('express');
var router =  express.Router();



router.use('/',require('../controller/websiteController')); 
router.use('/about',require('../controller/websiteController'));
router.use('/events',require('../controller/websiteController'));
router.use('/noticeboard',require('../controller/websiteController'));
router.use('/teachers',require('../controller/websiteController'));
router.use('/gallery',require('../controller/websiteController'));
router.use('/gallerydetail',require('../controller/websiteController'));
router.use('/admission',require('../controller/websiteController'));
router.use('/login',require('../controller/websiteController'));
router.use('/forgot_password',require('../controller/websiteController'));








/*******************/

router.use('/admin',require('../controller/adminlogin'));



//router.use('/student',require('../controller/studentController'));
//router.use('/parent',require('../controller/parentController'));
//router.use('/teacher',require('../controller/teacherController'));
router.use('/login',require('../controller/loginController'));






 


module.exports=router;
