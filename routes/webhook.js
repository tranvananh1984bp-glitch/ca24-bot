// ======================================
// CA24 v2.0
// Messenger Webhook Router
// ======================================

const express = require("express");
const router = express.Router();


// LOAD MENU DATA
const {
    buildQuickReplies
} = require("../services/replyBuilder");


// LOAD MESSENGER SERVICE
const {
    sendMessage,
    createMenu,
    createGetStarted
} = require("../services/messenger");


// LOAD INTENT ENGINE
const {
    handlePostback,
    handleQuickReply,
    handleText
} = require("../services/router");

// ======================================
// CONFIG
// ======================================


const VERIFY_TOKEN =
process.env.VERIFY_TOKEN;



// ======================================
// WEBHOOK VERIFY
// ======================================


router.get(
"/",
(req,res)=>{


    const mode =
    req.query["hub.mode"];


    const token =
    req.query["hub.verify_token"];


    const challenge =
    req.query["hub.challenge"];



    if(
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ){

        console.log(
            "CA24 WEBHOOK VERIFIED"
        );


        return res
        .status(200)
        .send(challenge);

    }



    return res.sendStatus(403);


});




// ======================================
// RECEIVE FACEBOOK EVENT
// ======================================


router.post(
"/",
async(req,res)=>{


try{


const body =
req.body;



if(
body.object !== "page"
){

return res.sendStatus(404);

}




for(
const entry of body.entry
){



for(
const event of entry.messaging || []
){



console.log(
"EVENT:",
JSON.stringify(
event,
null,
2
)
);



// ===============================
// IGNORE BOT ECHO
// ===============================


if(
event.message &&
event.message.is_echo
){

continue;

}




const senderId =
event.sender.id;
console.log(
"SENDER ID:",
senderId
);



// ===============================
// POSTBACK
// ===============================


if(event.postback){


await handlePostback(
senderId,
event.postback.payload
);


continue;

}




// ===============================
// QUICK REPLY
// ===============================


if(
event.message &&
event.message.quick_reply
){


await handleQuickReply(
senderId,
event.message.quick_reply.payload
);


continue;

}




// ===============================
// TEXT MESSAGE
// ===============================


if(
event.message &&
event.message.text
){


await handleText(
senderId,
event.message.text
);


continue;

}




}


}



res
.status(200)
.send(
"EVENT_RECEIVED"
);



}catch(error){


console.log(
"WEBHOOK ERROR:",
error.message
);


res.sendStatus(500);


}


});


module.exports =
router;

