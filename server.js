var Scratch = require('scratch-api');
var fs = require('fs');

var PROJ_ID=95350685;

var username;
var mode;
var sentData = [];
var tmp;
var numbSent;


var commands = ["read", "new", "post"];

//Insert your cloud var names here
var Base = "☁ Interface" //3 of them
var ReturnI = "☁ Return" //1
var Command = "☁ Command";
var Trigger = "☁ Trigger";

/*--------------------FILE IO--------------------*/
var f_path="forum";

function newThread(name){
	fs.writeFileSync(f_path+"/"+name+".txt", name+"\n");
}

function getThread(name){
	return(fs.readFileSync(f_path+"/"+name+".txt","utf8"));
}

function post(usr, thread, contents){
	fs.writeFileSync(f_path+"/"+thread+".txt", getThread(thread)+"\n"+usr+":"+contents);
}



/*--------------------FILE IO--------------------*/



/*--------------------MEC--------------------*/
function getTimeStamp(){
	var d = new Date();
	var min = d.getMinutes();
	
	var hour = d.getHours();
	var seconds = d.getSeconds();
	var mil = d.getMilliseconds();

	if (min<10){
		min="0"+min;
	}
	if (seconds<10){
		seconds="0"+seconds;
	}
	if (hour<10){
		hour="0"+hour;
	}

	return("["+hour+":"+min+":"+seconds+":"+mil+"]");
}

function log(text){
	console.log(getTimeStamp()+" "+text);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


/*--------------------MEC--------------------*/



/*--------------------ENCODING--------------------*/
function encode(text){
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-=_+[]\\{}|;':\",./<>?`~ ";
	var next;
	var result="";

	for(var i=0;i<text.length;i++){
		next=(alpha.indexOf(text[i])+1).toString();
		if(next.length==1){
			next="0"+next;
		}
		result+=next;
	}
	return result;
}	

function decode(text){
	log("Decoding: " + text);
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-=_+[]\\{}|;':\",./<>?`~ ";
	var next;
	var result="";
	var text2 = text.toString();

	for(var i=0;i<text.toString().length;i+=2){
		next=alpha[parseInt(text2[i]+text2[i+1])-1];
		result+=next;
	}
	return result;
}
/*--------------------ENCODING--------------------*/



/*--------------------MAIN--------------------*/

Scratch.UserSession.load(function(err, user) {
	log(err);
    user.cloudSession(PROJ_ID, function(err, cloud) {
    	if(err){
    		log(err);
    	}
    	log("Inner A");
    	cloud.on("set", function(name, val) {		
    		if(name==Trigger){
                log(name+": "+val);

        		if(val==1){
        			log("STARTING----------");

        			cloud.set(name, 2); // Tell server we are processing...

        			mode = commands[cloud.get(Command)-1];

        			sentData = [];
        			
        			sentData.push(decode(cloud.get(Base+"1")));
        			sentData.push(decode(cloud.get(Base+"2")));
        			sentData.push(decode(cloud.get(Base+"3")));
        			

        			if(mode == "read"){
        				// 0-Thread Name
        				cloud.set(ReturnI, getThread(sentData[0]));

        			} else if(mode == "new") {
        				// 0-Thread Name
        				// 1-Username
        				// 2-Post Contents
        				newThread(sentData[0]);
        				post(sentData[1], sentData[0], sentData[2]);
        				cloud.set(ReturnI, "Done");
        			} else if(mode == "post"){
        				// 0-Thread Name
        				// 1-Username
        				// 2-Post Contents
        				post(sentData[1], sentData[0], sentData[2]);
        				cloud.set(ReturnI, "Done");
        			}

        			log(mode);
        			console.log("setting now...");
    				cloud.set(Trigger, 0);
    				log("done");
    				
    			} else {
        			log("else");
        		}
        		console.log("2");
        		sleep(1000);
            }
    	});
		console.log("3");
  	});
});
/*--------------------MAIN--------------------*/
