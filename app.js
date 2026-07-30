require("dotenv").config();

const express = require("express");
const axios = require("axios");

const menu = require("./menu");
const { findIntent } = require("./services/intent");


const app = express();

app.use(express.json());


// ===============================
// CONFIG
// ===============================

const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


// Lưu trạng thái người dùng

const userSession = {};




// ===============================
// TẠO GET STARTED
// ===============================

async function createGetStarted(){

    try{


        await axios.post(

            "https://graph.facebook.com/v23.0/me/messenger_profile",

            {

                get_started:{
                    payload:"GET_STARTED"
                }

            },

            {

                params:{
                    access_token:PAGE_ACCESS_TOKEN
                }

            }

        );


        console.log(
            "CA24 GET STARTED CREATED"
        );


    }

    catch(error){

        console.log(

            "GET STARTED ERROR:",

            error.response?.data || error.message

        );

    }

}




// ===============================
// TẠO MENU
// ===============================

async function createMenu(){

    try{


        await axios.post(

            "https://graph.facebook.com/v23.0/me/messenger_profile",

            menu,

            {

                params:{
                    access_token:PAGE_ACCESS_TOKEN
                }

            }

        );


        console.log(
            "CA24 MENU CREATED"
        );


    }

    catch(error){


        console.log(

            "MENU ERROR:",

            error.response?.data || error.message

        );


    }

}






// ===============================
// KIỂM TRA SERVER
// ===============================

app.get("/",(req,res)=>{

    res.send(
        "CA24 BOT WEBHOOK RUNNING OK"
    );

});






// ===============================
// FACEBOOK VERIFY WEBHOOK
// ===============================

app.get("/webhook",(req,res)=>{


    const mode =
    req.query["hub.mode"];


    const token =
    req.query["hub.verify_token"];


    const challenge =
    req.query["hub.challenge"];



    if(

        mode==="subscribe" &&

        token===VERIFY_TOKEN

    ){


        console.log(
            "WEBHOOK VERIFIED"
        );


        res.status(200)
        .send(challenge);


    }

    else{


        res.sendStatus(403);


    }


});








// ===============================
// NHẬN SỰ KIỆN MESSENGER
// ===============================

app.post("/webhook",async(req,res)=>{


    const body=req.body;



    console.log(
        "MESSENGER EVENT:"
    );


    console.log(
        JSON.stringify(body,null,2)
    );




    if(body.object==="page"){



        for(const entry of body.entry){



            for(const event of entry.messaging){



                // =====================
                // NGƯỜI DÂN NHẮN TIN
                // =====================


                if(event.message){



                    const senderId =
                    event.sender.id;
		    // ==========================
// QUICK REPLY RELATED
// ==========================

if(event.message.quick_reply){

    const payload =
    event.message.quick_reply.payload;

    console.log(
        "QUICK REPLY:",
        payload
    );

    await handlePostback(
        senderId,
        payload
    );

    continue;

}


                    const userMessage =
                    event.message.text || "";
		 console.log("TIN NHẮN TỪ:", senderId);
    		console.log("NỘI DUNG:", userMessage);

		// ==========================
// XỬ LÝ QUICK REPLY MENU
// ==========================

if(userMessage.includes("Cư trú")){


    await handlePostback(
        senderId,
        "INT002"
    );


    continue;

}


if(userMessage.includes("Căn cước")){


    await handlePostback(
        senderId,
        "INT001"
    );


    return;

}


if(userMessage.includes("VNeID")){


    await handlePostback(
        senderId,
        "INT003"
    );


    return;

}


if(userMessage.includes("Đăng ký xe")){


    await handlePostback(
        senderId,
        "INT004"
    );


    return;

}


if(userMessage.includes("Giấy phép lái xe")){


    await handlePostback(
        senderId,
        "INT005"
    );


    return;

}



                    console.log(

                        "TIN NHAN:",

                        userMessage

                    );




                    const result =
                    findIntent(userMessage);




                    console.log(

                        "INTENT:",

                        result

                    );




                    let reply;




                    if(result){


                        userSession[senderId]=result;


                        reply=result.answer;



                    }

                    else{


                        reply =

                        "Xin lỗi, CA24 chưa nhận diện được nội dung bạn hỏi.\n\n" +

                        "Vui lòng chọn chức năng trong menu.";



                    }





                    await sendMessage(

                        senderId,

                        reply,

                        result?.video

                    );





                    if(

                        result &&

                        result.related

                    ){



                        await sendQuickReply(

                            senderId,

                            "👇 Chọn nội dung bạn muốn xem thêm:",

                            result.related

                        );


                    }



                }
 // =====================
                // XỬ LÝ POSTBACK MENU
                // =====================

                if(event.postback){


                    const senderId =
                    event.sender.id;


                    const payload =
                    event.postback.payload;



                    console.log(
                        "POSTBACK:",
                        payload
                    );




                    // =====================
                    // TRANG CHỦ
                    // =====================

                    if(
                        payload==="GET_STARTED" ||
                        payload==="HOME"
                    ){


                        await sendMessage(

                            senderId,

                            "👋 Xin chào! Đây là CA24 - Trợ lý AI của bạn.\n\n" +

                            "CA24 có thể hỗ trợ:\n\n" +

                            "1️⃣ Thủ tục hành chính\n" +
                            "2️⃣ Căn cước, cư trú\n" +
                            "3️⃣ Định danh điện tử VNeID\n" +
                            "4️⃣ Phản ánh ANTT\n" +
                            "5️⃣ Phòng cháy chữa cháy\n" +
                            "6️⃣ Cảnh báo lừa đảo trực tuyến\n" +
                            "7️⃣ Tra cứu pháp luật"

                        );


                    }



                    // =====================
                    // DỊCH VỤ CÔNG
                    // =====================

                   else if(payload==="DV_CONG"){

    console.log("========== DV_CONG ==========");
    console.log("Sender:", senderId);
    console.log("Payload:", payload);

    await sendQuickReply(

        senderId,

        "📄 Dịch vụ công\n\nChọn nội dung cần hỗ trợ:",

        [
            "🪪 Căn cước",
            "🏠 Cư trú",
            "📱 Định danh điện tử VNeID",
            "🚗 Đăng ký xe",
            "🪪 Giấy phép lái xe"
        ]

    );

    console.log("ĐÃ GỬI QUICK REPLY DV_CONG");

}





                    // =====================
                    // BÁO TIN ANTT
                    // =====================

                    else if(payload==="BAO_TIN_ANTT"){


    const result =
    findIntent("báo tin antt");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


}





                    // =====================
                    // PCCC
                    // =====================

                    else if(payload==="PCCC"){


    const result =
    findIntent("phòng cháy chữa cháy");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


}






                    // =====================
                    // LỪA ĐẢO
                    // =====================

                    else if(payload==="LUA_DAO"){


    const result =
    findIntent("lừa đảo trực tuyến");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }
}





                    // =====================
                    // PHÁP LUẬT
                    // =====================

                   else if(payload==="PHAP_LUAT"){


    const result =
    findIntent("tra cứu pháp luật");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


}





                    // =====================
                    // INT001 - INT005
                    // =====================

                    else{


                        await handlePostback(

                            senderId,

                            payload

                        );


                    }




                }



            }


        }



        res.status(200)
        .send("EVENT_RECEIVED");



    }

    else{


        res.sendStatus(404);


    }



});
// ===============================
// GỬI TIN NHẮN MESSENGER
// ===============================

async function sendMessage(senderId, messageText, videoLink=null){

    try{


        let message;



        if(videoLink){


            message={


                attachment:{


                    type:"template",


                    payload:{


                        template_type:"button",


                        text:messageText,


                        buttons:[

                            {

                                type:"web_url",

                                url:videoLink,

                                title:"🎥 Xem video hướng dẫn"

                            }

                        ]


                    }


                }


            };


        }


        else{


            message={

                text:messageText

            };


        }





        await axios.post(

            "https://graph.facebook.com/v23.0/me/messages",

            {


                recipient:{


                    id:senderId


                },


                message:message


            },


            {


                params:{


                    access_token:PAGE_ACCESS_TOKEN


                }


            }


        );



        console.log(
            "ĐÃ GỬI TIN NHẮN"
        );



    }


    catch(error){


        console.log(

            "LỖI GỬI MESSAGE:",

            error.response?.data || error.message

        );


    }


}







// ===============================
// GỬI BUTTON POSTBACK
// ===============================


async function sendButtons(senderId,text,buttons){


    try{


        await axios.post(

            "https://graph.facebook.com/v23.0/me/messages",

            {


                recipient:{


                    id:senderId


                },


                message:{


                    attachment:{


                        type:"template",


                        payload:{


                            template_type:"button",


                            text:text,


                            buttons:buttons.map(btn=>({


                                type:"postback",

                                title:btn.title,

                                payload:btn.payload


                            }))


                        }


                    }


                }


            },


            {


                params:{


                    access_token:PAGE_ACCESS_TOKEN


                }


            }


        );



        console.log(
            "ĐÃ GỬI BUTTON"
        );



    }


    catch(error){


        console.log(

            "LỖI BUTTON:",

            error.response?.data || error.message

        );


    }


}







// ===============================
// QUICK REPLY LIÊN QUAN
// ===============================


async function sendQuickReply(senderId,text,items){


    try{


       let quickReplies = [];

items.forEach((item, index) => {

    quickReplies.push({

        content_type: "text",

        title: item.substring(0,20),

        payload: "RELATED_" + index

    });

});




        await axios.post(


            "https://graph.facebook.com/v23.0/me/messages",


            {


                recipient:{


                    id:senderId


                },


                message:{


                    text:text,


                    quick_replies:quickReplies


                }


            },


            {


                params:{


                    access_token:PAGE_ACCESS_TOKEN


                }


            }


        );



        console.log(
            "ĐÃ GỬI QUICK REPLY"
        );


    }


    catch(error){


        console.log(

            "LỖI QUICK REPLY:",

            error.response?.data || error.message

        );


    }


}








// ===============================
// XỬ LÝ POSTBACK MỞ RỘNG
// ===============================


async function handlePostback(senderId,payload){


	// ===============================
// XỬ LÝ INT MENU DỊCH VỤ CÔNG
// ===============================


if(payload==="INT001"){


    const result =
    findIntent("căn cước");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


    return;


}




if(payload==="INT002"){


    const result =
    findIntent("cư trú");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


    return;


}





if(payload==="INT003"){


    const result =
    findIntent("vneid");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


    return;


}





if(payload==="INT004"){


    const result =
    findIntent("đăng ký xe");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


    return;


}





if(payload==="INT005"){


    const result =
    findIntent("giấy phép lái xe");


    if(result){


        userSession[senderId]=result;


        await sendMessage(

            senderId,

            result.answer,

            result.video

        );


    }


    return;


}
    





    // XỬ LÝ QUICK REPLY RELATED


   if(payload.startsWith("RELATED_")){

    const current =
    userSession[senderId];

    const index =
    Number(
        payload.replace("RELATED_","")
    );

    if(
        current &&
        current.related &&
        current.related[index]
    ){

        const question =
        current.related[index];

        const result =
        findIntent(question);

        if(result){

            userSession[senderId]=result;

            await sendMessage(

                senderId,

                result.answer,

                result.video

            );

            if(result.related){

                await sendQuickReply(

                    senderId,

                    "👇 Chọn nội dung bạn muốn xem thêm:",

                    result.related

                );

            }

        }

        else{

            await sendMessage(

                senderId,

                "📌 " + question

            );

        }

    }

    else{

        await sendMessage(

            senderId,

            "CA24 chưa tìm thấy nội dung mở rộng."

        );

    }

    return;

}




    await sendMessage(

        senderId,

        "CA24 đang cập nhật nội dung hỗ trợ."

    );


}








// ===============================
// KHỞI TẠO MESSENGER
// ===============================


async function setupMessenger(){


    await createGetStarted();


    await createMenu();


}


setupMessenger();







// ===============================
// START SERVER
// ===============================


app.listen(PORT,()=>{


    console.log(

        `CA24 BOT WEBHOOK RUNNING ON PORT ${PORT}`

    );


});