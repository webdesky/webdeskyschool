var express = require('express');
var app = express();   
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var cache = require("nocache");
var upload = require('express-fileupload');
 


app.set('view engine', 'ejs');





app.use(function(req, res, next){
    var arr=null;
    //console.log('req.url---->',req.url);
    
	var arr = req.url.split("/");
	
	res.locals.appName = "";
	
	//console.log('arr[1]',arr[1]);
	/*
	if(arr[1]=="panchavatividyalaya"){
		app.set("views", "./panchavatividyalaya/views/");
		app.use(express.static(__dirname+"/panchavatividyalaya/public/"));
		app.use(express.static(__dirname+"/public/website/"));
		
		res.locals.appName = "/panchavatividyalaya";
	}
	else if(arr[1]=="vedahighschool"){
		//console.log("---------------", __dirname+"/vedahighschool/public");  
	 //res.clearCookie()
		app.set("views", "./vedahighschool/views/");
		
		app.use(express.static(__dirname+"/vedahighschool/public/"));
		app.use(express.static(__dirname+"/public/website/"));
		res.locals.appName = "/vedahighschool";
		
	}
	else if(arr[1]=="divinegraceschool"){
		//console.log("---------------", __dirname );  
		app.set("views", "./divinegraceschool/views/");
		app.use(express.static(__dirname+"/divinegraceschool/public/"));
		app.use(express.static(__dirname+"/public/website"));
		res.locals.appName = "/divinegraceschool";
		
	}
	else if(arr[1]=="frontlineschool"){
	 //res.clearCookie()
		//console.log("---------------", __dirname+"/frontlineschool/public");  
		app.set("views", "./frontlineschool/views/");
		app.use(express.static(__dirname+"/frontlineschool/public/"));
		app.use(express.static(__dirname+"/frontlineschool/public/website/"));
		
		res.locals.appName = "/frontlineschool";
	}
	else if(arr[1]=="panchavatividyalaya2"){
	   
		//console.log("---------------");  
		app.set("views", "./panchavatividyalaya2/views/");
		app.use(express.static(__dirname+"/panchavatividyalaya2/public/"));
		app.use(express.static(__dirname+"/public/website/"));
		
		res.locals.appName = "/panchavatividyalaya2";
	}
	else
    
	 {*/
	    //console.log('Got Solution');
		app.set("views", "views");
		app.use(express.static(__dirname+"/public/"));
		app.use(express.static(__dirname+"/public/website/"));
		res.locals.appName = "";

	 /*}*/
  next();
});
// app.set('views', 'views');



app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret : "TSS", saveUninitialized: true}));
app.use(flash());
app.use(cache());
app.use(upload());
app.use(cors());
// app.use(require("./config/connect"));

app.use(bodyParser.json({limit: '1024mb'}));
app.use(bodyParser.urlencoded({limit: '1024mb', extended: true}));


app.use(function(req, res, next){
	//console.log(req.session)
	res.locals.session = req.session;
	res.locals.user_role = req.cookies.user_role;
	
	next();
});

app.use(require("./config/routes"));


// app.get("*", function(req, res){
// 	res.send("<h1>Page Not Found</h1>");
// })

app.listen(process.env.PORT || 3000, function(){
     
	console.log("Server Running");
});
