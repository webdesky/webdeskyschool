$(document).ready(function(){

/* Get value of specific user on register page */

    user =$("input[type=radio][name='register']:checked").val()

    $(".userregister").val(user);
    

    $( ".abc" ).change(function() {
       $(".userregister").val('');
       user =$("input[type=radio][name='register']:checked").val()
       $(".userregister").val(user);
    });

/**********/
/*  */

  $("#classid").change(function() {
    var id = $(this).children(":selected").attr("id");
    switch(id)
    {
      case "hostlers": $("#visiableclass").show();
      break;
      case "daysscholler": $("#visiableclass").show();
      break; 
      default: $("#visiableclass").hide(); 
    }
  });

});

$('form[id="student_register"]').validate({

 rules: {
          student_name: 'required',
          student_gender: 'required',
          //caste : 'required',
          //sub_caste : 'required',
          class_id : 'required',
          section_id : 'required',
          //adhar_number : 'required',
          datepicker : 'required',
          
          
          //address : 'required',
          student_email : {
              required: true,
              email: true,
                },
          student_phone :{
                           required: true,
                           digits: true,
                           minlength: 10,
                           maxlength:10,
                         },  
          student_password : 'required',
          admission_number : 'required',
          parent_password : 'required',
          parent_name : 'required',
          
          //parent_address : 'required',
          parent_number : {
                           required: true,
                           digits: true,
                           minlength: 10,
                           maxlength:10

                          },
          parent_email : {
                            required: true,
                            email: true,
                         },
           
        },
        messages: {
          student_name: 'This field is required',
          student_gender:'This field is required', 
          caste:'This field is required',
          sub_caste :'This field is required',
          //class_id :'This field is required',
          section_id :'This field is required',
          adhar_number :'This field is required',
          datepicker :'This field is required',
          sub_caste :'This field is required',
          //transport_id :'This field is required',
          //dormitory_id :'This field is required',
          //address :'This field is required',
          email :'This field is required Or Email is Not Valid',
          student_phone :{
             required :'This field is required',
             minlength:'Number is not Valid',
             maxlength:'Number is not Valid',
           },
          student_password :'This field is required',
          admission_number :'This field is required',
          //blood_group :'This field is required',
          parent_name :'This field is required',
          //mother_name :'This field is required',
          //parent_address :'This field is required',
          parent_number :{
             required :'This field is required',
             minlength:'Number is not Valid',
             maxlength:'Number is not Valid',
           },
          parent_email :{
                         required :'This field is required ',
                         email :'Email is Not Valid'
                         },
          parent_password :'This field is required',
          parent_profession :'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});


$('form[id="teacher_register"]').validate({

 rules: {
          teacher_name: 'required',
          teacher_gender: 'required',
          teacher_adhar_no: 'required',
          teacher_dob: 'required',
          show_website: 'required',
          //teacher_designation: 'required',
          teacher_address: 'required',
          teacher_phone:{
                           required: true,
                           digits: true,
                           minlength: 10,
                           maxlength: 10
                         }, 
          teacher_email: {
                            required: true,
                            email: true,
                         },
          teacher_password: 'required',
          //academics: 'required',
          teacher_profession: 'required',
          staff_category : 'required',
        },
        messages: {
          teacher_name: 'This field is required',
          teacher_gender: 'This field is required',
          teacher_adhar_no: 'This field is required',
          teacher_dob: 'This field is required',
          show_website: 'This field is required',
          teacher_designation: 'This field is required',
          teacher_address: 'This field is required',
          teacher_phone: {
                           required :'This field is required',
                           minlength:'Number is not Valid',
                           maxlength:'Number is not Valid',
                         },
          teacher_email: {
                         required :'This field is required ',
                         email :'Email is Not Valid'
                         },
          teacher_password: 'This field is required',
          //academics: 'This field is required',
          teacher_profession: 'This field is required',
          staff_category: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="accountant_register"]').validate({

 rules: {
          accountant_name: 'required',
          accountant_gender: 'required',
          accountant_email: {
                              required: true,
                              email: true,
                            },
          accountant_password: 'required',
          accountant_address: 'required',
          accountant_phone:{
                              required: true,
                              digits: true,
                              minlength: 10,
                              maxlength: 10
                           }, 
          //accountant_academics: 'required',
          //accountant_profession : 'required',
        },
        messages: {
          accountant_name: 'This field is required',
          accountant_gender: 'This field is required',
          accountant_email: 'This field is required Or Email is Not Valid',
          accountant_password: 'This field is required',
          accountant_address: 'This field is required',
          accountant_phone: {
                             required :'This field is required',
                             minlength:'Number is not Valid',
                             maxlength:'Number is not Valid',
                           },
          //accountant_academics: 'This field is required',
          //accountant_profession: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="librarian_register"]').validate({

 rules: {
          librarian_name: 'required',
          librarian_gender: 'required',
          librarian_email:{
                              required: true,
                              email: true,
                          },
          librarian_password: 'required',
          librarian_address: 'required',
          librarian_phone:{
                              required: true,
                              digits: true,
                              minlength: 10,
                              maxlength: 10
                          }, 
          librarian_academics: 'required',
          librarian_profession : 'required',
        },
        messages: {

          librarian_name: 'This field is required',
          librarian_gender: 'This field is required',
          librarian_email: 'This field is required Or Email is Not Valid',
          librarian_password: 'This field is required',
          librarian_address: 'This field is required',
          librarian_phone: 'This field is required Or Number is not Valid',
          librarian_academics: 'This field is required',
          librarian_profession: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_shiftsection"]').validate({

 rules: {
          class_id: 'required',
          section_id_stop: 'required',
          section_id_stop2: 'required'
        },
        messages: {
          class_id: 'This field is required',
          section_id_stop: 'This field is required',
          section_id_stop2: 'This field is required'
        },
        submitHandler: function(form) {
          form.submit();
        }
}); 

$('form[id="form_transport"]').validate({

 rules: {
          route_name: 'required',
          number_of_vehicle: 'required',
          route_fare:{
                        required: true,
                        number: true

                        //minlength: 10,
                      }, 
          //descriptions : 'required',
        },
        messages: {

          route_name: 'This field is required',
          number_of_vehicle: 'This field is required',
          route_fare: 'This field is required',
           
        },
        submitHandler: function(form) {
          form.submit();
        }
}); 

$('form[id="form_dormitory"]').validate({

 rules: {
          name: 'required',
          number_of_room: 'required',
          route_fare:{
                        required: true,
                        digits: true,
                        minlength: 10,
                      }, 
          //descriptions : 'required',
        },
        messages: {

          name: 'This field is required',
          number_of_room: 'This field is required',
          route_fare: 'This field is required',
           
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_class"]').validate({

 rules: {
          name: 'required',
          class_abbreviations: 'required',
          //descriptions : 'required',
        },
        messages: {
          name: 'This field is required',
          class_abbreviations: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});  
$('form[id="form_section"]').validate({

 rules: {
          class_id: 'required',
          section_name: 'required',
          //descriptions : 'required',
        },
        messages: {
          class_id: 'This field is required',
          section_name: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_fees_structure"]').validate({

 rules: {
          class_id: 'required',
          section_name: 'required',
          fees_type_id :'required',
          fees_term_id : 'required',
          //descriptions : 'required',
        },
        messages: {
          class_id: 'This field is required',
          section_name: 'This field is required',
          fees_type_id: 'This field is required',
          fees_term_id: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_academicsyllabus"]').validate({

 rules: {
          class_id: 'required',
          subject_id: 'required',
          title :  'required',
          section_name: 'required',
          //descriptions : 'required',
          //file: 'required',
        },
        messages: {
          class_id: 'This field is required',
          subject_id: 'This field is required',
          title: 'This field is required',
          section_name: 'This field is required',
          file: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_subject"]').validate({

 rules: {
          class_id: 'required',
          subject_name:'required',
          subject_type: 'required',
          //descriptions : 'required',
        },
        messages: {
         // class_id: 'This field is required',
          subject_name: 'This field is required',
          subject_type: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_assignteacher"]').validate({

 rules: {
          class: 'required',
          section_id:'required',
          subject_id: 'required',
          teacher_id: 'required',
          //descriptions : 'required',
        },
        messages: {
          class: 'This field is required',
          section_id: 'This field is required',
          subject_id: 'This field is required',
          teacher_id: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_homework"]').validate({

        rules: {
          //task: 'required',
          //task_description:'required',
          //checktosend: 'required',
           
        },
        messages: {
          //task: 'This field is required',
          //task_description: 'This field is required',
          //checktosend: 'Send messages required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_attendence_date"]').validate({

        rules: {
          attendence_date: 'required',
          class_id:'required',
          section_id: 'required',
           
        },
        messages: {
          attendence_date: 'This field is required',
          class_id: 'This field is required',
          section_id: 'Send messages required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_studymaterial"]').validate({

 rules: {
          class_id: 'required',
          subject_id:'required',
          title: 'required',
         // file: 'required',
          descriptions : 'required',
        },
        messages: {
          class_id: 'This field is required',
          subject_id: 'This field is required',
          title: 'This field is required',
          //file: 'This field is required',
          descriptions: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_addexam"]').validate({

 rules: {
          class: 'required',
          section_id:'required',
          name: 'required',
          exam_id: 'required',
        },
        messages: {
          class: 'This field is required',
          section_id: 'This field is required',
          name: 'This field is required',
          exam_id: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_examschedule"]').validate({

 rules: {
          class_id: 'required',
          exam_section_id:'required',
          subject_id: 'required',
          exam_id : 'required',
          date : 'required',
          total_marks:{
                        required: true,
                        number: true
 
                      },
        },
        messages: {
          class_id: 'This field is required',
          exam_section_id: 'This field is required',
          subject_id: 'This field is required',
          exam_id: 'This field is required',
          date: 'This field is required',
          total_marks:{
                         required :'This field is required ',
                         number :'Number is Not Valid'
                       },
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_grade"]').validate({

 rules: {
          name: 'required',
          mark_from:{
                        required: true,
                        number: true
 
                      },
          mark_upto: {
                        required: true,
                        number: true
 
                      },
          class_id : 'required',
          //section_id : 'required',
          exam_id : 'required',

        },
        messages: {
          name: 'This field is required',
          mark_from: {
                         required :'This field is required ',
                         number :'Number is Not Valid'
                       },
          mark_upto: {
                         required :'This field is required ',
                         number :'Number is Not Valid'
                       },
          class_id : 'This field is required',
          section_id :'This field is required',
          exam_id : 'This field is required',           

        },
        submitHandler: function(form) {
          form.submit();
        }
});


$('form[id="form_setting"]').validate({

 rules: {
          school_name: 'required',
          //file:'required',
          school_address: 'required',
          session_year : 'required',
        },
        messages: {
          school_name: 'This field is required',
          //file: 'This field is required',
          school_address: 'This field is required',
          session_year: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_promotion"]').validate({

 rules: {
          teacher_class_id: 'required',
          //file:'required',
          teacher_section_id: 'required',
           
        },
        messages: {
          school_name: 'This field is required',
          //file: 'This field is required',
          school_address: 'This field is required',
          session_year: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

/* Bulk Import Validation */
$('form[id="form_bulimport"]').validate({
 rules: {
          bulkfile: 'required',
        },
        messages: {
          bulkfile: 'Please upload File',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
// Validation for CSV file only and column name 
$('#bulkfile').change(function(e){
   
  var ext = $("#bulkfile").val().split(".").pop().toLowerCase();
  if($.inArray(ext, ["csv"]) == -1) {
    alert('Upload CSV file only');
    var $el = $('#bulkfile');
        $el.wrap('<form>').closest('form').get(0).reset();
        $el.unwrap();
    return false;
  }
  if(e.target.files != undefined){
    var reader = new FileReader();
    reader.onload = function(e){
      csvResult = e.target.result.split("\n");//(/\r|\n|\r\n/);
      var cells = csvResult[0].split(",");
      var fields= ['student_name','student_gender','caste','sub_caste','class_name','section_name','aadhar_number','student_dob','transport_id','dormitory_id','address','student_phone','student_email','student_password','blood_group','admission_number','parent_name','mother_name','parent_address','parent_phone','parent_email','parent_password','profession'];
      for(i=0;i< cells.length; i++)
      {
              if(cells[i].trim()!= fields[i])
              {
                alert('Incorrect sheet column name');
                var $el = $('#bulkfile');
            $el.wrap('<form>').closest('form').get(0).reset();
            $el.unwrap();
              }
      }
    }
    reader.readAsText(e.target.files.item(0));
  }
});

$("#checkAll").click(function(){
    $('input:checkbox').not(this).prop('checked', this.checked);
});

/* Send Marks SMS */
$('form[id="form_sendmarkssms"]').validate({

 rules: {
          class_id: 'required',
           
          exam_section_id: 'required',
          exam_id: 'required',
          user_role: 'required',
        },
        messages: {
          class_id: 'This field is required',
          exam_section_id: 'This field is required',
          exam_id: 'This field is required',
          user_role: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_questionpaper"]').validate({

 rules: {
          class_id: 'required',
           
          exam_section_id: 'required',
          subject_id: 'required',
          exam_id: 'required',
          quesionpaper_file: 'required' 
        },
        messages: {
          class_id: 'This field is required',
          exam_section_id: 'This field is required',
          exam_id: 'This field is required',
          user_role: 'This field is required',
          quesionpaper_file: 'This field is required'
        },
        submitHandler: function(form) {
          form.submit();
        }
});

$('form[id="form_studentmessage"]').validate({

 rules: {
          classid: 'required',
          descriptionstudent: 'required',
          //visiableclass: 'required',
        },
        messages: {
          class_id: 'This field is required',
          descriptionstudent: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_teachermessage"]').validate({

 rules: {
          class_id: 'required',
          descriptionteacher: 'required',
        },
        messages: {
          class_id: 'This field is required',
          descriptionteacher: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_parentmessage"]').validate({

 rules: {
          class_id: 'required',
          descriptionparent: 'required',
        },
        messages: {
          class_id: 'This field is required',
          descriptionparent: 'This field is required',
        },
        submitHandler: function(form) {
          form.submit();
        }
});
$('form[id="form_changepassword"]').validate({

       rules : {
                  password : {
                    minlength : 5,
                    required : true

                  },
                  password_confirm : {
                    minlength : 5,
                    required : true,
                    equalTo : "#password"
                  }
                },
        messages: {
          password: 'This field is required',
          password_confirm: 'Password Not Matched',
        },
        submitHandler: function(form) {
          form.submit();
        }

         
});

