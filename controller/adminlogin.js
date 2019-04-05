var express 	= require('express');
var router 		= express.Router();
var sha1 		= require('sha1');
var admin 		= require('../model/admin');
var website = require('../model/website');
var moment 		= require('moment');
var changename 	= require("../helper/changefilename");
var checkempty 	= require("../helper/checkempty");
var fs 			= require('fs');
var async 		= require('async');
var path 		= require('path');
const csv = require('csv-parser');



var fs = require('fs');
var parse = require('csv-parse');
var  Json2csvParser = require('json2csv').Parser;

//var csv = require('csv');
//var csvobj = csv();

function MyCSV(Fone, Ftwo, Fthree) {
        this.FieldOne = Fone;
        this.FieldTwo = Ftwo;
        this.FieldThree = Fthree;
    }; 

router.get("/",function(req,res){
	 	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{	
			 findObj  = {user_role  : 2}
			 tableobj = {tablename  :'tbl_registration'}
		  	 column   =	{column 	:'registration_id'}
	         admin.findCount(tableobj,column,findObj,function(err,parent){
	          	var parent_count  = parent[0].count;
	         	admin.findCount(tableobj,column,{user_role:3},function(err,student){
	          	var student_count  = student[0].count;
	          	  admin.findCount(tableobj,column,{user_role:4},function(err,teacher){
	          	   var teacher_count  = teacher[0].count;
	          		admin.findCount({tablename:'tbl_attendance'},column,{user_role:3,attendence_date:moment().format("YYYY-MM-DD")},function(err,attendence){
			          		  //console.log("attendence[0].count",attendence[0].count)
			          		    if(attendence==undefined)
			          		      var attendence_count	  = 0;
			          		    else 	
			          		      var attendence_count	  = attendence[0].count;
						var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dashboard", success: req.flash('success'),error: req.flash('error'),parent_count:parent_count,student_count:student_count,teacher_count:teacher_count,attendence_count:attendence_count};
					    res.render("admin_layout", pagedata);
					 });
				   });
				});
			 });
		}else
		{
 		 	website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login', appName :res.locals.appName,pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	 	}
});
router.post("/", function(req, res){
  
	var u = req.body.username;
	var p = sha1(req.body.password);
   
	admin.findWhere({ username : u}, function(err, result){
		if(result.length==1)
		{
			var data = JSON.parse(JSON.stringify(result[0]));
			if(data.user_password == p)
			{
				req.session.name = data.full_name;
				req.session.uid = data.registration_id;
				req.user_role   = data.user_role;
 				req.session.is_user_logged_in = true;

				//res.redirect("/dashboard");
				if(data.user_role==1)
				{
					 findObj  = {user_role  : 2}
				  	 tableobj = {tablename  :'tbl_registration'}
				  	 column   =	{column 	:'registration_id'}
			         admin.findCount(tableobj,column,findObj,function(err,parent){
			          	var parent_count  = parent[0].count;
			         	
			         	admin.findCount(tableobj,column,{user_role:3},function(err,student){
			          	var student_count  = student[0].count;
			          		admin.findCount(tableobj,column,{user_role:4},function(err,teacher){
			          		var teacher_count  = teacher[0].count;
			          		   admin.findCount({tablename:'tbl_attendance'},column,{user_role:3,attendence_date:moment().format("YYYY-MM-DD")},function(err,attendence){
			          		  //console.log("attendence[0].count",attendence[0].count)
				          		    if(attendence==undefined)
				          		      var attendence_count	  = 0;
				          		    else 	
				          		      var attendence_count	  = attendence[0].count;
									var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dashboard",success: req.flash('success'),error: req.flash('error'),parent_count:parent_count,student_count:student_count,teacher_count:teacher_count,attendence_count:attendence_count};
								    res.render("admin_layout", pagedata);
							   });
							});
						});
					});
	            }else if(data.user_role==2)
	            {
	            	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "parent/dashboard", success: req.flash('success'),error: req.flash('error')};
	                res.render("admin_layout", pagedata);
	            

	            }else if(data.user_role==3)
	            {
	            	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "student/dashboard", success: req.flash('success'),error: req.flash('error')};
	                res.render("admin_layout", pagedata);
	            }else if(data.user_role==4)
	            {
	            	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "teacher/dashboard", success: req.flash('success'),error: req.flash('error')};
	                res.render("admin_layout", pagedata);
	            }
			}
			else
			{
				//console.log('This password is incorrect aaaaaa');
				req.flash("msg", "This Password is incorrect");
				website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
    		      setting = result[0];
    		      console.log(setting);
    		     var pagedata = {title : "Edurecords",active:'login', appName :res.locals.appName,pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
    		     res.render("website_layout", pagedata);
    		    }); 
			}
		}
		else
		{
			//console.log('This username is incorrect');
			req.flash("msg", "This username and password is incorrect");
			website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login', appName :res.locals.appName,pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		}
	});
});


router.post("/dashboard", function(req, res){

	var u = req.body.username;
	var p = sha1(req.body.password);
    var tableobj = {tablename:'tbl_userlogin'};

    if(req.body.username=='' || req.body.password=='')
    {
		req.flash("error", "Usernmae & password is required");
		website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		   res.render("website_layout", pagedata);
		  }); 
    }
    else
    {
    	admin.findWhere(tableobj,{ email : u}, function(err, result){
		if(result.length>0) 
		{
			var data = JSON.parse(JSON.stringify(result[0]));
			if(data.user_password == p)
			{
				req.session.name              = data.full_name;
				req.session.uid               = data.registration_id;
				req.session.user_role         = data.user_role;
				req.session.is_user_logged_in = true;
				 
				if(data.user_role==1){
					 findObj  = {user_role  : 2}
				  	 tableobj = {tablename  :'tbl_registration'}
				  	 column   =	{column 	:'registration_id'}
			         admin.findCount(tableobj,column,findObj,function(err,parent){
			          	var parent_count  = parent[0].count;
			         	
			         	admin.findCount(tableobj,column,{user_role:3},function(err,student){
			          	var student_count  = student[0].count;
			          		admin.findCount(tableobj,column,{user_role:4},function(err,teacher){
			          		var teacher_count  = teacher[0].count;
			          		  admin.findAll({table:'tbl_setting'},function(err, result1){
			          		      
			          		  	req.session.school_id = result1[0].school_id;
			          		  	req.session.logo = result1[0].logo;
			          		  	req.session.session_year = result1[0].session_year;
			          		  	req.session.school_name = result1[0].school_name;
			          		  	req.session.school_address = result1[0].school_address;
			          		  	req.session.msgauthkey = result1[0].msgauthkey;
			          		  	req.session.senderid = result1[0].senderid;
			          		  	req.session.route = result1[0].route;
			          		  	req.session.phone = result1[0].phone;
			          		  	req.session.sitename= res.locals.appName;
			          		  	 admin.findCount({tablename:'tbl_attendance'},column,{user_role:3,attendence_date:moment().format("YYYY-MM-DD"),status:'1'},function(err,attendence){
			          		 	    if(attendence==undefined )
				          		      var attendence_count	  = 0;
				          		    else 	
				          		      var attendence_count	  = attendence[0].count;

										var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dashboard",parent_count:parent_count,student_count:student_count,teacher_count:teacher_count,attendence_count:attendence_count};
									    res.render("admin_layout", pagedata);
							      });
							    });
							});
						});
					});
					
	            }else if(data.user_role==2){
	            	admin.findAll({table:'tbl_setting'},function(err, result1){
			          		  	req.session.school_id = result1[0].school_id;
			          		  	req.session.logo = result1[0].logo;
			          		  	req.session.session_year = result1[0].session_year;
			          		  	req.session.school_name = result1[0].school_name;
			          		  	req.session.school_address = result1[0].school_address;

			          		  	req.session.phone = result1[0].phone;
	            	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "parent/dashboard", success: req.flash('success'),error: req.flash('error')};
	                res.render("admin_layout", pagedata);
	                });
	            }else if(data.user_role==3){
	            	admin.findAll({table:'tbl_setting'},function(err, result1){
			          		  	req.session.school_id = result1[0].school_id;
			          		  	req.session.logo = result1[0].logo;
			          		  	req.session.session_year = result1[0].session_year;
			          		  	req.session.school_name = result1[0].school_name;
			          		  	req.session.school_address = result1[0].school_address;

			          		  	req.session.phone = result1[0].phone;
	            	   var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "student/dashboard", success: req.flash('success'),error: req.flash('error')};
	                   res.render("admin_layout", pagedata);
	                });
	            }else if(data.user_role==4){
                     
                    findObj  = {user_role  : 2}
				  	 tableobj = {tablename  :'tbl_registration'}
				  	 column   =	{column 	:'registration_id'}
			         admin.findCount(tableobj,column,findObj,function(err,parent){
			          	var parent_count  = parent[0].count;
			         	
			         	admin.findCount(tableobj,column,{user_role:3},function(err,student){
			          	var student_count  = student[0].count;
			          		admin.findCount(tableobj,column,{user_role:4},function(err,teacher){
			          		var teacher_count  = teacher[0].count;
			          		  admin.findAll({table:'tbl_setting'},function(err, result1){
			          		  	req.session.school_id = result1[0].school_id;
			          		  	req.session.logo = result1[0].logo;
			          		  	req.session.session_year = result1[0].session_year;
			          		  	req.session.school_name = result1[0].school_name;
			          		  	req.session.school_address = result1[0].school_address;

			          		  	req.session.phone = result1[0].phone;
								//var pagedata = {title : "Edurecords", pagename : "admin/dashboard", message : req.flash('msg'),parent_count:parent_count,student_count:student_count,teacher_count:teacher_count};
							    //res.render("admin_layout", pagedata);
							     var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "teacher/dashboard",success: req.flash('success'),error: req.flash('error')};
	                             res.render("admin_layout", pagedata);
							    });
							});
						});
					}); 

	            	
	            }
			}
			else
			{
				//console.log('This password is incorrectbbbbbbbb');
				req.flash("error", "Password is incorrect");
				website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
				      setting = result[0];
				      console.log(setting);
				     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
				   res.render("website_layout", pagedata);
				 }); 
			}
		}
		else
		{
			req.flash("error", "Username is incorrect");
			var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		    res.render("website_layout", pagedata);

			//res.redirect("/");
		}
	  });
    }

    
});

router.get("/dashboard", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{

		findObj  = {user_role  : 2}
				  	 tableobj = {tablename  :'tbl_registration'}
				  	 column   =	{column 	:'registration_id'}
				  	 //attendence  ={tablename:'tbl_attendance'}
				  	 date=moment().format("YYYY-MM-DD")
				  	 session_year = req.session.session_year;
			         admin.findCount(tableobj,column,findObj,function(err,parent){
			          	var parent_count  = parent[0].count;
			         	
			         	admin.findCount(tableobj,column,{user_role:3},function(err,student){
			          	var student_count = student[0].count;
			          		admin.findCount(tableobj,column,{user_role:4},function(err,teacher){
			          		var teacher_count  = teacher[0].count;
			          		  admin.findCount({tablename:'tbl_attendance'},column,{user_role:3,attendence_date:moment().format("YYYY-MM-DD"),status:'1'},function(err,attendence){
			          		  //console.log("attendence[0].count",attendence[0].count)
			          		    if(attendence==undefined)
			          		      var attendence_count	  = 0;
			          		    else 	
			          		      var attendence_count	  = attendence[0].count;
							      var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dashboard", message : req.flash('msg'),parent_count:parent_count,student_count:student_count,teacher_count:teacher_count,attendence_count:attendence_count};
							    res.render("admin_layout", pagedata);
							  });
							});
						});
					});
	    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	 	}
});


router.post("/registration", function(req, res){
 	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
 		studentdata='';
	 	var register   = req.body.userregister;
	 	var table      = {tablename:'tbl_registration'};
     	if(register=='student'){
	         if(req.body.registration_id)
		     {

		          var where= {registration_id:req.body.registration_id.toString()}
			      var tableobj = {tablename:'tbl_registration'};
			      var obj= { admission_number : req.body.admission_number,
			      	          aadhar_number:req.body.adhar_number,
			      	          name :req.body.student_name,
			      	          dob:req.body.student_dob ,
			      	          sex:req.body.student_gender ,
			      	          //religion:req.body. ,
			      	          blood_group:req.body.blood_group ,
			      	          address:req.body.address ,
			      	          phone:req.body.student_phone ,
			      	          //email:req.body.student_email ,
			      	          mother_name:req.body.mother_name ,
			      	          caste:req.body.caste ,
			      	          subcaste:req.body.sub_caste ,
			      	          transport_id:req.body.transport_id ,
			      	          dormitory_id:req.body.dormitory_id ,


			      	        }


			      admin.updateWhere(tableobj,where,obj, function(err, result){  
			      	var tableobj = {tablename:'tbl_enroll'};
                    var whereenroll= { registration_id:req.body.registration_id }
			      	enrollobj=  {class_id:req.body.class_id,section_id:req.body.section_id}
			      	admin.updateWhere(tableobj,whereenroll,enrollobj, function(err, result){   
			           var tableobj      = {tablename:'tbl_registration'};
	                   var whereparent= { registration_id:req.body.parent_id }
	                   objparent={
	                             name :req.body.parent_name,
	                             address :req.body.parent_address,
	                             phone :req.body.parent_number,
	                             //email :req.body.parent_email,
	                             profession:req.body.parent_profession
	                           };  

	                   admin.updateWhere(tableobj,whereparent,objparent, function(err, result){   
	                        //if(result)
					      	//{
					      		req.flash('success',"Student record updated successfully");
					      	//} 
				       });
			         });
			     }); 	
		     } 
		     else{
		     	   	var data = {
			 		name 		 :req.body.parent_name,	 		
			 		address		 :req.body.parent_address,
			 		phone		 :req.body.parent_number,
			 		email		 :req.body.parent_email,
			 		user_role    :2,
			 		profession   :req.body.parent_profession,
			 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
		 		}
		 	
		 	var table      = {tablename:'tbl_registration'};
		 	var studentdata= { admission_number : req.body.admission_number,
			      	          aadhar_number:req.body.adhar_number,
			      	          name :req.body.student_name,
			      	          dob:req.body.student_dob ,
			      	          sex:req.body.student_gender ,
			      	          //religion:req.body. ,
			      	          blood_group:req.body.blood_group ,
			      	          address:req.body.address ,
			      	          phone:req.body.student_phone ,
			      	          student_email:req.body.student_email ,
			      	          mother_name:req.body.mother_name ,
			      	          caste:req.body.caste ,
			      	          subcaste:req.body.sub_caste ,
			      	          transport_id:req.body.transport_id ,
			      	          dormitory_id:req.body.dormitory_id ,
			      	          name :req.body.parent_name,
	                          parent_address :req.body.parent_address,
	                          parent_number :req.body.parent_number,
	                          parent_email :req.body.parent_email,
	                          parent_profession:req.body.parent_profession
			      	        }

            
            if(req.body.student_name==''||req.body.admission_number==''||req.body.address==''||req.body.student_phone==''||req.body.student_email==''||req.body.adhar_number=='')
            {
            	var table  = 'tbl_class';
			    admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;

					admin.findAll({table:'tbl_transport'},function(err,result){

						 transport_list  = result;

							admin.findAll({table:'tbl_dormitory'},function(err,result){
								 dormitory_list  = result;
                                 req.flash('error','Student information required')
 								 var pagedata = {title : "Edurecords", pagename : "admin/Registration", success : req.flash('success'), error : req.flash('error'),class_list:class_list,transport_list :transport_list,dormitory_list:dormitory_list,admission_number:admission_number,studentdata:studentdata};
								 res.render("admin_layout", pagedata);
								 
						    });	 
						  // console.log(transport_list);
					});
				});	
			       
            }
            else
            {
                 
                 admin.findWhere(table,{name:req.body.student_name,admission_number:req.body.admission_number,email:req.body.student_email,phone:req.body.student_phone},function(err, result){
			  	 if(result.length>0)
			  	 {
	              
	                req.flash('error','Student already registered')
        
		          }
			  	 else
			  	 {
			  	 	var table  	    = {tablename:'tbl_registration'};
			  	 	admin.insert_all(table,data,function(err, result){
			 		var registration_id 	= result;
			 		var login_table  	    = {tablename:'tbl_userlogin'};
			 		var parent_password    = sha1(req.body.parent_password)

				 			var login_data   = {
				 			registration_id : registration_id,
				 			email           : req.body.parent_email,
				 			user_password        : parent_password,
				 			user_role       : 2

				 		}
			 		
			 		admin.insert_all(login_table,login_data,function(err, result){

			 		});


                   var student_data = {
				 			admission_number :req.body.admission_number,
					 		name 		 :req.body.student_name,	 		
					 		caste		 :req.body.caste,
					 		subcaste     :req.body.sub_caste,
					 		dob          :req.body.student_dob,
					 		sex			 :req.body.student_gender,
					 		address		 :req.body.address,
					 		phone		 :req.body.student_phone,
					 		email		 :req.body.student_email,
					 		dormitory_id :req.body.dormitory_id,
					 		transport_id :req.body.transport_id,
					 		aadhar_number:req.body.adhar_number,
					 		blood_group  :req.body.blood_group,
					 		mother_name  :req.body.mother_name,
					 		parent_id    :registration_id,
					 		user_role    :3,
					 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
					    }
			 		/* Image Upload */
			 		var file = req.files.file;

		 			if(typeof file=="undefined"){
			  			var image = '';
				  	}else{
					  	var newname = changename(file.name);
					  	var filepath = path.join('/',"public/images/"+newname);
					  		file.mv(filepath, function(err){
								if(err){
									console.log(err);
									return;
								}
								else
								{
									
								}

							});

					    var image = newname
					     student_data.image= newname;
					    //data['file_name']=image;
					}
			 		/* ********* */

				 		 
				 	

					 	admin.insert_all(table,student_data,function(err, result){
					 			var registration_id  = result
					 			var student_password = sha1(req.body.student_password)
						 		var login_data   = {
						 			registration_id : registration_id,
						 			email           : req.body.student_email,
						 			user_password        : student_password,
						 			user_role       : 3

						 		}
					 		
						 		admin.insert_all(login_table,login_data,function(err, result){
						 			studentdata = "";
						 			req.flash('success','Student registered successfully')

						 		});

						 		var enroll_table  = {tablename:' tbl_enroll'}
				 				var enroll_data   = {
				 					registration_id  : registration_id,
				 					class_id         : req.body.class_id,
				 					section_id  	 : req.body.section_id,
				 					session_year     : req.session.session_year,
				 					created_date      :moment().format('YYYY-MM-DD:hh:mm:ss')
				 				}
				 				admin.insert_all(enroll_table,enroll_data,function(err, result){
				 					studentdata = "";
                                   req.flash('success','Student registered successfully')
						 		});
						 		studentdata = "";
						 		req.flash('success','Student registered successfully')
				 		});


					});
					  

			  	 } //  IF Close 

			  	});
            
               }


		     } 
	 	}else if(register=='teacher'){
	 		 console.log(req.body);
	 		var teacher_data = {
	 			    name 		 :req.body.teacher_name,	 		
			 		dob          :req.body.teacher_dob,
			 		sex			 :req.body.teacher_gender,
			 		address		 :req.body.teacher_address,
			 		email		 :req.body.teacher_email,
			 		phone		 :req.body.teacher_phone,
			 		aadhar_number:req.body.teacher_adhar_no,
			 		staff_category:req.body.staff_category,
			 		academics     :req.body.academics,
			 		profession    :req.body.teacher_profession,
			 		designation   :req.body.teacher_designation,
			 		show_website  :req.body.show_website,
			 		user_role    :4,
			 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
	 		}	
	 		/* Image Upload */
	 		var file = req.files.file;

 			if(typeof file=="undefined"){
	  			var image = '';
		  	}else{
			  	var newname = changename(file.name);
			  	var filepath = path.join('/',"public/images/"+newname);
			  		file.mv(filepath, function(err){
						if(err){
							console.log(err);
							return;
						}
						else
						{
							
						}

					});

			    var image = newname
			     teacher_data.image= newname;
			    //data['file_name']=image;
			}
	 		/* ********* */
            if(req.body.teacher_name==''||req.body.teacher_phone==''||req.body.teacher_email=='')
            { 
               studentdata=teacher_data;
               req.flash('error',"Please enter teacher detail");
            }
            else
            {
               admin.findWhere(table,{email:req.body.teacher_email,phone:req.body.teacher_phone},function(err, result){
			  	 if(result.length>0)
			  	 {
	                studentdata=teacher_data;
	                req.flash('error','Phone & Email already taken')
		         }
		         else
		         {
		         	admin.insert_all(table,teacher_data,function(err, result){
		 			var registration_id = result;

		 			var login_table  	    = {tablename:'tbl_userlogin'};
			 		var teacher_password    = sha1(req.body.teacher_password)
				 	
				 	var login_data   = {
				 			registration_id : registration_id,
				 			email           : req.body.teacher_email,
				 			user_password        : teacher_password,
				 			user_role       : 4
				 	}
				 	admin.insert_all(login_table,login_data,function(err, result){

					});
					 req.flash('success','Teacher registered successfully')

					 

				   });

		         }
                });
           }
	 	}else if(register=='accountant'){
	 		var accountant_data = {
	 			    name 		 :req.body.accountant_name,	 		
			 		sex			 :req.body.accountant_gender,
			 		email		 :req.body.accountant_email,
			 		address		 :req.body.accountant_address,
			 		phone		 :req.body.accountant_phone,
			 		academics     :req.body.accountant_academics,
			 		profession     :req.body.accountant_profession,
			 		user_role    :5,
			 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
	 		}	
            if(req.body.accountant_name==''||req.body.accountant_phone==''||req.body.accountant_email=='')
            { 
               studentdata=teacher_data;
               req.flash('error',"Please enter accountant detail");
            }
            else
            {
            	admin.findWhere(table,{email:req.body.accountant_email,phone:req.body.accountant_phone},function(err, result){
			  	 if(result.length>0)
			  	 {
                    studentdata=teacher_data;
	                req.flash('error','Phone & Email already taken')
			  	 }
			  	 else
			  	 {
			 		admin.insert_all(table,accountant_data,function(err, result){
			 			var registration_id = result;

			 			var login_table  	    = {tablename:'tbl_userlogin'};
				 		var accountant_password    = sha1(req.body.accountant_password)
					 	
					 	var login_data   = {
					 			registration_id : registration_id,
					 			email           : req.body.accountant_email,
					 			user_password        : accountant_password,
					 			user_role       : 5

					 	}
					 	admin.insert_all(login_table,login_data,function(err, result){
						});
                      req.flash('success','accountant registered successfully')
					});
				 }	
		 	});
            }

	 	}else if(register=='librarian'){
	 		var librarian_data = {
	 			    name 		 :req.body.librarian_name,	 		
			 		sex			 :req.body.librarian_gender,
			 		email		 :req.body.librarian_email,
			 		address		 :req.body.librarian_address,
			 		phone		 :req.body.librarian_phone,
			 		academics     :req.body.librarian_academics,
			 		profession     :req.body.librarian_profession,
			 		user_role    :6,
			 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
	 		}	

	 		admin.insert_all(table,librarian_data,function(err, result){
	 			var registration_id = result;

	 			var login_table  	       = {tablename:'tbl_userlogin'};
		 		var librarian_password    = sha1(req.body.librarian_password)
			 	
			 	var login_data   = {
			 			registration_id : registration_id,
			 			email           : req.body.librarian_email,
			 			user_password        : librarian_password,
			 			user_role       : 6

			 	}

			 	admin.insert_all(login_table,login_data,function(err, result){

				});

			});
	 	}


	 	var table_class = 'tbl_class';
	
		admin.findAll({table:table_class},function(err, result){
		    var class_list 	 = result;

		admin.findAll({table:'tbl_transport'},function(err,result){
			 transport_list  = result;

		admin.findAll({table:'tbl_dormitory'},function(err,result){
			 dormitory_list  = result;
        admission_number=req.body.admission_number
			url = '';
			if(register=='student')
             {
             	url='class_id='+req.body.class_id+'&section_id='+req.body.section_id 
          	   res.redirect(res.locals.appName+'/admin/studentList/?'+url);
          	 }
          	 else if(register =='teacher')
          	 {
          	 	res.redirect(res.locals.appName+'/admin/teacherList');
          	 }
          	 else if(register=='accountant'){
          	 	res.redirect(res.locals.appName+'/admin/accountantList');

          	 }

          	   
			 
	    });	 
	  });
	});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	 }
});

router.get("/classsection_studentList", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){ 
		var year= req.session.session_year;
		var class_id =req.query.class_id
		var section_id =req.query.section_id
	    var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
	    admin.getstudentlist(table,{class_id:class_id,section_id:section_id,session_year:year},function(err, result){
			   var student_list = result;
			   var table = {tablename:'tbl_registration'};
			   var n=0;
		 	   student_list.forEach(function(item, index){
		 	 	  student_list[index].parentname="";
		 	 	  student_list[index].parentphone="";
		 	 	  student_list[index].parentemail="";
		 	 	  student_list[index].nextyear="";
		 	   });
			   async.each(student_list, function (item, done) 
			   {
			 		 var registration_id   =  item['parent_id'].toString();
			 		 var Table = {tablename : 'tbl_registration'}
					 admin.findWhere(Table,{registration_id:registration_id},function(err, result1){
				     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
				     student_list[n].parentphone=parents_list[0].phone;
				     student_list[n].parentname=parents_list[0].name;
				     student_list[n].parentemail=parents_list[0].email;
				     years = year.split("-");
				     student_list[n].nextyear = years[1] +'-'+ (parseInt(years[1])+1);
				     
				     done(null);
				     n++;
					});
				}, function(){
					//console.log('^^^^^^^^^^^^^^^^^^',student_list)
                      res.send({student_list:student_list});
			  });
		});

      }
      else{
	      
           website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	  }
	 
}); 
/* To get student without bonafied */
router.get("/All_studentList", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){ 
		var year= req.session.session_year;
		var class_id =req.query.class_id
		var section_id =req.query.section_id
	    var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
	    admin.getallstudentlist(table,{class_id:class_id,section_id:section_id,session_year:year},function(err, result){
			   var student_list = result;
			   //console.log(student_list)
			   var table = {tablename:'tbl_registration'};
			   var n=0;
			  //console.log(student_list);
				 	 student_list.forEach(function(item, index){
				 	 	student_list[index].parentname="";
				 	 	student_list[index].parentphone="";
				 	 	student_list[index].parentemail="";
				 	 });
				 	 async.each(student_list, function (item, done) {

					 		var registration_id   =  item['registration_id'];
					 		var Table = {tablename : 'tbl_registration'}
							admin.findWhere(Table,{registration_id:registration_id.toString()},function(err, result1){
							     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
							     //console.log('##########',parents_list);
							     student_list[n].parentphone=parents_list[0].phone;
							     student_list[n].parentname=parents_list[0].name;
							     student_list[n].parentemail=parents_list[0].email;
							     done(null);
							     n++;
							});
					}, function(){
                      res.send({student_list:student_list});
					});
		});
     } 
	else
	{
		website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
}); 


/* Get Student Detail */
router.get("/get_studentDetail", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){ 
		var registration_id= req.query.registration_id.toString();
		var year= req.session.session_year;
		var class_id =req.query.class_id
		var section_id =req.query.section_id
		var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};

		
		   admin.getstudentdetail(table,{registration_id:registration_id,class_id:class_id,section_id:section_id,session_year:year},function(err, result){
			   var student_list = result;
			    
			   var table = {tablename:'tbl_registration'};
			   var n=0;
			  //console.log(student_list);
				 	 student_list.forEach(function(item, index){
				 	 	student_list[index].parentname="";
				 	 	student_list[index].parentphone="";
				 	 	student_list[index].parentemail="";
				 	 	student_list[index].school_name="";
				 	 	student_list[index].school_logo="";
				 	 	student_list[index].school_rc_no="";
				 	 	student_list[index].school_address="";
				 	 	student_list[index].school_contact="";
				 	 	student_list[index].school_session_year="";


				 	 });
				 	 async.each(student_list, function (item, done) {

					 		var registration_id   =  item['registration_id'];
					 		var Table = {tablename : 'tbl_registration'}
							admin.findWhere(Table,{registration_id:registration_id},function(err, result1){
							     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
							     
							     student_list[n].parentphone=parents_list[0].phone;
							     student_list[n].parentname=parents_list[0].name;
							     student_list[n].parentemail=parents_list[0].email;
 
                                admin.findAll({table:'tbl_setting'}, function(err,result){
       	                          
       	                             setting= result;
       	                             console.log(setting);
       	                             student_list[n].school_name=setting[0].school_name;
							 	 	 student_list[n].school_logo=setting[0].logo;
							 	 	 student_list[n].school_rc_no=setting[0].school_rc_no;
							 	 	 student_list[n].school_address=setting[0].school_address;
							 	 	 student_list[n].school_contact=setting[0].school_contact;
							 	 	 student_list[n].school_session_year= setting[0].session_year;

							        done(null);
							        n++;
							     });
							});
					}, function(){
						 console.log('-------Student Detail-------',student_list);
                      res.send({student_list:student_list});
					});
		});
	 
     }else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
}); 

/* Get Bonafied Student Detail */
router.get("/get_bonafidestudentDetail", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){ 
		var registration_id= req.query.registration_id;
		var year= req.session.session_year;
		var class_id =req.query.class_id
		var section_id =req.query.section_id
		var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll',tbl_class:'tbl_class'};

		
		   admin.getbonafieddetail(table,{registration_id:registration_id,class_id:class_id,section_id:section_id,session_year:year},function(err, result){
			   var student_list = result;
			  	
			    
			   var table = {tablename:'tbl_registration'};
			   var n=0;
			  console.log(student_list);
				 	 student_list.forEach(function(item, index){
				 	 	student_list[index].parentname="";
				 	 	//student_list[index].parentphone="";
				 	 	student_list[index].parentemail="";
				 	 	student_list[index].school_name="";
				 	 	student_list[index].school_logo="";
				 	 	student_list[index].school_rc_no="";
				 	 	student_list[index].school_address="";
				 	 	student_list[index].school_contact="";
				 	 	student_list[index].school_session_year="";


				 	 });
				 	 async.each(student_list, function (item, done) {

					 		var registration_id   =  item['parent_id'];
					 		var Table = {tablename : 'tbl_registration'}
							admin.findWhere(Table,{registration_id:registration_id.toString()},function(err, result1){
							     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
							     
							     //student_list[n].parentphone=parents_list[0].phone;
							     student_list[n].parentname=parents_list[0].name;
							     student_list[n].parentemail=parents_list[0].email;
 
                                admin.findAll({table:'tbl_setting'}, function(err,result){
       	                          
       	                             setting= result;
       	                             console.log(setting);
       	                             student_list[n].school_name=setting[0].school_name;
							 	 	 student_list[n].school_logo=setting[0].logo;
							 	 	 student_list[n].school_rc_no=setting[0].school_rc_no;
							 	 	 student_list[n].school_address=setting[0].school_address;
							 	 	 student_list[n].school_contact=setting[0].school_contact;
							 	 	 student_list[n].school_session_year= setting[0].session_year;

							        done(null);
							        n++;
							     });
							});
					}, function(){
						 console.log('-------Student Detail-------',student_list);
                      res.send({student_list:student_list});
					});
		});
	 
     }else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
}); 


/* Shift student to New Section on first page load */
router.get("/Shiftsection", function(req, res){ 

    if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
    {
        admin.findAll({table:'tbl_class'},function(err, result){
             var class_list      = result;
             var pagedata      = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/student_shift",success: req.flash('success'),error: req.flash('error'),class_list:class_list};
             res.render("admin_layout", pagedata); 
        });

    }
     else{
            website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
    }
});

router.post("/Shiftsection", function(req, res)
{ 

    if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
    {
        object=req.body;  
        //console.log(req.body);
        //return false;
        if(object.hasOwnProperty("enroll_id")) 
        {
         //if(req.body.enroll_id.length>1)
         var enroll_list = req.body.enroll_id;
         if(Array.isArray(enroll_list))
	      {
            //var enroll_list = req.body.enroll_id;

	      	//var obj= { class_name : name,class_abbreviations:numeric_value}
	      	var obj={section_id:req.body.section_id_stop2}
	      	var tableobj = {tablename:'tbl_enroll'};
            var n=0;  
            async.each(enroll_list, function (item, done) {
               var where= {enroll_id:enroll_list[n]}
               //console.log(where);
               admin.updateWhere(tableobj,where,obj, function(err, result){
		           if(result)
		           {	 
		           	  class_list='';
		              
 				   }

		        });
   
                done(null);
				n++;
            }, function(){
            	 req.flash('success',"Student shifted into new section successfully");
                 res.redirect(res.locals.appName+'/admin/Shiftsection');
            });

		  }
		  else
		  {
		  	
		  	var tableobj = {tablename:'tbl_enroll'};
		  	var where= {enroll_id:req.body.enroll_id}
		  	var obj={section_id:req.body.section_id_stop2}

               admin.updateWhere(tableobj,where,obj, function(err, result){
		           //if(result.length>0)
		           {	 
		           	  class_list='';
		              req.flash('success',"Student shifted into new section successfully");
                      res.redirect(res.locals.appName+'/admin/Shiftsection');
 				   }

		        });
		  }
        }
        else
        {
        	req.flash('error',"No student selected");
            res.redirect(res.locals.appName+'/admin/Shiftsection');
        } 
    }

});

/* **************  */

/* Promotions of student in new year */
router.get("/classsection_promotion", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year= req.session.session_year;
		var class_id =req.query.class_id
		var section_id =req.query.section_id

	    var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
	    admin.getstudentlist(table,{class_id:class_id,section_id:section_id,session_year:year},function(err, result){
		   var student_list = result;
		   var table = {tablename:'tbl_registration'};

		   var n=0;
	 	   student_list.forEach(function(item, index){
	 	 	  student_list[index].parentname="";
	 	 	  student_list[index].parentphone="";
	 	 	  student_list[index].parentemail="";
	 	 	  student_list[index].nextyear="";
	 	   });

	 	   //student_list[0].nextyear = years[1] +'-'+ (parseInt(years[1])+1);
		 
		 	    
			   async.each(student_list, function (item, done) 
			   {

			   	     
			 		 var registration_id   =  item['registration_id'].toString();
			 		 var Table = {tablename : 'tbl_registration'}
					 admin.findWhere(Table,{registration_id:registration_id},function(err, result1){
				     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
				     student_list[n].parentphone=parents_list[0].phone;
				     student_list[n].parentname=parents_list[0].name;
				     student_list[n].parentemail=parents_list[0].email;
				     years = year.split("-");
				     student_list[n].nextyear = years[1] +'-'+ (parseInt(years[1])+1);
				     
				     done(null);
				     n++;
					});
					 


				}, function(){
                      res.send({student_list:student_list});
			  });
			    
		});
     }else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/promotion",function(req,res){
   if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

   	var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
			class_list = result;
			 year=req.session.session_year
			 years = year.split("-");
			 nextyear = years[1] +'-'+ (parseInt(years[1])+1);
			session_year= {year:year,nextyear:nextyear}
		  var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/promotion", success: req.flash('success'),error: req.flash('error'),class_list:class_list,session_year:session_year};
	    res.render("admin_layout", pagedata);
		});

   }
   else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
router.post("/promotion", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{


        object=req.body;  
        if(object.hasOwnProperty("chk_enroll_id")) 
        {
         if(req.body.chk_enroll_id.length>0)
	      {
				var class_id  			= req.body.teacher_class_id;
				var section_id  			= req.body.teacher_section_id;
				var students =  req.body.chk_enroll_id;
		        var sessions = req.body.session_year;
		        data={};
		        var key = 'toupdate';
		        data[key] = []; // empty Array, which you can push() values into
		        if(Array.isArray(students))
		        {
		          for(i=0;i<students.length;i++)
					{
						str ={enroll_id:students[i],class_id:class_id,section_id:section_id ,session_year:sessions[i]};
			            data[key].push(str); 			
					}	
		        }
		        else
		        {
		        	str ={enroll_id:students,class_id:class_id,section_id:section_id ,session_year:sessions};
			        data[key].push(str); 	
		        }
		        
				 
				data= data.toupdate;
                 
		        n=0;
				async.each(data, function (item, done) {
					var tableobj = {tablename:'tbl_enroll'}; 
					var where= {enroll_id:data[n].enroll_id};
					
					admin.updateWhere(tableobj,where,data[n], function(err, result){
						 done(null);
					});
					 n++; 
		 		}, function(){
		 			req.flash('success',"Student promoted successfully");
		 		       res.redirect(res.locals.appName+'/admin/promotion');
		                     //res.send({student_bonafide: JSON.parse(JSON.stringify(student_list[0])) });
				});
	      }
	    }
	    else
        {
            req.flash('error',"No student selected");
            res.redirect(res.locals.appName+'/admin/promotion');
        } 

		
	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/* ************** */


router.get("/Registration", function(req, res){
	//var class_list = '';
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{

         if(req.query.registration_id)
	     {
           admission_number = req.body.admission_number 
		
				var table  = 'tbl_class';
				
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;

					admin.findAll({table:'tbl_transport'},function(err,result){
						 transport_list  = result;

							admin.findAll({table:'tbl_dormitory'},function(err,result){
								 dormitory_list  = result;

                               table={tablename:'tbl_registration'};
	     	                   var findObj = {registration_id:req.query.registration_id.toString()}
	     	                   
	     	                   admin.findWhere(table,findObj,function(err,result){
				             	studentdata = result;

					            if(result)
					            {

					              var n=0;
					              studentdata.forEach(function(item, index){
								 		studentdata[index].parent_name="";
								 		studentdata[index].parent_address="";
								 		studentdata[index].parent_number="";
								 		studentdata[index].parent_email="";
								 		studentdata[index].parent_password="";
								 		studentdata[index].parent_profession=""
								 		studentdata[index].section_name=""
								 		studentdata[index].class_name=""
								 		studentdata[index].class_id=""
								 		studentdata[index].section_id=""

								 	});
                                  
					              var findObj = {registration_id:result[0].parent_id.toString()}
								  admin.findWhere(table,findObj,function(err,result1){
								  	
				                        studentdata[0].parent_name= result1[0].name
								 		studentdata[0].parent_address= result1[0].address
								 		studentdata[0].parent_number=result1[0].phone;
								 		studentdata[0].parent_email=result1[0].email;
								 		studentdata[0].parent_password=result1[0].user_password;
								 	    studentdata[0].parent_profession=result1[0].profession;
								 	    //admin.findWhere({tablename:'tbl_section'},{section_id:studentdata[0].section_id},function(err,result2){  
								 	    admin.getenrollstudentdetail({tbl_enroll:'tbl_enroll',tbl_class:'tbl_class',tbl_section:'tbl_section'},{registration_id:studentdata[0].registration_id},function(err,result2){
                                          studentdata[0].section_name= result2[0].section_name;
                                          studentdata[0].class_name= result2[0].class_name;
                                          studentdata[0].class_id= result2[0].class_id;
                                          studentdata[0].section_id= result2[0].section_id;

                                           admin.findWhere({tablename:'tbl_section'},{class_id:result2[0].class_id.toString()},function(err,sectionlits){
                                             section_list= sectionlits;
                                           //console.log('dfsfdsfsdfsdfsdfsdfsfsdfsd',studentdata[0]);
								 	    var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/Registration", success: req.flash('success'),error: req.flash('error'),class_list:class_list,section_list:section_list,transport_list :transport_list,dormitory_list:dormitory_list,admission_number:admission_number,studentdata:JSON.parse(JSON.stringify(studentdata[0]))};
                                        res.render("admin_layout", pagedata);
				                        
				                            });
                                        });
				                  });
					            }
					           });
						    });	 
					});
				});
		     }
		     else			
		     {
		     	admission_number = req.body.admission_number 
		
				var table  = 'tbl_class';
				
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;

					admin.findAll({table:'tbl_transport'},function(err,result){

						 transport_list  = result;

							admin.findAll({table:'tbl_dormitory'},function(err,result){
								 dormitory_list  = result;

								 var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/Registration", success: req.flash('success'),error: req.flash('error'),class_list:class_list,section_list:"",transport_list :transport_list,dormitory_list:dormitory_list,admission_number:admission_number,studentdata:""};

								 res.render("admin_layout", pagedata);
								 
						    });	 
						   console.log(transport_list);
					});
				});
		     }
		  }else{
			       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
			      setting = result[0];
			      console.log(setting);
			     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
			     res.render("website_layout", pagedata);
			    }); 
		}
});

/* Bonafide Student */

router.get("/bonafide",function(req,res){

  if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
	  if(req.query.registration_id)
	  {
	  	 
        var year= req.session.session_year;
		var class_id =  req.query.class_id;
		var section_id = req.query.section_id;
	    var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
	    admin.getallstudentlist(table,{registration_id:req.query.registration_id,class_id:class_id,section_id:section_id,session_year:year},function(err, result){
			    var student_list = result;
			    //console.log(student_list);
			    var table = {tablename:'tbl_registration'};
			    var n=0;
			 	 student_list.forEach(function(item, index){
			 	 	student_list[index].parentname="";
			 	 	student_list[index].parentphone="";
			 	 	student_list[index].parentemail="";
			 	 });
				 	 async.each(student_list, function (item, done) {

					 		var registration_id   =  item['registration_id'].toString();
					 		var Table = {tablename : 'tbl_registration'}
							admin.findWhere(Table,{registration_id:registration_id},function(err, result1){
							     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
							     //console.log('##########',parents_list);
							     student_list[n].parentphone=parents_list[0].phone;
							     student_list[n].parentname=parents_list[0].name;
							     student_list[n].parentemail=parents_list[0].email;
							     done(null);
							     n++;
							});
					}, function(){
                      res.send({student_bonafide: JSON.parse(JSON.stringify(student_list[0])) });
					});
		});  
	  }
	  else
	  {
        findObj={class_id:req.query.id}
  	    tableobj={tablename:'tbl_class'}
  	    admin.findAll({table:'tbl_class'},function(err, result){
          var class_list      = result;
          var pagedata      = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/student_bonafide",  success: req.flash('success'),error: req.flash('error'),class_list:class_list};
          res.render("admin_layout", pagedata);
  	    });
	  } 	
	   
	}
	else
	{
       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
 
});

router.post("/bonafide", function(req, res)
{ 
    if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
    {
        object=req.body;


        if(object.hasOwnProperty("enroll_id")) 
        {
         if(req.body.enroll_id.length>0)
	      {

            var enroll_list = req.body.enroll_id;
	      	var moment = require('moment');
	        var bonafide_date = moment().format('YYYY-MM-DD:hh:mm:ss');
	      	var obj = {bonafide_status:1,bonafide_date:bonafide_date}

	      	var tableobj = {tablename:'tbl_enroll'};
            var n=0;  
            
            var check = Array.isArray(enroll_list);
            if(check)
            {
               async.each(enroll_list, function (item, done) {
               var where= {enroll_id:enroll_list[n]}
	               admin.updateWhere(tableobj,where,obj, function(err, result){
			           if(result)
			           {	 
			           	  class_list='';
			              
	 				   }

			        });
	   
	                done(null);
					n++;
	            }, function(){
	            	 req.flash('success',"Student bonafide successfully");
	                 res.redirect(res.locals.appName+'/admin/bonafide');
	            });
            }
            else
            {
               var where= {enroll_id:enroll_list}
               admin.updateWhere(tableobj,where,obj, function(err, result){
		         req.flash('success',"Student bonafide successfully");
                 res.redirect(res.locals.appName+'/admin/bonafide');
		       });
            }
            

		  }
        }
        else
        {  
  			req.flash('error',"No student selected");
            res.redirect(res.locals.appName+'/admin/bonafide');
        } 
    }

});

router.get("/bonafideList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	 var table = 'tbl_enroll'
			 admin.findAll({table:table},function(err, result){
			 	var transport_list = result;
			 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport_list", message : req.flash('msg'),transport_list :transport_list};
	                 res.render("admin_layout", pagedata);

			 });
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/************/

router.get("/classes", function(req, res){
 
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
  	  if(req.query.id)
	  {
  	  	 findObj={class_id:req.query.id.toString()}
	  	 tableobj={tablename:'tbl_class'}
         admin.findWhere(tableobj,findObj,function(err,result){
          
          $data=JSON.parse(JSON.stringify(result));
          var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classes", success: req.flash('success'),error: req.flash('error'),classdata:$data[0],class_list:''};   	
          res.render("admin_layout", pagedata)
         });
	  }
	  else
	  {
	  	var table = 'tbl_class'
		admin.findAll({table:table},function(err, result){
			var class_list = result;
			var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classes", success: req.flash('success'),error: req.flash('error'),class_list :class_list,classdata:''};
		    res.render("admin_layout", pagedata);

		});
	  	// var pagedata = {title : "Edurecords", pagename : "admin/class", message : req.flash('msg'),classdata:''};
	  	// res.render("admin_layout", pagedata)
	  }	
	  
	}
	else
	{
        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}


});

router.post("/delete", function(req, res){
    var key = Object.keys(req.body);
 	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
	 var findObj = {};
     name = req.body.columname;
     findObj[name] =  req.body.id;
     var tableobj = {tablename:req.body.tablename};
     admin.deletewhere(tableobj,findObj,function(err,result){
     	res.send(JSON.stringify(result));
     });
    }
    else
    {
	    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});



router.post("/classes", function(req, res){
 	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
	  var name          = (req.body.name).trim();;
	  var numeric_value = (req.body.class_abbreviations).trim();//parseInt(req.body.numeric_Value);
	  var moment = require('moment');
	  var created_at = moment().format('YYYY-MM-DD:hh:mm:ss');
	  if(req.body.class_id)
      {
      	var obj= { class_name : name,class_abbreviations:numeric_value}
      	var where= {class_id:req.body.class_id}
      	var tableobj = {tablename:'tbl_class'};
        admin.updateWhere(tableobj,where,obj, function(err, result){
         if(result)
         {	
           var table = 'tbl_class'
				 admin.findAll({table:table},function(err, result){
				 	var class_list = result;
				 	req.flash('success','Record updated successfully')
				 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/class_list", success : req.flash('success'), error : req.flash('error'),class_list :class_list};
		                 res.render("admin_layout", pagedata);
				 });   
		  }
        });

	  }
	  else
	  {
	  	if(name==""||numeric_value=="")
	  	{
           var table = 'tbl_class'
		   admin.findAll({table:table},function(err, result){
			    var class_list = result; 
           		req.flash('error','Please data required to save')
				var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classes", success : req.flash('success'), error : req.flash('error'),classdata:"",class_list :class_list};
			 	res.render("admin_layout", pagedata);
			});
	  	}
	  	else
	  	{

            $data={class_name:name};
		  	admin.findWhere({tablename:'tbl_class'},{class_name : name},function(err, result){
		  	 if(result.length>0)
		  	 {
		  	   //console.log('already exist')
	           req.flash('error','Class already exist')
	           
	           var  pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classes", success : req.flash('success'), error : req.flash('error'),classdata:$data,class_list:''};   	
	                 res.render("admin_layout", pagedata);
	          	  			
		  	 }
		  	 else
		  	 {
	   
	            admin.insert_class({ class_name : name,class_abbreviations:numeric_value,created_at :created_at}, function(err, result){
				 if(result)
					{
						//var data = JSON.parse(JSON.stringify(result[0]));
						 console.log(result);
						 var table = 'tbl_class'
						 admin.findAll({table:table},function(err, result){
						 	var class_list = result;
						 	req.flash('success','Class added successfully')
						 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classes", success : req.flash('success'), error : req.flash('error'),classdata:"",class_list :class_list};
				                 res.render("admin_layout", pagedata);

						 });
						
					}
					else
					{
						console.log('This username is incorrect');
						req.flash("msg", "This username and password is incorrect");
						res.redirect(res.locals.appName+"/");
					}
			      });

		  	 }
	 		});

	  	}
	  	
  	  }
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/classList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
	var table = 'tbl_class'
	admin.findAll({table:table},function(err, result){
		var class_list = result;
		var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/class_list", success : req.flash('success'), error : req.flash('error'),class_list :class_list};
	    res.render("admin_layout", pagedata);

	});
	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.get("/section", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
	     var table 	   = 'tbl_class';
	     var tableobj  = {tablename:'tbl_section'}
	          
			admin.findAll({table:table},function(err, result){
              var class_list = result;
              console.log(req.query.id);
              var findObj = {section_id:req.query.id}
              if(req.query.id)
              {
               admin.findWhere(tableobj,findObj,function(err,result1){
                if(result1)
                 {
                 	data =JSON.parse(JSON.stringify(result1)); 
                    //console.log('ddd') ;
                    //console.log(data[0]);
				    var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/section", success : req.flash('success'), error : req.flash('error'),class_list:class_list,section_data:data[0],section_list:''};
				    res.render("admin_layout", pagedata);
                 }

 			    });
              }
              else
              {
              	var table = 'tbl_section'
			    admin.findAllSection({table:table},function(err, result){
					 	var section_list = result;
					 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/section",success : req.flash('success'), error : req.flash('error'),section_list :section_list,class_list:class_list,section_data:''};
			                 res.render("admin_layout", pagedata);

			    });
              }
              
		
			});
         
	 }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
	

});

router.post("/section", function(req, res){
 	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
		var class_id          = req.body.class_id;
	    var section_name  	  = (req.body.section_name).trim();
		if(req.body.section_id) 
		{
	      var obj= { class_id : class_id,section_name:section_name}
	      var where= {section_id:req.body.section_id}
	      var tableobj = {tablename:'tbl_section'};
	      admin.updateWhere(tableobj,where,obj, function(err, result){  
	       
	      	 if(result)
             {	
             	req.flash('success','Section updated successfully')
                res.redirect(res.locals.appName+'/admin/section');
             }
	      });
 		}
		else
		{
         if(section_name=='')
         {
            
             req.flash('error','Section required to save')
                res.redirect(res.locals.appName+'/admin/section');

         }
         else
         {
              admin.findWhere({tablename:'tbl_section'},{class_id : class_id,section_name:section_name},function(err, result){
			  	 if(result.length>0)
			  	 {
			  	    req.flash('error','Section already exist')
		            section_data={
		                              class_id:class_id,
		                              section_name:section_name
		                         }
		             var table = 'tbl_section'
					    admin.findAllSection({table:table},function(err, result){
							 	var section_list = result;
							 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/section_list",success : req.flash('success'), error : req.flash('error'),section_list :section_list};
					                 res.render("admin_layout", pagedata);

					    });
		         }
		         else
		         {
		            

					  admin.insert_section({ class_id : class_id,section_name:section_name}, function(err, result){
				     	if(result)
						{
							//var data = JSON.parse(JSON.stringify(result[0]));
							 //console.log(result);
							 var table = 'tbl_section'
							 admin.findAllSection({table:table},function(err, result){
							 	var section_list = result;
							 	req.flash('success','Section added successfully')
							 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/section_list", success : req.flash('success'), error : req.flash('error'),section_list :section_list};
					                 res.render("admin_layout", pagedata);

							 });
							
						}
						else
						{
							console.log('This username is incorrect');
							req.flash("msg", "This username and password is incorrect");
							res.redirect(res.locals.appName+"/admin/");
						}
					 });
				 } 
		         
		         }); 

         }
	  	 
	    }
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/sectionList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
	 var table = 'tbl_section'
	    admin.findAllSection({table:table},function(err, result){
			 	var section_list = result;
			 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/section_list", success : req.flash('success'), error : req.flash('error'),section_list :section_list};
	                 res.render("admin_layout", pagedata);

	    });
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/transport", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
         
         
        var tableobj  = {tablename:'tbl_transport'}
	    if(req.query.id)
	     {
           var findObj = {transport_id:req.query.id.toString()}
           admin.findWhere(tableobj,findObj,function(err,result){
           if(result)
           {
              var $data =JSON.parse(JSON.stringify(result)); 
              console.log($data[0]);
              var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport", success: req.flash('success'),error: req.flash('error'),transportdata:$data[0],transport_list:''};
		      res.render("admin_layout", pagedata);
           }
           });
	     }
	     else
	     {
	     	var table = 'tbl_transport'
	     	admin.findAll({table:table},function(err, result){
			 	var transport_list = result;
			 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport",success: req.flash('success'),error: req.flash('error'),transport_list :transport_list,transportdata:''};
	                 res.render("admin_layout", pagedata);

			 });
	    //    var pagedata = {title : "Edurecords", pagename : "admin/transport", message : req.flash('msg'),transportdata:''};
		   // res.render("admin_layout", pagedata);	
	     }

	     
		 
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.post("/transport", function(req, res){
 	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	var route_name          = req.body.route_name;
	var number_of_vehicle  	= req.body.number_of_vehicle;
 	var description 		= req.body.descriptions;
 	var route_fare          = req.body.route_fare;
	var obj= { route_name : route_name,number_of_vehicle:number_of_vehicle,description :description,route_fare:route_fare}
    
    if(req.body.transport_id)
     {
          var where= {transport_id:req.body.transport_id}
	      var tableobj = {tablename:'tbl_transport'};
	      admin.updateWhere(tableobj,where,obj, function(err, result){  

	      	if(result)
	      	{
                req.flash('success',"Transport route updated successfully"); 
	      		res.redirect(res.locals.appName+"/admin/transport");
	      	}

	      });
     }
     else	
     {

          	admin.findWhere({tablename:'tbl_transport'},{ route_name : route_name,number_of_vehicle:number_of_vehicle},function(err, result){
		  	 if(result.length>0)
		  	 {
		  	   //console.log('already exist')
		  	
	           var table = 'tbl_transport'
	     	   admin.findAll({table:table},function(err, result){
                     transportdata= {
                             route_name:route_name,
                             number_of_vehicle:number_of_vehicle,
                             description:description,
                             route_fare:route_fare
	  	                  }
	           
			 	 var transport_list = result;
			 	 req.flash('error','Transport route already exist');
	             var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport",success: req.flash('success'),error: req.flash('error'),transport_list :transport_list,transportdata:transportdata};
	             res.render("admin_layout", pagedata);
	             
	     	    }); 

		  	 }
	  	 	 else
	  	 	 {
	  	 		admin.insert_transport(obj, function(err, result){
			        if(result)
					{
						//var data = JSON.parse(JSON.stringify(result[0]));
						//console.log(result);
						var table = 'tbl_transport'
						admin.findAll({table:table},function(err, result){
						 	var transport_list = result;
		                    req.flash('success',"Transport route added successfully");  
						 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport", success: req.flash('success'),error: req.flash('error'),transport_list :transport_list,transportdata:''};
				                 res.render("admin_layout", pagedata);

						 });
					}
					else
					{
						console.log('This username is incorrect');
						req.flash("msg", "This username and password is incorrect");
						res.redirect(res.locals.appName+"/");
					}
				});
	  	 	 }
	  	 });
	 }
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/transportList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	 var table = 'tbl_transport'
			 admin.findAll({table:table},function(err, result){
			 	var transport_list = result;
			 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport_list",success: req.flash('success'),error: req.flash('error'),transport_list :transport_list};
	                 res.render("admin_layout", pagedata);

			 });
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.get("/dormitory", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){


	    var tableobj  = {tablename:'tbl_dormitory'}
		if(req.query.id)
	    {
           var findObj = {dormitory_id:req.query.id.toString()}
           admin.findWhere(tableobj,findObj,function(err,result){
           if(result)
           {
              var $data =JSON.parse(JSON.stringify(result)); 
              console.log($data[0]);
              var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dormitory", message : req.flash('msg'),dormitoryData:$data[0],dormitory_list:''};
		      res.render("admin_layout", pagedata);
           }
           });
	    }
	    else{
	    	var table = 'tbl_dormitory'
			 admin.findAll({table:table},function(err, result){
			 	var dormitory_list = result;
			 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dormitory", message : req.flash('msg'),dormitoryData:'',dormitory_list :dormitory_list};
	                 res.render("admin_layout", pagedata);

			 });
		}
		 // var pagedata = {title : "Edurecords", pagename : "admin/dormitory", message : req.flash('msg')};
		 // res.render("admin_layout", pagedata);
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.post("/addDormitory", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	var name          		= req.body.name;
	var number_of_room  	= req.body.number_of_room;
 	var description 		= req.body.descriptions;
 	var moment 				= require('moment');
	var created_at 			= moment().format('YYYY-MM-DD:hh:mm:ss');
	var dormitory_id  		= req.body.dormitory_id;
		if(req.body.dormitory_id)
     	{
     	  var obj = { name : name,number_of_room:number_of_room,description :description}
          var where= {dormitory_id:req.body.dormitory_id}
	      var tableobj = {tablename:'tbl_dormitory'};
	      admin.updateWhere(tableobj,where,obj, function(err, result){  

	      	if(result)
	      	{
	      		res.redirect(res.locals.appName+"/admin/dormitoryList");
	      	}

	      });
     	}else{
			admin.insert_dormitory({ name : name,number_of_room:number_of_room,description :description,created_at:created_at}, function(err, result){
		        console.log(result);
				if(result)
				{
					//var data = JSON.parse(JSON.stringify(result[0]));
					 console.log(result);
					 var table = 'tbl_dormitory'
					 admin.findAll({table:table},function(err, result){
					 	var dormitory_list = result;
					 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dormitory_list", message : req.flash('msg'),dormitory_list :dormitory_list};
			                 res.render("admin_layout", pagedata);

					 });
					
				}
				else
				{
					console.log('This username is incorrect');
					req.flash("msg", "This username and password is incorrect");
					res.redirect(res.locals.appName+"/");
				}
			});
		}
     }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/dormitoryList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	 		 var table = 'tbl_dormitory'
			 admin.findAll({table:table},function(err, result){
			 	var dormitory_list = result;
			 	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/dormitory_list", message : req.flash('msg'),dormitory_list :dormitory_list};
	                 res.render("admin_layout", pagedata);

			 });
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getSection", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id =req.query.class_id.toString()
	    var table = {tablename:'tbl_section'};
			admin.findWhere(table,{class_id:class_id},function(err, result){
			 	var section_list = result;
			 	
			 	res.send({section_list:section_list});

				
			 	//res.send('Gaurav');
			});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getSubject", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= (req.query.class_id).toString()
		var section_id  = (req.query.section_id).toString()

		// console.log(class_id)
		// console.log(section_id)
	    var table = {tablename:'tbl_subject'};
			admin.findWhere(table,{class_id:class_id},function(err, result){
			 	var subject_list = result;
			 	
			 	res.send({subject_list:subject_list});

				
			 	//res.send('Gaurav');
			});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/logout", function(req, res){
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
		req.session.destroy();
		res.redirect(res.locals.appName+"/");	
});



router.get("/studentList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		//console.log('$$$$$$$$$$$$$$$$',req.query);
		

		 if(req.query.class_id &&  req.query.section_id )
		 {
		 	
		 	console.log('req.query',req.query)
		 	var table = {tablename:'tbl_registration'};
		    var session_year =req.session.session_year
	        admin.findAll({table:'tbl_class'},function(err, result){
			  var class_list 	 = result;
              var class_id =req.query.class_id.toString()

			  admin.findWhere({tablename:'tbl_section'},{class_id:class_id},function(err, result){
			      var section_list 	 = result; 
	          
			    var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll',tbl_class:'tbl_class',tbl_section:'tbl_section'};
				 //admin.findWhere(table,{user_role:'3'},function(err, result){
				  var class_id =req.query.class_id.toString()
		 	      var section_id =req.query.section_id.toString()
				 admin.getAllClassSectionRegisteruser(table,{class_id:class_id,section_id:section_id,session_year:session_year},function(err, result){
				   var student_list = result;
				   var table = {tablename:'tbl_registration'};
				   var n=0;
			 	   student_list.forEach(function(item, index){
			 	 	  student_list[index].parentname="";
			 	 	  student_list[index].parentphone="";
			 	 	  //student_list[index].parentemail="";
			 	 	  //student_list[index].nextyear="";
			 	   });
				   async.each(student_list, function (item, done) 
				   {

				 		 var registration_id   =  item['parent_id'].toString();
				 		 var Table = {tablename : 'tbl_registration'}
						 admin.findWhere(Table,{registration_id:registration_id},function(err, result1){
					     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
					     student_list[n].parentphone=parents_list[0].phone;
					     student_list[n].parentname=parents_list[0].name;
					     //student_list[n].parentemail=parents_list[0].email;
					     //years = year.split("-");
					     //student_list[n].nextyear = years[1] +'-'+ (parseInt(years[1])+1);
					     
					     done(null);
					     n++;
						});
					}, function(){
						//console.log('^^^^^^^^^^^^^^^^^^',student_list)
	                      //res.send({student_list:student_list});
	                       var student_list = result;
						 	//console.log(student_list);
						 	//console.log(class_list);
						 	console.log(section_list);
						 	//console.log('req.query',req.query);
				            	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/student_list", message : req.flash('msg'),student_list :student_list,class_list:class_list,section_list:section_list,studentdata:req.query};
				                res.render("admin_layout", pagedata);

				  });
			 			 	
					//console.log(result);
				 	//getregisterallStudent
				 	
	              });  
				});
			 }); 

		 }
		 else
		 {

		    var table = {tablename:'tbl_registration'};
		    var session_year =req.session.session_year
	        admin.findAll({table:'tbl_class'},function(err, result){
			    var class_list 	 = result;

			  admin.findAll({table:'tbl_section'},function(err, result){
			       var section_list 	 = result; 
	           
				 /* 
				 var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll',tbl_class:'tbl_class',tbl_section:'tbl_section'};
				 admin.getAllRegisteruser(table,{session_year:session_year},function(err, result){
				   var student_list = result;
				   var table = {tablename:'tbl_registration'};
				   var n=0;
			 	   student_list.forEach(function(item, index){
			 	 	  student_list[index].parentname="";
			 	 	  student_list[index].parentphone="";
			 	 	   
			 	   });
				   async.each(student_list, function (item, done) 
				   {

				 		 var registration_id   =  item['parent_id'].toString();
				 		 var Table = {tablename : 'tbl_registration'}
						 admin.findWhere(Table,{registration_id:registration_id},function(err, result1){
					     var parents_list  = Object.values(JSON.parse(JSON.stringify(result1)))
					     student_list[n].parentphone=parents_list[0].phone;
					     student_list[n].parentname=parents_list[0].name;
					     
					     
					     done(null);
					     n++;
						});
					}, function(){
						 
	                       var student_list = result;
						 	console.log(student_list);
						 	console.log(class_list);
						 	console.log(section_list);
						 	console.log('req.query',req.query);
	                        
	                        var section_list 	 = ""; 
				            if(req.query.class_id &&  req.query.section_id )
				            {
				              class_id=req.query.section_id.toString();
				              admin.findWhere({tablename:'tbl_section'},{class_id:class_id},function(err, result){	
				               var section_list 	 = result; 
				               var pagedata 	 = {title : "Edurecords", pagename : "admin/student_list", message : req.flash('msg'),student_list :student_list,class_list:class_list,section_list:section_list,studentdata:req.query};
				                res.render("admin_layout", pagedata);

				              });

				            }else{

				            	var pagedata 	 = {title : "Edurecords", pagename : "admin/student_list", message : req.flash('msg'),student_list :student_list,class_list:class_list,section_list:section_list,studentdata:req.query};
				                res.render("admin_layout", pagedata);

				            } 


						 	
				  });
			 			 	
					//console.log(result);
				 	//getregisterallStudent
				 	
	              }); 
	              */ 
	              var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/student_list", message : req.flash('msg'),student_list :"",class_list:class_list,section_list:section_list,studentdata:""};
				   res.render("admin_layout", pagedata);
				});
			  });	 
        }
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/teacherList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var class_id =req.query.class_id
	    var table = {tablename:'tbl_registration'};
	    //console.log(table);
			 admin.findWhere(table,{user_role:'4'},function(err, result){
			 	var teacher_list = result;
			 	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/teacher_list", message : req.flash('msg'),teacher_list :teacher_list};
	            res.render("admin_layout", pagedata);
			});
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
router.get("/teacherDetail", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
         
		var registration_id =req.query.registration_id.toString()


	    var table = {tablename:'tbl_registration'};
	    //console.log(table);
			 admin.findWhere(table,{user_role:'4',registration_id:registration_id},function(err, result){
			  var teacherdata = result;

			  //console.log(teacherdata);
			 /* 	 
			     teacherdata.forEach(function(item, index){
			 		teacherdata[index].email="";
			 		//teacherdata[index].parent_address="";
			 	});

			   admin.findWhere({tablename:'tbl_userlogin'},{user_role:'4',registration_id:registration_id},function(err, result1){	 
				    teacherdata[0].email= result1[0].email;    
				   console.log(teacherdata[0]);               
 			 	var pagedata 	 = {title : "Edurecords", pagename : "admin/teacheredit", message : req.flash('msg'),teacherdata :JSON.parse(JSON.stringify(teacherdata[0]))};
	            res.render("admin_layout", pagedata);
			  });
			   */
			   var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/teacheredit", message : req.flash('msg'),teacherdata :JSON.parse(JSON.stringify(teacherdata[0]))};
	            res.render("admin_layout", pagedata);
		  });	   
	}else{
	      
		   website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});
router.post("/teacherDetail", function(req, res){
    if(req.body.registration_id)
	     {
	         var obj= {   
	      	          aadhar_number:req.body.teacher_adhar_no,
	      	          name :req.body.teacher_name,
	      	          dob:req.body.teacher_dob ,
	      	          sex:req.body.teacher_gender ,
	      	          address:req.body.teacher_address ,
	      	          phone:req.body.teacher_phone ,
	      	          profession: req.body.teacher_profession,
	      	          academics: req.body.academics,
	      	          show_website: req.body.show_website,
	      	          staff_category:req.body.staff_category,
	      	          designation: req.body.teacher_designation,
	      	          show_website  :req.body.show_website

	      	        }

              var where= {registration_id:req.body.registration_id}
		      var tableobj = {tablename:'tbl_registration'};
		      admin.updateWhere(tableobj,where,obj, function(err, result){ 

			      res.redirect(res.locals.appName+"/admin/TeacherList");

		      });
	     }

});


router.get("/accountantList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var class_id =req.query.class_id
	    var table = {tablename:'tbl_registration'};
	    console.log(table);
			 admin.findWhere(table,{user_role:'5'},function(err, result){
			 	var accountant_list = result;
			 	console.log(accountant_list);
			 	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/accountant_list", message : req.flash('msg'),accountant_list :accountant_list};
	            res.render("admin_layout", pagedata);
			});
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});
router.get("/accountantDetail", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
         
		var registration_id =req.query.registration_id.toString()
		//console.log(registration_id);
	    var table = {tablename:'tbl_registration'};
			 admin.findWhere(table,{user_role:'5',registration_id:registration_id},function(err, result){
			 	var accountantdata = result;
			   var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/accountantedit", message : req.flash('msg'),accountantdata :JSON.parse(JSON.stringify(accountantdata[0]))};
	            res.render("admin_layout", pagedata);
		  });	   
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});
router.post("/accountantDetail", function(req, res){
    if(req.body.registration_id)
	     {
	         var obj= {   
	      	           
	      	           name :req.body.accountant_name,
	      	           sex:req.body.accountant_gender ,
	      	           address:req.body.accountant_address ,
	      	           phone:req.body.accountant_phone ,
	      	           profession: req.body.accountant_profession,
	      	           academics: req.body.accountant_academics,
	      	           //show_website: req.body.show_website
	      	           
	      	           //email: req.body.accountant_email
	      	          }
	      	 
              var where= {registration_id:req.body.registration_id}
		      var tableobj = {tablename:'tbl_registration'};

		      admin.updateWhere(tableobj,where,obj, function(err, result){ 
		          
		          /*
		          var table = { tablename:'tbl_userlogin' }; 

                  var whereaccountant= { registration_id:req.body.registration_id }
                  var objuser= {

		              email: req.body.accountant_email,
		      	      password: sha1(req.body.accountant_password)
		          }	  
                  admin.updateWhere(table,whereaccountant,objuser, function(err, result){
                     
			      		res.redirect("/accountantList");
			      });
			      */

			      res.redirect(res.locals.appName+"/admin/accountantList");
		      });
	     }

});


router.get("/librarianList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var class_id =req.query.class_id.toString()
	    var table = {tablename:'tbl_registration'};
	    //console.log(table);
			 admin.findWhere(table,{user_role:'6'},function(err, result){
			 	var librarian_list = result;
			 	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/librarian_list", message : req.flash('msg'),librarian_list :librarian_list};
	            res.render("admin_layout", pagedata);
			});
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
router.get("/librarianDetail", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
         
		var registration_id =req.query.registration_id.toString()
		console.log(registration_id);
	    var table = {tablename:'tbl_registration'};
	    //console.log(table);
			 admin.findWhere(table,{user_role:'6',registration_id:registration_id},function(err, result){
			 	var librariandata = result;
			 	/*
			 	 accountantdata.forEach(function(item, index){
			 		accountantdata[index].email="";
			 	});

			   admin.findWhere({tablename:'tbl_userlogin'},{user_role:'5',registration_id:registration_id},function(err, result1){	 
				    accountantdata[0].email= result1[0].email;    
				   console.log(accountantdata[0]);               
 			 	var pagedata 	 = {title : "Edurecords", pagename : "admin/accountantedit", message : req.flash('msg'),accountantdata :JSON.parse(JSON.stringify(accountantdata[0]))};
	            res.render("admin_layout", pagedata);
			  });
             */
			   var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/librarianedit", message : req.flash('msg'),librariandata :JSON.parse(JSON.stringify(librariandata[0]))};
	            res.render("admin_layout", pagedata);
		  });	   
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
router.post("/librarianDetail", function(req, res){
    if(req.body.registration_id)
	     {
	         var obj= {   
	      	           
	      	           name :req.body.librarian_name,
	      	           sex:req.body.librarian_gender ,
	      	           address:req.body.librarian_address ,
	      	           phone:req.body.librarian_phone ,
	      	           profession: req.body.librarian_profession,
	      	           academics: req.body.librarian_academics,
	      	           //show_website: req.body.show_website
	      	           email: req.body.librarian_email
	      	          }
	      	 
              var where= {registration_id:req.body.registration_id}
		      var tableobj = {tablename:'tbl_registration'};
		      admin.updateWhere(tableobj,where,obj, function(err, result){ 
		          
		          /*
		          var table = { tablename:'tbl_userlogin' }; 

                  var whereaccountant= { registration_id:req.body.registration_id }
                  var objuser= {

		              email: req.body.accountant_email,
		      	      password: sha1(req.body.accountant_password)
		          }	  
                  admin.updateWhere(table,whereaccountant,objuser, function(err, result){
                     
			      		res.redirect("/accountantList");
			      });
			      */
			      res.redirect(res.locals.appName+"/admin/librarianList");
		      });
	     }

});

router.get("/Subject", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
        

    var table  = 'tbl_class';
	admin.findAll({table:table},function(err, result){
	   var class_list 	 = result;
	   var table_subject = 'tbl_subject';
	   //console.log(req.query.subject_id);   
        if(req.query.subject_id)
	     {
	         var subject_id=req.query.subject_id.toString();
	          var where= {subject_id:req.query.subject_id.toString()}
		      var tableobj = {tablename:table_subject};
		      admin.findWhere(tableobj,{'subject_id': subject_id },function(err, result){
			 	  var subject_list 	 = JSON.parse(JSON.stringify(result[0]));
				  var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/subject", success: req.flash('success'),error: req.flash('error'),subject_list:subject_list,class_list:class_list};
                  res.render("admin_layout", pagedata);
			  });	
	     }
     	 else 
     	 {
			 admin.findAllsubject({table:table_subject},function(err, result){
			    var subject_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/subject", success: req.flash('success'),error: req.flash('error'),subject_list:subject_list,class_list:class_list};
				res.render("admin_layout", pagedata);
			});
     	 }  
	  });
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.post("/Subject", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
		var table   = {tablename:'tbl_subject'};
	 	var data = {
			 		name         :(req.body.subject_name).trim(),
			 		class_id     :req.body.class_id,	 		
			 		subject_type :req.body.subject_type,
			 		year         :req.session.session_year
		           }
		if(req.body.subject_id)
	     {
	     	  if((req.body.subject_name).trim()==''|| req.body.class_id==''||req.body.subject_type=='')
	          {
	          	 req.flash('error',"All field required");
			     res.redirect(res.locals.appName+"/admin/subject");
	          }   
	          var where= {subject_id:req.body.subject_id}
		      admin.updateWhere(table,where,data, function(err, result){  
	             if(result)
		      	 {
		      	 	req.flash('success',"Subject updated successfully");
		      		res.redirect(res.locals.appName+"/admin/subject");
		      	 }
		      });
	     }
     	else 
     	{
              
          if((req.body.subject_name).trim()==''|| req.body.class_id==''||req.body.subject_type=='')
          {
          	 req.flash('error',"All field required");
		     res.redirect(res.locals.appName+"/admin/subject");
          }   
          else
          {
              admin.findWhere(table,{name : req.body.subject_name,class_id : req.body.class_id, subject_type:req.body.subject_type },function(err, result){
		  	   if(result.length>0)
		  	   {
		  	   
	               req.flash('error','Subject already exist')	
	               res.redirect(res.locals.appName+"/admin/subject");   
	           }
	            else
	            {

	            	admin.insert_all(table,data,function(err, result){
					var class_table  = 'tbl_class';
					var table_subject = 'tbl_subject';
			  		var table  = 'tbl_class';
			  		req.flash('success',"Subject inserted successfully");
			
					admin.findAll({table:table},function(err, result){
				    	var class_list 	 = result;
						 admin.findAllsubject({table:table_subject},function(err, result){
						    var subject_list 	 = result;
							var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/subject",success: req.flash('success'),error: req.flash('error'),subject_list:subject_list,class_list:class_list};
							res.render("admin_layout", pagedata);
						});
					});

				  });
	            }

	     	 });
          } 
     	 	
     	}           
	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
	

});

router.get("/classsection_subjectList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	   var table = 'tbl_subject';
	   
		    var class_id =req.query.class_id.toString();
            table='tbl_subject';
		    admin.findWhere({tablename:table},{'class_id': class_id },function(err, result){
			 	  var subject_list 	 = result;

			 	  //console.log(subject_list);
				  //var pagedata 	 	 = {Title : "", pagename : "admin/subject_list", message : req.flash('msg'),subject_list:subject_list,class_list:class_list};
				  res.send({subject_list: subject_list});
			});	
		    
			 
	   
	  
	}else{
	      
		   website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});

router.get("/subjectList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
	   var table = 'tbl_subject';
	   admin.findAll({table:'tbl_class'},function(err, result1){
		    var class_list 	 = result1;
		       table='tbl_subject';
		  admin.findAllsubject({table:table},function(err, result){
			 	console.log(result);
			    var subject_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/subject_list", message : req.flash('msg'),subject_list:subject_list,class_list:class_list};
				res.render("admin_layout", pagedata);
		   });	
		   
	    });
	  
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});

router.get("/AssignTeacher", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
	    

		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
		    var table_teacher = {tablename:'tbl_registration'};
			admin.findWhere(table_teacher,{user_role:'4'},function(err, result){
				var teacher  = result;
				var table = 'tbl_teacherassignment';
          
			 if(req.query.id)
		     {
		          var id=(req.query.id).toString();
		          var tableobj = {table:table};
			      var assign_list= ""

			      admin.assignedtaeacherdetail(tableobj,{'id': id },function(err, result){
			      	    //console.log('$$$$$$$$$$$$$',result);
			        where1 ={class_id:(result[0].class_id).toString()}
				    admin.findWhere({tablename:'tbl_section'},where1,function(err, result1){
                          section_list =result1;	  
			      	  
				      admin.findWhere({tablename:'tbl_subject'},where1,function(err, result2){
                            subject_list=  result2;
				      	 if(result.length>0)
					 	    var assign_data 	 = result[0];//JSON.parse(JSON.stringify(result));
	                      assigned_id=req.query.id;
						  var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/assignTeacher", success: req.flash('success'),error: req.flash('error'),assign_data:assign_data,assign_list:"",section_list:section_list,class_list:class_list,subject_list:subject_list,teacher:teacher,assigned_id:assigned_id};
						  res.render("admin_layout", pagedata);

                      });						  

				    });	
				 });	
		     }
	     	 else 
	     	 {
	     	 
		       var table_teacher = {tablename:'tbl_registration'};
			   admin.findWhere(table_teacher,{user_role:'4'},function(err, result){
			   	teacher=result;
	     	  	admin.findallteacherassignment({table:table},function(err, result){
				 	//if(result.length>0)
				    //  var assign_list 	 = result[0];
				  	if(result.length>0)
				 	  var assign_list 	 = JSON.parse(JSON.stringify(result));
                     else
                     {
                       var assign_list= ""//{class_id:"",section_id:"",teacher_id:""}	
                     }  
              		  

					var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/assignTeacher",success: req.flash('success'),error: req.flash('error'),assign_data:"",assign_list:assign_list,class_list:class_list,subject_list:"",section_list:"",teacher:teacher,assigned_id:''};
					res.render("admin_layout", pagedata);
				});

              });


	     	 }	
		    });
		});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
/* Get all teacher based on class */
router.get("/class_teacherList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
	    var class_id = req.query.class_id.toString(); 

		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
		    var table_teacher = {tablename:'tbl_registration'};

			admin.findWhere(table_teacher,{user_role:'4'},function(err, result){
				 var teacher  = result;
				 var table = 'tbl_teacherassignment';
				 //console.log('teacher',teacher);
				 admin.getclassassignedteacher({table:table},{class_id:class_id,year:req.session.session_year},function(err, result){
				    var assign_list = result;
				    //console.log('getclassassignedteacher',assign_list);
				    res.send({assign_list:assign_list});
				});
			});
		});
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/classRoutine", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
			var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classRoutine", success: req.flash('success'),error: req.flash('error'),class_list:class_list};
			res.render("admin_layout", pagedata);
		});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getAllData", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id =req.query.class_id.toString()
	    var table = {tablename:'tbl_section'};
			admin.findWhere(table,{class_id:class_id},function(err, result){
				//console.log('@@@@@@@@@@@@@@@',result)

			 	var section_list = result;
			 	var tbl_subject  = {tablename:'tbl_subject'};
			 	admin.findWhere(tbl_subject,{class_id:class_id.toString()},function(err, result){
			 		var subject_list  = result;
				 	//admin.findWhere(tbl_subject,{class_id:class_id.toString()},function(err, result){
				 		res.send({section_list:section_list,subject_list:subject_list});
				 	//});
				});
			 	//res.send('Gaurav');
			});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/AssignTeacher", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){


		var table   = {tablename:'tbl_teacherassignment'};
	 	var data 	= {

			 		class_id         :req.body.class,
			 		section_id       :req.body.section_id,	 		
			 		subject_id       :req.body.subject_id,
			 		teacher_id       :req.body.teacher_id,
			 		year             :req.session.session_year
		}

       if(req.body.assigned_id)
	     {
	          var where= {id:req.body.assigned_id.toString()}
		      admin.updateWhere(table,where,data, function(err, result){  
                 if(result)
		      	 {
		      	 	req.flash('success',"Record updated successfully");
		      		res.redirect(res.locals.appName+"/admin/AssignTeacher");
		      	 }
		      });
	     }
     	else 
     	{

            where1 ={class_id :req.body.class.toString() ,section_id :req.body.section_id.toString() ,subject_id :req.body.subject_id.toString()}
            //console.log(where1);
			admin.findWhere(table,where1,function(err, result){
			//console.log(result);
				if(result.length>0)
				{
                   req.flash('error',"Other teacher Assigned Already");
                    
                  var table  = 'tbl_class';
	              admin.findAll({table:table},function(err, result){
	              	var class_list 	 = result;
                 	var table_teacher = {tablename:'tbl_registration'};
			        admin.findWhere(table_teacher,{user_role:'4'},function(err, result){
				     var teacher  = result;
			
			            
	                    where1 ={class_id:req.body.class}
					    admin.findWhere({tablename:'tbl_section'},where1,function(err, result1){
	                          section_list =result1;	  
				      	  
					      admin.findWhere({tablename:'tbl_subject'},where1,function(err, result2){
 							subject_list=  result2;
                               
	                           
					      	 if(result.length>0)
						 	    var assign_data 	 = result[0];//JSON.parse(JSON.stringify(result));
		                      assigned_id='';
							  var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/assignTeacher", success: req.flash('success'),error: req.flash('error'),assign_data:data,assign_list:"",section_list:section_list,class_list:class_list,subject_list:subject_list,teacher:teacher,assigned_id:assigned_id};
							  res.render("admin_layout", pagedata);

	                      });						  

					    });	
					});	  
                  });	
				}
				else
				{


		            admin.insert_all({tablename:'tbl_teacherassignment'},data,function(err, result){
						 
						var table  = 'tbl_class';
				        admin.findAll({table:table},function(err, result){
						    var class_list 	 = result;

						    var table_teacher = {tablename:'tbl_registration'};
							
							admin.findWhere(table_teacher,{user_role:'4'},function(err, result){
								var teacher  = result;

								 var table = 'tbl_teacherassignment';
					 
								 admin.findallteacherassignment({table:table},function(err, result){
		                             
		                            

								 	req.flash('success',"Teacher assigned successfully");

								    var assign_list 	 = result;
									var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/assignTeacher", success: req.flash('success'),error: req.flash('error'),assign_data:"",assign_list:assign_list,class_list:class_list,subject_list:'',teacher:teacher,assigned_id:""};

									res.render("admin_layout", pagedata);
								});
								// var pagedata = {title : "Edurecords", pagename : "admin/assignTeacher", message : req.flash('msg'),class_list:class_list,teacher:teacher};
								// res.render("admin_layout", pagedata);
							});
						});
					});	

				}
 

		  });		
     	}



	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
	

});


router.get("/assignteacher_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		

	    var table = 'tbl_teacherassignment';
	 
			 admin.findallteacherassignment({table:table},function(err, result){
			 	console.log(result);
			    var assign_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/assignteacher_list", message : req.flash('msg'),assign_data:"",assign_list:assign_list,assigned_id:""};

				res.render("admin_layout", pagedata);
			});
	}else{
	      
		   website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});

router.get("/homeworkList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		
	    	var table = 'tbl_homework';
	 
			 admin.findhomework({table:table},function(err, result){
			 	console.log(result);
			    var homework_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/homework_list", message : req.flash('msg'),homework_list:homework_list};
				res.render("admin_layout", pagedata);
			});
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});

router.get("/HomeWork", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;

		    var table = 'tbl_homework';
	 
			 admin.findhomework({table:table},function(err, result){
			 	//console.log(result);
			    var homework_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/homework",moment:moment ,success: req.flash('success'),error: req.flash('error'),homework_list:homework_list,class_list:class_list};
				res.render("admin_layout", pagedata);
			});
			
		});
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/HomeWork", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

  	console.log('#########',req.body);

  	var class_id            = req.body.class_id;
  	var section_id          = req.body.section_id;
  	var subject_name        = req.body.subject_name;
  	var subject_id  		= req.body.subject_id;
  	// var task        		= req.body.task;
  	// var task_description    = req.body.task_description;
  	var session_year        = req.session.session_year;

  	var moment 				= require('moment');
	var dates 				= moment().format('YYYY-MM-DD:hh:mm:ss');
  	
  	var file = req.files;
  	var data = [];
    message='';
 
  if(class_id!="")
   {

 object=req.body;
 flag=false;
  	async.forEachOf(subject_id, function (item,index, done) {

         if(object.hasOwnProperty('task_'+item))
  		 {
  		 	 task =object['task_'+item].trim();
  		 }
  		 if(object.hasOwnProperty('task_'+item))
  		 {
  		 	 task_description = object['task_description_'+item].trim();
  		 }
  		 
  		 
        if(file['subject_file_'+subject_id[index]])
        {
          file1= file['subject_file_'+subject_id[index]];
	  		var newname = changename(file['subject_file_'+subject_id[index]].name);
			var filepath = path.join('/',"public/homework_image/"+newname);
			
			file1.mv(filepath, function(err){
				if(err){
					console.log(err);
					return;
				}
			});	
		 }
		 else
		  	newname='';

  			var table   = {tablename:'tbl_homework'};

  	      if(task!='' )
  	      {
  	     	 
	  	    	message+='Subject-'+subject_name[index]+' ,Task-'+task+' ,Description-'+task_description
	  	    	data = {
		  		 	class_id 			: class_id,
		  		 	section_id			: section_id,
		  		 	teacher_id			: 0,
		  			subject_id 			: subject_id[index],
		  			task       			: task,
		  			description    		: task_description,
		  			file_name     	    : newname,
		  			homework_date	    : dates,
		  			created_date	    : dates,
		  			session_year        : session_year
	  			}
  			//console.log('Data of Task--->',data)
	            var table = {tablename:'tbl_homework'};
	            admin.findWhere(table,{class_id:class_id.toString(),section_id:section_id,subject_id:subject_id[index].toString()},function(err, result){
	            	//console.log('checklist-----',result);
	            	if(result.length>0)
	            	{
	                  homework= result[0];
	                   
	                  var where={homework_id:homework.homework_id.toString()};
		  	  		  admin.updateWhere({tablename:'tbl_homework'},where,data, function(err, result){
				            //req.flash('success',"Homework updated successfully");
				            flag=true;
			      	   });
	            	}
	            	else
	            	{

	            	  admin.insert_all({tablename:'tbl_homework'},data,function(err, result){
	            	  	flag=true;
	                       //req.flash('success',"Homework saved successfully");
			          });	  	    		
	            	}
			    });	 

	  	  }
	  	  
	  	    done(null);

		},function(){

            
           if(object.hasOwnProperty("checktosend"))
           {
                var mobileNo ='';
		        var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
			    admin.getstudentphone_by_class(table,{class_id:class_id,session_year:session_year,section_id:section_id},function(err, result){
			        
			        studentdata=result
			         async.each(studentdata, function (item, done) {
 	                  admin.findWhere({tablename:'tbl_registration'},{registration_id:item.parent_id.toString()},function(err, result2){
			           	 mobileNo += result2[0].phone+',';
    			         done(null);
			         });
	 		             
			         },function(){
			             
			             message = message.replace(/<\/?p>/g,'')
    		          // 	 message = req.body.message.replace("&#39;", "'",) 	    
               	//          message = message.replace(/<\/?p>/g,'')
               	//          message = encodeURI(message)
               	     
    		            //mobileNo='';
    			    	senderdata= JSON.parse(JSON.stringify(result[0]));
    		             
    			 
    			    	var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
    			    	mobileNo= mobileNo.substring(0, mobileNo.length - 1)
    			    	//var mobileNo = [ "XXXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXX" ];
    					//var mobileNo =  "XXXXXXXXXX,XXXXXXXXXX,XXXXXXXXXX";
    		        	msg91.send(mobileNo, message, function(err, response){
    		              req.flash('success',"Homework sent successfully");
    					});     
			             
			         });        
			        
	
			    });
		    } 


	  		var table  = 'tbl_class';
	  		admin.findAll({table:table},function(err, result){
			    var class_list 	 = result;
			     var table = 'tbl_homework';
			   admin.findhomework({table:table},function(err, result){
  
                if(flag==false)
                 	req.flash('error',"No homework assigned");	 
	 			else
	 			   req.flash('success',"Homework sent successfully-")
				 	 
				var homework_list 	 = result;
				var pagedata = {title : "Edurecords", moment:moment, pagename : "admin/homework", success: req.flash('success'),error: req.flash('error'),class_list:class_list,homework_list:homework_list};
				res.render("admin_layout", pagedata);
			   });
			});
  	    });
      }
      else
      {

      }
     }else{
		website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		});
	}
});


router.get("/getsubjTeach", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id   = req.query.class_id.toString()
		var section_id = req.query.section_id.toString()
		var day = req.query.day.toString()
		var session_year= req.session.session_year;


	    var table = {tablename:'tbl_subject'};
        
			 admin.findWhere(table,{class_id:class_id},function(err, result){
				var subject_list  = result
				var n=0;
				//var day = [ 'sunday', 'monday', 'tuesday','wednesday','thursday','friday','saturday'];
                 
                
				 subject_list.forEach(function(item, index){
				 	   
				 	    subject_list[index].class_routine_id="";
				 		subject_list[index].teacher="";
				 		subject_list[index].routed_teacher_id="";
				 		subject_list[index].routed_teacher_name="";
				 		subject_list[index].routed_time_start="";
				 		subject_list[index].routed_time_start_min=""
				 		subject_list[index].routed_time_end=""
					    subject_list[index].routed_starting_ampm= ""
					    subject_list[index].routed_time_end_min= ""
					    subject_list[index].routed_end_ampm= ""
					   // subject_list[index].routed_day=item

				 	});
				    async.forEachOf(subject_list, function (item,index, done) {

					 		var subject_id   =  item['subject_id'];
					 		//console.log(subject_id)
					 		var teacherTable = {tablename : 'tbl_teacherassignment'}

							admin.findsubjectTeacher(teacherTable,{class_id:class_id,section_id:section_id,subject_id:subject_id},function(err, result1){
								
								if(result1.length)
                                 {
							       var teacher_list  = Object.values(JSON.parse(JSON.stringify(result1)))
							        subject_list[index].teacher=teacher_list;
                                 	assignedteacher =JSON.parse(JSON.stringify(result1[0]));  
                                    registration_id= assignedteacher.teacher_id
                                 }
                                 else
                                   registration_id= 0;
                                   var class_routine = {tablename : 'tbl_class_routine'}
                                   admin.findClassRoutineAllday(class_routine,{class_id:class_id,section_id:section_id,subject_id:subject_id,registration_id:registration_id,day:day,session_year:session_year},function(err, result){
                                       if(result.length)
                                        {
                                        	routeddata =JSON.parse(JSON.stringify(result[0]))
                                        	subject_list[index].class_routine_id= routeddata.class_routine_id
                                        	subject_list[index].routed_teacher_id=routeddata.registration_id
									 		subject_list[index].routed_teacher_name=routeddata.registration_id
									 		subject_list[index].routed_time_start=routeddata.time_start
									 		subject_list[index].routed_time_start_min=routeddata.time_start_min
									 		subject_list[index].routed_time_end= routeddata.time_end
										    subject_list[index].routed_starting_ampm= routeddata.starting_ampm
										    subject_list[index].routed_time_end_min= routeddata.time_end_min
										    subject_list[index].routed_end_ampm= routeddata.end_ampm
										    //subject_list[index].routed_day= routeddata.day 
                                        }  
 							           done(null);
							          n++;
							       });
							     
							    

							});
					}, function(){
					 var subjectList = subject_list
					   console.log('Finallllllllllllllllllllll',subjectList);
					 res.send({subject_list:subjectList});
					});
			

			 });

			
	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/* 
*** Fetch Class routine on selcted class id & section id with week day
*** Get Default Data After Form Submit
*/
router.get("/getclassroutine", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id   = req.query.class_id.toString()
		var section_id = req.query.section_id.toString()
		var day = req.query.day.toString()
         //console.log(class_id);
         //return false;

	    var table = {tablename:'tbl_subject'};
        
			 admin.findWhere(table,{class_id:class_id},function(err, result){
				var subject_list  = result
				var n=0;
				//var day = [ 'sunday', 'monday', 'tuesday','wednesday','thursday','friday','saturday'];
                 
                
				 subject_list.forEach(function(item, index){
				 	 
				 		subject_list[index].teacher="";
				 		subject_list[index].routed_teacher_id="";
				 		subject_list[index].routed_teacher_name="";
				 		subject_list[index].routed_time_start="";
				 		subject_list[index].routed_time_start_min=""
				 		subject_list[index].routed_time_end=""
					    subject_list[index].routed_starting_ampm= ""
					    subject_list[index].routed_time_end_min= ""
					    subject_list[index].routed_end_ampm= ""
					   // subject_list[index].routed_day=item

                       
				 	});
				    async.forEachOf(subject_list, function (item,index, done) {

					 		var subject_id   =  item['subject_id'];
					 		//console.log(subject_id)
					 		var teacherTable = {tablename : 'tbl_teacherassignment'}

							admin.findsubjectTeacher(teacherTable,{class_id:class_id,section_id:section_id,subject_id:subject_id},function(err, result1){
								
							    var teacher_list  = Object.values(JSON.parse(JSON.stringify(result1)))
							     subject_list[index].teacher=teacher_list;
                               
                                 var class_routine = {tablename : 'tbl_class_routine'}
                                 if(result1.length)
                                 {
                                 	assignedteacher =JSON.parse(JSON.stringify(result1[0]));  
                                    registration_id= assignedteacher.teacher_id
                                 }
                                 else
                                    registration_id= 0;
                                 

                                   admin.findClassRoutineAllday(class_routine,{class_id:class_id,section_id:section_id,subject_id:subject_id,registration_id:registration_id,day:day},function(err, result){
                                       if(result.length)
                                        {
                                        	routeddata =JSON.parse(JSON.stringify(result[0]))
                                        	subject_list[index].routed_teacher_id=routeddata.registration_id
									 		subject_list[index].routed_teacher_name=routeddata.registration_id
									 		subject_list[index].routed_time_start=routeddata.time_start
									 		subject_list[index].routed_time_start_min=routeddata.time_start_min
									 		subject_list[index].routed_time_end= routeddata.time_end
										    subject_list[index].routed_starting_ampm= routeddata.starting_ampm
										    subject_list[index].routed_time_end_min= routeddata.time_end_min
										    subject_list[index].routed_end_ampm= routeddata.end_ampm
										    //subject_list[index].routed_day= routeddata.day 
                                        }  
 							           done(null);
							          n++;
							       });
							     
							    

							});
					}, function(){
					 var subjectList = subject_list
					   //console.log('Finallllllllllllllllllllll',subjectList);
					 res.send({subject_list:subjectList});
					});
			

			 });

			
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.get("/attendence", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
		var session_year =req.session.session_year;
	
		admin.findAll({table:table},function(err, result){

		    var class_list 	 = result;
		    admin.findAllteacher({tablename:'tbl_registration'},function(err, result1){
		    var teacher_list = result1
		    var n =0;


		    async.each(teacher_list, function (item, done) {

						 		console.log(item.registration_id)
						 		
						 		var tbl_attendence  = {tablename : 'tbl_attendance'}
						 		var attendence_date = moment().format('DD-MM-YYYY');
						 		date= (attendence_date).split('-');
								attendence_date= date[2]+'-'+date[1]+'-'+date[0];
								admin.getTeacherAttendence(tbl_attendence,{attendence_date:attendence_date,registration_id:item.registration_id,session_year:session_year},function(err, result1){
									//console.log('########################',result1)
								  	if(result1==undefined || result1==''){
								  		   teacher_list[n].attendence='';
								  	}else{
								  		   teacher_list[n].attendence=result1[0].status;
								  	}
								  
								    n++;
									
								    done(null);
								});
						}, function(){

				 //console.log(teacher_list)
				 //return false;
						//res.send(teacher_list)
			    
			    var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/attendence", success : req.flash('success'),error : req.flash('error'),class_list:class_list,teacher_list:teacher_list};
					    res.render("admin_layout", pagedata);
					
				});
			
			});
		});
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/* 
*** Get Student Attendence Report 
*/
router.get("/studentattendencereport",function(req,res){
   	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

  		var parent_id = req.session.uid;
  		var month     = {
  			'1' : 'January',
  			'2' : 'February',
  			'3' : 'March',
  			'4' : 'April',
  			'5' : 'May',
  			'6' : 'June',
  			'7' : 'July',
  			'8' : 'August',
  			'9' : 'September',
  			'10': 'October',
  			'11': 'November',
  			'12': 'December'

  		}
  		var session_year         = req.session.session_year; 
  		var y 					 = session_year.split("-");
  		var year                 = y[0];
  		var nextyear                 = y[1];
  		var tableobj = {tablename:'tbl_registration'};
     
    	var class_id =req.query.class_id
	    var table = {tablename:'tbl_registration'};
        admin.findAll({table:'tbl_class'},function(err, result){
		    var class_list 	 = result;
			 	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/studentattendencereport", message : req.flash('msg'),student_information :"",class_list:class_list,month:month,year:year,nextyear:nextyear};
	            res.render("admin_layout", pagedata);
		});
		
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/get_admin_student_attendance",function(req,res){

   if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	      =  req.query.class_id
		var section_id 	      =  req.query.section_id
		var month             =  req.query.month
		var session_year      =  req.session.session_year; 
		var registration_id   =  req.query.registration_id;
		var student_id        =  {};
		var table             =  { tbl_attendance:'tbl_attendance',tbl_enroll : 'tbl_enroll',tablename:'tbl_attendance' };
     	admin.getAdminStudentAttendence(table,{class_id:class_id,section_id:section_id,registration_id:registration_id,session_year:session_year,month:month},function(err, result1){
									//console.log('sas',result1)
		  	if(result1==undefined || result1==''){
		  		   student_id['attendence'] = '';
		  	}else{
		  		   student_id['attendence'] = result1[0].status;
		  	}
		  var attendance= result1;
		  //console.log('attendence',result1);
		  res.send({student_attendance : result1})
		});
 	}else{
        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		 }); 
	}
});


/* Get Report of attendance for All student */
router.get("/getAdminStudentAttendanceReport",function(req,res){

   if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id          =  req.query.class_id
		var section_id          =  req.query.section_id
		var month             =  req.query.month_id
		var session_year      =  req.session.session_year; 
		var year              =  req.query.year; 
		var student_id        =  {};
		var table             =  { tbl_attendance:'tbl_attendance',tbl_enroll : 'tbl_enroll',tbl_registration:'tbl_registration' };
     	 
	   // var table = {tbl_attendance:'tbl_attendance',tbl_registration:'tbl_registration'};
	    //admin.getteacherlist_by_attendence(table,{session_year:session_year,month:month,year:year,user_role:4},function(err, result){
	    admin.getstudentlist({tbl_enroll:'tbl_enroll',tbl_registration:'tbl_registration'},{class_id:class_id,section_id:section_id,session_year:session_year},function(err, result){
		   	//console.log(result);
		   	var student_list = result;

			   student_list.forEach(function(item, index){
			 	 	  student_list[index].attendence=[];
			 	 	 
			 	});
		  	 n=0;
		    async.each(student_list, function (item, done) {
			  	registration_id=item.registration_id;
	   	        //admin.getAdminTeacherAttendence(table,{session_year:session_year,month:month,year:year,user_role:4,registration_id:registration_id},function(err, result1){
	   	        	admin.getAdminStudentAttendence(table,{class_id:class_id,section_id:section_id,session_year:session_year,month:month,year:year,user_role:3,registration_id:registration_id},function(err, result1){
	   	        	 
	                   student_list[n].attendence =result1
			           n++
			           done(null);
			        });    
	             },function(){
		              //console.log('###############',student_list)
		              res.send({student_attendance : student_list})
		     
	         });        
         });	
 	}else{
        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


/* ********************************** */



/* 
*** Get Student Attendence Report 
*/
router.get("/teacherattendencereport",function(req,res){
   	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

  		var parent_id = req.session.uid;
  		var month     = {
  			'1' : 'January',
  			'2' : 'February',
  			'3' : 'March',
  			'4' : 'April',
  			'5' : 'May',
  			'6' : 'June',
  			'7' : 'July',
  			'8' : 'August',
  			'9' : 'September',
  			'10': 'October',
  			'11': 'November',
  			'12': 'December'

  		}
  		var session_year         = req.session.session_year; 
  		var y 					 = session_year.split("-");
  		var year                 = y[0];
  		var nextyear                 = y[1];
  		var tableobj = {tablename:'tbl_registration'};


  		
     
    	var class_id =req.query.class_id
	    var table = {tablename:'tbl_registration'};
        admin.findAll({table:'tbl_class'},function(err, result){
		    var class_list 	 = result;
			 	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/teacherattendencereport", message : req.flash('msg'),student_information :"",class_list:class_list,month:month,year:year,nextyear:nextyear};
	            res.render("admin_layout", pagedata);
		});
		
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/* Get Report of attendance for All student */
router.get("/getAdminTeacherAttendanceReport",function(req,res){

   if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		//var class_id 	      =  req.query.class_id
		//var section_id 	      =  req.query.section_id
		var month             =  req.query.month_id
		var session_year      =  req.session.session_year; 
		var year              =  req.query.year; 
		//var student_id        =  {};

     	 
	    var table = {tbl_attendance:'tbl_attendance',tbl_registration:'tbl_registration'};
	    admin.getteacherlist_by_attendence(table,{session_year:session_year,month:month,year:year,user_role:4},function(err, result){
	    	 
             
		   	var teacher_list = result;
			   teacher_list.forEach(function(item, index){
			 	 	  teacher_list[index].attendence=[];
			 	});
		  	 n=0;
		    async.each(teacher_list, function (item, done) {
			  	registration_id=item.registration_id;
	            var table  =  { tbl_attendance:'tbl_attendance',tbl_registration : 'tbl_registration',tablename:'tbl_attendance' };
	   	        admin.getAdminTeacherAttendence(table,{registration_id:registration_id,session_year:session_year,year:year,month:month,user_role:4},function(err, result1){
	   	        	 
	                   teacher_list[n].attendence =result1
			           n++
			           done(null);
			        });    
	             },function(){
		              //console.log('###############',student_list)
		              res.send({teacher_attendance : teacher_list})
		     
	         });        
         });	
 	}else{
       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});



/* ****************************** */

router.get("/academic_syllabus", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var tableobj  = {tablename:'tbl_academic_syllabus'}
		if(req.query.id)
	    {
            var findObj = {academic_syllabus_id:req.query.id}
            admin.findWhere(tableobj,findObj,function(err,result){
	            if(result){
	               var $data =JSON.parse(JSON.stringify(result[0])); 
	          		var table  = 'tbl_class';
					admin.findAll({table:table},function(err, result){
					  var class_list 	 = result;
					  console.log($data);
		              var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/academic_syllabus", success: req.flash('success'),error: req.flash('error'),academic_syllabusData:$data,academic_syllabus:'',class_list:class_list};
				      res.render("admin_layout", pagedata);
				    });
	            }
           	});
	    }
	    else{
			var table  = 'tbl_class';
			admin.findAll({table:table},function(err, result){
			    var class_list 	 = result;
			  
			    var tbl_academic_syllabus = {tablename :'tbl_academic_syllabus'}
		 
				 admin.findAcadmicSyllabus(tbl_academic_syllabus,function(err, result1){
				 	var academic_syllabus  = result1
				 	console.log(class_list);
				 	console.log(academic_syllabus);
					var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/academic_syllabus",success: req.flash('success'),error: req.flash('error'),academic_syllabusData:'',academic_syllabus:academic_syllabus,class_list:class_list};
					//var pagedata 	 	 = {Title : "", pagename : "admin/academic_syllabus", message : req.flash('msg'),academic_syllabus:academic_syllabus,class_list:class_list,academic_syllabusData:''};
					res.render("admin_layout", pagedata);
				});
				
			});
		}
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/addAcademicSyllabus", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
 	 
 	data={};
  	var class_id            = req.body.class_id;
  	var subject_id  		= req.body.subject_id;
  	var title        		= (req.body.title).trim();
  	var description    		= (req.body.descriptions).trim();
  	var moment 				= require('moment');
	var created_date 		= moment().format('YYYY-MM-DD:hh:mm:ss');
  	var file = req.files.file;
  	var image= '';

   
     if(title=='')
     {
    	 req.flash('error',"Title required to save");
    	res.redirect(res.locals.appName+'/admin/academic_syllabus') 	
     }
     else
     {
    	if(typeof file=="undefined"){
  			var image = '';
	  	}else{
		  	var newname = changename(file.name);
		  	var filepath = path.join('/',"public/syllabus/"+newname);
		  		file.mv(filepath, function(err){
					if(err){
						console.log(err);
						return;
					}
					else
					{
						
					}

				});

		    var image = newname
		    data['file_name']=image;
		}
	        data['class_id']=class_id
	    	data['subject_id']=subject_id
	    	data['title']=title
	    	data['description']=description
	    	data['year']=req.session.session_year
	  		var table   = {tablename:'tbl_academic_syllabus'};
	        if(req.body.academic_syllabus_id)
	        {
	        	console.log('Updated',data);

	            var where={academic_syllabus_id: req.body.academic_syllabus_id};
		  	    admin.updateWhere(table,where,data, function(err, result){
		           if(result)
		           {
		             res.redirect(res.locals.appName+'/admin/academic_syllabus') 	 
		           }
		        });
	        }
	        else
	        {
	           	
	          admin.insert_all(table,data,function(err, result){
	  			res.redirect(res.locals.appName+'/admin/academic_syllabus')
	  		  }); 
	        }
      }
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/academicSyllabus_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		
	    	var tbl_academic_syllabus = {tablename :'tbl_academic_syllabus'}
	 
			 admin.findAcadmicSyllabus(tbl_academic_syllabus,function(err, result1){
			 
			    var academic_syllabus 	 = result1;
				var pagedata 	 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/accademic_syllabus_list", message : req.flash('msg'),academic_syllabus:academic_syllabus};
				res.render("admin_layout", pagedata);
			});
	}else{
	      
		   website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});

router.get("/getStudentAttendence", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var class_id   			= req.query.class_id
		var section_id 			= req.query.section_id
		var attendence_date		= moment(req.query.attendence_date).format('YYYY-MM-DD');//req.query.attendence_date
		var session_year	    = req.session.session_year
       // console.log(req.query);

        var object = {};

	    	var table  		=  {tbl_attendance : 'tbl_attendance',tbl_enroll:'tbl_enroll',tbl_registration:'tbl_registration'}
        	var student_id  = ''; 
        	var n 			= 0;    
			admin.getStudent(table,{class_id:class_id,section_id:section_id,session_year:session_year},function(err, result){
						var student_id  = result;

						student_id.forEach(function(item, index){
							student_id[index].parent_phone="";
						 
						});
						async.each(student_id, function (item, done) {

						  	admin.getStudentAttendence(table,{class_id:class_id,section_id:section_id,attendence_date:attendence_date,student_id:item.registration_id,session_year:session_year},function(err, result1){
							   //if(result1.length>0)
							   {
							   	 //console.log('################',item.parent_id);
								  admin.findWhere({tablename:'tbl_registration'},{registration_id:(item.parent_id).toString()},function(err, result2){
										console.log('sas',result1)		
								  	if(result1==undefined || result1==''){
											 student_id[n].attendence='';
											 student_id[n].parent_phone=result2[0].phone;
								  	}else{
											 student_id[n].attendence=result1[0].status;
											 student_id[n].parent_phone=result2[0].phone;
								  	}
								    n++;
									
									done(null);	
								 });								   	
							   }	

                            
						 });
						  	

						}, function(){

					 	//console.log("###^^^^^^^^^^^^^^^^^^#",student_id)
						res.send(student_id)
					
						});

			});
		//	console.log(student_id)

			
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getTeacherAttendence", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		//var class_id   			= req.query.class_id
		//var section_id 			= req.query.section_id
        date= req.query.attendence_date.split('-');
		var attendence_date	=  date[2]+'-'+date[1]+'-'+date[0]
		//moment(req.query.attendence_date).format('YYYY-MM-DD');
		var session_year = req.session.session_year;
        var object = {};
    	var table  		= {tablename:'tbl_attendance'};
    	var teacher_id  = ''; 
    	var n 			= 0;   
        admin.findWhere({tablename:'tbl_registration'},{user_role:'4'},function(err, result){
        	//console.log('###############',result);
        	var teacher_id  = result;

        	async.each(teacher_id, function (item, done) {
			// 			var student_id  = result;
             admin.findWhere(table,{registration_id:item.registration_id.toString(),'user_role':'4',session_year:session_year,attendence_date:attendence_date},function(err,result1){
                 if(result1==undefined || result1=='')
                 {
					 teacher_id[n].attendence='';
			  	 }else{
			  		   teacher_id[n].attendence=result1[0].status;
			  	 }
			     n++;
			     
			     done(null);

	            //res.send(result)
             });
           },function(){
                 console.log('^^^^^^^^^^^^^^^^^^^^^^^^',teacher_id)
                 res.send(teacher_id)

           });
         });

			// admin.getTeacher(table,{class_id:class_id,section_id:section_id},function(err, result){
			// 			var student_id  = result;
						
			// 			async.each(student_id, function (item, done) {

			// 			 		//console.log(item.registration_id)
						 		
			// 			 		var tbl_attendence = {tablename : 'tbl_attendance'}

			// 					admin.getAttendence(tbl_attendence,{class_id:class_id,section_id:section_id,attendence_date:attendence_date,student_id:item.registration_id},function(err, result1){
			// 						console.log(result1)
			// 					  	if(result1==undefined || result1==''){
			// 					  		   student_id[n].attendence='';
			// 					  	}else{
			// 					  		   student_id[n].attendence=result1[0].status;
			// 					  	}
								  
			// 					    n++;
									
			// 					    done(null);
			// 					});
			// 			}, function(){

			// 			//console.log(student_id)
			// 			res.send(student_id)
					
			// 			});

			// });
		//	console.log(student_id)

			
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/attendence", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var type 				= req.body.attendence;
        var session_year	= req.session.session_year

        // console.log(req.body);
        // return false;

		if(type=='student'){

			var class_id  			= req.body.class_id;
			var section_id 			= req.body.section_id;
			//var attendence_date		= moment(req.body.attendence_date).format('YYYY-MM-');

			date= (req.body.attendence_date).split('-');
			attendence_date= date[2]+'-'+date[1]+'-'+date[0];
 			var student_id			= req.body.student_id;
			var status				= req.body.status;
			var session_year	    = req.session.session_year;
			var check               = Array.isArray(student_id);
			var parent_id           = req.body.parent_id;
			var student_name        = req.body.studentname;
			var class_name          = req.body.class_name;
			var section_name        = req.body.section_name;



			  
			if(check==false){
				var data = {
						class_id 		: class_id,
						section_id		: section_id,
						attendence_date	: attendence_date,
						registration_id : parseInt(student_id),
						status		    : status,
						created_date 	: moment().format('YYYY-MM-DD:hh:mm:ss'),
						session_year	: req.session.session_year,
						user_role		: 3
					}


					var table   = {tbl_attendance:'tbl_attendance',tbl_enroll : 'tbl_enroll',tablename:'tbl_attendance'};
		  			admin.getStudentAttendence(table,{class_id:class_id,section_id:section_id,attendence_date:attendence_date,student_id:student_id,session_year:session_year},function(err, result1){
		  				   //console.log('abcbdsdd>>>>>>>>>>>>>>>>>.',result1);
		  				 // return false;
		  				if(result1=='' || result1==undefined){
		  					
		  				}else{
		  					var id = result1[0].attendance_id
		  					var findObj = {};
				            findObj['attendance_id'] = id;
				            admin.deletewhere(table,findObj,function(err,result){
	                        });
		  				}
		  			});
		  			 
		  			admin.insert_all(table,data,function(err, result){

						if(parseInt(status)==2)
						{
						   admin.findWhere({tablename:'tbl_registration'},{registration_id:parent_id},function(err,resultparent){
							   message="Dear Parent, Your child "+student_name+" "+ class_name+ "("+ section_name+") section is absent today."
							   mobileNo= resultparent[0].phone;
							   var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
							   msg91.send(mobileNo, message, function(err, response){
								 req.flash('success',"message sent successfully");
							   });

						   });
						}
			  			
			  		});
			}else{
				 var  n=0;
                 var flag= false;
				async.forEachOf(student_id,function(item,key,callback){

					var parent_id           = req.body.parent_id;
					var student_name        = req.body.studentname;
					var class_name          = req.body.class_name;
					var section_name        = req.body.section_name;

                    //console.log('dddddddddddddddd',key); 
                    registration_id=parseInt(student_id[key])
					var data = {
						class_id 		: class_id,
						section_id		: section_id,
						attendence_date	: attendence_date,
						registration_id : registration_id,//parseInt(student_id[key]),
						status		    : parseInt(status[key]),
						created_date 	: moment().format('YYYY-MM-DD:hh:mm:ss'),
						session_year	: req.session.session_year,
						user_role		: 3
					}
					var table   = {tbl_attendance:'tbl_attendance',tbl_enroll : 'tbl_enroll',tablename:'tbl_attendance'};
		  			admin.getStudentAttendence(table,{class_id:class_id,section_id:section_id,attendence_date:attendence_date,student_id:registration_id,session_year:session_year},function(err, result1){
		  				if(result1=='' || result1==undefined){
		  					
		  				}else{
		  					var id = result1[0].attendance_id
		  					var findObj = {};
				            findObj['attendance_id'] = id;
				            admin.deletewhere(table,findObj,function(err,result){

	                        });
		  				}
					});
 
 					admin.insert_all(table,data,function(err, result){

						   admin.findWhere({tablename:'tbl_registration'},{registration_id:(parent_id[key]).toString()},function(err,resultparent){

						   	//return false;
							 admin.findWhere({tablename:'tbl_class'},{class_id:class_id.toString()},function(err,resultclass){
							    //console.log('resultclass55555555555',resultclass);
							    class_name=resultclass[0].class_abbreviations
							    message="Dear Parent, Your child "+student_name[key]+" "+ class_name+ " class ("+ section_name[key]+") section is absent today."
							    // console.log('<<message>>',message);
							    // console.log('@@@@@@@',);
							    mobileNo= resultparent[0].phone;
                                //console.log('++++++',mobileNo);
							    //console.log('--mobileNo--',mobileNo);
                                if(parseInt(status[key])==2)
					          	{
					          	 var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);	
							     msg91.send(mobileNo, message, function(err, response){
							    	flag=true;
								 //req.flash('success',"message sent successfully");
							     }); 
							    }
							    n++;
                             }); 
						  });
			  		});
 
              callback();
				},function(){
                  console.log('flag',flag);
                  if(flag==true)
                  {
                  	req.flash('success',"message sent successfully");
                  	req.redirect(res.locals.appName+'/admin/attendence')

                  }
 
				});
			}
		}else{
			var teacher_id  		= req.body.teacher_id;
			var status 				= req.body.teacher_status;

			if(req.body.teacherattendence_date)
			{
				date= (req.body.teacherattendence_date).split('-');
			    attendence_date= date[2]+'-'+date[1]+'-'+date[0];
			}
			else
			{
				attendence_date= moment().format('YYYY-MM-DD');
			}

			
 			var check  = Array.isArray(teacher_id);
			 
			if(check==false){
					var data = {
						
						attendence_date	: attendence_date,
						registration_id : teacher_id,
						status		    : status,
						created_date 	: moment().format('YYYY-MM-DD:hh:mm:ss'),
						session_year	: req.session.session_year,
						user_role		: 4
					}

					var table   = {tablename:'tbl_attendance'};
					
		  			admin.getTeacherAttendence(table,{attendence_date:attendence_date,registration_id:teacher_id,session_year:session_year},function(err, result1){
		  				if(result1!='')
		  				{
		  					var id = result1[0].attendance_id
		  					var findObj = {};
				         	findObj['attendance_id'] = id;
						    admin.deletewhere(table,findObj,function(err,result){

						    });
		  				}
		  			});
		  			admin.insert_all(table,data,function(err, result){
			  			
			  		});
			}else{
				 //  console.log(teacher_id);
				 // console.log( status);
				 // return false;
				for(var k in teacher_id)
				{
					var data = {
						attendence_date	: attendence_date,
						registration_id : teacher_id[k],
						status		    : status[k],
						created_date 	: moment().format('YYYY-MM-DD:hh:mm:ss'),
						session_year	: req.session.session_year,
						user_role		: 4
					}

					var table   = {tablename:'tbl_attendance'};
		  			admin.getTeacherAttendence(table,{attendence_date:attendence_date,registration_id:teacher_id[k],session_year:session_year},function(err, result1){
		  				 
		  				if(result1!=''){
		  					
		  					var id = result1[0].attendance_id
		  					var findObj = {};
				           console.log('id',id);
				         	findObj['attendance_id'] = id;
				
						     admin.deletewhere(table,findObj,function(err,result){

						     });
		  				}
		  			});
		  			 console.log('every data',data)
		  			admin.insert_all(table,data,function(err, result){
			  			
			  		});
			  		
				}
			}
		
		}	
		req.flash('success','Attendence done')
	    res.redirect(res.locals.appName+'/admin/attendence')
		//console.log(req.body)

			
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/study_material", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

         if(req.query.id)
         {
    		var table = {tbl_document : 'tbl_document',tbl_subject:'tbl_subject'}
 			admin.getstudymaterialDetail(table,{document_id: req.query.id},function(err, result){
                 documentdata     = result[0];
                var table  = 'tbl_class';
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
				   
                     var table = {tablename :'tbl_subject'}
                     where1 ={class_id:result[0].class_id.toString()}
				     admin.findWhere(table,where1,function(err, result1){
                          subject_list =result1;
                        var tbl_document = {tablename :'tbl_document'}
						 admin.findStudyMaterial(tbl_document,function(err, result){
						 

						    var document_list 	 = result;
							var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/study_material", success: req.flash('success'),error: req.flash('error'),document_list:document_list,class_list:class_list,subject_list:subject_list,documentdata:documentdata};
							res.render("admin_layout", pagedata);
						});
				   });	
				});
         
			});
         }
         else
         {
         	    var table  = 'tbl_class';
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
				    var tbl_document = {tablename :'tbl_document'}
					 admin.findStudyMaterial(tbl_document,function(err, result){
					 
					    var document_list 	 = result;
						var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/study_material", success: req.flash('success'),error: req.flash('error'),document_list:document_list,class_list:class_list,subject_list:'',documentdata:''};
						res.render("admin_layout", pagedata);
					});
					
				});
         }


    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});



router.post("/study_material", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
  	var class_id            = req.body.class_id;
  	var subject_id  		= req.body.subject_id;
  	var title        		= (req.body.title).trim();
  	var description    		= req.body.descriptions;
  	var moment = require('moment');
	var created_date = moment().format('YYYY-MM-DD:hh:mm:ss');
  	
  	var file = req.files.file;

  	if(title=='')
  	{

  		req.flash('error',"Title is required to save");
  		res.redirect(res.locals.appName+"/admin/study_material")
  	}
  
  	var image= '';
  	if(typeof file=="undefined"){

  			var image = '';
  	}else{
	  	var newname = changename(file.name);
	  	var filepath = path.join('/',"public/study_material/"+newname);

	  		file.mv(filepath, function(err){
				if(err){
					console.log(err);
					return;
				}
			});

	    var image = newname
	}
		if(file)
		{
		  data = {
  		 	class_id 			: class_id,
  		 	subject_id 			: subject_id,
  			title       		: title,
  			description    		: description,
  			file_name     	    : image,
  			created_date	    : created_date
  		   }	
		}else{
			data = {
	  		 	class_id 			: class_id,
	  		 	subject_id 			: subject_id,
	  			title       		: title,
	  			description    		: description,
	  			created_date	    : created_date
    		   }
		}

  		var table   = {tablename:'tbl_document'};
  		if(req.body.document_id)
  		{
          var where= { document_id:req.body.document_id }
          admin.updateWhere(table,where,data, function(err, result){
            req.flash('success',"Record updated successfully");
          	res.redirect(res.locals.appName+'/admin/study_material')

          });
  		}
  		else
  		{
      		admin.insert_all(table,data,function(err, result){
      		  req.flash('success',"Study material assigned successfully");
  	   	   	  res.redirect(res.locals.appName+'/admin/study_material')
      		});

  		}
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


router.get("/Studymaterial_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		 if(req.query.id)
         {
    		var table = {tbl_document : 'tbl_document',tbl_subject:'tbl_subject'}
 			admin.getstudymaterialDetail(table,{document_id: req.query.id},function(err, result){
                 documentdata     = result[0];
                var table  = 'tbl_class';
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
				    var tbl_document = {tablename :'tbl_document'}
					 admin.findStudyMaterial(tbl_document,function(err, result){
					 //console.log('ssssssssssssss',documentdata)
					    var document_list 	 = result;
						var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/study_material", success: req.flash('success'),error: req.flash('error'),document_list:document_list,class_list:class_list,documentdata:documentdata};
						res.render("admin_layout", pagedata);
					});
					
				});
         
			});
         }
         else
         {
         	var tbl_document = {tablename :'tbl_document'}
	 
			 admin.findStudyMaterial(tbl_document,function(err, result){
			 
			    var document_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/study_material_list", success: req.flash('success'),error: req.flash('error'),document_list:document_list};
				res.render("admin_layout", pagedata);
			});
         }
		
	    	
	}else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});



router.post("/classRoutine", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
    	var class_id            = req.body.class_id;
    	var section_id          = req.body.section_id;
     	var subject_id  		= req.body.subject_id;
     	var teacher_id			= req.body.teacher_id;
     	var day 			 	= req.body.day;
     	var time_start			= req.body.time_start;
     	var time_start_min		= req.body.time_start_min;
     	var starting_ampm		= req.body.starting_ampm;
     	var time_end			= req.body.time_end;
     	var time_end_min		= req.body.time_end_min;
     	var end_ampm			= req.body.end_ampm;
     	var created_date 		= moment().format('YYYY-MM-DD:hh:mm:ss');
 
        postdatas=[];
        rejecteddata=[];


         if( teacher_id!='' )
         {
         	 
         	if(Array.isArray(subject_id))
	         {
	             for(var k in subject_id)
		     	{
		     		 
		     		if(teacher_id[k]!='')
		     		{
		     		   var data  = {
		     			class_id 		: class_id,
		     			section_id		: section_id,
		     			subject_id  	: subject_id[k],
		     			registration_id : teacher_id[k],
		     			day				: day,
		     			time_start  	: time_start[k],
		     			time_start_min	: time_start_min[k],
		     		    starting_ampm	: starting_ampm[k],
		     			time_end 		: time_end[k],
		     			time_end_min	: time_end_min[k],
		     			end_ampm		: end_ampm[k],
		     			session_year	: req.session.session_year,
		     			created_date	: created_date
		     		  }	
		     		  postdatas.push(data); 
		     		}
		     	} 
	         }
	         else
	         {
	                var data  = {
		     			class_id 		: class_id,
		     			section_id		: section_id,
		     			subject_id  	: subject_id,
		     			registration_id : teacher_id,
		     			day				: day,
		     			time_start  	: time_start,
		     			time_start_min	: time_start_min,
		     		    starting_ampm	: starting_ampm,
		     			time_end 		: time_end,
		     			time_end_min	: time_end_min,
		     			end_ampm		: end_ampm,
		     			session_year	: req.session.session_year,
		     			created_date	: created_date
		     		  }	
		     		  postdatas.push(data); 
	         }

       
     	
     	 async.eachSeries(postdatas,function(postdata,done){

           session_year =req.session.session_year

          var table  = {tablename:'tbl_class_routine'};

            //where1= {registration_id:postdata.registration_id,time_start:postdata.time_start,time_start_min:postdata.time_start_min,starting_ampm:postdata.starting_ampm,time_end:postdata.time_end,time_end_min:postdata.time_end_min,end_ampm:postdata.end_ampm,session_year:session_year}
            where1= {registration_id:postdata.registration_id,day:postdata.day,class_id:postdata.class_id,section_id:postdata.section_id,subject_id:postdata.subject_id,session_year:postdata.session_year};//  time_start:postdata.time_start,time_start_min:postdata.time_start_min,starting_ampm:postdata.starting_ampm,time_end:postdata.time_end,time_end_min:postdata.time_end_min,end_ampm:postdata.end_ampm,session_year:session_year}
        
		          admin.findWhere(table,where1,function(err, result1){
		          	   if(result1.length>0)
		          	   {
                          //console.log('classroutine',result1);
                          findObj={'class_routine_id':result1[0].class_routine_id }
						   admin.deletewhere(table,findObj,function(err,result){
                               
                               admin.insert_all(table,postdata,function(err, result){
		                          //req.flash('msg','Teacher Assigned Successfully');
		                           done(null);
		          	   	         }); 

						   });


		          	   	  /*
		                  where2= {registration_id:postdata.registration_id,time_start:postdata.time_start,time_start_min:postdata.time_start_min,starting_ampm:postdata.starting_ampm,time_end:postdata.time_end,time_end_min:postdata.time_end_min,end_ampm:postdata.end_ampm,session_year:session_year}

		                  admin.findWhere(table,where2,function(err, result2){ 
		                    
		                      if(result2.length>0)
		                      {

		                      	where0= {registration_id:postdata.registration_id,class_id:postdata.class_id,section_id:postdata.section_id,time_start:postdata.time_start,time_start_min:postdata.time_start_min,starting_ampm:postdata.starting_ampm,time_end:postdata.time_end,time_end_min:postdata.time_end_min,end_ampm:postdata.end_ampm,session_year:session_year}

				                     admin.findWhere(table,where0,function(err, result0){
				                     	 
				                      		if(result0.length==0)
				                      		{
					                      	    rejecteddata.push(postdata);
					                      	    //req.flash('msg','Teacher Already Assigned');
				                      		}
                                        
				                        done(null);

				                     });
		                      }
		                      else
		                      {
		                      	admin.insert_all(table,postdata,function(err, result){
		                          //req.flash('msg','Teacher Assigned Successfully');
		                           done(null);
		          	   	         });  

		                      }

		                     

		                  }); */
		          	   }
		          	   else
		          	   {
		          	   	   admin.insert_all(table,postdata,function(err, result){
		          	   	   	//req.flash('msg','Teacher Assigned Successfully');
		                        done(null);
		          	   	   });
		          	   }
                   
		          });	
         
        }, 
          function(){
		     	var table  = 'tbl_class';
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
				     rejecteddata="";
				    //if(rejecteddata.length==0)
                 	 //  req.flash('msg','Teacher Assigned Successfully');

                 	//if(rejecteddata.length!=0) 
                 	//   req.flash('msg','Teacher Already Assigned');
                    req.flash('success',"Class Routine assigned successfully");  

					var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classRoutine", success: req.flash('success'),error: req.flash('error'),class_list:class_list,rejected_list:rejecteddata};
					res.render("admin_layout", pagedata);
					
				});	  
        });
     }
     else
     {
     	 req.flash('error',"No tecaher selected");
     	 res.redirect(res.locals.appName+"/admin/classRoutine")
     }
     
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


/* 
** Copy Class Routine  from one week day to all 
*/

router.get("/classRoutineClone", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

    var day = [ 'monday', 'tuesday','wednesday','thursday','friday','saturday'];
		var class_routine_id  = req.query.class_routine_id.toString();
		var tbl_obj  = {tablename:'tbl_class_routine'};
		
		admin.findWhere(tbl_obj,{class_routine_id:class_routine_id},function(err, result)
		{
			
            daydata = JSON.parse( JSON.stringify(result[0]));

            console.log(result[0]);
            d = result[0].day;
            var n = day.indexOf(d);
            postdatas = [];
            async.each(day,function(item,done){
                
                var postdata  = {

	     			class_id 		: daydata.class_id,
	     			section_id		: daydata.section_id,
	     			subject_id  	: daydata.subject_id,
	     			registration_id : daydata.registration_id,
	     			day             : item,
	     			time_start  	: daydata.time_start,
	     			time_start_min	: daydata.time_start_min,
	     		    starting_ampm	: daydata.starting_ampm,
	     			time_end 		: daydata.time_end,
	     			time_end_min	: daydata.time_end_min,
	     			end_ampm		: daydata.end_ampm,
	     			session_year	: req.session.session_year,
	     			created_date	: moment().format('YYYY-MM-DD:hh:mm:ss')

                 }

                 var table  = {tablename:'tbl_class_routine'};

                 where1= {class_id:postdata.class_id.toString(), section_id:postdata.section_id.toString(),subject_id:postdata.subject_id.toString(),day:postdata.day.toString(), registration_id:postdata.registration_id.toString(),time_start:postdata.time_start.toString(),time_start_min:postdata.time_start_min.toString(),starting_ampm:postdata.starting_ampm.toString(),time_end:postdata.time_end.toString(),time_end_min:postdata.time_end_min.toString(),end_ampm:postdata.end_ampm.toString(),session_year:postdata.session_year}
                 flag=1;
		          admin.findWhere(table,where1,function(err, result1){
		          	   if(result1.length==0)
		          	   {
		          	   	   admin.insert_all(table,postdata,function(err, result){
		                          //req.flash('msg','Teacher Assigned Successfully');
		                           //done(null);
		          	   	   });
		          	   }
		          });
               n++;
            done(null);
		},function(){
				var table  = 'tbl_class';
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
				    rejecteddata="";
                    req.flash('msg','Teacher Assigned Successfully');                    
					var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classRoutine", success: req.flash('success'),error: req.flash('error'),class_list:class_list,rejected_list:rejecteddata};
					res.render("admin_layout", pagedata);
				});
		  });
      });      

     
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

 
router.get("/classroutineList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
						var table  = 'tbl_class';
	
						admin.findAll({table:table},function(err, result){
						    var class_list 	 = result;
 
						var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classRoutineList", message : req.flash('msg'),class_list:class_list,class_routine:''};
 
						res.render("admin_layout", pagedata);
					});
			
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/classroutineList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id   = req.body.class_id;
		var section_id = req.body.section_id;
			var day = [ 'sunday', 'monday', 'tuesday','wednesday','thursday','friday','saturday'];
			//console.log(arr3);
				var abc  = [];
				var n = 0;
				async.each(day, function (item, done) {

						 		
						 		//console.log(subject_id)
						 		var class_routine = {tablename : 'tbl_class_routine'}

								admin.findClassRoutine(class_routine,{class_id:class_id,section_id:section_id,day:item},function(err, result1){
									//console.log(result1);
								    var class_routine  = Object.values(JSON.parse(JSON.stringify(result1)))
								  //ddd  console.log(class_routine)
								    //class_routine.push(class_routine)
								   // console.log("#####",teacher_list);
								   // if(class_routine!=''){
								    abc[n]=class_routine;
								      n++;
									//}
								    done(null);
								  

								 
								});
						}, function(){

						 var class_routine = abc
  
						var table  = 'tbl_class';
	
						admin.findAll({table:table},function(err, result){
						    var class_list 	 = result;
						var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/classRoutineList", message : req.flash('msg'),class_routine:class_routine,class_list:class_list};
						res.render("admin_layout", pagedata);
						});
			
						// res.send({class_routine:class_routine});
						});
			
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/exam", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';

		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
		    var exam_table   = 'tbl_exam_master';
		    
		    admin.findExam({table:exam_table},function(err, exam_list){
		    	 var exam_list    = exam_list

 
                 		        
		    	if(req.query.exam_id != undefined)
		    	{
                    admin.findexamDetail({table:exam_table},{exam_id:req.query.exam_id},function(err, exam_data){
                    	
                    	if(exam_data!= undefined){
                       		var examdata 	 = exam_data[0];
                       	}else{
                       		var examdata 	 = '';
                       	}
							var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam",success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:exam_list,examdata:examdata};
							res.render("admin_layout", pagedata);
						
                    });
		    	}
		    	else
		    	{
			    	var exam_list    = exam_list
					var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam",success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:exam_list,examdata:""};
					res.render("admin_layout", pagedata);
		    	}
			});
		});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/exam", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
		var class_id 	  = req.body.class;
		var exam_code	  = req.body.exam_code;
		var name 		  = req.body.name;

		if(req.body.othername!="")
			var name 		  = req.body.othername;
 
		var created_date  = moment().format('YYYY-MM-DD:hh:mm:ss');
		
		var table = {tablename : 'tbl_exam_master'}
		var data  = {
			class_id   		: class_id,
			exam_code 		: exam_code,
			exam_name  		: name,
			session_year	: req.session.session_year,
			created_date	: created_date
	   }

       if(class_id==""||name=="")
       {
       	   req.flash('error',"Exam detail required");
           res.redirect(res.locals.appName+'/admin/exam');
       }


        if(req.body.exam_id != undefined || req.body.exam_id != '' || req.body.exam_id!=null ) 
        {
        
          var tbl_exammaster  = {tablename:'tbl_exam_master'};
		  admin.findWhere(tbl_exammaster,{class_id:class_id,exam_name:name},function(err, result){
		    if(result.length>0)
		    {
               
                 req.flash('error',"Exam detail already exist");
                 res.redirect(res.locals.appName+'/admin/exam');

		    }
		    else
		    {

		    	admin.insert_all(table,data,function(err, result){
	
					var table  = 'tbl_class';
					admin.findAll({table:table},function(err, result){
					    var class_list 	 = result;
					    var exam_table   = 'tbl_exam_master';
					    
					    admin.findExam({table:exam_table},function(err, exam_list){
					    	req.flash('success',"Exam detail added successfully");

					    	var exam_list    = exam_list
							var pagedata 	 = {Title : "",appName :res.locals.appName,appName :res.locals.appName, pagename : "admin/exam", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:exam_list,examdata:""};
							res.render("admin_layout", pagedata);
						});
					});
				});

		    }

	       }); 
        	
        }
        else
        {

		  var where= { exam_id:req.body.exam_id }
          admin.updateWhere(table,where,data, function(err, result){

          	    var table  = 'tbl_class';
				admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
				    var exam_table   = 'tbl_exam_master';
				    
				    admin.findExam({table:exam_table},function(err, exam_list){
				    	 req.flash('success',"Exam detail updated successfully");
				    	var exam_list    = exam_list
						var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:exam_list,examdata:""};
						res.render("admin_layout", pagedata);
					});
				});
          });


        }
		//console.log(req.body)
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});



router.get("/exam_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var exam_table   = 'tbl_exam_master';
		    
	    admin.findExam({table:exam_table},function(err, exam_list){
	    	
	    	var exam_list    = exam_list
			var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam_list", message : req.flash('msg'),exam_list:exam_list};
			res.render("admin_layout", pagedata);
		});
			
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login', appName :res.locals.appName,pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
		
	}
});
/* 
** ----- Marksheet Formats ----- 
*/
router.get("/sheet_Formats", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
        var sheetformat="";
		var columns=""
		var columnarray=[]
		var othercolumnarray=[]
		var session_year= req.session.session_year;

		//else
		{
          
           admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
		    var table   = {tbl_sheet_formats:'tbl_sheet_formats',tbl_exam_master:'tbl_exam_master',tbl_class:'tbl_class'};
			//console.log(class_list);
			admin.getMarksheetFormatList(table,function(err, formate_list){

				 //console.log(formate_list); 
  	    	     var formate_list    = formate_list
                
                    if(req.query.id)
					{
						 id = req.query.id.toString();
			       
			             admin.findWhere({tablename:'tbl_sheet_formats'},{id:id},function(err, result1){
			               if(result1.length>0)
			               {
			                  sheetformat= result1[0];
			                  columns = JSON.parse(result1[0].dynamic_column);
			                  otheractivity = JSON.parse(result1[0].otheracivity);
			                  Object.keys(columns).forEach(function(key) {
							    columnarray.push(key.replace(/_/gi," "));
							  })
							  Object.keys(otheractivity).forEach(function(key) {
							  	
							  	var value  = key.replace(/_/gi," ");
					            var value  = value.replace('-',"&");
					            var value  = value.replace('percentage',"%");
					            //var value  = value.replace('_',".");
					            //var value  = value.replace(',',"_");
					            //var value  = value.replace(':',"_");
							    othercolumnarray.push(value);
							  })

                            //console.log(columnarray)
                            //console.log(othercolumnarray)
                            class_id = result1[0].class_id;
                             admin.findWhere({tablename:'tbl_exam_master'},{session_year:session_year,class_id:class_id},function
                             	(err, examresult){

                              exam_list= examresult;
				 			  var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/sheet_formats", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:exam_list,formate_list:formate_list,sheetformat:sheetformat,columns:columnarray,othercolumn:othercolumnarray};
				 			  res.render("admin_layout", pagedata);
                             }); 
			               }
			             });          
					}
					else
					{
                        console.log(sheetformat);
				 		var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/sheet_formats", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:"",formate_list:formate_list,sheetformat:sheetformat,columns:columnarray,othercolumn:""};
				 	    res.render("admin_layout", pagedata);
					}
			 });
		   });
		}

    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}

});

router.post("/sheet_Formats", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){


        var columns=[];

		var class_id 	   = req.body.class;
		var exam_id 	   = req.body.exam_id;
        var columns        = req.body.column;
        var activity_column= req.body.activity_column;
	    var jsonData = {};
 	     if(Array.isArray(columns))
	     {
	     	for(var k in columns)
	         {
	         	//console.log(columns[k]);
	         	if(columns[k].trim() !='')
	         	{
	         	   var value  = columns[k].replace(/ /g,"_");
		           var value  = value.replace('&',"-");
		           var value  = value.replace('%',"percentage");
		           var value  = value.replace('.',"_");
		           var value  = value.replace(',',"_");
		           var value  = value.replace(':',"_");
		           jsonData[value] = 0;//columns[k];	
	         	}
	         }


	     }
	     else
	     {
	     	 if(columns!=undefined || columns!='')
	     	  {
                if(columns.trim() !='')
                {
                  var  value = columns.replace(/ /g,"_");
		          var value = value.replace('&',"-");
		          var value = value.replace('%',"percentage");
		          var value  = value.replace('.',"_");
		          var value  = value.replace(',',"_");
		          var value  = value.replace(':',"_");
               	  jsonData[value]=0;	
                }	
	     	  } 
	     }

	     var jsonOtherData = {};
	     if(Array.isArray(activity_column))
	     {
	     	for(var j in activity_column)
	         {
	         	if(activity_column[j].trim() !="")
                {

                  
	         	   var value =activity_column[j].replace(/ /g,"_");
	         	   var value =value.replace('&',"-");
	         	   var value =value.replace('%',"percentage");
	         	  jsonOtherData[value] = 0;//columns[k]; 
	         	}
	         }
	     }
	     else
	     {
	         if(activity_column .trim() !='')
	     	  {
	     	  	 var value =activity_column.replace(/ /g,"_");
	         	 var value =value.replace('&',"-");
	         	 var value =value.replace('%',"percentage");
	     	  	jsonOtherData[value]=0;
	     	  } 	

	     }
	   var table = {tablename : 'tbl_sheet_formats'}
       if(checkempty(jsonData))
        {
           req.flash('error',"Please add column in sheet");
           res.redirect(res.locals.appName+'/admin/sheet_Formats');
        }
        else
        {
       	 admin.findWhere(table,{class_id:class_id,exam_id:exam_id},function(err, result){

            if(req.body.id)
            {
            	id=req.body.id;
               if(result.length>0)
               {
               	  where  = { id:id }
               	  var data = {
							class_id   		: class_id,
							//section_id 		: section_id,
							exam_id  		: exam_id,
							dynamic_column  : JSON.stringify(jsonData),
							otheracivity :  JSON.stringify(jsonOtherData) ,
			   		     }
			    	     

               	  admin.updateWhere({tablename:'tbl_sheet_formats'},where,data, function(err, result){
					      req.flash('success',"Sheet updated successfully");
					      res.redirect(res.locals.appName+'/admin/sheet_Formats');
 			      });

               }
            }
            else
            {
                if(result.length>0)
				{
	     			 req.flash('error',"Sheet formate Already exist");
					      res.redirect(res.locals.appName+'/admin/sheet_Formats');
				}
				else
				{
					var data  = {
						class_id   		: class_id,
						exam_id  		: exam_id,
						dynamic_column  :  JSON.stringify(jsonData),
						otheracivity :  JSON.stringify(jsonOtherData) ,
   		         	}
					 
	              admin.insert_all(table,data,function(err, result){
					var table  = 'tbl_class';
			
					  admin.findAll({table:table},function(err, result){
					     var class_list 	 = result;
					     var table   = {tbl_sheet_formats:'tbl_sheet_formats',tbl_exam_master:'tbl_exam_master',tbl_class:'tbl_class'};

					      req.flash('success',"Sheet coulmn added successfully");
					      res.redirect(res.locals.appName+'/admin/sheet_Formats');
				   	 });
				  });
				 }
             }
          });
        }
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
router.get("/exam_schedule", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

         	var table  = 'tbl_class';

			admin.findAll({table:table},function(err, result){
			    var class_list 	 		= result;
			    var tbl_exam_schedule   = 'tbl_exam_schedule';
			    
			    admin.findExamSchedule({table:tbl_exam_schedule},function(err, exam_schedule){

			    	var exam_schedule    = exam_schedule

			    	 if(req.query.scheduledid)
			    	 {
			    	 	id=req.query.scheduledid
			    	 	admin.findWhere({tablename:'tbl_exam_schedule'},{id:id},function(err, result)
			    	 	{
			    	 		 
					       admin.findWhere({tablename:'tbl_section'},{class_id:result[0].class_id.toString()},function(err, resultsection){
					       	    section_list= resultsection;
					       	    
					       	admin.findWhere({tablename:'tbl_subject'},{class_id:result[0].class_id.toString()},function(err, resultsubject){
					       	    subject_list= resultsubject;
					       	    
					       	  admin.findWhere({tablename:'tbl_exam_master'},{class_id:result[0].class_id.toString()},function(err, resultexam){
					       	  	 exam_list= resultexam;
					       	     //console.log(resultexam);   
						 		var scheduledata  = result[0];
						 		 //console.log(scheduledata);
						 		var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam_schedule", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_schedule:exam_schedule,scheduledata:scheduledata,section_list:section_list,subject_list:subject_list,exam_list:exam_list};
						       res.render("admin_layout", pagedata);
						      });  
						     });   
						    });   

					 	});	
			    	 }
			    	 else
			    	 {
			    	 	var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam_schedule", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_schedule:exam_schedule,scheduledata:"",section_list:"",subject_list:"",exam_list:""};
					    res.render("admin_layout", pagedata);
			    	 }
					
				});
			});
         

		
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/exam_schedule", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	  = req.body.class_id;
		var section_id	  = req.body.exam_section_id;
		var subject_id	  = req.body.subject_id;
		var exam_id		  = req.body.exam_id;
		var date 		  = req.body.date;
		var total_marks   = (req.body.total_marks).trim();
		var session_year  = req.session.session_year;
		
		var table = {tablename : 'tbl_exam_schedule'}
		var data  = {
			class_id   		: class_id,
			section_id 		: section_id,
			subject_id  	: subject_id,
			exam_id			: exam_id,
			totalmarks		: total_marks.trim(),
			session_year	: req.session.session_year,
			date			: date
		}


		if(total_marks==""||class_id==""||section_id==""||exam_id==""||date=="")
		{
			req.flash('error',"Marks required to save");
			res.redirect(res.locals.appName+'/admin/exam_schedule');
		}
		else
		{
			if(req.body.scheduleid)
			{
              
             var table   = {tablename:'tbl_exam_schedule'};
		  	 var where= { id:req.body.scheduleid }
	  	  	 admin.updateWhere(table,where,data, function(err, result){
                  req.flash('success',"Exam schedule updated successfully");
                  res.redirect(res.locals.appName+'/admin/exam_schedule');

			 });

			}
			else
			{

			 var table = {tablename:'tbl_exam_schedule'};

			 admin.findWhere(table,{class_id:class_id,section_id:section_id,subject_id:subject_id,exam_id:exam_id,session_year:session_year},function(err, result)
			 {
               if(result.length>0)
               {
               	  scheduleid =result[0].id
               	 req.flash('error',"Exam already scheduled");
               	 res.redirect(res.locals.appName+"/admin/exam_schedule/?scheduledid="+scheduleid);
               }
               else
               {
	               	admin.insert_all(table,data,function(err, result){
						var table  = 'tbl_class';
				
						admin.findAll({table:table},function(err, result){
						    var class_list 	 		= result;
						    var tbl_exam_schedule   = 'tbl_exam_schedule';
						    
						    admin.findExamSchedule({table:tbl_exam_schedule},function(err, exam_schedule){
						    	req.flash('success',"Exam schedule added successfully");
						    	var exam_schedule    = exam_schedule
								var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/exam_schedule", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_schedule:exam_schedule,scheduledata:"",section_list:"",subject_list:"",exam_list:""};
								res.render("admin_layout", pagedata);
							});
						 });
					    });
               }	

				  
			  });
			}

			

		}


		
		//console.log(req.body)
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/exam_schedule_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
			  var tbl_exam_schedule   = 'tbl_exam_schedule';
			    
			    admin.findExamSchedule({table:tbl_exam_schedule},function(err, exam_schedule){
			    	
			    	var exam_schedule    = exam_schedule
					var pagedata 	 = {Title : "", pagename : "admin/exam_schedule_list", message : req.flash('msg'),exam_schedule:exam_schedule};
					res.render("admin_layout", pagedata);
				});
			
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/exam_grades", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table_grades = 'tbl_exam_grades';
		 var exam_table   = 'tbl_exam_master';

		 var tbl_class  = 'tbl_class';
	
		admin.findAll({table:tbl_class},function(err, class_list){
           var class_list = class_list;		    
		  admin.findExam({table:exam_table},function(err, exam_list){
            var exam_list    = exam_list
			var session_year=req.session.session_year;
			admin.findGradeExamList({tbl_grades:"tbl_grades",tbl_class:"tbl_class",tbl_section:"tbl_section",tbl_exam_grades:"tbl_exam_grades",tbl_exam_master:"tbl_exam_master"},{session_year:session_year},function(err, result){
				  var exam_grades   = result;

                  if(req.query.grade_id)
                  {
                     grade_id = req.query.grade_id;

                     admin.findGradeExamDetail({tbl_grades:"tbl_grades",tbl_class:"tbl_class",tbl_section:"tbl_section",tbl_exam_grades:"tbl_exam_grades",tbl_exam_master:"tbl_exam_master"},{grade_id:grade_id,session_year:session_year},function(err, result){
                       var gradedata= result[0];
                       //console.log(result);
                       var pagedata 	  = {Title : "",appName :res.locals.appName, pagename : "admin/exam_grades", success: req.flash('success'),error: req.flash('error'),exam_grades:exam_grades,exam_list:exam_list,class_list:class_list,gradedata:gradedata};
				       res.render("admin_layout", pagedata);       

                     });
                  }
                  else
                  {
                  	
				    var pagedata 	  = {Title : "",appName :res.locals.appName, pagename : "admin/exam_grades",success: req.flash('success'),error: req.flash('error'),exam_grades:exam_grades,exam_list:exam_list,class_list:class_list,gradedata:""};
					res.render("admin_layout", pagedata);
                  }

				    
			});    	
		});    	
	  }); 		
			
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/exam_grades", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var class_id	  = req.body.class_id;
		//var section_id	  = req.body.section_id;
		var exam_id       = req.body.exam_id;
		var name 	  	  = (req.body.name).trim();
		var mark_from	  = req.body.mark_from.trim();;
		var mark_upto	  = req.body.mark_upto.trim();
		var comment		  = req.body.comment.trim();
		
		var data  = {
			name  	 		: name,
			class_id        : class_id,
			//section_id      : section_id,
			exam_id         : exam_id,
			mark_from 		: mark_from,
			mark_upto  		: mark_upto,
			comment			: comment	
		}

		var table = {tablename : 'tbl_exam_grades'}
		var session_year=req.session.session_year;
		 
		var tbl_class  = 'tbl_class';
		admin.findAll({table:tbl_class},function(err, class_list){
           var class_list = class_list;	



        if(req.body.grade_id)
	     {

	        var table   = {tablename:'tbl_exam_grades'};
		  	 var where= { grade_id:req.body.grade_id }

		  	admin.updateWhere(table,where,data, function(err, result){
                
		       admin.findGradeExamList({tbl_grades:"tbl_grades",tbl_class:"tbl_class",tbl_section:"tbl_section",tbl_exam_grades:"tbl_exam_grades",tbl_exam_master:"tbl_exam_master"},{session_year:session_year},function(err, result){
				    var exam_grades   = result;
				    req.flash('success',"Exam grades updated successfully");
				    var pagedata 	  = {Title : "",appName :res.locals.appName, pagename : "admin/exam_grades",success: req.flash('success'),error: req.flash('error'),exam_grades:exam_grades,exam_list:'',class_list:class_list,gradedata:""};
					res.render("admin_layout", pagedata);
			   });   

		    });     	
	     } 
	     else
	     {
           if(exam_id==""|| class_id==""|| name==""|| mark_from==""|| mark_upto=="")   	 
	        {

	          req.flash('error',"Grade data required to save"); 
	          res.redirect(res.locals.appName+'/admin/exam_grades'); 

	        }
	        else
	        {
               var table   = {tablename:'tbl_exam_grades'}; 
		     	admin.insert_all(table,data,function(err, result){
				
			  	  admin.findGradeExamList({tbl_grades:"tbl_grades",tbl_class:"tbl_class",tbl_section:"tbl_section",tbl_exam_grades:"tbl_exam_grades",tbl_exam_master:"tbl_exam_master"},{session_year:session_year},function(err, result){
					    var exam_grades   = result;
					    req.flash('success',"Exam grades added successfully");
					    var pagedata 	  = {Title : "",appName :res.locals.appName, pagename : "admin/exam_grades", success: req.flash('success'),error: req.flash('error'),exam_grades:exam_grades,exam_list:'',class_list:class_list,gradedata:""};
						res.render("admin_layout", pagedata);
				  });
			    })
	        	
	        }

	     		

	     } 
          
		  


		})	
		//console.log(req.body)
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/exam_grades_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
        var session_year=req.session.session_year;
		var table_grades = 'tbl_exam_grades';
		admin.findGradeExamList({tbl_grades:"tbl_grades",tbl_class:"tbl_class",tbl_section:"tbl_section",tbl_exam_grades:"tbl_exam_grades",tbl_exam_master:"tbl_exam_master"},{session_year:session_year},function(err, result){
			    var exam_grades   = result;
			    var pagedata 	  = {Title : "",appName :res.locals.appName, pagename : "admin/exam_grades_list", message : req.flash('msg'),exam_grades:exam_grades,gradedata:""};
				res.render("admin_layout", pagedata);
		});


	}else{
		   website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getAllExamData", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= req.query.class_id
		var section_id	= req.query.section_id
	   
			 	var tbl_subject  = {tablename:'tbl_subject'};
			 	admin.findWhere(tbl_subject,{class_id:class_id},function(err, result){
			 		var subject_list  = result;
			 		var tbl_exam  = {tablename:'tbl_exam_master'};
			 		var session_year = req.session.session_year
			 		admin.findWhereorderby(tbl_exam,{class_id:class_id,session_year:session_year},{orderby:'exam_name',order:'ASC'},function(err,result){
			 			var exam_list = result
			 			res.send({subject_list:subject_list,exam_list:exam_list});
			 		})
				});
			 	//res.send('Gaurav');
			
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


/* 
 ** Get All Exam Name on select of class name only 
*/
router.get("/getAllExamName", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= req.query.class_id
		//var section_id	= req.query.section_id
	   
			 	var tbl_subject  = {tablename:'tbl_subject'};
			 	admin.findWhere(tbl_subject,{class_id:class_id},function(err, result){
			 		var subject_list  = result;
			 		var tbl_exam  = {tablename:'tbl_exam_master'};
			 		admin.findWhereorderby(tbl_exam,{class_id:class_id},{orderby:'exam_name',order:'ASC'},function(err,result){
			 			var exam_list = result
			 			res.send({subject_list:subject_list,exam_list:exam_list});
			 		})
				});
			 	//res.send('Gaurav');
			
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
/* 
 ** Get All Scheduled Exam Name of selected subject  
*/
router.get("/getSecheduledExamName", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= req.query.class_id
		var subject_id 	= req.query.subject_id
		var session_year=  req.session.session_year; 
		var section_id=  req.query.section_id;

			table={tbl_exam_master:"tbl_exam_master",tbl_exam_schedule:"tbl_exam_schedule",tbl_exam_grades:"tbl_exam_grades" }
	 		admin.get_subject_scheduled_exam(table,{class_id:class_id,section_id:section_id,subject_id:subject_id,session_year:session_year},{orderby:'exam_name',order:'ASC'},{exam_id:'exam_id'},function(err,result){
	 			var exam_list=result
	 			console.log("exam_list",exam_list);
                res.send({exam_list:exam_list});
	 		})
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});



router.get("/manage_marks", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
			var pagedata 	 = {Title : "", pagename : "admin/manage_marks", message : req.flash('msg'),class_list:class_list};
			res.render("admin_layout", pagedata);
		});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/add_manage_marks", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var data = req.body
		
		 

		
		var student_id 				= req.body.student_id;
		var class_id 				= req.body.class_id;
		var section_id  			= req.body.exam_section_id;
		var exam_id    				= req.body.exam_id;

		var subject_id              = req.body.subject_id;
		var subjectname 			= req.body.subjectname;
		var marks 			        = req.body.marks;
		var children_participation  = req.body.children_participation;
		var written_work			= req.body.written_work;
		var project_work			= req.body.project_work;
		var slip_test				= req.body.slip_test;
		var comment					= req.body.comment;
		var marks_total				= req.body.total_marks;
		var marks_obtained			= req.body.marks_obtained;
        var subject_type			= req.body.subject_type;
        var exam_code			    = req.body.exam_code;

         pos=0;
         postdata=[];
		 for(var k in student_id)
		 {
		    str= '{';
           for(i=0; i< (subjectname.length)/(student_id.length);i++)
           {

           	 str+= '"'+subjectname[pos]+'"' +':'+marks[pos]+',';
           	 pos++;
           }
            str=str.slice(0, -1);
            str+= '}'

            var data={
              student_id : student_id[k],
              class_id  			    : class_id,
              exam_id    				: exam_id,
              section_id 				: section_id,
              subject_id                : subject_id,
              mark_total				: marks_total[k],
              marks_obtained			: marks_obtained[k],
              marks                     : str ,
              year                      : req.session.session_year,
              subject_type              : subject_type,
              exam_code                 : exam_code
             }


			var table   = {tablename:'tbl_marks'};
				
	  			admin.getMarks(table,{student_id:student_id[k],class_id:class_id,section_id:section_id,subject_id:subject_id,exam_id:exam_id},function(err, result1){
	  				//console.log(result1);
	  				if(result1!=''){
	  					//console.log('SDssdds')
	  					var id = result1[0].mark_id
	  					var findObj = {};
			     
			         	findObj['mark_id'] = id;
			
					     admin.deletewhere(table,findObj,function(err,result){

					     });
	  				}
	  			});
			 var table  = {tablename:'tbl_marks'}
			 admin.insert_all(table,data,function(err, result){

			 })
		 
          }
			res.redirect(res.locals.appName+'/admin/manage_marks');	
			
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});


/*
**  ##################  Tabulation Sheets  #####################
*/
router.get("/getMarksExamNameList", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= req.query.class_id
		var section_id 	= req.query.section_id
		var session_year=  req.session.session_year; 

			table={tbl_exam_master:"tbl_exam_master",tbl_marks:"tbl_marks" }
	 		admin.get_marks_exam_list(table,{class_id:class_id,section_id:section_id,session_year:session_year},{orderby:'exam_name',order:'ASC'},function(err,result){
	 			var exam_list=result
                res.send({exam_list:exam_list});
	 		})
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getTabulateMarksList",function(req,res){

   if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= req.query.class_id.toString()
		var section_id 	= req.query.section_id.toString()
		var exam_id 	= req.query.exam_id.toString()
		var session_year=  req.session.session_year; 
		var exam_code   =  req.query.exam_code.toString()

			
        table={tablename:"tbl_marks"}  
        admin.findmarksheetstudent(table,{class_id:class_id,section_id:section_id,exam_id:exam_id,year:session_year},function(err,result){

              tabulation_list=result;
              tabulardata={};
              key="data";
              tabulation_list.forEach(function(item, index){
		 	 	  tabulation_list[index].marksheet=[];
		 	 	  tabulation_list[index].otherexammarksheet=[];
		 	 	  tabulation_list[index].student_name='';
		 	 	  tabulation_list[index].admission_number='';
		 	   });
               n=0 ; 
          
			   async.each(tabulation_list, function (item, done) 
			   {
                   student_id=item.student_id;
                    table={tbl_marks:"tbl_marks",tbl_registration:"tbl_registration",tbl_exam_grades:"tbl_exam_grades",tbl_subject:"tbl_subject" } 	
	 		        admin.get_exam_marks_list(table,{student_id:student_id,exam_code:exam_code,class_id:class_id,section_id:section_id,exam_id:exam_id,session_year:session_year},{orderby:'name',order:'ASC'},function(err,result){

                        if(result!=''){
	                        marksheet='';otherexammarksheet='';
	                        result.forEach(function(item, index){
	                        	if(item.subject_type==1)
					    		  marksheet += item.subject_name+'='+item.marks +'^';
					    		else
					    		 otherexammarksheet += item.subject_name+'='+item.marks +'^';	
					    	});

					    	marksheet =marksheet.substring(0, marksheet.length - 1)
					    	otherexammarksheet=otherexammarksheet.substring(0, otherexammarksheet.length - 1)
	                        tabulation_list[n].marksheet    = marksheet;
	                        tabulation_list[n].otherexammarksheet=otherexammarksheet;
	                        tabulation_list[n].student_name = result[0].student_name;
	                        tabulation_list[n].admission_number = result[0].admission_number;
	                         n++;
	                      done(null);
                     	}
                     	else
                     	{

                     	}


	 		        }); 
			   },function(){
                 console.log('$$$$$$$$$$$$$$$$$',tabulation_list);
			   	  var table = {tablename : 'tbl_exam_grades'}
				  admin.findWhere(table,{class_id:class_id,exam_id:exam_id},function(err,result){
			 			    var  gradelist = result;
			 			    res.send({tabulation_list:tabulation_list,gradelist:gradelist});
			    	});
			   	
			   });
          });
             // return false;
 	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.get("/getMarsksheet",function(req,res){

   if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	 = req.query.class_id.toString()
		var section_id 	 = req.query.section_id.toString()
		var exam_id 	 = req.query.exam_id.toString()
		var session_year = req.session.session_year; 
		var student_id   = req.query.student_id.toString();
		var exam_code   =  req.query.exam_code.toString()
			
          table={tablename:"tbl_marks"}  
          admin.findmarksheetstudent(table,{student_id:student_id,class_id:class_id,section_id:section_id,exam_id:exam_id,year:session_year},function(err,result){
              

               tabulation_list=result;
               tabulardata={};
               key="data";
                

              tabulation_list.forEach(function(item, index){
		 	 	  tabulation_list[index].marksheet=[];
		 	 	  tabulation_list[index].student_name='';
		 	 	  tabulation_list[index].otherexammarksheet=[];
		 	 	  //tabulation_list[index].FA1+FA2_20percentage=''
		 	   });
               n=0 ; 
			   async.each(tabulation_list, function (item, done) 
			   {
                   student_id=item.student_id;
                   //console.log('studenntttttttttttttt',student_id);
			   	  //var table = {tablename : 'tbl_marks'}
	 		         //admin.findWhere(table,{student_id:student_id,class_id:class_id,exam_id:exam_id},function(err,result){
	 		      table={tbl_marks:"tbl_marks",tbl_registration:"tbl_registration",tbl_exam_grades:"tbl_exam_grades",tbl_subject:"tbl_subject" } 	
	 		      admin.get_averge_marks_FA1FA2(table,{student_id:student_id,class_id:class_id,section_id:section_id,exam_id:exam_id,session_year:session_year},{orderby:'name',order:'ASC'},function(err,FA1FA2){ 
                     
                       //console.log('###############',FA1FA2[0].average);

                       var AVG= FA1FA2[0].average;
                          
	 		         admin.get_exam_marks_list(table,{student_id:student_id,exam_code:exam_code,class_id:class_id,exam_id:exam_id,session_year:session_year,section_id:section_id},{orderby:'name',order:'ASC'},function(err,result){
	 		   	
                         console.log('New-------------',result);

                        marksheet='';
                        result.forEach(function(item, index){
                        	otherexammarksheet="";
				    		 //marksheet += item.subject_name+'='+item.marks +'^';
				    		if(item.subject_type==1)
				    		  {
                                if(item.exam_code=='SM1' || item.exam_code=='SM2')
				    		    { 
				    		    	//marksheet += item.subject_name+'='+FA1FA2[0].average +'^'; 
				    		    	jj= JSON.parse(item.marks)
				    		    	
				    		    	jj["FA1+FA2_20percentage"]=AVG
                                
				    		        marksheet+= item.subject_name+'='+JSON.stringify(jj)+'^'; 
				    		    	

				    		    }
				    		    else
				    		       marksheet += item.subject_name+'='+item.marks +'^';
				    		    

                               // if(item.exam_code=='SM1' || item.exam_code=='SM2')
				    		   //  { 
				    		   //  	//marksheet += item.subject_name+'='+FA1FA2[0].average +'^'; 
				    		   //  	jj= JSON.parse(item.marks)
				    		   //  	jj.forEach(function(item, index){
				 	 		 	 	//   jj[index].ffff='';
							 	    // });

				    		   //  	//jj[1].fff=111;
				    		   //  	jj[1].ffff='11111';

				    		   //  }
				    		   //  console.log(jj);
				    		   //  return false;
				    		  
				    		  }
				    		else
				    		 {
				    		 	//console.log('---------------',item.marks)
				    		 	 otherexammarksheet += item.subject_name+'='+item.marks +'^';	
								 otherexammarksheet=otherexammarksheet.substring(0, otherexammarksheet.length - 1)
                                 tabulation_list[n].otherexammarksheet=otherexammarksheet;
                                 tabulation_list[n].FA1FA2 = FA1FA2[0].average;
				    		 } 

				    	});
				    	
				    	marksheet =marksheet.substring(0, marksheet.length - 1)
                        tabulation_list[n].marksheet    = marksheet;

                        tabulation_list[n].student_name = result[0].student_name;
                        n++;
                      done(null);
	 		        }); 
	 		      });   
			   },function(){
                 //console.log('NEW$$$$$$$$$$$$$',tabulation_list);
			   	  var table = {tablename : 'tbl_exam_grades'}
				  admin.findWhere(table,{class_id:class_id,exam_id:exam_id},function(err,result){
				  	    var table_marks  ={ tablename : 'tbl_exam_master' };
				  	       admin.findWhere(table_marks,{class_id:class_id,exam_id:exam_id},function(err,exam_date){
				  	       	    var exam_date = exam_date[0].created_date;

				  	       	    var check = moment(exam_date, 'YYYY/MM/DD');

								var month = check.format('M');
								var day   = check.format('D');
								var year  = check.format('YYYY');
								if(month=12){
									var next_month  = 1;
								}else{
									var next_month  = parseInt(month) +parseInt(1);
								}	
								var last_date = moment(next_month, "MM").daysInMonth();
								var first_start_date = "01-"+month+"-"+year;
								var first_end_date 	 = last_date+"-"+next_month+"-"+year;

								// console.log(first_start_date);
								// console.log(first_end_date);
								// console.log(month);
								// console.log(day);
								// console.log(year);
								var table_attendence = {tablename : 'tbl_attendance'}
								admin.getTotalAttendence(table_attendence,{class_id:class_id,section_id:section_id,student_id:student_id,first_start_date:first_start_date,first_end_date:first_end_date},function(err,total_attendence){
									//console.log(total_attendence);
									var working_days = total_attendence[0].total_attendence;
									admin.getPresentAttendence(table_attendence,{class_id:class_id,section_id:section_id,student_id:student_id,first_start_date:first_start_date,first_end_date:first_end_date},function(err,present_days){
										var present_days  = present_days[0].present_attendance;
			 			    			var  gradelist = result;
			 			    			res.send({tabulation_list:tabulation_list,gradelist:gradelist,working_days:working_days,present_days:present_days});
			 			    		});
			 			    	});

			 				});
			    	});
			   	
			   });
			    
                      
          });
              
              return false;
 	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/***********/


router.get("/tabulation_sheet", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
			var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/tabulation_sheet", message : req.flash('msg'),class_list:class_list,tabulation_list:""};
			res.render("admin_layout", pagedata);
		});
	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
/*
**  ################## #####################
*/
router.get("/getStudentAllDetail", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var class_id 	= req.query.class_id.toString()
		var section_id	= req.query.section_id.toString()
	   	var subject_id  = req.query.subject_id.toString()
	   	var exam_id     = req.query.exam_id.toString()
	   	var subject_type= req.query.subject_type.toString()
	   	var session_year= req.session.session_year;
	   	//var exam_code   = req.query.exam_code
	    


	    var table  		= {tablename:'tbl_enroll'};
        	var student_detail  = ''; 
        	var n 			= 0;    
			admin.getStudentsformarks(table,{class_id:class_id,section_id:section_id,session_year:session_year},function(err, result){

				var student_detail  = result;
				async.each(student_detail, function (item, done) {

					var student_id = item.registration_id.toString();
			 	  	var tbl_marks = {tablename : 'tbl_marks'}
	                var session_year = req.session.session_year;  
					admin.findWhere(tbl_marks,{year:session_year,student_id:student_id,class_id:class_id,section_id:section_id,subject_id:subject_id,exam_id:exam_id},function(err, result1){
					var table  = {tablename:'tbl_marks'};
					var session_year = req.session.session_year;

                        //admin.getstudentexammarks(table,{session_year:session_year,student_id:student_id,class_id:class_id,section_id:section_id,subject_id:subject_id,exam_id:exam_id},function(err, student_marks){
						  var tbl_formats = {tablename : 'tbl_sheet_formats'}

                            admin.getcolumnformat(tbl_formats,{class_id:class_id,exam_id:exam_id},function(err, result2){

                              if(result1==undefined || result1=='')
                              {
                                  	
							  		if(subject_type==0)
							  		     student_detail[n].marks = result2[0].otheracivity;
							  		else
							  		 	student_detail[n].marks  = result2[0].dynamic_column;

							  }else{
								  		   
								  	  //if(subject_type==0)
								  	  //   student_detail[n].marks=result1[0].othermarks;
								  	 // else
								  	   	 student_detail[n].marks=result1[0].marks;

							  }
                          	 n++;
						    done(null);
                           });
                        });

				}, function(){
					console.log('Detail of marksssss---- ',student_detail);
					 
					 
				var table_exam 		= {tablename:'tbl_exam_schedule'};
				admin.getexammarks(table_exam,{class_id:class_id,section_id:section_id,subject_id:subject_id,exam_id:exam_id},function(err,result1){

			    		res.send({student_detail:student_detail,total_marks:result1})
			    	});					
				});
			});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/* 
**** Question Paper 
*/
router.get("/QuestionPaper", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;

		    var table = 'tbl_question_paper';
	 
			 admin.findquestionpaper({table:table},function(err, result){

			    var question_paper_list 	 = result;
				var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/questionpaper",success: req.flash('success'),error: req.flash('error'),question_paper_list:question_paper_list,class_list:class_list};
				res.render("admin_layout", pagedata);
			});
			
		});
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

router.post("/QuestionPaper", function(req, res){
  if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

  	var class_id            = req.body.class_id;
  	var section_id          = req.body.exam_section_id;
  	var subject_id  		= req.body.subject_id;
  	var exam_id  		    = req.body.exam_id;
  	var moment 				= require('moment');
	var dates 				= moment().format('YYYY-MM-DD:hh:mm:ss');
  	
  	var file = req.files.quesionpaper_file;
  	var data = [];
 		file1= file;
  		var newname = changename(file.name);
		var filepath = path.join('/',"public/question_paper/"+newname);
		
		file1.mv(filepath, function(err){
			if(err){
				console.log(err);
				return;
			}
		});
		
  		 data = {
  		 	class_id 			: class_id,
  		 	section_id			: section_id,
  		 	subject_id 			: subject_id,
  		 	exam_id             : exam_id,
  			file_name     	    : newname,
  			created_date	    : dates
  		}
  		var table   = {tablename:'tbl_question_paper'};

  		if(class_id==""||section_id==""||subject_id==""||exam_id=="")
  		{
           
           req.flash('error',"Question paper detail required to save");
           res.redirect(res.locals.appName+"/admin/QuestionPaper");
  		}
  		else
  		{
             var table = {tablename:'tbl_question_paper'};
			 admin.findWhere(table,{class_id:class_id,section_id:section_id,subject_id:subject_id,exam_id:exam_id},function(err, result){
			 	 
               if(result.length>0)
               {
               	 req.flash('error',"Question paper already exist");
               	 res.redirect(res.locals.appName+"/admin/QuestionPaper");
               }
               else
               {
                

                 var table = {tablename:'tbl_question_paper'};
                  admin.insert_all(table,data,function(err, result){

                  	  req.flash('success',"Question paper added successfully");
			
				  });	

			  		var table  = 'tbl_class';
				
					admin.findAll({table:table},function(err, result){
					    var class_list 	 = result;
					    var table = 'tbl_question_paper';
						admin.findquestionpaper({table:table},function(err, result){
						 	//console.log(result);
						    var question_paper_list 	 = result;
							var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/questionpaper", success: req.flash('success'),error: req.flash('error'),question_paper_list:question_paper_list,class_list:class_list};
							res.render("admin_layout", pagedata);
						});
					});

               }
                

                 
			 })
 
  			
  		}
  	
  		
     }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});

/* Send Mark SMS to parent & students */

router.get("/sendmarks", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		var table  = 'tbl_class';
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;
		    var exam_table   = 'tbl_exam_master';
		    admin.findExam({table:exam_table},function(err, exam_list){
		    	
		       var exam_list    = exam_list

               var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/sendmarks", success: req.flash('success'),error: req.flash('error'),class_list:class_list,exam_list:exam_list};
			   res.render("admin_layout", pagedata);


			});
		});
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
});
router.post("/sendmarks", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
        
        class_id= req.body.class_id;
        section_id= req.body.exam_section_id;
        exam_id= req.body.exam_id
        session_year=req.session.session_year
        user_role = req.session.user_role 

        table= {tbl_marks:'tbl_marks',tbl_registration:'tbl_registration',tbl_class:'tbl_class',tbl_section:'tbl_section'}
        obj = {class_id:class_id,section_id:section_id,exam_id:exam_id,session_year:session_year}
        admin.find_marks_receiver_sms(table,obj,function(err,result){


           
           student_list=result;

           student_list.forEach(function(item, index){
           
               student_list[index].grade=""
     	    });
         

          async.each(student_list,function(item,done) {
                 
            obtained =item.marks_obtained;     
            student_name= item.name
            phone = item.phone
 


                 parent_id =item.parent_id
                 var table = {tablename:'tbl_registration'};

			     admin.findWhere(table,{registration_id:parent_id.toString()},function(err, resultparent){

			       //console.log('resultparent-<<<',resultparent);

			       admin.findWhere({tablename:'tbl_class'},{class_id:class_id.toString()},function(err,classresult){
                     classname=classresult[0].class_abbreviations
                     admin.findWhere({tablename:'tbl_section'},{section_id:section_id.toString()},function(err,sectionresult){
                       sectionname=sectionresult[0].section_name

                        admin.findWhere({tablename:'tbl_exam_grades'},{class_id:class_id.toString(),exam_id:exam_id.toString()},function(err,gradesresult){
                         grades_list=gradesresult

                         admin.find_marks_all_subject({tbl_marks:'tbl_marks',tbl_subject:'tbl_subject'},{class_id:class_id,exam_id:exam_id,section_id:section_id,student_id:item.registration_id,session_year:session_year},function(err,studentresult){

                             message='';
                             message+="Your child "+item.name+" "+ classname+ " class("+ sectionname +") section "+item.exam_code+" marks "
                              //console.log('first Message ', message)
                             async.each(studentresult,function(item2,done2) {                                
							  subjectname= item2.name ;	
                              marksobtained= item2.marks_obtained ;// /item.numberofsubject;
                              totalmark= item2.mark_total ;
								  async.each(grades_list,function(item1,done1) {
			                         	from = item1.mark_from;
					                    upto =  item1.mark_upto
					                    if(marksobtained >= from    && marksobtained <= upto  )
					                     {
					                     	gradename=item1.name

					                     }  
				                   
						       	   	done1(null);
							     },function(){

							     	if(resultparent.length>0)
							     	{
							     		message+= subjectname+":-"+marksobtained +'/'+totalmark+ " "+ gradename+";"
							     	}
							     	
							     }) // inner async close

								done2(null)	
                             },function(){
                            	   mobileNo= resultparent[0].phone+ " ";
                            	   var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
                                   msg91.send(mobileNo, message, function(err, response){
										req.flash('success',"message sent successfully");
								   });
                             });

                         });

					    }); 	
			     	});

			       });

			     })

			     done(null);

          },function(){
          	 req.flash('success',"Marks sent successfully");
          	 res.redirect(res.locals.appName+'/admin/sendmarks');
          });
             
 
        });
        
     		 
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});



router.get("/user_rights", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
		    var class_list 	 = result;

		    var table = 'tbl_rights_menu';
	 
			 admin.findAll({table:table},function(err, result){

			 	console.log(result);
			    var user_rights 	 = result;
			    var table_role  = 'tbl_userrole'
			    admin.findAll({table:table_role},function(err, result){
			    	var user_role   = result;
					var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/user_rights", message : req.flash('msg'),user_rights:user_rights,class_list:class_list,user_role:user_role};
					res.render("admin_layout", pagedata);
				});
			});
			
		});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});



router.get("/matchperentdetail", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var phone =req.query.phone.toString()
		var email =req.query.email.toString()
	    var table = {tablename:'tbl_registration'};
			admin.findWhere(table,{phone:phone,email:email},function(err, result){
			 	var email_list = result;
			 	
			 	 //console.log(email_list);
			 	 //res.send({parent_email:email_list});

				
			 	//res.send('Gaurav');
			});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.get("/setting", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		var table  = 'tbl_setting';
	    var current_setting = "";
		admin.findAll({table:table},function(err, result){
		    var current_setting 	 = result;

			var pagedata 	 = {Title : "", appName:res.locals.appName,appName :res.locals.appName, pagename : "admin/setting", message : req.flash('msg'),current_setting:current_setting};
			res.render("admin_layout", pagedata);
		});

    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});
router.post("/setting", function(req, res){
   
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		

  	var school_name         = req.body.school_name;
  	var session_year  		= req.body.session_year;
  	var school_address      = req.body.school_address;


  	var phone       		= req.body.phone;
  	var msgauthkey          = req.body.msgauthkey;
  	var senderid            = req.body.senderid;
  	var route               = req.body.route;

	var updated_at = moment().format('YYYY-MM-DD:hh:mm:ss');
  	
  	var file = req.files.file;
  	
  
  	var image= '';
  	if(typeof file=="undefined"){

  			var image = '';
  	}else{
	  	var newname = changename(file.name);
	  	var filepath = path.join('/',"public/images/"+newname);
	  	console.log('filepath---',filepath);
	  	
	  		file.mv(filepath, function(err){
	  			console.log(err);
				if(err){
					console.log(err);
					return;
				}else{
					console.log('success')
				}

			});

	    var image = newname
	}
		
	var	data = {
  		 	school_name 	: school_name,
  		 	session_year 	: session_year,
  			school_address  : school_address,

  			phone 			: phone,
  			logo     	    : image,
  			msgauthkey      : msgauthkey,
  			senderid        : senderid,
  			route           : route,  
  			updated_at	    : updated_at
  		}

  		var table   = {tablename:'tbl_setting'};
  	    var where='';
  	    admin.updateWhere(table,where,data, function(err, result){
           if(result)
           {	
	            if(image)
	  		  	  req.session.logo 				= image;
	  		  	if(session_year)
	  		  	  req.session.session_year 		= session_year;
	  		  	if(school_name)
	  		  	  req.session.school_name 		= school_name;
	  		  	if(school_address)
	  		  	  req.session.school_address 	= school_address; 
	  		  	if(phone)
	  		  	  req.session.phone 			= phone; 
			   res.redirect(res.locals.appName+'/admin/setting')  
		   }

        });
    }else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

/** Send Message ********* */
router.get("/sendmessage", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
	
		admin.findAll({table:table},function(err, result){
		   var class_list 	 = result;

		    table={tablename:'tbl_registration'};
	     	var findObj = {user_role:'4'}
	     	admin.findWhere(table,findObj,function(err,result){
               teacher_list= result;
              
               
               table={tablename:'tbl_registration'}
               var findObj = {user_role:'2'}
               admin.findWhere(table,findObj,function(err,result){

                 parent_list= result;
                  //console.log(parent_list);
            	 var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/sendmessage", success: req.flash('success'),error: req.flash('error'),class_list:class_list,teacher_list:teacher_list,parent_list:parent_list,page:""};
		         res.render("admin_layout", pagedata);

               });


		    });

		});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});
router.post("/sendmessage",function(req,res){
    
    
   if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
    {
      var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
      session_year =req.session.session_year

     if(req.body.class_id=="daysscholler")
      {
      	dayscaller ="";
      	if(req.body.visiableclass!='')
      	  dayscaller = "tbl_enroll.class_id="+req.body.visiableclass;	
        where= {condition:'tbl_registration.dormitory_id=0 ',dayscaller,session_year:session_year}

      }
      else if(req.body.class_id=="hostels")
      {
         hosterlsclass ="";
      	if(req.body.visiableclass!='')
      	  hosterlsclass = "tbl_enroll.class_id="+req.body.visiableclass;	
        where= {condition:'tbl_registration.dormitory_id!=0',hosterlsclass,session_year:session_year}
      }
      else if(req.body.class_id=="Tstff")
      {
      	var where= {staff_category:"T" , user_role:'4'}
      }
      else if(req.body.class_id=="Nstff")
      {
      	var where= {staff_category:"N" , user_role:'4'}
      }
      else if(req.body.class_id=="ALLT")
      {
        var where= {user_role:'4'}
      }
      else if(req.body.class_id=="ALLP")
      {
        var where= {user_role:'2'}
      }
      else 
      {
      	if(req.body.page=='studentpage')
           where= {condition:'tbl_enroll.class_id='+req.body.class_id ,session_year:session_year}
        if(req.body.page=='teacherpage')
        	where= {registration_id:req.body.class_id ,user_role:'4'}
        if(req.body.page=='parentpage')
            where= {registration_id:req.body.class_id ,user_role:'2'}
        
      }

       
      if(req.body.page=='studentpage') 
       {
       	  if(req.body.descriptionstudent==""||req.body.class_id=="")
       	  {
             req.flash('error',"Message required to send ");
             res.redirect(res.locals.appName+'/admin/sendmessage');
       	  }
       	  else
       	  {
       	  	  // console.log('where',where);
             //  return false;  
              admin.getalldaysscholler(table,where,function(err, result){

              	if(result.length>0)
              	{
              	 person= result;
              	 mobileNo='';
              	// console.log('person',person);
              	async.each(person, function (item, done){
              	    
              	    
              	 var table = {tablename:'tbl_registration'};
              	 where = {registration_id:item.parent_id.toString()}
                 admin.findWhere(table,where,function(err, result){
              	    
              	     mobileNo += result[0].phone+',';
              	    
              	    done(null);
              	    
                 }); 
              },function(){
                var message = req.body.descriptionstudent.replace("&#39;", "'",) 	    
           	     message = message.replace(/<\/?p>/g,'')
           	     //message = encodeURI(message) 
           	     //console.log(message);
           	     
           	    // return false;
           	   
		     	mobileNo= mobileNo.substring(0, mobileNo.length - 1)
              	  var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
				    msg91.send(mobileNo, message, function(err, response){
				    req.flash('success',"Message sent successfully ");
	                res.redirect(res.locals.appName+'/admin/sendmessage');
				  });
			
              	     
              	});
		    	
               }else{
               	 req.flash('error',"No student in this category");
	                res.redirect(res.locals.appName+'/admin/sendmessage');
               }               


 
		      });	
       	  }    

         
       }
       else if(req.body.page=='teacherpage') 
       {

       	  if(req.body.descriptionteacher==""||req.body.class_id=="")
       	  {

             req.flash('error',"Message required to send ");
             res.redirect(res.locals.appName+'/admin/sendmessage');
       	  }
       	  else
       	  {
       	    var table = {tablename:'tbl_registration'};
            admin.findWhere(table,where,function(err, result){

             if(result.length>0)
             {
             	message = req.body.descriptionteacher.replace(/<\/?p>/g,'')
	            mobileNo='';
		    	senderdata= JSON.parse(JSON.stringify(result[0]));
		    	result.forEach(function(item, index){
		    		if(result[index].phone && result[index].phone!='undefined')
		    		  mobileNo += result[index].phone+',';
		    	});
		    	mobileNo= mobileNo.substring(0, mobileNo.length - 1)
		    	//var mobileNo = [ "XXXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXX" ];
				//var mobileNo =  "XXXXXXXXXX,XXXXXXXXXX,XXXXXXXXXX";
				var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
			      msg91.send(mobileNo, message, function(err, response){
			      	req.flash('success',"Message sent successfully ");
					res.redirect(res.locals.appName+'/admin/sendmessage');
				  });

             } 
             else{
             	req.flash('error',"No teacher in this category");
				res.redirect(res.locals.appName+'/admin/sendmessage');
             }	


              
            });
          } 
       }
       else if(req.body.page=='parentpage')
       {
       	if(req.body.descriptionparent==""||req.body.class_id=="")
       	  {

             req.flash('error',"Message required to send ");
             res.redirect(res.locals.appName+'/admin/sendmessage');
       	  }
       	  else
       	  {
       	    var table = {tablename:'tbl_registration'};
            admin.findWhere(table,where,function(err, result){
            message = req.body.descriptionparent.replace(/<\/?p>/g,'')
            mobileNo='';
	    	senderdata= JSON.parse(JSON.stringify(result[0]));
	    	result.forEach(function(item, index){
	    		if(result[index].phone && result[index].phone!='undefined')
	    		  mobileNo += result[index].phone+',';
	    	});
	    	mobileNo= mobileNo.substring(0, mobileNo.length - 1)
	    	//console.log(mobileNo);
	    	//var mobileNo = [ "XXXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXX" ];
			//var mobileNo =  "XXXXXXXXXX,XXXXXXXXXX,XXXXXXXXXX";
			var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
		      msg91.send(mobileNo, message, function(err, response){
		      	req.flash('success',"Message sent successfully ");
				res.redirect(res.locals.appName+'/admin/sendmessage');
			  });
              
            });
          } 
       }
 	}
   else
 	{
       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
	   });
 	}
});

/* Import Bulk Record of student */ 
 
router.get("/bulkimport",function(req,res){

	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
    {
     

       var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/bulkimport", success: req.flash('success'),error: req.flash('error'),rejected_list:''};
	   res.render("admin_layout", pagedata);

	}
	else
	{
        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		});
	}   
});

router.post("/bulkimport",function(req,res){
      	var file = req.files.bulkfile;
  		var newname = changename(file.name);
		var filepath = path.join('/',"public/bulkimport/"+newname);
			
		file.mv(filepath, function(err)
		{
				if(err){
					console.log(err);
					return;
				}
		});
	   var csvfile = __dirname + "/../public/bulkimport/"+newname;
       var csvData=[];
       var csvData=[] 
  	   fs.createReadStream(csvfile)
 	   .pipe(parse({headers: false,columns:true}))
	   .on('data', function(csvrow) {
	        csvData.push(csvrow); 
	    })
       .on('end',function(){
               n=0;
               //var;
               var rejected   =[]; 
               var fields= ['student_name','student_gender','caste','sub_caste','class_name','section_name','aadhar_number','student_dob','transport_id','dormitory_id','address','student_phone','student_email','student_password','blood_group','admission_number','parent_name','mother_name','parent_address','parent_phone','parent_email','parent_password','profession'];
              j=0
              csvData.forEach(function(item, index){
              	  keys = Object.keys(item) 

              	  if(keys[index]!=undefined)
              	  {
              	     csvData[index].rejection_reason=""; 	
              	  }
		 	   });

               async.eachSeries(csvData, function (item, done) 
			   {
                  var data = {
						 		name 		 :item.parent_name,	 		
						 		address		 :item.parent_address,
						 		phone		 :item.parent_phone,
						 		email		 :item.parent_email,
						 		profession   :item.profession,
						 		user_role    :2,
						 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
					 		}  

                  var existparentid=0;existstudentid=0;
                  var student_data='';
                   var table = {tablename:'tbl_registration'} 
                   var login_table = {tablename:'tbl_userlogin'};	  
                   var enroll_table = {tablename:'tbl_enroll'};	  
                   record={parent_email:item.parent_email,parent_phone:item.parent_phone,admission_number:item.admission_number,student_email:item.student_email,student_phone:item.student_phone} 

                   admin.getclass_id_sectionid({class_name:item.class_name,section_name:item.section_name},function(err,classsection){
                       
                    if(classsection.length>0)
                    {
                    admin.checkrecordexist(table,record,function(err , resultexist){
                       
                   	   if(resultexist.admission_number==0 && item.parent_email!="" && item.parent_phone!="" && item.admission_number!="" )
                   	   {
                         /* For Parent Detail Insert start */
                          if(resultexist.parent_id!=0)
                          {
                            data={}; 
                            //item.rejection_reason='Parent contact'
                          // rejected[n]=item
                          }

                   	   	 admin.insert_all(table,data,function(err, result){

                   	   	 	if(resultexist.parent_id==0)
                   	   	 	{
                   	   	 		registration_id=result;
                   	   	 		var login_table  	    = {tablename:'tbl_userlogin'};
				                var parent_password     = sha1(item.parent_password)
				                var login_data= {
								                 registration_id  : registration_id,
								 			     email           : item.parent_email,
								 			     user_password        : parent_password,
								 			     user_role       : 2
				 		 			            }
				 		 		 admin.insert_all(login_table,login_data,function(err, result1){

				         		    });		            

                   	   	 	} 

                   	   	 	if(resultexist.student_id==0)
	                   	    {

	                   	    	var student_data = {
							 			admission_number :item.admission_number,
								 		name 		 :item.student_name,	 		
								 		caste		 :item.caste,
								 		subcaste     :item.sub_caste,
								 		dob          :item.student_dob,
								 		sex			 :item.student_gender,
								 		address		 :item.address,
								 		phone		 :item.student_phone,
								 		email		 :item.student_email,
								 		dormitory_id :item.dormitory_id,
								 		transport_id :item.transport_id,
								 		aadhar_number:item.aadhar_number,
								 		blood_group  :item.blood_group,
								 		mother_name  :item.mother_name,
								 		parent_id    :resultexist.parent_id?resultexist.parent_id:result,
								 		user_role    :3,
								 		created_date :moment().format('YYYY-MM-DD:hh:mm:ss')
								 	}  	
                                  var table = {tablename:'tbl_registration'} 
	                   	   	     admin.insert_all(table,student_data,function(err, resultstudent){
                                   var registration_id=resultstudent;
                                   var student_password = sha1(item.student_password)
		                           var login_data   = {
											 			registration_id : registration_id,
											 			email           : item.student_email,
											 			user_password        : student_password,
											 			user_role       : 3
								 		              }
                                     var login_table = {tablename:'tbl_userlogin'};	  
								 	 admin.insert_all(login_table,login_data,function(err, result){	  

								 	     var enroll_data= {
						 					registration_id  : registration_id,
						 					class_id         : classsection[0].class_id,
						 					section_id  	 : classsection[0].section_id,
						 					session_year     : req.session.session_year,
						 					created_date      :moment().format('YYYY-MM-DD:hh:mm:ss')	
						 					}  
						 				var enroll_table = {tablename:'tbl_enroll'};	  
								    	admin.insert_all(enroll_table,enroll_data,function(err, result){


								 	     });	
								 	});              
                      
	                   	   	     });

	                   	    }
	                   	    else
	                   	    {
 								item.rejection_reason='student already exist'
                                rejected[n]=item
	                   	    }

                   	   	 })
                   	   	   
                   	   	 /* For Parent Detail END */
                   	   }else
                   	   {

                   	   	   if(item.parent_email=="")
                             item.rejection_reason='parent email empty'
                           else if(item.parent_phone=="")
                             item.rejection_reason='parent phone empty' 
                           else if(item.admission_number=="")
							 item.rejection_reason='admission number empty' 
                           else
                           	item.rejection_reason='admission number exist'
                           
                           rejected[n]=item
                   	   }

                   	   /* FOr Student INsert */

                     });  // close of parent check 
                   }
                   else
                   {
                        
                           	item.rejection_reason='No class section it'
                           
                            rejected[n]=item 
                   }
                   done(null);
				      n++;  
                  }); //close of classsection  
  	
			    },function(){
			    	 
                      var fields= ['student_name','student_gender','caste','sub_caste','class_name','section_name','aadhar_number','student_dob','transport_id','dormitory_id','address','student_phone','student_email','student_password','blood_group','admission_number','parent_name','mother_name','parent_address','parent_phone','parent_email','parent_password','profession','rejection_reason'];
                                  

                          if(rejected.length>0)
                          {
                              const json2csvParser = new Json2csvParser({ fields });
	                          const csv = json2csvParser.parse(rejected);
	 
							  res.setHeader('Content-disposition', 'attachment; filename=rejected.csv');
							  res.set('Content-Type', 'text/csv');
							  res.status(200).send(csv);	
                          }
                          else{

                                 req.flash('success',"All records imported successfully");
                          }   
                          

			    	  var pagedata 	 	 = {Title : "",appName :res.locals.appName, pagename : "admin/bulkimport",  success: req.flash('success'),error: req.flash('error'),rejected_list:rejected};
	                  res.render("admin_layout", pagedata);	
                       
			    }); // asyn close 
		    });
        
});

/* Import Bulk Record of student */ 
router.post("/frontend_setting", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		

  	var type         		= req.body.type;
  	if(type =='about_us'){
  		var about_us   = req.body.about_description;

  		var data       = {
  			about_us   : about_us
  		}

  		var table   = {tablename:'tbl_setting'};
  	    var where='';
  	    admin.updateWhere(table,where,data, function(err, result){
  	    	res.redirect(res.locals.appName+'/admin/website')
  	    });
  	}else if(type =='terms_conditions'){
  		var terms_description   = req.body.terms_description;

  		var data       = {
  			terms_conditions   : terms_description
  		}

  		var table   = {tablename:'tbl_setting'};
  	    var where='';
  	    admin.updateWhere(table,where,data, function(err, result){
  	    	res.redirect(res.locals.appName+'/admin/website')
  	    });
  	}else if(type=='privacy_policy'){
  		var privacy_description   = req.body.privacy_description;

  		var data       = {
  			privacy_policy   : privacy_description
  		}

  		var table   = {tablename:'tbl_setting'};
  	    var where='';
  	    admin.updateWhere(table,where,data, function(err, result){
  	    	res.redirect(res.locals.appName+'/admin/website')
  	    });
  	}else if(type=='notice_board'){
  		 
  		var file = req.files.file;
  	
  		
	  	var image= '';
	  	if(typeof file=="undefined"){

	  			var image = '';
	  	}else{
		  	var newname = changename(file.name);
		  	var filepath = path.join('/',"public/images/"+newname);
		  		file.mv(filepath, function(err){
					if(err){
						console.log(err);
						return;
					}
				});

		    var image = newname
		}	
		
  		var fd = req.body.date;
		var fromDate = fd.split(" ");
		var dates    = formatDate(fromDate[0],fromDate[1] + " " + fromDate[2]);// 
  		
  		var data  = {
  		 	notice_title    : req.body.title,
  		 	notice          : req.body.notice,
  		 	notice_date		: dates,
  		 	show_on_website	: req.body.show_website,
  		 	created_date    : moment().format('YYYY-MM-DD:hh:mm:ss'),
  		 	image           : image
  		}

  		var table  = {tablename:'tbl_noticeboard'} 
  		if(req.body.notice_id){
	  		    var obj      =  {
			  		 	notice_title    : req.body.title,
			  		 	notice          : req.body.notice,
			  		 	notice_date		: dates,
			  		 	show_on_website	: req.body.show_website,
			  		 	image           : image
			  		}
		        var where    = {notice_id:req.body.notice_id}
		        
		        admin.updateWhere(table,where,obj, function(err, result){  
		      	
		      	if(result)
	            {	
	                 res.redirect(res.locals.appName+'/admin/website');
	            }
	    });
	  		
  		}else{
	  		website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
  		}


  	}else if(type=='events'){
  		 
  		
  		var fd = req.body.event_date;
		var fromDate = fd.split(" ");
		var dates    = formatDate(fromDate[0],fromDate[1] + " " + fromDate[2]);// 
  		
  		var data  = {
  		 	title    		: req.body.title,
  		 	status          : req.body.status,
  		 	event_date		: dates,
  		 	created_date    : moment().format('YYYY-MM-DD:hh:mm:ss'),
  		 	
  		}

  		var table  = {tablename:'tbl_frontend_events'} 
  		if(req.body.event_id){
	  		    var obj      =  {
			  		 	title    		: req.body.title,
  		 				status          : req.body.status,
  		 				event_date		: dates,
			  		}
		        var where    = {frontend_events_id:req.body.event_id}
		        
		        admin.updateWhere(table,where,obj, function(err, result){  
		      	
		      	if(result)
	            {	
	                 res.redirect(res.locals.appName+'/admin/website');
	            }
	    });
	  		
  		}else{

			website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
  		}


  	}else if(type =='settings'){
  		
  		var school_title       	= req.body.school_title;
  		var school_email   		= req.body.school_email;
  		var phone          		= req.body.phone;
  		var fax  		   		= req.body.fax;
  		var copyright_text 		= req.body.copyright_text;
  		var address  	   		= req.body.address;
  		var geo_code	   		= req.body.geo_code;
  		var recaptcha_site_key  = req.body.recaptcha_site_key;

  		var header_logo = req.files.header_logo;
  	

	  	var header_logo_image= '';
	  	if(typeof header_logo=="undefined"){

	  			var header_logo_image = '';
	  	}else{
		  	var newname = changename(header_logo.name);
		  	var filepath = path.join('/',"public/images/"+newname);
		  		header_logo.mv(filepath, function(err){
					if(err){
						console.log(err);
						return;
					}
				});

		    var header_logo_image = newname
		}	

		var footer_logo = req.files.footer_logo;
  	
  		
	  	var footer_logo_image= '';
	  	if(typeof footer_logo=="undefined"){

	  			var footer_logo_image = '';
	  	}else{
		  	var ff = changename(footer_logo.name);
		  	var filepath = path.join('/',"public/images/"+ff);
		  		footer_logo.mv(filepath, function(err){
					if(err){
						console.log(err);
						return;
					}
				});

		    var footer_logo_image = ff
		}	

  		var data       = {
				school_title        : school_title,
				school_email	    : school_email,
				phone     			: phone,
				fax 				: fax,
				copyright_text		: copyright_text,
				address 			: address,
				geo_code		    : geo_code,
				recaptcha_site_key  : recaptcha_site_key,
				header_logo 		: header_logo_image,
				footer_logo 		: footer_logo_image
   		 		}

  		var table   = {tablename:'tbl_frontend_settings'};
  	    var where='';
  	    admin.updateWhere(table,where,data, function(err, result){
  	    	res.redirect(res.locals.appName+'/admin/website')
  	    });

  	}else if(type =='slider'){
  		var title       = req.body.slider_title;
  		var description = req.body.slider_description;
  		var files       = req.files;
  		console.log(files);
  		async.forEachOf(title, function(item, key, callback){
  			var image  = '';
  			var slider = req.files.slider_image;
  			if(slider!="undefined"){
			    if(slider.length>1){
  				

	  				var slider_image = req.files.slider_image[key];
	  	
	  		
				  	var image= '';
				  	if(typeof slider_image=="undefined"){

				  			var image = '';
				  	}else{
					  	var ff = changename(slider_image.name);
					  	var filepath = path.join('/',"public/images/"+ff);
					  		slider_image.mv(filepath, function(err){
								if(err){
									console.log(err);
									return;
								}
							});

					    var image = ff
					}	
				}else{
					var slider_image = req.files.slider_image;
	  	
	  		
				  	var image= '';
				  	if(typeof slider_image=="undefined"){

				  			var image = '';
				  	}else{
					  	var ff = changename(slider_image.name);
					  	var filepath = path.join('/',"public/images/"+ff);
					  		slider_image.mv(filepath, function(err){
								if(err){
									console.log(err);
									return;
								}
							});

					    var image = ff
					}	
				}
			}

				var data  = {
						title  			: title[key],
						description     : description[key],
						image  			: image
				}
				var table   = {tablename:'tbl_frontend_slider'};
				admin.insert_all(table,data,function(err, result){	

				});
				//console.log(data);
		});

		res.redirect(res.locals.appName+'/admin/website')
  	}else if(type =='gallery'){

  	    var fd = req.body.date;
		var fromDate = fd.split(" ");
		var dates    = formatDate(fromDate[0],fromDate[1] + " " + fromDate[2]);// 
  		var title   	  	= req.body.title;
  		var description   	= req.body.gallery_description;
  		var show_on_website = req.body.show_on_website;
  		var gallery_image   = req.files.gallery_image;
  		var youtube_link    = req.body.youtube_link;
  		
  		

	    
  		var cover_image = req.files.cover_image;
  		
  		
	  	var cover_logo= '';
	  	if(typeof cover_image=="undefined"){

	  			var cover_logo = '';
	  	}else{
		  	var ff = changename(cover_image.name);
		  	var filepath = path.join('/',"public/images/"+ff);
		  		cover_image.mv(filepath, function(err){
					if(err){
						console.log(err);
						return;
					}
				});

		    var cover_logo = ff
		}	


  		var gallery_data   = {
  			title  			: title,
  			description     : description,
  			show_on_website : show_on_website,
  			date_added      : dates,
  			image 			: cover_logo
  		}

  		var table   = {tablename:'tbl_frontend_gallery'};
		admin.insert_all(table,gallery_data,function(err, result){	
		    var frontend_gallery_id  = result;
		    var gallery_image = req.files.gallery_image;

		    if(gallery_image!="undefined"){
			    if(gallery_image.length>1){
			    	async.forEachOf(gallery_image, function(item, key, callback){
						var gallery_logo= '';

						console.log(item)

					  	if(typeof item=="undefined"){

					  			var gallery_logo = '';
					  	}else{
						  	var ff = changename(item.name);
						  	var filepath = path.join('/',"public/images/"+ff);
						  		item.mv(filepath, function(err){
									if(err){
										console.log(err);
										return;
									}
								});

						    var gallery_logo = ff
						}	

						var gallery_image = {
							frontend_gallery_id  : frontend_gallery_id,
							image 			     : gallery_logo
						}

						var table_gallery_image  = {tablename:'tbl_frontend_gallery_image'}
						admin.insert_all(table_gallery_image,gallery_image,function(err, result){	

						});		
					 	 		  
		    		callback();
					}, function(err){
					  if(err) {
					    console.log(err);
					    callback(err);
					  }else{
					  	 // res.send('1');
					  }
					});
			    }else{
			    	
				  	var gallery_logo= '';
				  	if(typeof gallery_image=="undefined"){

				  			var gallery_logo = '';
				  	}else{
					  	var ff = changename(gallery_image.name);
					  	var filepath = path.join('/',"public/images/"+ff);
					  		gallery_image.mv(filepath, function(err){
								if(err){
									console.log(err);
									return;
								}
							});

					    var gallery_logo = ff
					}	

					var gallery_image = {
						frontend_gallery_id  : frontend_gallery_id,
						image 			     : gallery_logo
					}

					var table_gallery_image  = {tablename:'tbl_frontend_gallery_image'}
					admin.insert_all(table_gallery_image,gallery_image,function(err, result){	

					});



			    }
			}

			if(youtube_link!=''){
					async.forEachOf(youtube_link, function(item, key, callback){
				     	var youtube_link = {
						frontend_gallery_id   : frontend_gallery_id,
						frontend_youtube_link : item
						}

					var table_youtube  = {tablename:'tbl_frontend_gallery_youtube'}
					admin.insert_all(table_youtube,youtube_link,function(err, result){	

					});
					callback();
					}, function(err){
					  if(err) {
					    console.log(err);
					    callback(err);
					  }else{
					  	 // res.send('1');
					  }
					});
			}

			res.redirect(res.locals.appName+'/admin/website');

		});
  		console.log(req.files.gallery_image);

  		console.log(req.body);
  	}
  	
  
  
		
	
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});
router.get("/accounting_fee_type", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table  = 'tbl_class';
		if(req.query.id){
	  	  	findObj={fee_type_id:req.query.id}
		  	tableobj={tablename:'tbl_fee_type'}
	        admin.findWhere(tableobj,findObj,function(err,result){
	          
	           $data=JSON.parse(JSON.stringify(result));
	           admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
		           	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/accounting_fee_type", message : req.flash('msg'),fee_data:$data[0],class_list:class_list,fees_type:''};   	
		           	res.render("admin_layout", pagedata);
	        	});
	        });
	  	}else{
	  		
			admin.findAll({table:table},function(err, result){
			    var class_list 	 = result;
				var table_fees   = 'tbl_fee_type';
				admin.findFeeType({table:table_fees},function(err, result){
					var fees_type    = result;
					var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/accounting_fee_type", message : req.flash('msg'),fee_data:'',class_list:class_list,fees_type:fees_type};
					res.render("admin_layout", pagedata);
				});
			});
		}
	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


/// get student by class id
router.get("/get_student_by_class_id", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year= req.session.session_year;
		var class_id    =req.query.class_id
		var section_id  =req.query.section_id 
		//var section_id =req.query.section_id
	    var table = {tbl_registration:'tbl_registration',tbl_enroll:'tbl_enroll'};
	    admin.getstudentlist_by_class(table,{class_id:class_id,session_year:year,section_id:section_id},function(err, result){
		   var student_list = result;
		  // console.log(student_list)
		   res.send({student_list:student_list});
		   
			    
		});
     }else{
	      
		  website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.post("/add_fee_type", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		
		var table   = {tablename:'tbl_fee_type'};
	 	var data 	= {
			 		class_id         :req.body.class_id,
			 		fee_type         :req.body.fee_type,	 		
			 		session_year     :req.session.session_year,
			 		created_date 	 :moment().format('YYYY-MM-DD:hh:mm:ss')
		}	

       if(req.body.fee_type_id)
	     {
	     	var update_array 	= {
			 		class_id         :req.body.class_id,
			 		fee_type         :req.body.fee_type,	 		
			 		session_year     :req.session.session_year
			 		
			}	

			
	        var where       = {fee_type_id:req.body.fee_type_id}
		    admin.updateWhere(table,where,update_array, function(err, result){  
                 if(result)
		      	 {
		      		res.redirect(res.locals.appName+"/admin/accounting_fee_type");
		      	 }
		    });
	     }
     	else 
     	{
	     	admin.insert_all(table,data,function(err, result){
	     		var table_class  = 'tbl_class';
				admin.findAll({table:table_class},function(err, result){
				    var class_list 	 = result;
				    var table_fees   = 'tbl_fee_type';
				    admin.findFeeType({table:table_fees},function(err, result){
				    	var fees_type    = result;
						var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/accounting_fee_type", message : req.flash('msg'),class_list:class_list,fees_type:fees_type,fee_data:''};
						res.render("admin_layout", pagedata);
					});
				});
			});	
     	}



	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/fees_type_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
	 var table_fees   = 'tbl_fee_type';
				admin.findFeeType({table:table_fees},function(err, result){
				    	var fees_type    = result;
						var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/fee_type_list", message : req.flash('msg'),fees_type:fees_type};
						res.render("admin_layout", pagedata);
			    });
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


// accounting term starts
router.get("/accounting_term", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table  = 'tbl_class';
		if(req.query.id){
	  	  	findObj={term_id:req.query.id}
		  	tableobj={tablename:'tbl_fees_term'}
	        admin.findWhere(tableobj,findObj,function(err,result){
	          
	           $data=JSON.parse(JSON.stringify(result));
	           admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
		           	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/accounting_fee_term", message : req.flash('msg'),fee_data:$data[0],class_list:class_list,fees_term:''};   	
		           	res.render("admin_layout", pagedata);
	        	});
	        });
	  	}else{
	  		
			admin.findAll({table:table},function(err, result){
			    var class_list 	 = result;
				var table_fees   = 'tbl_fees_term';
				admin.findFeeType({table:table_fees},function(err, result){
					var fees_term    = result;
					var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/accounting_fee_term", message : req.flash('msg'),fee_data:'',class_list:class_list,fees_term:fees_term};
					res.render("admin_layout", pagedata);
				});
			});
		}
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.post("/add_fee_term", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		
		var table   = {tablename:'tbl_fees_term'};
	 	var data 	= {
			 		class_id         :req.body.class_id,
			 		term_name        :req.body.term_name,	 		
			 		session_year     :req.session.session_year,
			 		start_date       :req.body.start_date,
			 		end_date         :req.body.end_date,
			 		created_date 	 :moment().format('YYYY-MM-DD:hh:mm:ss')
		}	

       if(req.body.term_id)
	     {
	     	var update_array 	= {
			 		class_id         :req.body.class_id,
			 		term_name        :req.body.term_name,	 		
			 		session_year     :req.session.session_year,
			 		start_date       :req.body.start_date,
			 		end_date         :req.body.end_date,
			 		
			}	
	        var where       = {term_id:req.body.term_id}
		    admin.updateWhere(table,where,update_array, function(err, result){  
                 if(result)
		      	 {
		      		res.redirect(res.locals.appName+"/admin/accounting_term");
		      	 }
		    });
	     }
     	else 
     	{
	     	admin.insert_all(table,data,function(err, result){
	     		var table_class  = 'tbl_class';
				admin.findAll({table:table_class},function(err, result){
				    var class_list 	 = result;
				    var tbl_fee_term   = 'tbl_fees_term';
				    admin.findFeeType({table:tbl_fee_term},function(err, result){
				    	var fees_term    = result;
						var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/accounting_fee_term", message : req.flash('msg'),class_list:class_list,fees_term:fees_term,fee_data:''};
						res.render("admin_layout", pagedata);
					});
				});
			});	
     	}



	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/fees_term_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
		    var table_fees   = 'tbl_fees_term';
			
			admin.findFeeType({table:table_fees},function(err, result){
				    	var fees_term    = result;
						var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/fees_term_list", message : req.flash('msg'),fees_term:fees_term};
						res.render("admin_layout", pagedata);
			    });
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

// accounting fees term ends

// accounting fees structure starts
router.get("/fee_structure", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table  = 'tbl_class';
		if(req.query.id){
	  	  	findObj={fees_id:req.query.id}
		  	tableobj={tablename:'tbl_fees_structure'}
	        admin.findWhere(tableobj,findObj,function(err,result){
	          
	           $data=JSON.parse(JSON.stringify(result));
	           
	           var class_id   = $data[0].class_id;
	           var term_table = {tablename:'tbl_fees_term'}
	            admin.findTermById(term_table,{class_id:class_id},function(err, result){
	            	
	            	var fees_term   = result;
	            	var type_table  = {tablename:'tbl_fee_type'}
	            	admin.findTypeById(type_table,{class_id:class_id},function(err, result){
	            		var fees_type  = result;
			            admin.findAll({table:table},function(err, result){
						    var class_list 	 = result;
				           	var pagedata 	 = {title : "Edurecords", appName :res.locals.appName,pagename : "admin/fees_structure", message : req.flash('msg'),fee_data:$data[0],class_list:class_list,fees_structure:'',fees_term:fees_term,fees_type:fees_type};   	
				           	res.render("admin_layout", pagedata);
			        	});
		      	    });
	       		});
	        });
	  	}else{
	  		
			admin.findAll({table:table},function(err, result){
			    var class_list 	 = result;
				var table_fees   = 'tbl_fees_structure';
				admin.findFeesStructure({table:table_fees},function(err, result){
					var fees_structure    = result;
					var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/fees_structure", message : req.flash('msg'),fee_data:'',class_list:class_list,fees_structure:fees_structure};
					res.render("admin_layout", pagedata);
				});
			});
		}
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.post("/add_fees_structure", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		
		var table   = {tablename:'tbl_fees_structure'};
	 	var data 	= {
			 		class_id         :req.body.class_id,
			 		fees_term_id     :req.body.fees_term_id,
			 		fees_type_id     :req.body.fees_type_id,	 		
			 		session_year     :req.session.session_year,
			 		fees_amount      :req.body.fees_amount,
			 		created_date 	 :moment().format('YYYY-MM-DD:hh:mm:ss')
		}	

       if(req.body.fees_id)
	     {
	     	var update_array 	= {
			 		class_id         :req.body.class_id,
			 		fees_term_id     :req.body.fees_term_id,
			 		fees_type_id     :req.body.fees_type_id,	 		
			 		session_year     :req.session.session_year,
			 		fees_amount      :req.body.fees_amount
			 		
			}	
	        var where       = {fees_id:req.body.fees_id}
		    admin.updateWhere(table,where,update_array, function(err, result){  
                 if(result)
		      	 {
		      		res.redirect(res.locals.appName+"/admin/fee_structure");
		      	 }
		    });
	     }
     	else 
     	{
	     	admin.insert_all(table,data,function(err, result){
	     		var table_class  = 'tbl_class';
				admin.findAll({table:table_class},function(err, result){
				    var class_list 	 = result;
				    var table_fees   = 'tbl_fees_structure';
					admin.findFeesStructure({table:table_fees},function(err, result){
						var fees_structure    = result;
						var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/fees_structure", message : req.flash('msg'),fee_data:'',class_list:class_list,fees_structure:fees_structure};
						res.render("admin_layout", pagedata);
					});
				});
			});	
     	}



	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/fees_structure_list", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
		{
		    var table_fees   = 'tbl_fees_structure';
			admin.findFeesStructure({table:table_fees},function(err, result){
				var fees_structure    = result;
				var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/fees_structure_list", message : req.flash('msg'),fees_structure:fees_structure};
				res.render("admin_layout", pagedata);
			});
	}else{
	        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});
// get fees type and term on the basis of class
router.get("/get_fess_tt", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year     = req.session.session_year;
		var class_id = req.query.class_id
		//var section_id =req.query.section_id
	    var table_term = {tbl_name : 'tbl_fees_term'};
	    var table_type = {tbl_name : 'tbl_fee_type'};
	    admin.get_fees_type(table_type,{class_id:class_id,session_year:year},function(err, result){
	    	var type_list  = result;
		    admin.get_fees_term(table_term,{class_id:class_id,session_year:year},function(err, result){
			   var term_list = result;
			   
			   res.send({term_list:term_list,type_list:type_list});
			   
				    
			});
		});
     }else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


// Student Fees Paymemt System

router.get("/student_payment", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		
		var table  = 'tbl_class';
		if(req.query.id){
	  	  	findObj={fee_type_id:req.query.id.toString()}
		  	tableobj={tablename:'tbl_fee_type'}
	        admin.findWhere(tableobj,findObj,function(err,result){
	          
	           $data=JSON.parse(JSON.stringify(result));
	           admin.findAll({table:table},function(err, result){
				    var class_list 	 = result;
		           	var pagedata 	 = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/accounting_fee_type", message : req.flash('msg'),fee_data:$data[0],class_list:class_list,fees_type:''};   	
		           	res.render("admin_layout", pagedata);
	        	});
	        });
	  	}else{
	  		
			admin.findAll({table:table},function(err, result){
			    var class_list 	 = result;
				
				var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/student_payment", message : req.flash('msg'),class_list:class_list};
				res.render("admin_layout", pagedata);
				
			});
		}
	}else{

	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


// get fees detail by class and student id
router.get("/ajax_get_student_fees", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year        = req.session.session_year;
		var class_id    = req.query.class_id;
		var student_id  = req.query.student_id;

		var total 	 = 0;
		var paid 	 = 0;
	    var discount = 0;
		var table  = {tablename : 'tbl_fees_structure'}
			admin.getFeesDetail(table,{class_id:class_id,session_year:year},function(err, result){
			    var fees_detail 	 = result;
			    
				//console.log(fees_detail);
				var table_student    = {tablename : 'tbl_registration'}
				admin.getStudentFees(table_student,{registration_id:student_id},function(err, result){
					var transport_fees   = result;
					 

					fees_detail.forEach(function(item, index){
				 	 	  fees_detail[index].amount_paid="";
				 	 	  fees_detail[index].discount="";
				 	 	  
				 	   });
                    var i=0;
					async.each(fees_detail, function (item, done){
					
						var fees_id  = item.fees_id;
					
						var table_payment  = {tablename :'tbl_student_payment'};
						admin.get_paid_fees(table_payment,{fees_id:fees_id,student_id:student_id},function(err, result){
						
					  	if(result=='' || result==undefined || result.length === 0){
	                        fees_detail[i].amount_paid = 0.00;
	                        fees_detail[i].discount    = 0.00;
	                        i++;
	                    }
	                    else{
	                    	
	                        fees_detail[i].amount_paid = result[0].amount;
	                        fees_detail[i].discount    = result[0].discount;
	                         i++;
	                        
	                    }
	                     total  	+= parseInt(item.fees_amount);
	                     paid   	+= parseInt(item.amount_paid);
	                     discount   += parseInt(item.discount);
	                    done(null);
	                    
					  	
					  	})
					  	 
					 
				     	 
					
					}, function(){
						
						var table_payment  = {tablename:'tbl_student_payment_master'}
							admin.getFeesReceipt(table_payment,{student_id:student_id},function(err, result){
								var fees_receipt  = result;
								//console.log(fees_receipt);return false;
								var table_transport   = {tablename : 'tbl_registration'}
								admin.getTransportFeesReceipt(table_transport,{student_id:student_id},function(err, result){var transport_receipt   = result;	
									res.send({fees_detail:fees_detail,transport_fees:transport_fees,fees_receipt:fees_receipt,transport_receipt:transport_receipt,total:total,paid:paid,discount,discount});
								});
								
							});
	             	});		
		
		   
				
				
				});
			});
		
     }else{
	      
		   website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


//get transport fees data
router.get("/ajax_get_transport_fees", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year        = req.session.session_year;
		
		var student_id  = req.query.user_id;

		
		var table_student   	 = {tablename : 'tbl_registration'}
			admin.getStudentFees(table_student,{registration_id:student_id},function(err, result){
				var transport_fees   = result;
				res.send({transport_fees:transport_fees});
				

			});
		
     }else{
	      
		    website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});
// pay fees detail
router.get("/get_payment_data", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year        = req.session.session_year;
		var user_id    	= req.query.user_id;
		var fees        = req.query.fees;
		console.log('user_id',user_id);
		console.log('fees_id',fees);
		 var detail = [];
		 var n = 0;
		 		async.each(fees, function (item, done){
			 		 var fees_id   =  item;
			 		 //console.log(fees_id)
			 		 var Table = {tablename : 'tbl_fees_structure'}
					 admin.find_pay_fees(Table,{fees_id:fees_id,session_year:year},function(err, result1){
				     var fees_detail  = Object.values(JSON.parse(JSON.stringify(result1)));
				    	
				      detail[n]  = fees_detail[0];
				     
				     
				     done(null);
				     n++;
					});
				}, function(){
					//  console.log(detail)
					detail.forEach(function(item, index){
				 	 	  detail[index].amount_paid="";
				 	 	  detail[index].discount="";
				 	 	  
				 	   });
                    var i=0;
					async.each(detail, function (item, done){
					//	console.log(item)
						var fees_id  = item.fees_id;
					//	console.log(fees_id);
						var table_payment  = {tablename :'tbl_student_payment'};
						admin.get_paid_fees(table_payment,{fees_id:fees_id,student_id:user_id},function(err, result){
						
					  	if(result=='' || result==undefined){
	                      //	console.log(result)
 							detail[i].amount_paid = 0.00;
	                        detail[i].discount    = 0.00;
	                         i++;
	                      	
	                      	//fees_detail.push({'amount_paid':result[0].amount});
	                       
	                    }
	                    else{
	                         detail[i].amount_paid = result[0].amount;
	                        detail[i].discount    = result[0].discount;
	                         i++;
	                    }
	                     done(null);
	                    
					  	
					  	})
					  	 
					 
				     	 
					
					}, function(){
						   console.log('feeesssss',detail)
	                      res.send({fees_detail:detail});
				  	});		

                     // res.send({fees_detail:detail});
			  	});		
		
		
     }else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

// pay fees detail
router.get("/pay_fees", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year      			  = req.session.session_year;
		var amount    			  = req.query.amount;
		var fee_id      		  = req.query.fee_id;
		var discount              = req.query.discount;
		var payment_number        = req.query.payment_number;
		var user_id               = req.query.user_id;
		var type                  = req.query.type;
		var fees_type             = req.query.fee_type;
		var fees_term    		  = req.query.term_name;
		
		if(amount.filter)
		var insert_data = [];
		var text 	 	= "";
		var possible 	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var table    	= {tablename:'tbl_student_payment_master'}
		for (var i = 0; i < 5; i++){
		    text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		
		var n=0;  
		if(amount!='' && discount!=''){
			console.log('1');
			async.forEachOf(amount, function(item, key, callback){
				if(amount[key]==''){
					amount[key] = 0.00;
				}
				if(discount[key]==''){
					discount[key] = 0.00;
				}
				insert_data   = {
				 		'fees_id'       : fee_id[key],
	                    'amount'        : parseFloat(amount[key]),
	                    'discount'      : parseFloat(discount[key]),
	                    'payment_number': payment_number[key],
	                    'type'          : type[key],
	                    'collected_by'  : 'Admin',
	                    'student_id'    : user_id,
	                    'date'          : moment().format('YYYY-MM-DD:hh:mm:ss'),
	                    'year'          : req.session.session_year,
	                    'receipt_number': text,
	                    'fees_type'     : fees_type[key],
	                    'fees_term'		: fees_term[key]

			    }

			   
				admin.insert_all(table,insert_data,function(err, result){	
						admin.getStudentDetail({registration_id:user_id},function(err, result){
				        	
					    	var mobileNo      = result[0].parent_number;
					    	var amount_new    = parseFloat(amount[key])  +  parseFloat(discount[key]);
					    	var current_date  = moment().format('DD-MM-YYYY')
					    	var message   = "Dear Parent ,Your child "+result[0].student_name+" "+result[0].class_name+" class "+result[0].section_name+" section "+fees_term[key]+" Rs "+amount_new+" has paid ("+current_date+")";

					    	var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
							msg91.send(mobileNo, message, function(err, response){
					             //req.flash('success',"Homework sent successfully");
							});
		       			});
						
				    	var table_payment  = {tablename : 'tbl_student_payment'}
				    	
				    	//console.log(key)
				    	admin.findPayment(table_payment,{fees_id:fee_id[key],student_id :user_id},function(err, result){
				    		if(result=='' || result==undefined){
				    			insert_data   = {
							 		'fees_id'       : fee_id[key],
				                    'amount'        : amount[key],
				                    'discount'      : discount[key],
				                    'payment_number': payment_number[key],
				                    'type'          : type[key],
				                    'collected_by'  : 'Admin',
				                    'student_id'    : user_id,
				                    'date'          : moment().format('YYYY-MM-DD:hh:mm:ss'),
				                    'year'          : req.session.session_year,
				                    'receipt_number': text,
				                     'fees_type'     : fees_type[key],
	                    		    'fees_term'		: fees_term[key]
						    	}
				    			admin.insert_all(table_payment,insert_data,function(err, result){
				    			});
				    		}else{
				    			 console.log(result);
				    			 var total_amount     = (Number(result[0].amount)   + Number(amount[key])); 
		                         var discount_amount  = (Number(result[0].discount) + Number(discount[key]));
		                         var update_data  	  = {
		                         	'amount'   : total_amount,
		                         	'discount' : discount_amount

		                         }
		                         var where  = {payment_id : result[0].payment_id}
		                         admin.updateWhereAccounting(table_payment,where,update_data, function(err, result){ 
		                         });
				    		}

				    		
				    	});
				});	
			
			  //console.log('/brokers/topics/' + topic + '/partitions/' + key + '/state');
			  callback();
			}, function(err){
			  if(err) {
			    console.log(err);
			    callback(err);
			  }else{
			  	  
			  	  res.send('1');
			  }
			});
		}else if(amount==''  && discount!='') {
						

			async.forEachOf(discount, function(item, key, callback){
				if(amount[key]==''){
					amount[key] = 0.00;
				}
				if(discount[key]==''){
					discount[key] = 0.00;
				}
				insert_data   = {
				 		'fees_id'       : fee_id[key],
	                    'amount'        : parseFloat(amount[key]),
	                    'discount'      : parseFloat(discount[key]),
	                    'payment_number': payment_number[key],
	                    'type'          : type[key],
	                    'collected_by'  : 'Admin',
	                    'student_id'    : user_id,
	                    'date'          : moment().format('YYYY-MM-DD:hh:mm:ss'),
	                    'year'          : req.session.session_year,
	                    'receipt_number': text,
	                    'fees_type'     : fees_type[key],
	                    'fees_term'		: fees_term[key]
			    	}

			   
				    admin.insert_all(table,insert_data,function(err, result){	
				    	admin.getStudentDetail({registration_id:user_id},function(err, result){
				        	
					    	var mobileNo      = result[0].parent_number;
					    	var amount_new    = parseFloat(amount[key])  +  parseFloat(discount[key]);
					    	var current_date  = moment().format('DD-MM-YYYY')
					    	var message   = "Dear Parent ,Your child "+result[0].student_name+" "+result[0].class_name+" class "+result[0].section_name+" section "+fees_term[key]+" Rs"+amount_new+" has paid ("+current_date+")";

					    	var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
							msg91.send(mobileNo, message, function(err, response){
					             //req.flash('success',"Homework sent successfully");
							});
		       			});
				    	var table_payment  = {tablename : 'tbl_student_payment'}
				    	
				    	console.log(key)
				    	admin.findPayment(table_payment,{fees_id:fee_id[key],student_id :user_id},function(err, result){
				    		if(result=='' || result==undefined){
				    			insert_data   = {
							 		'fees_id'       : fee_id[key],
				                    'amount'        : amount[key],
				                    'discount'      : discount[key],
				                    'payment_number': payment_number[key],
				                    'type'          : type[key],
				                    'collected_by'  : 'Admin',
				                    'student_id'    : user_id,
				                    'date'          : moment().format('YYYY-MM-DD:hh:mm:ss'),
				                    'year'          : req.session.session_year,
				                    'receipt_number': text,
				                    'fees_type'     : fees_type[key],
	                   				'fees_term'		: fees_term[key]
						    	}
				    			admin.insert_all(table_payment,insert_data,function(err, result){
				    			});
				    		}else{
				    			 console.log(result);
				    			 var total_amount     = (Number(result[0].amount)   + Number(amount[key])); 
		                         var discount_amount  = (Number(result[0].discount) + Number(discount[key]));
		                         var update_data  	  = {
		                         	'amount'   : total_amount,
		                         	'discount' : discount_amount

		                         }
		                         var where  = {payment_id : result[0].payment_id}
		                         admin.updateWhereAccounting(table_payment,where,update_data, function(err, result){ 
		                         });
				    		}

				    		
				    	});
				    });	
			
			  //console.log('/brokers/topics/' + topic + '/partitions/' + key + '/state');
			  callback();
			}, function(err){
			  if(err) {
			    console.log(err);
			    callback(err);
			  }else{
			  	  res.send('1');
			  }
			});
		}else if(amount!=''  && discount=='') {
						

			async.forEachOf(amount, function(item, key, callback){
				if(amount[key]==''){
					amount[key] = 0.00;
				}
				if(discount[key]==''){
					discount[key] = 0.00;
				}
				insert_data   = {
				 		'fees_id'       : fee_id[key],
	                    'amount'        : parseFloat(amount[key]),
	                    'discount'      : parseFloat(discount[key]),
	                    'payment_number': payment_number[key],
	                    'type'          : type[key],
	                    'collected_by'  : 'Admin',
	                    'student_id'    : user_id,
	                    'date'          : moment().format('YYYY-MM-DD:hh:mm:ss'),
	                    'year'          : req.session.session_year,
	                    'receipt_number': text,
	                    'fees_type'     : fees_type[key],
	                    'fees_term'		: fees_term[key]
			    	}

			   
				    admin.insert_all(table,insert_data,function(err, result){	
				    	admin.getStudentDetail({registration_id:user_id},function(err, result){
				        	
					    	var mobileNo      = result[0].parent_number;
					    	var amount_new    = parseFloat(amount[key])  +  parseFloat(discount[key]);
					    	var current_date  = moment().format('DD-MM-YYYY')
					    	var message   = "Dear Parent ,Your child "+result[0].student_name+" "+result[0].class_name+" class "+result[0].section_name+" section "+fees_term[key]+" Rs"+amount_new+" has paid ("+current_date+")";

					    	var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
							msg91.send(mobileNo, message, function(err, response){
					             //req.flash('success',"Homework sent successfully");
							});
		       			});
				    	var table_payment  = {tablename : 'tbl_student_payment'}
				    	
				    	console.log(key)
				    	admin.findPayment(table_payment,{fees_id:fee_id[key],student_id :user_id},function(err, result){
				    		if(result=='' || result==undefined){
				    			insert_data   = {
							 		'fees_id'       : fee_id[key],
				                    'amount'        : amount[key],
				                    'discount'      : discount[key],
				                    'payment_number': payment_number[key],
				                    'type'          : type[key],
				                    'collected_by'  : 'Admin',
				                    'student_id'    : user_id,
				                    'date'          : moment().format('YYYY-MM-DD:hh:mm:ss'),
				                    'year'          : req.session.session_year,
				                    'receipt_number': text,
				                    'fees_type'     : fees_type[key],
	                    			'fees_term'		: fees_term[key]
						    	}
				    			admin.insert_all(table_payment,insert_data,function(err, result){
				    			});
				    		}else{
				    			 console.log(result);
				    			 var total_amount     = (Number(result[0].amount)   + Number(amount[key])); 
		                         var discount_amount  = (Number(result[0].discount) + Number(discount[key]));
		                         var update_data  	  = {
		                         	'amount'   : total_amount,
		                         	'discount' : discount_amount

		                         }
		                         var where  = {payment_id : result[0].payment_id}
		                         admin.updateWhereAccounting(table_payment,where,update_data, function(err, result){ 
		                         });
				    		}

				    		
				    	});
				    });	
			
			  //console.log('/brokers/topics/' + topic + '/partitions/' + key + '/state');
			  callback();
			}, function(err){
			  if(err) {
			    console.log(err);
			    callback(err);
			  }else{

			  	  res.send('1');
			  }
			});
		}
        
        
    	//admin.getStudentDetail()
     }else{

	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		  });
	}
});

router.get("/insert_transport_payment", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year      			  = req.session.session_year;
		var amount    			  = req.query.amount;
		var discount              = req.query.discount;
		var payment_number        = req.query.payment_number;
		var student_id            = req.query.student_id;
		var type                  = req.query.type;

		
		
		var insert_data = [];
		var text 	 	= "";
		var possible 	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var table    	= {tablename:'tbl_transport_payment_master'}
		for (var i = 0; i < 5; i++){
		    text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		if(amount==''){
					amount = 0.00;
		}
	   if(discount==''){
					discount = 0.00;
		}
		insert_data   = {
				'receipt_number'    : text,
                'student_id'        : student_id,
                'type'              : type,
                'payment_number'    : payment_number,
                'amount'            : parseFloat(amount),
                'discount'          : parseFloat(discount),
                'date'              : moment().format('YYYY-MM-DD:hh:mm:ss'),
                'year'              : year,
                'collected_by'      : 'Admin'
			 		
		    	}



		  admin.insert_all(table,insert_data,function(err, result){	
		  	admin.getStudentDetail({registration_id:student_id},function(err, result){
				        	
					    	var mobileNo      = result[0].parent_number;
					    	var amount_new    = parseFloat(amount)  +  parseFloat(discount);
					    	var current_date  = moment().format('DD-MM-YYYY')
					    	var message   = "Dear Parent ,Your child "+result[0].student_name+" "+result[0].class_name+" class "+result[0].section_name+" section Transport Fees Rs"+amount_new+" has paid ("+current_date+")";

					    	var msg91 = require("msg91")(req.session.msgauthkey, req.session.senderid,req.session.route);
							msg91.send(mobileNo, message, function(err, response){
					             //req.flash('success',"Homework sent successfully");
							});
		       			});
		  	res.send('1');
		  });
	
    
		
     }else{

	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/payment_report", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
		var table  = 'tbl_class';
		var total_fee        = 0;
		var transport_amount = 0;
		admin.findAll({table:table},function(err, result){
		   	    var class_list 	 = result;
		   		async.each(class_list, function (itemA, callback) { //loop through array
   			 //process itemA

   			         var table_section  = {tablename:'tbl_section'}
   			 		 admin.findWhere(table_section,{ class_id : itemA.class_id.toString()}, function(err, section){
   			 		 	async.each(section, function (itemAChild, callback1) { //loop through array
						    //process itemAChild
						    var class_id   = itemA.class_id;
						    var section_id = itemAChild.section_id;
							var year       = req.session.session_year;
						    admin.getStudentCount(table_section,{ class_id : class_id,section_id:section_id,year:year}, function(err, count){
						    	var student_count  = count;
						    	//console.log(student_count[0].count_student);
						    	admin.getTotalFeesSchool(table_section,{ class_id : class_id}, function(err, total_fees){
                    				//console.log(total_fees[0]['fees_amount'])
                    				if(total_fees[0]['fees_amount']!=null && student_count!=0){
									
                    				total_fee += parseInt(student_count[0].count_student) * parseInt(total_fees[0]['fees_amount']);
                    				
                    				}

                    				admin.getTransportTotalFees(table_section,{class_id : class_id,section_id:section_id,year:year}, function(err, 	transport_fees){
                    					if(transport_fees!=''){
                    						transport_amount += parseInt(transport_fees[0].route_fare);
                    					}
                    					//console.log(transport_fees)
                    					callback1();
                    				});
						    	});
						    });

						   // callback1();
						     
					    }, function(err) {
						    	 
						    
						      callback();
						});

   			 		 });
						

						//callback();
			    }, function(err) {
			    	//var paid_amount = 0;
			    	//var paid_discount = 0;
			    	//var paid_transport_amount = 0;
			    	var total_fees  = total_fee + transport_amount;
			    	console.log(total_fees)
			    	admin.getTotalPaidFees(function(err,amount){
			    		console.log(amount[0].amount);
			    		if(amount[0]==''){
			    			console.log('a')
			    			var paid_amount    = 0.00;
			    			var paid_discount  = 0.00;
			    		}else{
			    			console.log('2')
			    			var paid_amount    = amount[0].amount;
			    			var paid_discount  = amount[0].discount;
			    		}


			    		admin.getTotalPaidTransportFees(function(err,transport){
			    		console.log(transport);
			    		if(transport!=''){
			    			var paid_transport_amount    = parseInt(transport[0].amount) + parseInt(transport[0].discount);
			    		}else{
			    			var paid_transport_amount    = 0.00;
			    			
			    		}
				    	
				    	var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/payment_report", message : req.flash('msg'),class_list:class_list,total_fees:total_fees,paid_amount:paid_amount,paid_discount:paid_discount,paid_transport_amount:paid_transport_amount};
						res.render("admin_layout", pagedata);

			    	});


			    	});

			    	
						
				});
			
		});
    }else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});



router.get("/ajax_get_payment_receipt_data", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year      			  = req.session.session_year;
		var class_id    	      = req.query.class_id;
		var fees_term_id          = req.query.fees_term_id;
		var fee_type_id        	  = req.query.fee_type_id;
		var section_id        	  = req.query.section_id;
		var balance      		  = req.query.balance;
		var type 				  = req.query.type;
		// console.log('abvc',type);
		// console.log(class_id);
		// console.log(fees_term_id);
		// console.log(fee_type_id);
		

            var table        = {tablename : 'tbl_enroll'}
     		var fee_payment  = '';
     		if(class_id!='' && section_id!=''){
     		  	var obj  =  {class_id:class_id,year:year,section_id:section_id}
     		}else if(class_id!='' && section_id==''){
     			var obj  =  {class_id:class_id,year:year}
     		}
     		admin.getStudentByClassId(table,obj,function(err, result){
     			console.log(result);
		        var fee_payment 	 = result;
		   		 fee_payment.forEach(function(item, index){
		 	 	  //fee_payment[index].transport_fees ="";
		 	 	//  fee_payment[index].route_fare		="";
		 	 	  fee_payment[index].total_amount	="";
		 	 	  fee_payment[index].total_discount = "";
		 	 	  fee_payment[index].fees_amount    = "";
		 	 	  fee_payment[index].payment_date   = "";
		 	    });

		   		if(type==2){
				async.forEachOf(fee_payment, function(item, key, callback){
				var table_transport  = {tablename:'tbl_transport_payment_master'}	
			    admin.getTransportFeesByStudentId(table_transport,{student_id:fee_payment[key].student_id},function(err, result){
			    		
			    		var transport_data   = result;
			    		console.log(transport_data);
			    		if(transport_data!=undefined){
				    		if(transport_data[0]['route_fare']!=null){
		                        if(transport_data[0]['transport_paid_amount']!=null || transport_data[0]['transport_paid_discount']!=null ){
		                        
		                      //  fee_payment[key].transport_fees  = transport_data[0]['transport_paid_amount'] + transport_data[0]['transport_paid_discount'];
		                      //  fee_payment[key].transport_fees  = 0.00
		                        fee_payment[key].total_amount    = transport_data[0]['transport_paid_amount'];
		                        fee_payment[key].total_discount  = transport_data[0]['transport_paid_discount'];
		                        fee_payment[key].fees_amount     = transport_data[0]['route_fare'];
		                        fee_payment[key].payment_date    = moment(transport_data[0]['payment_date']).format('DD-MM-YYYY');
		                        
		                        }else{
		                        	
		                      //  fee_payment[key].transport_fees = 0.00;
		                        fee_payment[key].total_amount   = 0.00;
		                        fee_payment[key].total_discount = 0.00;
		                        fee_payment[key].fees_amount    = transport_data[0]['route_fare'];
		                        fee_payment[key].payment_date   = 'No Payment Done';
		                        }
	                     	}else{
	                     		fee_payment[key].total_amount   = 0.00;
		                        fee_payment[key].total_discount = 0.00;
		                       // fee_payment[key].transport_fees = 'No Transport Taken';
		                        fee_payment[key].fees_amount    =  'No Transport Taken';
		                        fee_payment[key].payment_date   = 'No Payment Done';
	                    	 }
                    	 }


                    	callback();
			    });
				
				}, function(err){
				  if(err) {
				    console.log(err);
				    callback(err);
				  }else{
				  //	console.log('ahaushd',fee_payment);
				  	if(balance==1){
				  		async.forEachOf(fee_payment, function(item, key, callback){
				  				  // 		if(fee_payment[key].route_fare=='No Transport Taken'){
							  			// 	fee_payment[key].route_fare  = 0;
							  			// }
							  			if(fee_payment[key].fees_amount=='' || fee_payment[key].fees_amount==null){
							  				fee_payment[key].fees_amount  = 0;
							  			}
							  			if(fee_payment[key].total_amount=='' || fee_payment[key].total_amount==null){
							  				fee_payment[key].total_amount  = 0;
							  			}
							  			if(fee_payment[key].total_discount=='' || fee_payment[key].total_discount==null){
							  				fee_payment[key].total_discount  = 0;
							  			}
							  			// if(fee_payment[key].transport_fees=='No Transport Taken' || fee_payment[key].transport_fees==null){
							  			// 	fee_payment[key].transport_fees  = 0;
							  			// }



							  			var remaining_amount   =  parseInt(fee_payment[key].fees_amount) - (parseInt(fee_payment[key].total_amount)+  parseInt(fee_payment[key].total_discount)) 
							  			if(remaining_amount==0){
							  				delete fee_payment[key];
							  			}
							  			// if(fee_payment[key].total_amount==0 && fee_payment[key].total_discount==0 && fee_payment[key].transport_fees==0){
							  			// 	delete fee_payment[key];
							  			// }

							  			 callback();
							  		}, function(err){
							  			 if(err) {

										    console.log(err);
										    callback(err);
										  }else{
										  	//console.log('auihduiahduihduiaduiaduid',fee_payment)

										  	res.send({fee_payment:fee_payment})
										  }
							  		});

				  	}else{
				  		//console.log('abc',fee_payment)
				  		//console.log(fee_payment);
				  		res.send({fee_payment:fee_payment})
				  	}
				
				  }
				});
				}else{
						async.forEachOf(fee_payment, function(item, key, callback){
				  			  var where1 = '';
		                      if (class_id!='') {
		                        where1 =  "tbl_fees_structure.class_id = "+class_id+"";
		                      }
		                      
		                      if (fee_type_id!='' && fee_type_id!=0) {
		                        where1 =  " "+where1+"  AND tbl_fees_structure.fees_type_id ="+fee_type_id+"";
		                      }
		                      if (fees_term_id!='') {
		                        where1 =  " "+where1+" AND tbl_fees_structure.fees_term_id = "+fees_term_id+"";
		                      }
		                      
		                      var table_payment  = {tablename:'tbl_student_payment_master'}
							 admin.getAccountingFeesByStudentId(table_payment,{student_id:fee_payment[key].student_id,where1},function(err, result){
							 	 fee_payment[key].total_amount  = result[0]['amount'];
							 	 fee_payment[key].total_discount  = result[0]['discount'];
							 	  fee_payment[key].payment_date     = moment(result[0]['payment_date']).format('DD-MM-YYYY');
							 	 var table_fees = {tablename : 'tbl_fees_structure'}
							 	 admin.getTotalFees(table_fees,{where1},function(err, result){
							 	 	var fees_amount  = result;
							 	 	fee_payment[key].fees_amount  = fees_amount[0]['fees_amount'];
							 	 	
							 	 callback();

							 	});
							 });
			    		
							
						}, function(err){
						  if(err) {
						    console.log(err);
						    callback(err);
						  }else{
						  		if(balance==1){
							  		async.forEachOf(fee_payment, function(item, key, callback){

							  			if(fee_payment[key].fees_amount=='' || fee_payment[key].fees_amount==null){
							  				fee_payment[key].fees_amount  = 0;
							  			}
							  			if(fee_payment[key].total_amount=='' || fee_payment[key].total_amount==null){
							  				fee_payment[key].total_amount  = 0;
							  			}
							  			if(fee_payment[key].total_discount=='' || fee_payment[key].total_discount==null){
							  				fee_payment[key].total_discount  = 0;
							  			}
							  			// if(fee_payment[key].transport_fees=='No Transport Taken' || fee_payment[key].transport_fees==null){
							  			// 	fee_payment[key].transport_fees  = 0;
							  			// }



							  			var remaining_amount   = (parseInt(fee_payment[key].route_fare) + parseInt(fee_payment[key].fees_amount) - (parseInt(fee_payment[key].total_amount)+  parseInt(fee_payment[key].total_discount) + parseInt(fee_payment[key].transport_fees))) 
							  			if(remaining_amount==0){
							  				delete fee_payment[key];
							  			}
							  			// if(fee_payment[key].total_amount==0 && fee_payment[key].total_discount==0 && fee_payment[key].transport_fees==0){
							  			// 	delete fee_payment[key];
							  			// }
							  			
							  			 callback();
							  		}, function(err){
							  			 if(err) {

										    console.log(err);
										    callback(err);
										  }else{
										  	console.log(fee_payment)

										  	res.send({fee_payment:fee_payment})
										  }
							  		});
						  		}else{

						  		
											res.send({fee_payment:fee_payment})
						  		}
						  }
						});

				}
			
		});
    
		
     }else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/ajax_get_payment_receipt_data_by_date", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var year      			  = req.session.session_year;
		var from    	          = req.query.from;
		var to         		      = req.query.to;
		var type    			  = req.query.type;
		//var balance      		  = req.query.balance;
	
	    var session_year	    = req.session.session_year

	     var table  		=  {tbl_attendance : 'tbl_attendance',tbl_enroll:'tbl_enroll',tbl_registration:'tbl_registration'}


           // var table  = {tablename : 'tbl_enroll'}
     		var fee_payment  = '';
     			
     		admin.getAllStudent(table,{session_year:session_year},function(err, result){
     			console.log('abc1',result);
		        var fee_payment 	 = result;
		   		  fee_payment.forEach(function(item, index){
		 	 	 // fee_payment[index].transport_fees = "";
		 	 	//  fee_payment[index].route_fare		= "";
		 	 	  fee_payment[index].total_amount	= "";
		 	 	  fee_payment[index].total_discount = "";
		 	 	  fee_payment[index].fees_amount    = "";
		 	 	   fee_payment[index].payment_date   = "";
		 	    });

		   		if(type==2){
				async.forEachOf(fee_payment, function(item, key, callback){
				var table_transport  = {tablename:'tbl_transport_payment_master'}	
				var where  = "date >= '"+from+"' AND date <= '"+to+"'";
				//var where = "(created_date BETWEEN '"+from+"' AND '"+to+"')"
			    admin.getTransportFeesByStudentId_date(table_transport,{student_id:fee_payment[key].registration_id,where},function(err, result){
			    		
			    		var transport_data   = result;
			    		console.log('abc2',transport_data);
			    		if(transport_data!=undefined){
				    		if(transport_data[0]['route_fare']!=null){
		                        if(transport_data[0]['transport_paid_amount']!=null || transport_data[0]['transport_paid_discount']!=null ){
		                        fee_payment[key].total_amount    = transport_data[0]['transport_paid_amount'];
		                        fee_payment[key].total_discount  = transport_data[0]['transport_paid_discount'];
		                        //fee_payment[key].transport_fees  = transport_data[0]['transport_paid_amount'] + transport_data[0]['transport_paid_discount'];
		                        fee_payment[key].fees_amount       = transport_data[0]['route_fare'];
		                        fee_payment[key].payment_date      = moment(transport_data[0]['payment_date']).format('DD-MM-YYYY');
		                        }else{
		                        	
		                        fee_payment[key].total_amount    = 0.00;
		                        fee_payment[key].total_discount  = 0.00;
		                        fee_payment[key].fees_amount     = transport_data[0]['route_fare'];
		                         fee_payment[key].payment_date   = 'No Payment Done';
		                        }
	                     	}else{
	                     		
		                        fee_payment[key].total_amount    = 0.00;
		                        fee_payment[key].total_discount  = 0.00;
		                        fee_payment[key].fees_amount     =  'No Transport Taken';
		                        fee_payment[key].payment_date   = 'No Payment Done';
	                    	 }
                    	 }


                    	callback();
			    });
				
				}, function(err){
				  if(err) {
				    console.log(err);
				    callback(err);
				  }else{
				  		async.forEachOf(fee_payment, function(item, key, callback){
							  			//console.log('#######################################');
							  			// if(fee_payment[key].route_fare=='No Transport Taken'){
							  			// 	fee_payment[key].route_fare  = 0;
							  			// }
							  			if(fee_payment[key].fees_amount=='' || fee_payment[key].fees_amount==null){
							  				fee_payment[key].fees_amount  = 0;
							  			}
							  			if(fee_payment[key].total_amount=='' || fee_payment[key].total_amount==null){
							  				fee_payment[key].total_amount  = 0;
							  			}
							  			if(fee_payment[key].total_discount=='' || fee_payment[key].total_discount==null){
							  				fee_payment[key].total_discount  = 0;
							  			}
							  			// if(fee_payment[key].transport_fees=='No Transport Taken' || fee_payment[key].transport_fees==null){
							  			// 	fee_payment[key].transport_fees  = 0;
							  			// }



							  			
							  			if(fee_payment[key].total_amount==0 && fee_payment[key].total_discount==0){
							  				delete fee_payment[key];
							  			}
							  			
							  			 callback();
							  		}, function(err){
							  			 if(err) {

										    console.log(err);
										    callback(err);
										  }else{
										  	console.log(fee_payment)
										  	
										  		res.send({fee_payment:fee_payment})
										  }
							  		});

				

				  }
				});

				}else{
						async.forEachOf(fee_payment, function(item, key, callback){
				  			  var where1 = '';
				  			//  var where1 = "(created_date BETWEEN '"+from+"' AND '"+to+"')"
		                     var where1  = "tbl_student_payment_master.date >= '"+from+"' AND tbl_student_payment_master.date <= '"+to+"'";
		                      
		                      var table_payment  = {tablename:'tbl_student_payment_master'}
							 admin.getAccountingFeesByStudentId(table_payment,{student_id:fee_payment[key].registration_id,where1},function(err, result){
							 	console.log('abc3',result[0])
							 	  if(result!=''){
								 	 fee_payment[key].total_amount  = result[0]['amount'];
								 	 fee_payment[key].total_discount  = result[0]['discount'];
								 	  if(result[0]['payment_date']!=undefined){
								 	  	fee_payment[key].payment_date   = moment(result[0]['payment_date']).format('DD-MM-YYYY');
								 	  }else{
								 	  	fee_payment[key].payment_date   = 'No Payment Done';
								 	  }
								 	 var table_fees = {tablename : 'tbl_fees_structure'}
								 	 var fees_id    = result[0]['fees_id'];
								 	 var where2     = "fees_id  = '"+fees_id+"'"; 
								 	 admin.getTotalFees(table_fees,{where1:where2},function(err, result1){
								 	 	var fees_amount  = result1;
								 	 	 fee_payment[key].fees_amount  = fees_amount[0]['fees_amount'];
								 	 	
								 	 callback();

								 	 });
							 	}
							 });
			    		
							
						}, function(err){
						  if(err) {
						    console.log(err);
						    callback(err);
						  }else{
						 
						  

						  			async.forEachOf(fee_payment, function(item, key, callback){

							  			if(fee_payment[key].fees_amount=='' || fee_payment[key].fees_amount==null){
							  				fee_payment[key].fees_amount  = 0;
							  			}
							  			if(fee_payment[key].total_amount=='' || fee_payment[key].total_amount==null){
							  				fee_payment[key].total_amount  = 0;
							  			}
							  			if(fee_payment[key].total_discount=='' || fee_payment[key].total_discount==null){
							  				fee_payment[key].total_discount  = 0;
							  			}
							  			// if(fee_payment[key].transport_fees=='No Transport Taken' || fee_payment[key].transport_fees==null){
							  			// 	fee_payment[key].transport_fees  = 0;
							  			// }



							  			
							  			if(fee_payment[key].total_amount==0 && fee_payment[key].total_discount==0){
							  				delete fee_payment[key];
							  			}
							  			
							  			 callback();
							  		}, function(err){
							  			 if(err) {

										    console.log(err);
										    callback(err);
										  }else{
										  	console.log(fee_payment)
										  	
										  	res.send({fee_payment:fee_payment})
										  }
							  		});
						  		//}

								
						  }
						});
				}
			
		});
    
		
     }else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/get_receipt_detail", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		
		var receipt_number    	      = req.query.receipt_number;
		var student_id                = req.query.student_id;
		admin.get_receipt_detail({table:'table'},{receipt_number:receipt_number,student_id:student_id},function(err, result){
			var detail 		 	= result;
			var school_name  	= req.session.school_name;
			var school_address  = req.session.school_address; 
			var school_number   = req.session.phone;
			var logo    		= req.session.logo;
			res.send({detail:detail,school_name:school_name,school_address,school_address,school_number:school_number,logo:logo})


		});
    
		
     }else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/get_transport_detail", function(req, res)
{
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		
		var receipt_number    	      = req.query.receipt_number;
		var student_id                = req.query.student_id;
		admin.get_transport_detail({table:'table'},{receipt_number:receipt_number,student_id:student_id},function(err, result){
			var detail 		 	= result;
			var school_name  	= req.session.school_name;
			var school_address  = req.session.school_address;
			var school_number   = req.session.phone; 
			var logo    		= req.session.logo;
			res.send({detail:detail,school_name:school_name,school_address,school_address,school_number:school_number,logo:logo})


		});
    
		
     }else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.get("/website",function(req,res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 
		var table  = 'tbl_setting';
	    var current_setting = "";
		admin.findAll({table:table},function(err, result){
		    var current_setting 	 = result;
		    var table_notice  = 'tbl_noticeboard';
		    admin.findAll({table:table_notice},function(err, noticedata){
		    	var table_events = 'tbl_frontend_events';
		    	admin.findAll({table:table_events},function(err, Events){
		    		var table_settings  = 'tbl_frontend_settings'
		    		admin.findAll({table:table_settings},function(err, settings){
		    			var table_slider  = 'tbl_frontend_slider';
		    			admin.findAll({table:table_slider},function(err, slider_image){
		    				var table_gallery  = 'tbl_frontend_gallery';
		    				admin.findAll({table:table_gallery},function(err, gallery){
								var pagedata 	 = {Title : "",appName :res.locals.appName, pagename : "admin/website", message : req.flash('msg'),current_setting:current_setting,noticedata:noticedata,Events:Events,settings:settings,slider_image:slider_image,gallery:gallery};
								res.render("admin_layout", pagedata);
							});
						});
					});
				});
			});
		});
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});
router.post("/add_rights", function(req, res)
{ 

    if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
    {
        object=req.body; 
        var actions    = [
                'add',
                'edit',
                'delete'
            ]
        var role_id   = object.role_id;
        var user_role = object.user_role;
        var roles     = user_role.toString();
        var rights    = '';
		
		async.each(user_role, function (itemA, callback) { //loop through array
   			 //process itemA
				async.each(actions, function (itemAChild, callback1) { //loop through array
				    //process itemAChild
				    				//console.log(itemA+'_'+itemAChild);
				    				if(object.hasOwnProperty(itemA+'_'+itemAChild)){
				    			  
					        	 		//console.log('a');
				                        rights += 1;
				                    } else {
				                    	//console.log('b');
				                        rights += 0;
				                    }
				    	callback1();
				     
			    }, function(err) {
				    	rights += ','; 
				    
				      callback();
				});
	    }, function(err) {
	    	    var user_rights = {
	    	    	"role_id" 	: role_id,
	    	    	"roles"   	: roles.trim(),
	    	    	"rights"  	: rights.trim(),
	    	    	"created_at": moment().format('YYYY-MM-DD:hh:mm:ss')
	    	    }
	    	    var table  = {tablename :'tbl_user_rights'}

	    	    admin.findWhere(table,{ role_id : role_id}, function(err, result){
	    	    	console.log(result);
	    	    	if(result!=''){
	    	    		admin.updateWhere(table,{ role_id : role_id},user_rights, function(err, result){  
	    	    		});
	    	    	}else{
	    	    		 admin.insert_all(table,user_rights,function(err, result){
			    	    });
	    	    	}
	    	    });
			    	res.redirect(res.locals.appName+"/admin/user_rights");	

	   });
		
        
    }else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}

});

router.get("/noticeBoard",function(req,res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 		
			var tableobj = {tablename:'tbl_noticeboard'}
			var findObj  = {notice_id:req.query.id.toString()}
            if(req.query.id){
                admin.findWhere(tableobj,findObj,function(err,result1){
	                if(result1){
	                 	data =JSON.parse(JSON.stringify(result1)); 
	                    console.log('ddd') ;
	                    console.log(data[0]);
					    var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/noticeBoard", message : req.flash('msg'),noticeBoard : data[0]};
					    res.render("admin_layout", pagedata);
	                }

 			    });
            }else{
            	var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/noticeBoard", message : req.flash('msg'),noticeBoard :''};
					    res.render("admin_layout", pagedata);
            }
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/Events",function(req,res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 		
			var tableobj = {tablename:'tbl_frontend_events'}
			var findObj  = {frontend_events_id:req.query.id.toString()}
            if(req.query.id){
                admin.findWhere(tableobj,findObj,function(err,result1){
	                if(result1){
	                 	data       =   JSON.parse(JSON.stringify(result1)); 
	                    console.log('ddd') ;
	                    console.log(data[0]);
					    var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/Events", message : req.flash('msg'),Events : data[0]};
					    res.render("admin_layout", pagedata);
	                }

 			    });
            }
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.get("/Formative",function(req,res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 		
		//console.log(req.query);
		var student_id   = req.query.student_id.toString();
		var class_id     = req.query.class_id.toString();
		var section_id   = req.query.section_id.toString();
		var exam_id      = req.query.exam_id.toString();
			res.render('admin/formative');
	}else{
			website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

//date format function
function formatDate(date, time2) {
    var from = date.split("-");
    var f = from[2] + "-" + from[1] + "-" + from[0];
    var time1 = time2;

    return f;
}

router.get("/manage_payment",function(req,res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{ 		
		// console.log(req.query);
		// var student_id   = req.query.student_id;
		// var class_id     = req.query.class_id;
		// var section_id   = req.query.section_id;
		// var exam_id      = req.query.exam_id;
		var table  = 'tbl_student_payment_master';
	   
		admin.findAllPayment({table:table},function(err, result){
			var payments  = result;
			var table_transport  = 'tbl_transport_payment_master';
			admin.findAllPayment({table:table_transport},function(err, transport){
	    		var pagedata = {title : "Edurecords", pagename : "admin/manage_payment", message : req.flash('msg'),payments:payments,transport:transport,moment:moment};
	    		res.render("admin_layout", pagedata);
	    	});
		});
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/payments_edit", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
         
         
        var tableobj  = {tablename:'tbl_student_payment_master'}
	    if(req.query.id)
	     {
           var findObj = {payment_master_id:req.query.id.toString()}
           admin.findWhere(tableobj,findObj,function(err,result){

           if(result)
	           {
	              var $data =JSON.parse(JSON.stringify(result)); 
	              var fees_id    = $data[0].fees_id;
	              var tableobj1  = {tablename:'tbl_fees_structure'}
	              var findObj1   = {fees_id:fees_id.toString()}
	              admin.findWhere(tableobj1,findObj1,function(err,result1){
		              //console.log($data[0].fees_id);
		              var total_fees  = result1[0].fees_amount;
		              var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/payment_edit", success: req.flash('success'),error: req.flash('error'),paymentData:$data[0],total_fees:total_fees};
				      res.render("admin_layout", pagedata);
			      });
	           }
           });
	     }
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.post("/update_payment", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		var payment_master_id  = req.body.payment_master_id;
		var fees_id            = req.body.fees_id;
		var old_amount 		   = req.body.old_amount;
		var old_discount       = req.body.old_discount;
		var amount     	       = req.body.amount;
		var discount           = req.body.discount;
		var student_id         = req.body.student_id;
		console.log(req.body);

		if(old_amount!=amount){
			var tableobj      = {tablename:'tbl_student_payment_master'};
	        var whereparent   = { payment_master_id:payment_master_id }
	        var objparent     = {
	                              amount : amount
	                            };  

	            admin.updateWhereAccounting(tableobj,whereparent,objparent, function(err, result){   
	            	var tableobj1 = {tablename:'tbl_student_payment'};
	            	
					admin.findWhere(tableobj1,{ fees_id : fees_id,student_id:student_id}, function(err, result){  
					     var payment_id  = result[0].payment_id;          
						 var fees_amount = result[0].amount;
						 if(amount>old_amount){
						 	var am             = amount-old_amount;
						 	var update_amount  = fees_amount+am; 
						 }

						 if(amount<old_amount){
						 	var am             =  old_amount - amount;
						 	var update_amount  = fees_amount-am;	
						 }

						 var where  = { payment_id :payment_id }
						 var obj    = {
						 	amount   : update_amount
						 }
						 admin.updateWhereAccounting(tableobj1,where,obj, function(err, result){  

						 });
						 

					});
				});
		}

		else if(old_discount!=discount){
			//console.log('abccccc');
			var tableobj      = {tablename:'tbl_student_payment_master'};
	        var whereparent   = { payment_master_id:payment_master_id }
	            objparent     = {
	                              discount : discount
	                            };  

	            admin.updateWhereAccounting(tableobj,whereparent,objparent, function(err, result){   
	            	var tableobj1 = {tablename:'tbl_student_payment'};
					admin.findWhere(tableobj1,{ fees_id : fees_id,student_id:student_id}, function(err, result){  
						 var payment_id  = result[0].payment_id;          
						 var fees_discount = result[0].discount;
						 if(discount>old_discount){
						 	var am             = discount-old_discount;
						 	var update_discount  = fees_discount+am; 
						 }

						 if(discount<old_discount){
						 	var am               =  old_discount - discount;
						 	var update_discount  = fees_discount-am;	
						 }

						 var where  = { payment_id :payment_id }
						 var obj    = {
						 	discount   : update_discount
						 }
						 admin.updateWhereAccounting(tableobj1,where,obj, function(err, result){  

						 });
						 

					});
				});
		}
			//
			res.redirect(res.locals.appName+'/admin/manage_payment'); 
		


	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});


router.get("/transport_payments_edit", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){
         
         
        var tableobj  = {tablename:'tbl_transport_payment_master'}
	    if(req.query.id)
	     {
           var findObj = {transport_master_id:req.query.id.toString()}
           admin.findWhere(tableobj,findObj,function(err,result){
           if(result)
	           {
	              var $data =JSON.parse(JSON.stringify(result)); 
	              var table_enroll     = {tablename : 'tbl_registration'}
	              var registration_id  = result[0].student_id;
	              admin.findStudentTransportFees(table_enroll,{registration_id:registration_id},function(err,result1){
		              //console.log($data[0].fees_id);
		              var total_fees  = result1[0].route_fare;
		              var pagedata = {title : "Edurecords",appName :res.locals.appName, pagename : "admin/transport_payment_edit", success: req.flash('success'),error: req.flash('error'),paymentData:$data[0],total_fees:total_fees};
				      res.render("admin_layout", pagedata);
			      });
	           }
           });
	     }
	}else{
	      website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.post("/update_transport_payment", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName ){

		var transport_master_id       = req.body.transport_master_id;
		
		var amount     	       = req.body.amount;
		var discount           = req.body.discount;
		var student_id         = req.body.student_id;
		console.log(req.body);

		    var tableobj            = {tablename:'tbl_transport_payment_master'};
	        var whereparent   		= { transport_master_id:transport_master_id }
	        var objparent     		= {
	                              amount  : amount,
	                              discount : discount
	                            };  

	            admin.updateWhereAccounting(tableobj,whereparent,objparent, function(err, result){   

	            });
			//
			res.redirect(res.locals.appName+'/admin/manage_payment'); 
		


	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    });
	}
});

router.get("/changepassword", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
		var pagedata = {Title : "",appName :res.locals.appName, pagename : "admin/changepassword", success: req.flash('success'),error: req.flash('error')};
		res.render("admin_layout", pagedata);
    }else
    {
        website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
	       setting = result[0];
	       console.log(setting);
	       var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
	       res.render("website_layout", pagedata);
	    }); 
	}
});


router.post("/changepassword", function(req, res){
	if(req.session.user_role==1 && req.session.sitename==res.locals.appName )
	{
	 	var obj = {login_password :  sha1(req.body.password)}
	 	var where = {registration_id:req.session.uid}

		admin.updatepassword(where,obj, function(err, result){ 
			 
             req.flash('success','Password changed successfully')
			var pagedata = {Title : "",appName :res.locals.appName, pagename : "admin/changepassword",success: req.flash('success'),error: req.flash('error')};
			res.render("admin_layout", pagedata);
		});           

	}else{
	       website.findbyColumn({table:'tbl_frontend_settings',column:'header_logo'},function(err,result){
		      setting = result[0];
		      //console.log(setting);
		     var pagedata = {title : "Edurecords",active:'login',appName :res.locals.appName, pagename : "website/login", success: req.flash('success'),error : req.flash('error'),setting:setting};
		     res.render("website_layout", pagedata);
		    }); 
	}
	

});
module.exports=router;