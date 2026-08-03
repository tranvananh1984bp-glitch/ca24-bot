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
    findIntent
} = require("../services/intent");


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





// ======================================
// HANDLE POSTBACK
// ======================================


async function handlePostback(
senderId,
payload
){


console.log(
"POSTBACK:",
payload
);



switch(payload){



case "HOME":


await sendMessage(
senderId,
{

text:
"🏠 CA24 - Trợ lý AI của bạn\n\nVui lòng chọn nội dung cần hỗ trợ."

}

);

break;




case "DV_CONG":

    await sendMessage(
        senderId,
        {

            text:
            "📄 Dịch vụ công\n\nBạn muốn hỗ trợ nội dung nào?",

            quick_replies:
            buildQuickReplies("service_menu")

        }
    );

break;



case "PCCC":


await sendMessage(
senderId,
{

text:
"🔥 PCCC\n\nCA24 hỗ trợ kiến thức phòng cháy, chữa cháy và kỹ năng thoát nạn."

}

);


break;



case "LUA_DAO":


await sendMessage(
senderId,
{

text:
"⚠️ Cảnh báo lừa đảo\n\nKhông cung cấp OTP, mật khẩu, mã xác thực cho người lạ."

}

);


break;



case "PHAP_LUAT":


await sendMessage(
senderId,
{

text:
"⚖️ Pháp luật\n\nHãy nhập nội dung bạn cần tra cứu."

}

);


break;



}



}




// ======================================
// HANDLE QUICK REPLY
// ======================================


async function handleQuickReply(
senderId,
payload
){


console.log(
"QUICK:",
payload
);



let text="";



switch(payload){


case "CCCD":

text="căn cước";

break;


case "CU_TRU":

text="cư trú";

break;


case "XE":

text="đăng ký xe";

break;


case "GPLX":

text="giấy phép lái xe";

break;


}



await handleText(
senderId,
text
);


}




// ======================================
// HANDLE USER TEXT
// ======================================


async function handleText(
senderId,
text
){



console.log(
"USER:",
text
);



const intent =
findIntent(text);



if(intent){


await sendMessage(
senderId,
{

text:
intent.answer

}

);



}else{


await sendMessage(
senderId,
{

text:
"❓ CA24 chưa nhận diện được câu hỏi.\n\nBạn có thể chọn menu hoặc nhập rõ hơn nội dung cần hỗ trợ."

}

);



}



}





module.exports =
router;

