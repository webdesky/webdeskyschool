var con = require('../config/connect');
var empty = require('is-empty');

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

module.exports.select= function(cb){
	  con.connect(function(err){
	  	    //console.log(obj);
	  	   con.query("SELECT * FROM amendo_user",cb); 
	  });
} 


module.exports.insert_all=function(tableobj, obj, cb){ 
    
      // console.log(obj);
      // return false;
     
     //if(obj.hasOwnProperty("name")>0 || obj.hasOwnProperty("registration_id")>0 )

     if(JSON.stringify(obj) != '{}')
     {
     	con.connect(function(err){
		var que = "INSERT INTO "+tableobj.tablename+" SET ?";
			   
			 con.query(que, obj, function (err, result) {
			 	//console.log("[mysql error]",err);
			 	if (err) throw err;
			 	cb(undefined, result.insertId);
		 	 });
		});
     }
     else
     	cb(undefined, 0);

	 
}



module.exports.findWhere=function(tableobj, obj, cb){
	con.connect(function(err){
		var que = "SELECT * FROM "+tableobj.tablename+" WHERE ";
		var counter = 1;
		for(var k in obj){
			if(counter==1)
			{
				que += k+"= '"+obj[k]+"'";
			}
			else
			{
				que += " AND "+k+"= '"+obj[k]+"' ";

			}
			counter++;
		}
		console.log(que)
		con.query(que, cb);
	});

	
}
module.exports.findWhereorderby=function(tableobj, obj, orerby, cb){
	con.connect(function(err){
		var que = "SELECT * FROM "+tableobj.tablename+" WHERE ";
		var counter = 1;
		for(var k in obj){
			if(counter==1)
			{
				que += k+"= '"+obj[k]+"'";
			}
			else
			{
				que += " AND "+k+"= '"+obj[k]+"' ";

			}
			counter++;
		}

		var que = que+ " ORDER BY "+orerby.orderby+" "+orerby.order

		
		con.query(que, cb);
	});

	
}

module.exports.findCount=function(tableobj,id,obj, cb){
	con.connect(function(err){
		var que = "SELECT count("+id.column+") as count FROM "+tableobj.tablename+" WHERE ";
		var counter = 1;
		for(var k in obj){
			if(counter==1)
			{
				que += k+"= '"+obj[k]+"'";
			}
			else
			{
				que += " AND "+k+"= '"+obj[k]+"' ";

			}
			counter++;
		}
 		//console.log(que)
		con.query(que, cb);
	});
	
}
module.exports.findAll=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+" ";
         console.log(que);
		con.query(que, cb);
	});
}


/* Find Teacher Routed Class Name List */
module.exports.FindTeacherClass= function(table, groupby, orderby, cb)
{

    con.connect(function(err){
		var que = "SELECT *   FROM "+table.tbl_class_routine+" LEFT JOIN  "+table.tbl_class+" ON  "+table.tbl_class+".class_id= "+table.tbl_class_routine+".class_id   LEFT JOIN "+table.tbl_section+" ON "+table.tbl_class+".class_id= "+table.tbl_section+".class_id GROUP BY "+groupby.class_id + " ORDER BY "+orderby.class_name+" "+orderby.order ;

		 //console.log(que);

		con.query(que, cb);
	});
}


/* Find Teacher Section Name List on Select of Class Routed */
module.exports.FindTeacherSection= function(table, where, groupby, orderby,  cb)
{

    con.connect(function(err){
		var que = "SELECT "+table.tbl_section+".section_id,"+table.tbl_section+".section_name FROM "+table.tbl_class_routine+" LEFT JOIN  "+table.tbl_section+" ON  "+table.tbl_section+".section_id= "+table.tbl_class_routine+".section_id  Where "+table.tbl_class_routine+".class_id= "+where.class_id+ " GROUP BY "+groupby.section_id + " ORDER BY "+orderby.section_name+" "+orderby.order  ;

		//console.log(que);
		con.query(que, cb);
	});
}
/* Get student List on Click on class and section name bt teacher */
module.exports.getstudentlist=function(obj,where, cb){
	  //console.log('-----------getstudentlist------------');
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".bonafide_status=0  AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".user_role=3 ORDER BY "+obj.tbl_registration+".name ASC" ;
	    //console.log('$#$#$#$#$#$#$$$$$$$$$$$$$$$ ',que); 

	 	con.query(que, cb); 
	});
}
module.exports.getAdminStudentAttendence=function(table,obj, cb){

	con.connect(function(err){
        var que = "SELECT *  FROM "+table.tbl_attendance+"  LEFT JOIN "+table.tbl_enroll+" ON "+table.tbl_attendance+".registration_id="+table.tbl_enroll+".registration_id WHERE "+table.tbl_attendance+".class_id='"+obj.class_id+"' AND "+table.tbl_attendance+".section_id='"+obj.section_id+"'  AND MONTH("+table.tbl_attendance+".attendence_date) ="+obj.month+" AND "+table.tbl_enroll+".bonafide_status='0' AND "+table.tbl_attendance+".registration_id="+obj.registration_id+" AND "+table.tbl_enroll+".session_year='"+obj.session_year+"'";	
       // console.log('singlellllllllllllll',que);
		con.query(que, cb);
	});
}
 

 //
 /* Get student List on Click on class and section name bt teacher */
module.exports.getsubjectlist=function(table, where, cb){
	  //
	con.connect(function(err){

       var que = "SELECT * FROM "+table.tbl_subject+" LEFT JOIN "+table.tbl_class_routine+" ON "+table.tbl_class_routine+".subject_id="+table.tbl_subject+".subject_id WHERE "+table.tbl_class_routine+".registration_id="+where.registration_id+" AND "+table.tbl_class_routine+".class_id="+where.class_id+" GROUP BY "+table.tbl_class_routine+".subject_id  ORDER BY "+table.tbl_subject+".name  ASC ";

	 	//var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".bonafide_status=0  AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".user_role=3 ORDER BY "+obj.tbl_registration+".name ASC" ;

	    //console.log('Queriiiiiiiiiii',que); 
	    
	 	con.query(que, cb); 
	});
}

/* Get all class Routine of teacher */
module.exports.findClassRoutine=function(table,obj ,cb){
	
	con.connect(function(err){
		
		var que = "SELECT tbl_class.class_name,tbl_section.section_name,tbl_subject.name as subject_name,tbl_registration.name as teacher_name,tbl_class_routine.*  FROM "+table.tablename+"  LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id LEFT JOIN tbl_registration ON "+table.tablename+".registration_id=tbl_registration.registration_id LEFT JOIN tbl_section ON tbl_section.section_id="+table.tablename+".section_id  LEFT JOIN tbl_class ON tbl_class.class_id="+table.tablename+".class_id   WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".registration_id="+obj.registration_id+"  AND "+table.tablename+".day='"+obj.day+"' AND "+table.tablename+".session_year='"+obj.session_year+"'";

	     //console.log('########################',que);
		 con.query(que, cb);
	});
}


/* 
*****  Get All Study material of teacher class  and subject only 
*/

module.exports.findStudyMaterial=function(table,obj, cb){
	
	con.connect(function(err){
		var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_class ON "+table.tablename+".class_id=tbl_class.class_id LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id WHERE "+table.tablename+".registration_id="+obj.registration_id+" AND "+table.tablename+".session_year='"+obj.session_year+"'";
	 console.log(que);
		 con.query(que, cb);
	});
}

/* Get Detail of Specific Document */
module.exports.findStudyMaterialDetail=function(table,obj, cb){
	
	con.connect(function(err){
		var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_class ON "+table.tablename+".class_id=tbl_class.class_id LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id WHERE "+table.tablename+".registration_id="+obj.registration_id+" AND "+table.tablename+".session_year='"+obj.session_year+"' AND "+table.tablename+".document_id=".obj.document_id;
	  //console.log(que);
		 con.query(que, cb);
	});
}

/* Get assigned subject of class selection */
module.exports.findassignedsubject=function(table,obj, cb){
	
	con.connect(function(err){
	//	var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_class ON "+table.tablename+".class_id=tbl_class.class_id LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id";
	var que = "SELECT "+table.tbl_subject+".name  , "+table.tbl_class_routine+".subject_id FROM "+table.tbl_subject+" LEFT JOIN "+table.tbl_class_routine+" ON "+table.tbl_class_routine+".subject_id="+table.tbl_subject+".subject_id WHERE "+table.tbl_class_routine+".class_id="+obj.class_id+" AND "+table.tbl_class_routine+".registration_id="+obj.registration_id+" AND "+table.tbl_class_routine+".session_year='"+obj.session_year+"'";
	 //console.log(que);
		 con.query(que, cb);
	});
}
/* *************************************** */

/* 
** Get Academic Syllabus 
*/
module.exports.findAcademicSyllabus=function(table,obj, cb){

	con.connect(function(err){
	//var que = "SELECT "+table.tbl_subject+".name  , "+table.tbl_class_routine+".subject_id FROM "+table.tbl_subject+" LEFT JOIN "+table.tbl_class_routine+" ON "+table.tbl_class_routine+".subject_id="+table.tbl_subject+".subject_id WHERE "+table.tbl_class_routine+".class_id="+obj.class_id+" AND "+table.tbl_class_routine+".registration_id="+obj.registration_id+" AND "+table.tbl_class_routine+".session_year='"+obj.session_year+"'";
   // var que= "SELECT "+table.tbl_academic_syllabus+".* ,"+table.tbl_academic_syllabus+".* ,  "+table.tbl_subject+".name  FROM "+table.tbl_academic_syllabus"+ LEFT JOIN "+table.tbl_class+" ON  "  ;
    var que ="SELECT "+table.tbl_academic_syllabus+".* , "+table.tbl_class+".class_name ,  "+table.tbl_subject+".name FROM "+table.tbl_academic_syllabus+" LEFT JOIN "+table.tbl_class+" ON "+table.tbl_class+".class_id="+table.tbl_academic_syllabus+".class_id LEFT JOIN "+table.tbl_subject+" ON "+table.tbl_subject+".subject_id = "+table.tbl_academic_syllabus+".subject_id WHERE "+table.tbl_academic_syllabus+".year='"+obj.session_year+"'" ;
	    console.log('ssssssssssssssssssssss',que);
	   con.query(que, cb);
	});
}


/*
** Get Teacher Attandance 
*/
module.exports.findAllteacher=function(table, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+table.tablename+" WHERE user_role='4'";
		con.query(que, cb);
	});
}



module.exports.Teachermarkssubject=function(table,obj, cb){

	con.connect(function(err){
	 
	 var que = "SELECT tbl_subject.subject_id,tbl_subject.subject_type,tbl_subject.name,tbl_exam_master.exam_code  FROM tbl_subject LEFT JOIN tbl_exam_schedule ON tbl_subject.subject_id=tbl_exam_schedule.subject_id LEFT JOIN tbl_class_routine ON tbl_class_routine.subject_id= tbl_exam_schedule.subject_id LEFT JOIN tbl_exam_master ON tbl_exam_master.exam_id = tbl_exam_schedule.exam_id WHERE tbl_exam_schedule.class_id="+obj.class_id+" AND tbl_exam_schedule.section_id= "+obj.section_id+" AND tbl_class_routine.registration_id="+obj.registration_id+" AND tbl_exam_schedule.session_year='"+obj.session_year+"'  GROUP BY tbl_exam_schedule.subject_id"; 
	
     console.log(que);

	 //var que =  "SELECT * FROM "+table.tbl_subject+" LEFT JOIN "+table.tbl_exam_schedule+" ON "+table.tbl_subject+".subject_id= "+table.tbl_exam_schedule+".subject_id LEFT JOIN "+table.tbl_class_routine+" ON "+table.tbl_class_routine+".subject_id= "+table.tbl_exam_schedule+".subject_id where "+table.tbl_exam_schedule+".class_id="+obj.class_id+" AND "+table.tbl_exam_schedule+".section_id= "+obj.section_id+" AND "+tbl_class_routine+".registration_id="+obj.registration_id+" AND "+table.tbl_exam_schedule+".session_year="+obj.session_year+" GROUP BY "+table.tbl_exam_schedule+".subject_id ";
	   con.query(que, cb);
	});
}

module.exports.getteachersubjectlist=function(obj,where, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		 
	   var que="SELECT tbl_subject.* FROM "+obj.table+" LEFT JOIN tbl_class_routine ON tbl_class_routine.subject_id=tbl_subject.subject_id WHERE tbl_class_routine.registration_id="+where.registration_id+" AND tbl_class_routine.class_id=1 AND tbl_class_routine.section_id=1 AND tbl_class_routine.session_year='"+where.session_year+"'";
	   console.log(que);
		con.query(que, cb);
	});
}


module.exports.Teacherfindhomework=function(obj, where, cb){
	con.connect(function(err){
		//var que= "SELECT tbl_class.class_name,tbl_section.section_name,tbl_subject.name,tbl_subject.name, tbl_homework.task,tbl_homework.description,tbl_homework.homework_date ,tbl_homework.file_name  FROM "+obj.table+" LEFT join tbl_subject ON tbl_homework.subject_id=tbl_subject.subject_id LEFT JOIN tbl_class ON tbl_class.class_id=tbl_homework.class_id LEFT JOIN tbl_section ON tbl_section.section_id=tbl_homework.section_id WHERE tbl_homework.class_id="+where.class_id+" AND tbl_homework.section_id="+where.section_id+" AND tbl_homework.teacher_id="+where.teacher_id+" AND tbl_homework.session_year='"+where.session_year+"'"
		var que= "SELECT tbl_homework.homework_id ,tbl_class.class_name,tbl_section.section_name,tbl_subject.name,tbl_subject.name, tbl_homework.task,tbl_homework.description, DATE_FORMAT(tbl_homework.homework_date,'%d/%m/%Y') AS date ,tbl_homework.file_name  FROM "+obj.table+" LEFT join tbl_subject ON tbl_homework.subject_id=tbl_subject.subject_id LEFT JOIN tbl_class ON tbl_class.class_id=tbl_homework.class_id LEFT JOIN tbl_section ON tbl_section.section_id=tbl_homework.section_id WHERE  tbl_homework.teacher_id="+where.teacher_id+" AND tbl_homework.session_year='"+where.session_year+"'"
		 console.log(que);
		con.query(que, cb);

	});
}













module.exports.findAllteacher=function(table, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+table.tablename+" WHERE user_role='4'";
		con.query(que, cb);
	});
}
module.exports.findFeeType=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+" LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";

		con.query(que, cb);
	});
}


module.exports.findAllSection=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";
	//	console.log(que);
		con.query(que, cb);
	});
}


module.exports.getStudentCount = function(table,obj,cb){
	con.connect(function(err){
	
		var que = "SELECT COUNT(enroll_id) as count_student FROM tbl_enroll WHERE tbl_enroll.bonafide_status='0' AND tbl_enroll.class_id='"+obj.class_id+"' AND tbl_enroll.section_id='"+obj.section_id+"' AND tbl_enroll.session_year='"+obj.year+"'";
	//	console.log(que);
		con.query(que, cb);
	});
}

module.exports.getTotalPaidFees = function(cb){
	con.connect(function(err){
		//select("SUM(amount) as amount,SUM(discount) as discount")->get('student_payment_master')
		var que = "SELECT SUM(amount) as amount,SUM(discount) as discount FROM tbl_student_payment_master";
	//	console.log(que);
		con.query(que, cb);
	});
}

module.exports.getTotalPaidTransportFees = function(cb){
	con.connect(function(err){
		//SUM(amount) as tamount,SUM(discount) as tdiscount")->get('transport_payment_master
		var que = "SELECT SUM(amount) as amount,SUM(discount) as discount FROM tbl_transport_payment_master";
	//	console.log(que);
		con.query(que, cb);
	});
}

module.exports.findExam=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";// LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id";
		 console.log('ddddddddddddddddddddddd',que);
		con.query(que, cb);
	});
}
/*
** Find Exam Detail on  edit exam list
*/
module.exports.findexamDetail=function(obj, where, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id WHERE  "+obj.table+".exam_id="+ where.exam_id ;
		//console.log(que);
		con.query(que, cb);
	});
}
module.exports.findFeesStructure=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+" LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_fee_type ON tbl_fee_type.fee_type_id="+obj.table+".fees_type_id LEFT JOIN tbl_fees_term ON tbl_fees_term.term_id="+obj.table+".fees_term_id";
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.findAllteacher=function(table, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+table.tablename+" WHERE user_role='4'";

		con.query(que, cb);
	});
}

module.exports.findExamSchedule=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT "+obj.table+".*,tbl_class.class_name,tbl_section.section_name,tbl_subject.name as subject_name,tbl_exam_master.exam_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_exam_master ON tbl_exam_master.exam_id="+obj.table+".exam_id";
		//console.log(que);
		con.query(que, cb);
	});
}
module.exports.findAllSection=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+" LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";
	//	console.log(que);
		con.query(que, cb);
	});
}


/* Get all Grade Detail With exam and class and section name */
module.exports.findGradeExamList=function(obj,where ,cb){
	//console.log(obj);
	con.connect(function(err){
		//var que = "SELECT "+obj.table+".*,tbl_class.class_name,tbl_section.section_name,tbl_exam_grades.name as grade ,tbl_exam_master.exam_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_exam_grades ON tbl_exam_grades.exam_id="+obj.table+".subject_id LEFT JOIN tbl_exam_master ON tbl_exam_master.exam_id="+obj.table+".exam_id";
		var que = "SELECT "+obj.tbl_exam_grades+".*, "+obj.tbl_exam_master+".exam_name, "+obj.tbl_class+".class_name,"+obj.tbl_section+".section_name from "+obj.tbl_exam_grades+" LEFT JOIN "+obj.tbl_exam_master+" ON "+obj.tbl_exam_grades+".exam_id= "+obj.tbl_exam_master+".exam_id LEFT JOIN "+obj.tbl_class+" ON "+obj.tbl_exam_grades+".class_id= "+obj.tbl_class+".class_id LEFT JOIN "+obj.tbl_section+" ON "+obj.tbl_exam_grades+".section_id= "+obj.tbl_section+".section_id WHERE "+obj.tbl_exam_master+".session_year='"+where.session_year+"'"
		//console.log(que);
		con.query(que, cb);
	});
}
module.exports.findExam=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id";
		//console.log(que);
		con.query(que, cb);
	});
}
/* Get single  Detail of Grade with Exam name class name and section name */
module.exports.findGradeExamDetail=function(obj,where ,cb){
	//console.log(obj);
	con.connect(function(err){
		//var que = "SELECT "+obj.table+".*,tbl_class.class_name,tbl_section.section_name,tbl_exam_grades.name as grade ,tbl_exam_master.exam_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_exam_grades ON tbl_exam_grades.exam_id="+obj.table+".subject_id LEFT JOIN tbl_exam_master ON tbl_exam_master.exam_id="+obj.table+".exam_id";
		var que = "SELECT "+obj.tbl_exam_grades+".*, "+obj.tbl_exam_master+".exam_name, "+obj.tbl_class+".class_name,"+obj.tbl_section+".section_name from "+obj.tbl_exam_grades+" LEFT JOIN "+obj.tbl_exam_master+" ON "+obj.tbl_exam_grades+".exam_id= "+obj.tbl_exam_master+".exam_id LEFT JOIN "+obj.tbl_class+" ON "+obj.tbl_exam_grades+".class_id= "+obj.tbl_class+".class_id LEFT JOIN "+obj.tbl_section+" ON "+obj.tbl_exam_grades+".section_id= "+obj.tbl_section+".section_id WHERE "+obj.tbl_exam_grades+".grade_id="+where.grade_id+" AND "+obj.tbl_exam_master+".session_year='"+where.session_year+"'"
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.findExamSchedule=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT "+obj.table+".*,tbl_class.class_name,tbl_section.section_name,tbl_subject.name as subject_name,tbl_exam_master.exam_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_exam_master ON tbl_exam_master.exam_id="+obj.table+".exam_id";

		con.query(que, cb);
	});
}

module.exports.findAllsubject=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";

		con.query(que, cb);
	});
}

module.exports.findallteacherassignment=function(obj, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		var que = "SELECT tbl_registration.name as teacher_name,tbl_class.class_name,tbl_subject.name as subject_name,tbl_teacherassignment.id,tbl_section.section_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_registration ON tbl_registration.registration_id="+obj.table+".teacher_id ";

		con.query(que, cb);
	});
}
module.exports.assignedtaeacherdetail=function(obj,where, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		var que = "SELECT tbl_registration.registration_id as teacher_id, tbl_registration.name as teacher_name,tbl_class.class_id,tbl_class.class_name,tbl_subject.subject_id as subject_id,tbl_subject.name as subject_name,tbl_teacherassignment.id,tbl_section.section_name,tbl_section.section_id FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_registration ON tbl_registration.registration_id="+obj.table+".teacher_id  WHERE  "+obj.table+".id= "+where.id;

		con.query(que, cb);
	});
}
module.exports.findhomework=function(obj, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		var que = "SELECT *  FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id";
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.findsubjectTeacher=function(table,obj, cb){
	
	con.connect(function(err){
		
		var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_registration On tbl_registration.registration_id="+table.tablename+".teacher_id WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".subject_id="+obj.subject_id+"";

		 con.query(que, cb);
	});
}


module.exports.getTotalAttendence=function(table,obj, cb){
	
	con.connect(function(err){
		//select count(distinct(timestamp)) as total_attendence from attendance where section_id='$section_id' and class_id='$class_id' and   timestamp between $secound_start_timestamp and $secound_end_timestamp
		var que = "SELECT COUNT(distinct(attendence_date)) as total_attendence   FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".registration_id="+obj.student_id+" AND "+table.tablename+".attendence_date >='"+obj.first_start_date+"' AND "+table.tablename+".attendence_date <='"+obj.first_end_date+"'";
		console.log(que);
		 con.query(que, cb);
	});
}

module.exports.getPresentAttendence=function(table,obj, cb){
	
	con.connect(function(err){
		//select count(distinct(timestamp)) as total_attendence from attendance where section_id='$section_id' and class_id='$class_id' and   timestamp between $secound_start_timestamp and $secound_end_timestamp
		var que = "SELECT COUNT(distinct(attendence_date)) as present_attendance   FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".registration_id="+obj.student_id+" AND "+table.tablename+".attendence_date >='"+obj.first_start_date+"' AND "+table.tablename+".attendence_date <='"+obj.first_end_date+"' AND "+table.tablename+".status='1'";
		console.log(que);
		 con.query(que, cb);
	});
}


module.exports.findPayment=function(table,obj, cb){
	
	con.connect(function(err){
		
		var que = "SELECT *  FROM "+table.tablename+"  WHERE "+table.tablename+".fees_id="+obj.fees_id+" AND "+table.tablename+".student_id="+obj.student_id+"";

	 
		 con.query(que, cb);
	});
}


// module.exports.findStudyMaterial=function(table, cb){
	
// 	con.connect(function(err){
		
// 		var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_class ON "+table.tablename+".class_id=tbl_class.class_id LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id";

// 	 //console.log(que);
// 		 con.query(que, cb);
// 	});
// }

module.exports.findAcadmicSyllabus=function(table, cb){
	
	con.connect(function(err){
		
		var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_class ON "+table.tablename+".class_id=tbl_class.class_id LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id";

	 //console.log(que);
		 con.query(que, cb);
	});
}


/* Find All class Routine of class and section based */ 

module.exports.findClassRoutineAllday=function(table,obj ,cb){
	
	con.connect(function(err){
		
		var que = "SELECT tbl_subject.name as subject_name, tbl_registration.name as teacher_name, tbl_registration.registration_id as teacher_id, tbl_class_routine.*  FROM "+table.tablename+"  LEFT JOIN tbl_subject ON "+table.tablename+".subject_id=tbl_subject.subject_id LEFT JOIN tbl_registration ON "+table.tablename+".registration_id=tbl_registration.registration_id  WHERE  "+table.tablename+".day='"+obj.day+"' AND "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".registration_id="+obj.registration_id;

	  //console.log(que);
		 con.query(que, cb);
	});
}

module.exports.find_pay_fees=function(table,obj ,cb){
	
	con.connect(function(err){
		
		var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_fee_type ON "+table.tablename+".fees_type_id = tbl_fee_type.fee_type_id LEFT JOIN tbl_fees_term ON "+table.tablename+".fees_term_id=tbl_fees_term.term_id WHERE "+table.tablename+".fees_id = "+obj.fees_id+" AND "+table.tablename+".session_year= '"+obj.session_year+"'";	

	 //console.log(que);
		 con.query(que, cb);
	});
}


module.exports.findTermById=function(table,obj ,cb){
	
		con.connect(function(err){
		
		var que = "SELECT * FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+"";

	    //console.log(que);
		 con.query(que, cb);
	});
}

module.exports.findTypeById=function(table,obj ,cb){
	
		con.connect(function(err){
		
		var que = "SELECT * FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+"";

	    //console.log(que);
		 con.query(que, cb);
	});
}
module.exports.getFeesReceipt=function(table,obj ,cb){
	
		con.connect(function(err){
		
		var que = "SELECT collected_by,receipt_number,type,SUM(amount)as total_amount,SUM(discount)as total_discount,"+table.tablename+".date as dates,student_id FROM "+table.tablename+" WHERE "+table.tablename+".student_id="+obj.student_id+" GROUP BY receipt_number	";

	   //console.log(que);
		 con.query(que, cb);
	});
}


module.exports.get_receipt_detail=function(table,obj ,cb){
	
		con.connect(function(err){
		
		var que = "SELECT tbl_student_payment_master.*,tbl_registration.name as student_name,tbl_parent.name as parent_name,tbl_fee_type.fee_type,tbl_fees_term.term_name,tbl_class.class_name,tbl_section.section_name,tbl_fees_structure.fees_amount	 FROM tbl_student_payment_master INNER JOIN tbl_registration ON tbl_registration.registration_id = tbl_student_payment_master.student_id                                                                       INNER JOIN tbl_registration as tbl_parent ON tbl_parent.registration_id=tbl_registration.parent_id                                                       INNER JOIN tbl_fees_structure ON tbl_student_payment_master.fees_id=tbl_fees_structure.fees_id              INNER JOIN tbl_fee_type ON tbl_fees_structure.fees_type_id=tbl_fee_type.fee_type_id                         INNER JOIN tbl_fees_term ON tbl_fees_term.term_id=tbl_fees_structure.fees_term_id                           INNER JOIN tbl_enroll ON tbl_enroll.registration_id=tbl_registration.registration_id                         INNER JOIN tbl_class ON tbl_class.class_id = tbl_enroll.class_id                                             INNER JOIN tbl_section ON tbl_section.section_id = tbl_enroll.section_id   WHERE tbl_student_payment_master.student_id='"+obj.student_id+"' AND tbl_student_payment_master.receipt_number='"+obj.receipt_number+"'";

	    //console.log(que);
		 con.query(que, cb);
	});
}
module.exports.get_transport_detail=function(table,obj ,cb){
	
		con.connect(function(err){
		
		var que = "SELECT tbl_registration.name as student_name,tbl_parent.name as parent_name,tbl_transport_payment_master.date as date,tbl_transport_payment_master.amount as amount,tbl_transport_payment_master.discount as discount,tbl_class.class_name,tbl_section.section_name,tbl_transport_payment_master.receipt_number,tbl_transport_payment_master.type,tbl_transport.route_fare FROM tbl_transport_payment_master                                                                                INNER JOIN tbl_registration ON tbl_transport_payment_master.student_id = tbl_registration.registration_id    INNER JOIN tbl_registration as tbl_parent ON tbl_parent.registration_id = tbl_transport_payment_master.student_id                                                                      INNER JOIN tbl_enroll ON tbl_registration.registration_id  = tbl_enroll.registration_id                     INNER JOIN tbl_class ON tbl_enroll.class_id = tbl_class.class_id      INNER JOIN tbl_transport ON tbl_registration.transport_id = tbl_transport.transport_id                                         INNER JOIN tbl_section  ON tbl_enroll.section_id = tbl_section.section_id WHERE tbl_transport_payment_master.student_id='"+obj.student_id+"' AND tbl_transport_payment_master.receipt_number='"+obj.receipt_number+"'";

	    console.log(que);
		 con.query(que, cb);
	});
}

module.exports.getStudentAttendence=function(table,obj, cb){

	con.connect(function(err){
		console.log('obh',obj)
		//var que = "SELECT *  FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".attendence_date='"+obj.attendence_date+"' AND "+table.tablename+".registration_id="+obj.student_id+" ";
        var que = "SELECT *  FROM "+table.tbl_attendance+" LEFT JOIN "+table.tbl_enroll+" ON "+table.tbl_attendance+".registration_id="+table.tbl_enroll+".registration_id WHERE "+table.tbl_attendance+".class_id='"+obj.class_id+"' AND "+table.tbl_attendance+".section_id='"+obj.section_id+"' AND "+table.tbl_attendance+".attendence_date='"+obj.attendence_date+"' AND "+table.tbl_attendance+".registration_id='"+obj.student_id+"' AND "+table.tbl_enroll+".bonafide_status='0' AND "+table.tbl_enroll+".session_year='"+obj.session_year+"'";	
        console.log(que)	
		con.query(que, cb);
	});
}
module.exports.getTeacherStudentAttendence=function(table,obj, cb){

	con.connect(function(err){
		//var que = "SELECT *  FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".attendence_date='"+obj.attendence_date+"' AND "+table.tablename+".registration_id="+obj.student_id+" ";
        var que = "SELECT *  FROM "+table.tbl_attendance+" INNER JOIN "+table.tbl_enroll+" ON "+table.tbl_attendance+".registration_id="+table.tbl_enroll+".registration_id WHERE "+table.tbl_attendance+".class_id="+obj.class_id+" AND "+table.tbl_attendance+".section_id="+obj.section_id+" AND "+table.tbl_attendance+".attendence_date='"+obj.attendence_date+"' AND "+table.tbl_attendance+".registration_id="+obj.student_id+" AND "+table.tbl_enroll+".bonafide_status=0 AND "+table.tbl_enroll+".session_year="+obj.session_year;	
        console.log(que);	
		con.query(que, cb);
	});
}
module.exports.getTeacherAttendence=function(table,obj, cb){

	con.connect(function(err){
// 		var que = "SELECT *  FROM "+table.tablename+" WHERE  "+table.tablename+".attendence_date='"+obj.attendence_date+"' AND "+table.tablename+".registration_id="+obj.student_id+" ";
// =======
		
        var que = "SELECT *  FROM "+table.tbl_attendance+" INNER JOIN "+table.tbl_enroll+" ON "+obj.tbl_attendance+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+table.tbl_attendance+".class_id="+obj.class_id+" AND "+table.tbl_attendance+".section_id="+obj.section_id+" AND "+table.tbl_attendance+".attendence_date='"+obj.attendence_date+"' AND "+table.tbl_attendance+".registration_id="+obj.student_id+" AND "+table.tbl_enroll+".bonafide_status=0 AND "+table.tbl_enroll+".session_year="+obj.session_year;		
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.get_paid_fees=function(table,obj, cb){

	con.connect(function(err){
		
        var que = "SELECT *  FROM "+table.tablename+" WHERE "+table.tablename+".fees_id="+obj.fees_id+" AND "+table.tablename+".student_id="+obj.student_id+"";		
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.getMarks=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT *  FROM "+table.tablename+" WHERE  "+table.tablename+".class_id='"+obj.class_id+"' AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".subject_id="+obj.subject_id+" AND "+table.tablename+".exam_id="+obj.exam_id+" AND "+table.tablename+".student_id="+obj.student_id+" ";
		//console.log(que);
		con.query(que, cb);
	});
}
module.exports.getFeesDetail=function(table,obj, cb){

	con.connect(function(err){
		
        var que = "SELECT *  FROM "+table.tablename+" LEFT JOIN tbl_fee_type ON "+table.tablename+".fees_type_id = tbl_fee_type.fee_type_id LEFT JOIN tbl_fees_term ON "+table.tablename+".fees_term_id=tbl_fees_term.term_id WHERE "+table.tablename+".class_id = "+obj.class_id+" AND "+table.tablename+".session_year= '"+obj.session_year+"'";		
		//console.log(que);
		con.query(que, cb);
	});
}
module.exports.getStudent=function(table,obj, cb){

	con.connect(function(err){
		//var que = "SELECT "+table.tablename+".registration_id,tbl_registration.name  FROM "+table.tablename+" LEFT JOIN tbl_registration ON "+table.tablename+".registration_id=tbl_registration.registration_id WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+"";

		//rajendra sir query
      //  var que = "SELECT *  FROM "+table.tbl_attendance+" INNER JOIN "+table.tbl_enroll+" ON "+table.tbl_attendance+".registration_id="+table.tbl_enroll+".registration_id  INNER JOIN "+table.tbl_registration+" ON "+table.tbl_registration+".registration_id="+table.tbl_enroll+".registration_id WHERE "+table.tbl_attendance+".class_id="+obj.class_id+" AND "+table.tbl_attendance+".section_id="+obj.section_id+" AND  "+table.tbl_enroll+".bonafide_status=0 AND "+table.tbl_enroll+".session_year='"+obj.session_year+"'";


        var que = "SELECT tbl_registration.registration_id,tbl_registration.name,tbl_registration.admission_number  FROM "+table.tbl_registration+" LEFT JOIN "+table.tbl_enroll+" ON "+table.tbl_registration+".registration_id="+table.tbl_enroll+".registration_id  LEFT JOIN "+table.tbl_attendance+" ON "+table.tbl_registration+".registration_id="+table.tbl_attendance+".registration_id WHERE "+table.tbl_enroll+".class_id="+obj.class_id+" AND "+table.tbl_enroll+".section_id="+obj.section_id+" AND  "+table.tbl_enroll+".bonafide_status=0 AND "+table.tbl_enroll+".session_year='"+obj.session_year+"'";		
		 console.log(que); 
		con.query(que, cb);
	});
}
module.exports.getStudentsformarks=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT "+table.tablename+".registration_id,tbl_registration.name  FROM "+table.tablename+" LEFT JOIN tbl_registration ON "+table.tablename+".registration_id=tbl_registration.registration_id WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+"";
        //var que = "SELECT *  FROM "+table.tbl_attendance+" INNER JOIN "+table.tbl_enroll+" ON "+table.tbl_attendance+".registration_id="+table.tbl_enroll+".registration_id  INNER JOIN "+table.tbl_registration+" ON "+table.tbl_registration+".registration_id="+table.tbl_enroll+".registration_id WHERE "+table.tbl_attendance+".class_id="+obj.class_id+" AND "+table.tbl_attendance+".section_id="+obj.section_id+" AND  "+table.tbl_enroll+".bonafide_status=0 AND "+table.tbl_enroll+".session_year='"+obj.session_year+"'";		

		 console.log(que); 
		con.query(que, cb);
	});
}


module.exports.getStudentByClassId= function(table,obj,cb){
	con.connect(function(err){
		//select DISTINCT(student.student_id) as student_id,student.name,student.student_code from enroll INNER JOIN student ON enroll.student_id= student.student_id $where
        var que = "SELECT DISTINCT(tbl_registration.registration_id) as student_id,tbl_registration.name  FROM "+table.tablename+" INNER JOIN tbl_registration ON "+table.tablename+".registration_id= tbl_registration.registration_id  WHERE "+table.tablename+".class_id='"+obj.class_id+"' AND "+table.tablename+".section_id='"+obj.section_id+"' AND "+table.tablename+".session_year= '"+obj.year+"'";		
		//console.log(que);
		con.query(que, cb);
	});	
}



 module.exports.getTransportFeesByStudentId = function(table,obj,cb){
 		con.connect(function(err){
		//SELECT * FROM tbl_registration LEFT JOIN tbl_transport ON tbl_registration.transport_id=tbl_transport.transport_id LEFT JOIN tbl_transport_payment_master ON tbl_registration.registration_id = tbl_transport_payment_master.student_id  WHERE tbl_registration.registration_id = 61 
        // var que = "SELECT tbl_transport.route_fare,SUM(tbl_transport_payment_master.amount) as transport_paid_amount,SUM(tbl_transport_payment_master.discount) as transport_paid_discount from "+table.tablename+" INNER JOIN tbl_registration ON tbl_registration.registration_id="+table.tablename+".student_id INNER JOIN tbl_transport ON tbl_registration.transport_id=tbl_transport.transport_id WHERE "+table.tablename+".student_id="+obj.student_id+"";		
        var que = "SELECT tbl_transport.route_fare,SUM('tbl_transport_payment_master.amount') as transport_paid_amount,SUM('tbl_transport_payment_master.discount') as transport_paid_discount FROM tbl_registration LEFT JOIN tbl_transport ON tbl_registration.transport_id = tbl_transport.transport_id LEFT JOIN tbl_student_payment_master ON tbl_registration.registration_id = tbl_student_payment_master.student_id WHERE tbl_registration.registration_id = "+obj.student_id+""
		console.log(que);
		con.query(que, cb);
	});	
 }

module.exports.getAccountingFeesByStudentId = function(table,obj,cb){
 		con.connect(function(err){
		
		
        var que = "SELECT SUM(tbl_student_payment_master.discount) as discount,SUM(tbl_student_payment_master.amount) as amount from tbl_student_payment_master LEFT JOIN tbl_fees_structure ON tbl_fees_structure.fees_id=tbl_student_payment_master.fees_id WHERE tbl_student_payment_master.student_id="+obj.student_id+" AND "+obj.where1+"";		
	//	console.log(que);
		con.query(que, cb);
	});	
 }


module.exports.getTotalFees = function(table,obj,cb){
	con.connect(function(err){
		//SELECT SUM(fees_structure.fees_amount) as fees_amount from fees_structure $where2
		
        var que = "SELECT SUM("+table.tablename+".fees_amount) as fees_amount from "+table.tablename+" WHERE "+obj.where1+"";		
		//console.log(que);
		con.query(que, cb);
	});	
}

module.exports.getTotalFeesSchool = function(table,obj,cb){
	con.connect(function(err){
		
		
        var que = "SELECT SUM(tbl_fees_structure.fees_amount) as fees_amount from tbl_fees_structure WHERE tbl_fees_structure.class_id="+obj.class_id+"";		
		//console.log(que);
		con.query(que, cb);
	});	
}

module.exports.getTransportTotalFees  = function(table,obj,cb){
	con.connect(function(err){
		
		//SELECT transport.route_fare FROM transport LEFT JOIN student ON student.transport_id = transport.transport_id LEFT JOIN enroll ON student.student_id = enroll.student_id where enroll.bonafide_status=0 AND enroll.class_id = $class AND enroll.section_id=$section
        var que = "SELECT tbl_transport.route_fare FROM tbl_transport LEFT JOIN tbl_registration ON tbl_registration.transport_id=tbl_transport.transport_id LEFT JOIN tbl_enroll ON tbl_registration.registration_id = tbl_enroll.registration_id WHERE tbl_enroll.bonafide_status='0' AND tbl_enroll.class_id ='"+obj.class_id+"' AND tbl_enroll.section_id='"+obj.section_id+"'";		
		//console.log(que);
		con.query(que, cb);
	});	
}

module.exports.getStudentFees=function(table,obj, cb){

	con.connect(function(err){
		//SELECT transport.route_fare ,SUM(transport_payment_master.amount) as paid_amount,SUM(transport_payment_master.discount) as paid_discount from student LEFT JOIN  transport  ON student.transport_id= transport.transport_id LEFT JOIN transport_payment_master ON transport_payment_master.student_id= student.student_id WHERE student.student_id= $student_id
        var que = "SELECT tbl_transport.route_fare,tbl_transport.route_name,tbl_transport.transport_id ,SUM(tbl_transport_payment_master.amount) as paid_amount,SUM(tbl_transport_payment_master.discount) as paid_discount  FROM "+table.tablename+" LEFT JOIN tbl_transport ON "+table.tablename+".transport_id = tbl_transport.transport_id LEFT JOIN tbl_transport_payment_master ON tbl_transport_payment_master.student_id= "+table.tablename+".registration_id WHERE "+table.tablename+".registration_id="+obj.registration_id+"";		
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.getTransportFeesReceipt=function(table,obj, cb){

	con.connect(function(err){
		//SELECT transport_payment_master.type,transport_payment_master.amount as total_amount,transport_payment_master.discount as total_discount, transport_payment_master.collected_by,transport_payment_master.date as dates,transport_payment_master.receipt_number from student LEFT JOIN  transport  ON student.transport_id= transport.transport_id LEFT JOIN transport_payment_master ON transport_payment_master.student_id= student.student_id WHERE student.student_id= $student_id
        var que = "SELECT tbl_transport_payment_master.type,tbl_transport_payment_master.amount as total_amount,tbl_transport_payment_master.discount as total_discount, tbl_transport_payment_master.collected_by,tbl_transport_payment_master.date as dates,tbl_transport_payment_master.receipt_number  FROM "+table.tablename+" INNER JOIN  tbl_transport  ON "+table.tablename+".transport_id= tbl_transport.transport_id LEFT JOIN tbl_transport_payment_master ON tbl_transport_payment_master.student_id= "+table.tablename+".registration_id WHERE "+table.tablename+".registration_id= "+obj.student_id+"";		
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.getexammarks=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT "+table.tablename+".totalmarks  FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".subject_id="+obj.subject_id+" AND "+table.tablename+".exam_id="+obj.exam_id+"";
		console.log(que);
		con.query(que, cb);
	});
}

module.exports.getTeacherAttendence=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT *  FROM "+table.tablename+" WHERE  "+table.tablename+".attendence_date='"+obj.attendence_date+"' AND "+table.tablename+".registration_id="+obj.student_id+" ";
		//console.log(que);
		con.query(que, cb);
	});
}

/*
** Get existing Record of student marks from tbl_makrs
*/
module.exports.getstudentexammarks=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT "+table.tablename+".marks  FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".subject_id="+obj.subject_id+" AND "+table.tablename+".exam_id="+obj.exam_id+" AND "+table.tablename+".student_id="+obj.student_id+" AND "+table.tablename+".year='"+obj.session_year+"'";
		console.log(que);
		con.query(que, cb);
	});
}


/* Get MArks With Marksheet Formats */
 
module.exports.getcolumnformat =function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT "+table.tablename+".dynamic_column, "+table.tablename+".otheracivity  FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+"  AND "+table.tablename+".exam_id="+obj.exam_id+"";
		console.log('---marksheet formate--',que);
		con.query(que, cb);
	});
}
module.exports.getMarks=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT *  FROM "+table.tablename+" WHERE  "+table.tablename+".class_id='"+obj.class_id+"' AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".subject_id="+obj.subject_id+" AND "+table.tablename+".exam_id="+obj.exam_id+" AND "+table.tablename+".student_id="+obj.student_id+" ";
		//console.log(que);
		con.query(que, cb);
	});
}


module.exports.getexammarks=function(table,obj, cb){

	con.connect(function(err){
		var que = "SELECT "+table.tablename+".totalmarks  FROM "+table.tablename+" WHERE "+table.tablename+".class_id="+obj.class_id+" AND "+table.tablename+".section_id="+obj.section_id+" AND "+table.tablename+".subject_id="+obj.subject_id+" AND "+table.tablename+".exam_id="+obj.exam_id+"";
		//console.log(que);
		con.query(que, cb);
	});
}

module.exports.insert=function(obj, cb){
	con.connect(function(err){
		var que = "INSERT INTO user (full_name, username, password, address, gender, city) VALUES ('"+obj.full_name+"', '"+obj.username+"', '"+sha1(obj.password)+"', '"+obj.address+"', '"+obj.gender+"', '"+obj.city+"')";
		con.query(que, cb);
	});
}

/* Questino Paper Data */
module.exports.findquestionpaper=function(obj, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		var que = "SELECT  "+obj.table+".* ,tbl_class.class_name,   tbl_subject.name AS subject_name, tbl_section.section_name  FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id";
		console.log(que);
		con.query(que, cb);
	});
}



module.exports.insert_class=function(obj, cb){
	con.connect(function(err){
		var que = "INSERT INTO  tbl_class(class_name, class_name_numeric,created_at) VALUES ('"+obj.name+"', '"+obj.numeric_value+"','"+obj.created_at+"')";
		//console.log(que);
		con.query(que, function (err, result) {
		    if (err) throw err;
		     cb(undefined, result.insertId);
		    //return result.insertId;
		   // console.log("1 record inserted, ID: " + result.insertId);
		  });
	});
}

module.exports.insert_section=function(obj, cb){
	con.connect(function(err){
		var que = "INSERT INTO  tbl_section(class_id, section_name) VALUES ('"+obj.class_id+"', '"+obj.section_name+"')";
		//console.log(que);
		con.query(que, function (err, result) {
		    if (err) throw err;
		     cb(undefined, result.insertId);
		    //return result.insertId;
		   // console.log("1 record inserted, ID: " + result.insertId);
		  });
	});
}

module.exports.insert_transport=function(obj, cb){
	con.connect(function(err){
		var que = "INSERT INTO  tbl_transport(route_name, number_of_vehicle,description,route_fare) VALUES ('"+obj.route_name+"', '"+obj.number_of_vehicle+"', '"+obj.description+"', '"+obj.route_fare+"')";
		//console.log(que);
		con.query(que, function (err, result) {
		    if (err) throw err;
		     cb(undefined, result.insertId);
		    //return result.insertId;
		   // console.log("1 record inserted, ID: " + result.insertId);
		  });
	});
}

module.exports.insert_dormitory=function(obj, cb){
	con.connect(function(err){
		var que = "INSERT INTO  tbl_dormitory(name, number_of_room,description,created_at) VALUES ('"+obj.name+"', '"+obj.number_of_room+"', '"+obj.description+"', '"+obj.created_at+"')";
	//	console.log(que);
		con.query(que, function (err, result) {
		    if (err) throw err;
		     cb(undefined, result.insertId);
		    //return result.insertId;
		   // console.log("1 record inserted, ID: " + result.insertId);
		  });
	});
}
 

module.exports.updateWhere=function(tableobj,where, obj, cb){
    
    con.connect(function(err){
      var que= "UPDATE "+tableobj.tablename+" SET ";
      var counter = 1;
		for(var k in obj){
			if(counter==1)
			{
				que += k+"= '"+obj[k]+"'";
			}
			else
			{
				que += " , "+k+"= '"+obj[k]+"' ";

			}
			counter++;
		}

	   var key = Object.keys(where);
	   
	   if(key.length>0)

	     que += " WHERE "+key[0]+" = '"+where[key[0]]+"'";	
       con.query(que, cb);
	});
 
}

module.exports.deletewhere=function(tableobj,obj,cb)
{
  var que= "DELETE  FROM "+tableobj.tablename+" WHERE ";
      var counter = 1;
		for(var k in obj){
			if(counter==1)
			{
				que += k+"= '"+obj[k]+"'";
			}
			else
			{
				que += " AND "+k+"= '"+obj[k]+"' ";

			}
			counter++;
		}

		con.query(que,cb);
		//cb(undefined,1);
}


/*
UPDATE user SET salary=10000 WHERE city='ujjain'
UPDATE user SET salary=10000, age=25, name="rohit" WHERE city='ujjain'
{ salary : 1000, name : "rohit", age : 25 }
*/


module.exports.update=function(where, obj, cb){

	var que = "UPDATE user SET full_name='"+obj.full_name+"', address = '"+obj.address+"', gender = '"+obj.gender+"', city = '"+obj.city+"' WHERE id = "+where.id;
	con.connect(function(err){
		con.query(que, cb);
	});
	// var que = "UPDATE user SET ";
	// var counter=1;
	// for(var k in obj){
	// 	if(counter==1){
	// 		que += k+" = '"+obj[k]+"'"
			
	// 	}
	// 	else{
	// 	que += ", "+k+" = '"+obj[k]+"'"
			
	// 	}
	// 	counter++;
	// }
	// var key = Object.keys(where);
	// que += " WHERE "+key[0]+" = '"+where[key[0]]+"'";
	// console.log(que);
}
module.exports.updateImg=function(where, obj, cb){
	var que = "UPDATE user SET image='"+obj.img+"' WHERE id = "+where.id;
	con.connect(function(err){
		con.query(que, cb);
	});
}

module.exports.getenrollstudentdetail=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_class +" ON "+obj.tbl_enroll+".class_id="+obj.tbl_class+".class_id INNER JOIN "+obj.tbl_section+" ON "+obj.tbl_section+".section_id="+obj.tbl_class+".class_id    WHERE "+obj.tbl_enroll+".registration_id="+ where.registration_id; // + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' ORDER BY "+obj.tbl_registration+".name ASC" ;
	 	//console.log(que);
	 	con.query(que, cb);
	});
}

module.exports.getallstudentlist=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".user_role=3 ORDER BY "+obj.tbl_registration+".name ASC" ;
	 	con.query(que, cb);
	});
}
module.exports.getstudentdetail=function(obj,where, cb)
{
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".registration_id="+where.registration_id  ;
	 	  console.log(que);
	 	con.query(que, cb);
	});
}
module.exports.getbonafieddetail=function(obj,where, cb)
{
	con.connect(function(err){
	 	var que = "SELECT tbl_class.class_name,tbl_registration.dob,tbl_enroll.session_year, tbl_enroll.created_date,tbl_enroll.bonafide_date, tbl_enroll.enroll_id,tbl_enroll.class_id,tbl_enroll.enroll_id,tbl_registration.parent_id,tbl_enroll.bonafide_status,tbl_registration.name,tbl_registration.admission_number FROM  "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id INNER JOIN "+obj.tbl_class+" ON "+obj.tbl_class+" .class_id="+obj.tbl_class+" .class_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".registration_id="+where.registration_id+ " group by "+obj.tbl_registration+".registration_id"  ;
	 	  console.log(que);
	 	con.query(que, cb);
	});
}
/*
module.exports.getsubjectlist=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";
		//console.log(que);
		con.query(que, cb);
	});
}
*/
module.exports.getclassassignedteacher=function(obj,where, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		var que = "SELECT tbl_registration.name as teacher_name,tbl_class.class_name,tbl_subject.name as subject_name,tbl_teacherassignment.id,tbl_section.section_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_registration ON tbl_registration.registration_id="+obj.table+".teacher_id  Where "+obj.table+".class_id="+where.class_id+" AND "+obj.table+".year='"+where.year+"'";
		 //console.log(que);
		con.query(que, cb);
	});
}
module.exports.getalldaysscholler=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT tbl_registration.phone, tbl_registration.name FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE  "+obj.tbl_enroll+".bonafide_status=0 AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".user_role=3";
	 	if(where.condition)
	 	{
	 		que += " AND "+where.condition;
	 	}	
	 	console.log(que);
	 	con.query(que, cb);
	});
} 
module.exports.getallparent=function(obj,where, cb){
	con.connect(function(err){
		// SELECT tr1.registration_id as parentid, tr2.registration_id as childid , tr1.phone as parentphone ,tr1.name as parentname FROM tbl_registration tr1, tbl_registration tr2  Where tr1.registration_id=tr2.parent_id
	 	var que = "SELECT tbl_registration.phone, tbl_registration.name FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE  "+obj.tbl_enroll+".bonafide_status=0 AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".user_role=2";
	 	if(where.condition)
	 	{
	 		que += " AND "+where.condition;
	 	}	
	 	console.log(que);
	 	con.query(que, cb);
	});
} 

module.exports.getssetting=function(obj, cb)
{
	con.connect(function(err){
	 	var que = "SELECT * FROM tbl_setting ";
	 	console.log(que);
        con.query(que, cb);
	});
}
module.exports.getstudentlist_by_class=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + "  AND "+obj.tbl_enroll+".bonafide_status=0  AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_enroll+".section_id='"+where.section_id+"' ORDER BY "+obj.tbl_registration+".name ASC" ;
	 	//var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' ORDER BY "+obj.tbl_registration+".name ASC" ;

	 	con.query(que, cb);
	});
}

module.exports.get_fees_term=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_name+"   WHERE "+obj.tbl_name+".class_id="+ where.class_id + "  AND "+obj.tbl_name+".session_year='"+where.session_year+"'" ;
	 	//var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' ORDER BY "+obj.tbl_registration+".name ASC" ;
	 	//console.log(que);
	 	con.query(que, cb);
	});
}

module.exports.getclass_id_sectionid=function(obj,cb)
{
	con.connect(function(err){
	 	var que = "SELECT * FROM tbl_class INNER JOIN tbl_section ON tbl_class.class_id = tbl_section.section_id WHERE tbl_class.class_name='"+obj.class_name+"' AND tbl_section.section_name='"+obj.section_name+"'";
	 	//console.log(que);
	 	con.query(que, cb);
	}); 
}


module.exports.checkrecordexist=function(obj,where,cb)
{
	con.connect(function(err){
	 	var record={student_id:'',parent_id:'',admission_number:''}

        var que = "SELECT admission_number FROM tbl_registration WHERE admission_number='"+where.admission_number+"' AND user_role=3";
        //console.log(que);
        con.query(que,  function (err, result){
             if (err) throw err;
	         if(result.length>0)
			   admission_number= result[0].admission_number;
			 else
			   admission_number= 0; 


	        var que = "SELECT registration_id FROM tbl_registration WHERE email='"+where.student_email+"' AND phone='"+where.student_phone+"' AND user_role=3";
	        var studentid=0;
		 	con.query(que,  function (err, result){
		 		 if (err) throw err;
	               if(result.length>0)
				 	  studentid= result[0].registration_id;
				   else
				   	  studentid= 0;


	            que = "SELECT registration_id FROM  tbl_registration WHERE email='"+where.parent_email+"' AND phone='"+where.parent_phone+"' AND user_role=2";
	             con.query(que,  function (err, result1){

	               if(result1.length>0)
	               	  record= {student_id: studentid , parent_id:result1[0].registration_id,admission_number:admission_number};
				   else
				   	   record= {student_id: studentid , parent_id:0,admission_number:admission_number};
	               
	                
				   	//console.log(record)	
				    
				    cb(undefined,record);
			 		
			     });

		     });
	    });
	}); 
}
module.exports.checkparentexist=function(obj,where,cb)
{
	con.connect(function(err){
	 	 var record={parent_id:''}

	   que = "SELECT registration_id FROM  tbl_registration WHERE email='"+where.parent_email+"' AND phone='"+where.parent_phone+"' AND user_role=2";
             
	 	con.query(que,  function (err, result){
	 		 //console.log(que);
               if(result.length>0)
               	  record= {parent_id:result[0].registration_id};
			   else
			   	   record= { parent_id:0};
                //console.log(record);
			    cb(undefined,record);//console.log(result[0])
	     });
	}); 
}

/* Get Scheduled exam name list */
module.exports.get_subject_scheduled_exam=function(obj, where, orerby, groupby, cb){
	con.connect(function(err){
		//var que = "SELECT "+obj.tbl_exam_master+".exam_id , "+obj.tbl_exam_master+".exam_name FROM "+obj.tbl_exam_master+"  LEFT JOIN "+obj.tbl_exam_schedule+" ON "+obj.tbl_exam_master+".class_id="+obj.tbl_exam_schedule+".class_id WHERE  "+obj.tbl_exam_schedule+".subject_id="+ where.subject_id+ "  AND "+obj.tbl_exam_schedule+".session_year='"+where.session_year+"' GROUP BY "+obj.tbl_exam_master+"."+groupby.exam_id+" ORDER BY "+orerby.orderby+" "+orerby.order ;

		var que ="SELECT * FROM "+obj.tbl_exam_schedule+" LEFT JOIN "+obj.tbl_exam_master+" ON "+obj.tbl_exam_master+".exam_id= "+obj.tbl_exam_schedule+".exam_id LEFT JOIN "+obj.tbl_exam_grades+" ON "+obj.tbl_exam_schedule+".exam_id= "+obj.tbl_exam_grades+".exam_id where "+obj.tbl_exam_schedule+".subject_id="+where.subject_id+" AND "+obj.tbl_exam_schedule+".class_id="+where.class_id+" AND "+obj.tbl_exam_schedule+".section_id="+where.section_id+" AND "+obj.tbl_exam_schedule+".session_year='2018-2019' GROUP BY "+obj.tbl_exam_grades+".exam_id ORDER BY "+obj.tbl_exam_master+"."+orerby.orderby+" "+orerby.order ;
		 console.log(que);
		con.query(que, cb);
	});
}

/* Get exam name list From Marks Table and class  */
module.exports.get_marks_exam_list=function(obj, where, orerby, cb){
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.tbl_marks+" LEFT JOIN "+obj.tbl_exam_master+" ON "+obj.tbl_exam_master+".class_id="+obj.tbl_marks+".class_id WHERE  "+obj.tbl_marks+".section_id="+ where.section_id+ " AND "+obj.tbl_marks+".year='"+where.session_year+"' GROUP BY "+obj.tbl_exam_master+".exam_id  ORDER BY "+orerby.orderby+" "+orerby.order ;
		console.log(que);
		con.query(que, cb);
	});

	
}

/* Get Marks list of class section & exam name  
module.exports.get_exam_marks_list=function(obj, where, orerby, cb){
	con.connect(function(err){
		var que = "SELECT "+obj.tbl_marks+".* , "+obj.tbl_registration +".name as student_name ,"+obj.tbl_subject +".name as subject_name FROM "+obj.tbl_marks+" LEFT JOIN "+obj.tbl_registration +" ON  "+obj.tbl_registration+".registration_id = "+obj.tbl_marks +".student_id  LEFT JOIN "+obj.tbl_subject+" ON "+obj.tbl_subject+".subject_id="+obj.tbl_marks+".subject_id  WHERE  "+obj.tbl_marks+".class_id="+ where.class_id+ "  AND "+obj.tbl_marks+".section_id="+ where.section_id+" AND "+obj.tbl_marks+".section_id="+ where.exam_id+" AND "+obj.tbl_marks+".year='"+where.session_year+"' ORDER BY  "+obj.tbl_registration+"."+orerby.orderby+" "+orerby.order ;
		  console.log(que);
		con.query(que, cb);
	});
}
*/
module.exports.get_exam_marks_list=function(obj, where, orerby, cb){
	con.connect(function(err){
		//var que = "SELECT "+obj.tbl_marks+".* , "+obj.tbl_registration +".name as student_name ,"+obj.tbl_subject +".name as subject_name FROM "+obj.tbl_marks+" LEFT JOIN "+obj.tbl_registration +" ON  "+obj.tbl_registration+".registration_id = "+obj.tbl_marks +".student_id  LEFT JOIN "+obj.tbl_subject+" ON "+obj.tbl_subject+".subject_id="+obj.tbl_marks+".subject_id  WHERE  "+obj.tbl_marks+".class_id="+ where.class_id+ "  AND "+obj.tbl_marks+".section_id="+ where.section_id+" AND "+obj.tbl_marks+".section_id="+ where.exam_id+" AND "+obj.tbl_marks+".student_id="+ where.student_id+" AND "+obj.tbl_marks+".year='"+where.session_year+"' ORDER BY  "+obj.tbl_registration+"."+orerby.orderby+" "+orerby.order ;
		var que = "SELECT "+obj.tbl_marks+".* , "+obj.tbl_registration +".name as student_name , "+obj.tbl_registration +".admission_number  ,"+obj.tbl_subject +".name as subject_name FROM "+obj.tbl_marks+" LEFT JOIN "+obj.tbl_registration +" ON  "+obj.tbl_registration+".registration_id = "+obj.tbl_marks +".student_id  LEFT JOIN "+obj.tbl_subject+" ON "+obj.tbl_subject+".subject_id="+obj.tbl_marks+".subject_id  WHERE  "+obj.tbl_marks+".class_id="+ where.class_id+ " AND "+obj.tbl_marks+".section_id="+ where.section_id+" AND "+obj.tbl_marks+".exam_code='"+where.exam_code+"' AND "+obj.tbl_marks+".student_id="+ where.student_id+" AND "+obj.tbl_marks+".year='"+where.session_year+"' ORDER BY  "+obj.tbl_registration+"."+orerby.orderby+" "+orerby.order ;
		  console.log('Queriiiiiiiiiii',que);
		con.query(que, cb);
	});
}


// module.exports.get_summative_exam_marks_list=function(obj, where, orerby, cb){
// 	con.connect(function(err){
// 		//var que = "SELECT "+obj.tbl_marks+".* , "+obj.tbl_registration +".name as student_name ,"+obj.tbl_subject +".name as subject_name FROM "+obj.tbl_marks+" LEFT JOIN "+obj.tbl_registration +" ON  "+obj.tbl_registration+".registration_id = "+obj.tbl_marks +".student_id  LEFT JOIN "+obj.tbl_subject+" ON "+obj.tbl_subject+".subject_id="+obj.tbl_marks+".subject_id  WHERE  "+obj.tbl_marks+".class_id="+ where.class_id+ "  AND "+obj.tbl_marks+".section_id="+ where.section_id+" AND "+obj.tbl_marks+".section_id="+ where.exam_id+" AND "+obj.tbl_marks+".student_id="+ where.student_id+" AND "+obj.tbl_marks+".year='"+where.session_year+"' ORDER BY  "+obj.tbl_registration+"."+orerby.orderby+" "+orerby.order ;
// 		var que = "SELECT "+obj.tbl_marks+".* , "+obj.tbl_registration +".name as student_name , "+obj.tbl_registration +".admission_number  ,"+obj.tbl_subject +".name as subject_name FROM "+obj.tbl_marks+" LEFT JOIN "+obj.tbl_registration +" ON  "+obj.tbl_registration+".registration_id = "+obj.tbl_marks +".student_id  LEFT JOIN "+obj.tbl_subject+" ON "+obj.tbl_subject+".subject_id="+obj.tbl_marks+".subject_id  WHERE  "+obj.tbl_marks+".class_id="+ where.class_id+ " AND "+obj.tbl_marks+".section_id="+ where.section_id+" AND "+obj.tbl_marks+".student_id="+ where.student_id+" AND "+obj.tbl_marks+".year='"+where.session_year+"' ORDER BY  "+obj.tbl_registration+"."+orerby.orderby+" "+orerby.order ;
// 		  console.log('Queriiiiiiiiiii',que);
// 		con.query(que, cb);
// 	});
// }

module.exports.get_fees_type=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_name+"   WHERE "+obj.tbl_name+".class_id="+ where.class_id + "  AND "+obj.tbl_name+".session_year='"+where.session_year+"'" ;
	 	//var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' ORDER BY "+obj.tbl_registration+".name ASC" ;
	 	//console.log(que);
	 	con.query(que, cb);
	});
}



module.exports.getallstudentlist=function(obj,where, cb){
	  //
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' ORDER BY "+obj.tbl_registration+".name ASC" ;
	 	con.query(que, cb);
	});
}
module.exports.getstudentdetail=function(obj,where, cb)
{
	con.connect(function(err){
	 	var que = "SELECT * FROM "+obj.tbl_enroll+"  INNER JOIN "+obj.tbl_registration+" ON "+obj.tbl_registration+".registration_id="+obj.tbl_enroll+".registration_id WHERE "+obj.tbl_enroll+".class_id="+ where.class_id + " AND "+obj.tbl_enroll+".section_id="+ where.section_id+ " AND "+obj.tbl_enroll+".session_year='"+where.session_year+"' AND "+obj.tbl_registration+".registration_id="+where.registration_id  ;
	 	 //console.log(que);
	 	con.query(que, cb);
	});
}
/*
module.exports.getsubjectlist=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id";
		//console.log(que);
		con.query(que, cb);
	});
}
*/
module.exports.getclassassignedteacher=function(obj,where, cb){
	//console.log(obj);
	//console.log("SELECT * FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id");
	con.connect(function(err){
		var que = "SELECT tbl_registration.name as teacher_name,tbl_class.class_name,tbl_subject.name as subject_name,tbl_teacherassignment.id,tbl_section.section_name FROM "+obj.table+"  LEFT JOIN tbl_class ON tbl_class.class_id="+obj.table+".class_id LEFT JOIN tbl_subject ON tbl_subject.subject_id="+obj.table+".subject_id LEFT JOIN tbl_section ON tbl_section.section_id="+obj.table+".section_id LEFT JOIN tbl_registration ON tbl_registration.registration_id="+obj.table+".teacher_id  Where "+obj.table+".class_id="+where.class_id+" AND "+obj.table+".year='"+where.year+"'";
		 //console.log(que);
		con.query(que, cb);
	});
}
 
 


module.exports.findmarksheetstudent=function(tableobj, obj, cb){
	con.connect(function(err){
		var que = "SELECT exam_code,subject_type,student_id,subject_id,section_id,exam_id,comment,year FROM "+tableobj.tablename+" WHERE ";
		var counter = 1;
		for(var k in obj){
			if(counter==1)
			{
				que += k+"= '"+obj[k]+"'";
			}
			else
			{
				que += " AND "+k+"= '"+obj[k]+"' ";

			}
			counter++;
		}
		que+= " GROUP BY student_id ";
        //console.log('Queriiiiiiiiiiiiii',que);
		con.query(que, cb);
	});

	
}


 

 


