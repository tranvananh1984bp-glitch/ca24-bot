// ======================================
// CA24 v2.0
// Messenger Service
// ======================================


const axios = require("axios");



// ======================================
// CONFIG
// ======================================


const PAGE_ACCESS_TOKEN =
process.env.PAGE_ACCESS_TOKEN;



const GRAPH_API =
"https://graph.facebook.com/v25.0";





// ======================================
// SEND MESSAGE
// ======================================


async function sendMessage(
senderId,
message
){


try{


await axios.post(

`${GRAPH_API}/me/messages`,

{

recipient:{
id:senderId
},

message

},

{

params:{

access_token:
PAGE_ACCESS_TOKEN

}

}

);



console.log(
"SEND SUCCESS:",
senderId,
"TIME:",
new Date().toISOString()
);


}catch(error){



console.log(

"SEND MESSAGE ERROR:",

error.response?.data ||
error.message

);



}



}





// ======================================
// CREATE GET STARTED
// ======================================


async function createGetStarted(){


try{


await axios.post(


`${GRAPH_API}/me/messenger_profile`,


{


get_started:{


payload:
"HOME"


}


},


{


params:{


access_token:
PAGE_ACCESS_TOKEN


}


}



);



console.log(
"GET STARTED CREATED"
);



}catch(error){


console.log(

"GET STARTED ERROR:",

error.response?.data ||
error.message

);



}



}






// ======================================
// CREATE PERSISTENT MENU
// ======================================


async function createMenu(){


try{


await axios.post(


`${GRAPH_API}/me/messenger_profile`,


{


persistent_menu:[


{


locale:
"default",



composer_input_disabled:
false,



call_to_actions:[



{


type:
"postback",

title:
"🏠 Trang chủ CA24",

payload:
"HOME"


},



{


type:
"postback",

title:
"📄 Dịch vụ công",

payload:
"DV_CONG"


},



{


type:
"postback",

title:
"🚨 Báo tin ANTT",

payload:
"BAO_TIN_ANTT"


},



{


type:
"postback",

title:
"🔥 PCCC",

payload:
"PCCC"


},



{


type:
"postback",

title:
"⚠️ Lừa đảo",

payload:
"LUA_DAO"


},



{


type:
"postback",

title:
"⚖️ Pháp luật",

payload:
"PHAP_LUAT"


}



]


}


]


},



{


params:{


access_token:
PAGE_ACCESS_TOKEN


}


}



);



console.log(
"MENU CREATED"
);



}catch(error){


console.log(

"MENU ERROR:",

error.response?.data ||
error.message

);



}



}





// ======================================
// EXPORT
// ======================================


module.exports = {


sendMessage,

createMenu,

createGetStarted


};