var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var website = require('../model/website');
var admin     = require('../model/admin');
var moment 		= require('moment');
var changename 	= require("../helper/changefilename");
var fs 			= require('fs');
var async 		= require('async');
var path 		= require('path');

var msg91 = require("msg91")("217251AHzwgfQryg5b08d540", "edurec", "4" );
var fs = require('fs');
var parse = require('csv-parse');
var  Json2csvParser = require('json2csv').Parser;


router.get("/",function(req,res){
	setting="";
  if(req.session.user_role==1)
  {
     res.redirect('/admin/dashboard');
  }
  else
  {
    website.findsetting({table:'tbl_frontend_settings'},function(err,result){
      setting =""; 
      if(result.length>0)
      {
       setting = result[0];  
      }
      console.log(setting);
     var pagedata = {title : "Welcome Admin",active:'index', pagename : "website/index", message : req.flash('msg'),setting:setting};
    res.render("website_layout", pagedata);
   }); 
  }
   	
});

router.get("/about",function(req,res){
    website.findbyColumn({table:'tbl_setting',column:'about_us'},function(err,result){
 		aboutus= "No Contents Found";	
     if(result.length>0)
       aboutus= result[0].about_us	
 	   var pagedata = {title : "About Us",active:'about', pagename : "website/about", message : req.flash('msg'),aboutus:aboutus};
	   res.render("website_layout", pagedata);
     });
});

router.get("/events",function(req,res){
      website.findAllwhereorderby({table:'tbl_frontend_events'},{status:'1'},{orderbyfield:'frontend_events_id',order:'DESC'},{limit:4},function(err,result){
 		events= "";	
 		 
        if(result.length>0)
          events= result;	
        
          console.log(events);

 	   var pagedata = {title : "Events",active:'events', pagename : "website/events", message : req.flash('msg'),events:events, moment: moment };
 	   res.render("website_layout", pagedata);

     });  

 	
});

router.get("/noticeboard",function(req,res){

	website.findAllwhereorderby({table:'tbl_noticeboard'},{status:1},{orderbyfield:'notice_id',order:'DESC'},{limit:4},function(err,result){

 	   noticeboard= "";	
 	    console.log(result);
 	   // return false;

       if(result.length>0)
          noticeboard= result;	

 	   var pagedata = {title : "Events", active:'noticeboard', pagename : "website/noticeboard", message : req.flash('msg'),noticeboard:noticeboard, moment: moment };
 	   res.render("website_layout", pagedata);

     });  
 	 
});
router.get("/teachers",function(req,res){

	website.findAllwhereorderby({table:'tbl_registration'},{user_role:4,show_website:'yes'},{orderbyfield:'registration_id',order:'DESC'},"",function(err,result){
        teacherdata= "";	
 	  website.findsetting({table:'tbl_frontend_settings'},function(err,resultsetting){
       if(result.length>0)
          teacherdata= result;	

      
       setting =""; 
          if(result.length>0)
          {
            setting = resultsetting[0];
          }
		var pagedata = {title : "Teacher", active:'teachers', pagename : "website/teachers", message : req.flash('msg'),teacherdata:teacherdata,setting:setting};
 	 	res.render("website_layout", pagedata);
    }) ;
	}) ;
 	 
});
router.get("/gallery",function(req,res){

    website.findAllwhereorderby({table:'tbl_frontend_gallery'},{show_on_website:1},{orderbyfield:'frontend_gallery_id',order:'DESC'},"",function(err,result){
        gallery= "";	
      if(result.length>0)
        gallery= result;	
      website.findAllwhereorderby({table:'tbl_frontend_gallery_youtube'},"",{orderbyfield:'id',order:'DESC'},"",function(err,resultvideo){
  	    
  	    video = resultvideo
  	    website.findsetting({table:'tbl_frontend_settings'},function(err,resultsetting){
         setting = resultsetting[0]; 
         console.log(setting);
  	      var pagedata = {title : "Gallery",  active:'gallery',  pagename : "website/gallery", message : req.flash('msg'),gallery:gallery,video:video,setting:setting};
  	      res.render("website_layout", pagedata);
        }) ;
	  }) ;
    }) ;
});
router.get("/gallerydetail",function(req,res){
	 //console.log(req.query);
	 //return false;
	 frontend_gallery_id = req.query.id;
	  website.findAllwhereorderby({table:'tbl_frontend_gallery_image'},{frontend_gallery_id:frontend_gallery_id},{orderbyfield:'frontend_gallery_image_id',order:'DESC'},"",function(err,result){
      
      gallery= "";	
      if(result.length>0)
        gallery= result;	

       website.findsetting({table:'tbl_frontend_settings'},function(err,resultsetting){
        setting = resultsetting[0];

        //console.log(setting.header_logo);
         
         website.findAllwhereorderby({table:'tbl_frontend_gallery_youtube'},"",{orderbyfield:'id',order:'DESC'},"",function(err,resultvideo){
  	        video = resultvideo


 	        var pagedata = {title : "Gallery detail",active:'gallery', pagename : "website/gallerydetail", message : req.flash('msg'),gallery:gallery,video:video,setting:setting};
 	        res.render("website_layout", pagedata);
         });
       });  

 	});
});
router.get("/admission",function(req,res){
 	 var pagedata = {title : "Gallery detail", active:'admission',  pagename : "website/admission", message : req.flash('msg')};
 	 res.render("website_layout", pagedata);
});

router.get("/contact",function(req,res){
	setting="";
   //website.findAll({table:'tbl_frontend_settings'},function(err,result){
   website.findsetting({table:'tbl_frontend_settings'},function(err,result){
      setting = result[0];
      //console.log(setting);
     var pagedata = {title : "Welcome Admin",  active:'contact',  pagename : "website/contact", message : req.flash('msg'),setting:setting};
	 res.render("website_layout", pagedata);
   });	
});

router.get("/login",function(req,res){
   //
  setting="";
  if(req.session.user_role==1)
  {
     res.redirect('/admin/dashboard');
  }
  else
  {
  website.findsetting({table:'tbl_frontend_settings'},function(err,result){
      console.log('rrrrrrrrrrrrrrrrrrrr',result);
      setting =""; 
      if(result.length>0)
      {
       setting = result[0];  
      }
     var pagedata = {title : "Welcome Admin",active:'login', pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
     res.render("website_layout", pagedata);
    }); 
  }
   //website.findAll({table:'tbl_frontend_settings'},function(err,result){
   
});


router.get("/forgot_password",function(req,res){
  setting="";
   //website.findAll({table:'tbl_frontend_settings'},function(err,result){
    website.findsetting({table:'tbl_frontend_settings'},function(err,result){
      setting =""; 
      setting = result[0];
      console.log(setting);
     var pagedata = {title : "Welcome Admin",active:'forgot_password', pagename : "website/forgot_password", message : req.flash('msg'),setting:setting};
   res.render("website_layout", pagedata);
   });  
});




module.exports=router;





