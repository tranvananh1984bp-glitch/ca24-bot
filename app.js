require("dotenv").config();

const express = require("express");
const axios = require("axios");
const menu = require("./menu");
const { findIntent } = require("./services/intent");

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
async function createGetStarted(){

    try {

        await axios.post(
            "https://graph.facebook.com/v21.0/me/messenger_profile",
            {
                get_started:{
                    payload:"GET_STARTED"
                }
            },
            {
                params:{
                    access_token: PAGE_ACCESS_TOKEN
                }
            }
        );

        console.log("CA24 GET STARTED CREATED");

    } catch(error){

        console.log(
            "GET STARTED ERROR:",
            error.response?.data || error.message
        );

    }

}
async function createMenu(){

    try {

        await axios.post(
            "https://graph.facebook.com/v21.0/me/messenger_profile",
            menu,
            {
                params:{
                    access_token: PAGE_ACCESS_TOKEN
                }
            }
        );

        console.log("CA24 MENU CREATED");

    } catch(error){

        console.log(
            "MENU ERROR:",
            error.response?.data || error.message
        );

    }

}

// Lưu trạng thái người dùng đang xem INT nào
const userSession = {};



// ===============================
// KIỂM TRA SERVER
// ===============================

app.get("/", (req,res)=>{

    res.send("CA24 BOT WEBHOOK RUNNING OK");

});



// ===============================
// FACEBOOK VERIFY WEBHOOK
// ===============================

app.get("/webhook",(req,res)=>{


    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];


    if(
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ){

        console.log("WEBHOOK VERIFIED");

        res.status(200).send(challenge);

    }

    else{

        res.sendStatus(403);

    }


});




// ===============================
// NHẬN TIN NHẮN MESSENGER
// ===============================

app.post("/webhook", async(req,res)=>{


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



                // ======================
                // NGƯỜI DÂN GỬI TIN
                // ======================


                if(event.message){


                    const senderId =
                    event.sender.id;



                    const userMessage =
                    event.message.text || "";



                    console.log(
                        "TIN NHAN:",
                        userMessage
                    );



                    const result =
                    findIntent(userMessage);



                    console.log(
                        "KET QUA INTENT:",
                        result
                    );



                    let reply;



                    if(result){


                        // lưu INT hiện tại

                        userSession[senderId]=result;



                        reply =
                        result.answer;



                    }

                    else{


                        reply =
                        "Xin lỗi, CA24 chưa nhận diện được nội dung bạn hỏi.\n\n" +
                        "Vui lòng nhập rõ hơn hoặc chọn chức năng trong menu.";

                    }




                    console.log(
                        "NOI DUNG TRA LOI:",
                        reply
                    );



                    await sendMessage(

                        senderId,

                        reply,

                        result?.video

                    );




                    // Nếu có related thì hiện nút

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
	

	// ======================
// XỬ LÝ NÚT MENU POSTBACK
// ======================

if(event.postback){


    const senderId = event.sender.id;


    const payload = event.postback.payload;


    console.log(
        "POSTBACK:",
        payload
    );



    if(payload==="GET_STARTED"){


        await sendMessage(
            senderId,
            "👋 Xin chào! Tôi là CA24 - Trợ lý AI của bạn.\n\nVui lòng chọn nội dung cần hỗ trợ."
        );


    }



    if(payload==="DV_CONG"){


        await sendMessage(
            senderId,
            "📄 Dịch vụ công\n\nVui lòng chọn nội dung:\n\n1️⃣ Căn cước\n2️⃣ Cư trú\n3️⃣ Định danh điện tử VNeID\n4️⃣ Đăng ký xe\n5️⃣ Giấy phép lái xe"
        );


    }



    if(payload==="BAO_TIN_ANTT"){


        await sendMessage(
            senderId,
            "🚨 Báo tin ANTT\n\nCA24 - Trợ lý AI của bạn hỗ trợ hướng dẫn phản ánh thông tin."
        );


    }



    if(payload==="PCCC"){


        await sendMessage(
            senderId,
            "🔥 Phòng cháy chữa cháy\n\nCA24 cung cấp hướng dẫn an toàn PCCC."
        );


    }



    if(payload==="LUA_DAO"){


        await sendMessage(
            senderId,
            "🛡️ Phòng ngừa lừa đảo\n\nCA24 cung cấp cảnh báo và cách phòng tránh."
        );


    }



    if(payload==="PHAP_LUAT"){


        await sendMessage(
            senderId,
            "⚖️ Tra cứu pháp luật\n\nBạn hãy nhập nội dung cần tra cứu."
        );


    }


}

	if(event.postback){

    const senderId = event.sender.id;
    const payload = event.postback.payload;

    console.log("POSTBACK:", payload);


    if(payload === "GET_STARTED"){

        await sendMessage(
            senderId,
            "👋 Xin chào! Tôi là CA24 - Trợ lý AI của bạn.\n\nVui lòng chọn nội dung cần hỗ trợ."
        );

    }


    if(payload === "DV_CONG"){

        await sendMessage(
            senderId,
            "📄 Dịch vụ công\n\nVui lòng chọn nội dung:\n\n1️⃣ Căn cước\n2️⃣ Cư trú\n3️⃣ Định danh điện tử VNeID\n4️⃣ Đăng ký xe\n5️⃣ Giấy phép lái xe"
        );

    }


    if(payload === "BAO_TIN_ANTT"){

        await sendMessage(
            senderId,
            "🚨 Báo tin ANTT\n\nCA24 - Trợ lý AI của bạn hỗ trợ hướng dẫn phản ánh thông tin."
        );

    }


    if(payload === "PCCC"){

        await sendMessage(
            senderId,
            "🔥 Phòng cháy chữa cháy\n\nCA24 cung cấp hướng dẫn an toàn PCCC."
        );

    }


    if(payload === "LUA_DAO"){

        await sendMessage(
            senderId,
            "🛡️ Phòng ngừa lừa đảo\n\nCA24 cung cấp cảnh báo và cách phòng tránh."
        );

    }


    if(payload === "PHAP_LUAT"){

        await sendMessage(
            senderId,
            "⚖️ Tra cứu pháp luật\n\nBạn hãy nhập nội dung cần tra cứu."
        );

    }

}

                // ======================
                // XỬ LÝ NÚT BẤM
                // ======================


                if(event.postback){


                    const senderId =
                    event.sender.id;


                    const payload =
                    event.postback.payload;



                    console.log(
                        "POSTBACK:",
                        payload
                    );



                    await handlePostback(

                        senderId,

                        payload

                    );

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



        // Nếu có video

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

            error.response?.data ||
            error.message

        );


    }


}




// ===============================
// QUICK REPLY ĐỘNG THEO INTENT
// ===============================


async function sendQuickReply(senderId,text,items){


    try{


        let quickReplies=[];



        items.forEach((item,index)=>{


            quickReplies.push({


                content_type:"text",


                title:item.substring(0,20),


                payload:"RELATED_"+index



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

            error.response?.data ||
            error.message

        );


    }


}




// ===============================
// XỬ LÝ NÚT BẤM
// ===============================


async function handlePostback(senderId,payload){


    let current =
    userSession[senderId];



    let reply="";




    // Người dân chọn nội dung liên quan

    if(payload.startsWith("RELATED_")){


        const index =
        Number(payload.replace("RELATED_",""));



        if(current && current.related[index]){


            const selected =
            current.related[index];



            reply =
            "📌 " + selected +
            "\n\n";


            if(selected.includes("Hồ sơ")){


                reply +=
                "CA24 hướng dẫn hồ sơ thực hiện thủ tục:\n\n" +
                "- Kiểm tra thông tin cá nhân.\n" +
                "- Chuẩn bị giấy tờ cần thiết.\n" +
                "- Liên hệ cơ quan có thẩm quyền để được tiếp nhận.";


            }


            else if(selected.includes("Lệ phí")){


                reply +=
                "Mức thu thực hiện theo quy định hiện hành.\n\n" +
                "Người dân liên hệ cơ quan tiếp nhận để được hướng dẫn cụ thể.";


            }


            else if(selected.includes("Video")){


                await sendMessage(

                    senderId,

                    "🎥 Video hướng dẫn CA24",

                    current.video

                );


                return;


            }


            else{


                reply +=
                "CA24 sẽ tiếp tục hỗ trợ nội dung này.";


            }



        }


        else{


            reply =
            "CA24 chưa tìm thấy nội dung mở rộng.";


        }



        await sendMessage(

            senderId,

            reply

        );



    }



}

// ===============================
// KHỞI ĐỘNG SERVER
// ===============================

async function setupMessenger(){

    await createGetStarted();

    await createMenu();

}

setupMessenger();


app.listen(PORT,()=>{
 console.log(`CA24 BOT WEBHOOK RUNNING ON PORT ${PORT}`);
});