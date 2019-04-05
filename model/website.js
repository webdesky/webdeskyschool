var con = require('../config/connect');
var empty = require('is-empty');

 

module.exports.select= function(cb){
	  con.connect(function(err){
	  	    //console.log(obj);
	  	   con.query("SELECT * FROM amendo_user",cb); 
	  });
} 


module.exports.insert_all=function(tableobj, obj, cb){ 

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
module.exports.findAll=function(obj, where, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table;
         console.log(que);
		con.query(que, cb);
	});
}
module.exports.findAllwhereorderby=function(obj, where, orderby,limit, cb){
	 
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table; //+" ORDER BY "+obj.orderbyfield+" DESC ";
		//console.log('ssss',where);
		if(where!="")
		{
		   que += " WHERE ";
		   var counter = 1;
			 for(var k in where)
			 {
				if(counter==1)
				{
					que += k+"= '"+where[k]+"'";
				}
				else
				{
					que += " AND "+k+"= '"+where[k]+"' ";

				}
				counter++;
			 }
        }
        if(orderby!="")
        	que+= " ORDER BY "+orderby.orderbyfield+ "  "+orderby.order;
        if(limit!="")
        	que+= " LIMIT "+limit.limit 
  //console.log(que);
         
		con.query(que, cb);
	});
}
module.exports.findbyColumn=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT "+obj.column+" FROM "+obj.table;
         console.log(que);
		con.query(que, cb);
	});
}

module.exports.findsetting=function(obj, cb){
	//console.log(obj);
	con.connect(function(err){
		var que = "SELECT * FROM "+obj.table;
        console.log(que);
		con.query(que, cb);
	});
}



 

 


 

 


