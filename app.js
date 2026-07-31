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

const PORT = process.env.PORT || 10000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


// ===============================
// SEND MESSAGE FACEBOOK
// ===============================

async function sendMessage(senderId, message) {

    try {

        await axios.post(
            "https://graph.facebook.com/v25.0/me/messages",

            {
                recipient: {
                    id: senderId
                },

                message: message
            },

            {
                params: {
                    access_token: PAGE_ACCESS_TOKEN
                }
            }
        );


        console.log(
            "SEND MESSAGE SUCCESS:",
            senderId
        );


    } catch(error){

        console.log(
            "SEND MESSAGE ERROR:",
            error.response?.data || error.message
        );

    }

}



// ===============================
// WEBHOOK VERIFY
// ===============================


app.get("/webhook", (req,res)=>{


    const mode = req.query["hub.mode"];

    const token = req.query["hub.verify_token"];

    const challenge = req.query["hub.challenge"];



    if(mode && token){


        if(
            mode === "subscribe" &&
            token === VERIFY_TOKEN
        ){

            console.log(
                "WEBHOOK VERIFIED"
            );


            res.status(200)
            .send(challenge);


        }else{


            res.sendStatus(403);

        }


    }else{


        res.sendStatus(400);

    }


});

// ===============================
// HANDLE MESSAGE FACEBOOK
// ===============================


app.post("/webhook", async (req, res) => {


    const body = req.body;


    if (body.object !== "page") {

        return res.sendStatus(404);

    }



    try {


        for (const entry of body.entry) {


	for (const webhookEvent of entry.messaging || []) {   
	if(
    	webhookEvent.message &&
    	webhookEvent.message.is_echo
	){
    	continue;
	}


            console.log(
                "MESSENGER EVENT:",
                JSON.stringify(webhookEvent, null, 2)
            );



            const senderId =
                webhookEvent.sender.id;



            // ==================================================
            // 1. XỬ LÝ POSTBACK MENU CHÍNH
            // ==================================================


            if (webhookEvent.postback) {


                const payload =
                    webhookEvent.postback.payload;



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
                                "🏠 Chào mừng bạn đến với CA24 - Trợ lý AI của bạn.\n\nVui lòng chọn nội dung cần hỗ trợ.",
                                quick_replies: menu
                            }
                        );


                    break;



                    case "DV_CONG":


                        await sendMessage(
                            senderId,
                            {

                                text:
                                "📄 Dịch vụ công\n\nChọn nội dung cần hỗ trợ:",


                                quick_replies:[


                                    {
                                        content_type:"text",
                                        title:"🪪 Căn cước",
                                        payload:"CCCD"
                                    },


                                    {
                                        content_type:"text",
                                        title:"🏠 Cư trú",
                                        payload:"CU_TRU"
                                    },


                                    {
                                        content_type:"text",
                                        title:"📱 Định danh điện tử",
                                        payload:"VNEID"
                                    },


                                    {
                                        content_type:"text",
                                        title:"🚗 Đăng ký xe",
                                        payload:"XE"
                                    },


                                    {
                                        content_type:"text",
                                        title:"🪪 Giấy phép lái xe",
                                        payload:"GPLX"
                                    }


                                ]

                            }
                        );


                    break;



                    case "PCCC":


                        await sendMessage(
                            senderId,
                            {
                                text:
                                "🔥 Phòng cháy chữa cháy\n\nCA24 hỗ trợ:\n- Điều kiện an toàn PCCC\n- Kỹ năng thoát nạn\n- Xử lý khi có cháy"
                            }
                        );


                    break;



                    case "LUA_DAO":


                        await sendMessage(
                            senderId,
                            {
                                text:
                                "⚠️ Cảnh báo lừa đảo trực tuyến\n\nKhông cung cấp OTP, mật khẩu hoặc thông tin cá nhân cho người lạ."
                            }
                        );


                    break;



                    case "BAO_TIN_ANTT":


                        await sendMessage(
                            senderId,
                            {
                                text:
                                "🚨 Báo tin ANTT\n\nVui lòng liên hệ Công an gần nhất hoặc gọi 113 khi cần."
                            }
                        );


                    break;



                    case "PHAP_LUAT":


                        await sendMessage(
                            senderId,
                            {
                                text:
                                "⚖️ Tra cứu pháp luật\n\nHãy nhập nội dung pháp luật bạn cần hỏi."
                            }
                        );


                    break;



                }


                continue;

            }



            // ==================================================
            // 2. XỬ LÝ QUICK REPLY DỊCH VỤ CÔNG
            // ==================================================


            if(
                webhookEvent.message &&
                webhookEvent.message.quick_reply
            ){


                const payload =
                webhookEvent.message.quick_reply.payload;



                console.log(
                    "QUICK REPLY:",
                    payload
                );



                if(payload === "CCCD"){


                    await sendMessage(
                        senderId,
                        {
                            text:
                            "🪪 Căn cước\n\nCA24 hỗ trợ:\n\n✅ Cấp mới căn cước\n✅ Cấp đổi căn cước\n✅ Cấp lại khi mất\n✅ Sửa thông tin căn cước\n✅ Tích hợp VNeID"
                        }
                    );


                }


                else if(payload === "CU_TRU"){


                    await sendMessage(
                        senderId,
                        {
                            text:
                            "🏠 Cư trú\n\nCA24 hỗ trợ:\n\n✅ Đăng ký thường trú\n✅ Đăng ký tạm trú\n✅ Tạm vắng\n✅ Xác nhận thông tin cư trú\n✅ Tách hộ\n✅ Điều chỉnh thông tin cư trú"
                        }
                    );


                }


                else if(payload === "VNEID"){


                    await sendMessage(
                        senderId,
                        {
                            text:
                            "📱 Định danh điện tử\n\nCA24 hỗ trợ:\n\n✅ Kích hoạt VNeID\n✅ Mức độ 1\n✅ Mức độ 2\n✅ Tích hợp giấy tờ"
                        }
                    );


                }


                else if(payload === "XE"){


                    await sendMessage(
                        senderId,
                        {
                            text:
                            "🚗 Đăng ký xe\n\nCA24 hỗ trợ:\n\n✅ Đăng ký xe lần đầu\n✅ Sang tên xe\n✅ Cấp đổi giấy tờ xe\n✅ Thu hồi biển số"
                        }
                    );


                }


                else if(payload === "GPLX"){


                    await sendMessage(
                        senderId,
                        {
                            text:
                            "🪪 Giấy phép lái xe\n\nCA24 hỗ trợ:\n\n✅ Cấp đổi GPLX\n✅ Tích hợp VNeID\n✅ Tra cứu GPLX"
                        }
                    );


                }


                continue;

            }
	// ==================================================
// 3. XỬ LÝ TIN NHẮN TEXT
// ==================================================

// ==================================================
// XỬ LÝ QUICK REPLY
// ==================================================

if(
    webhookEvent.message &&
    webhookEvent.message.quick_reply
){

    const payload =
        webhookEvent.message.quick_reply.payload;


    console.log(
        "QUICK REPLY:",
        payload
    );


    let userMessage = "";


    switch(payload){

        case "CCCD":
            userMessage = "căn cước";
        break;


        case "CU_TRU":
            userMessage = "cư trú";
        break;


        case "VNEID":
            userMessage = "định danh điện tử";
        break;


        case "XE":
            userMessage = "đăng ký xe";
        break;


        case "GPLX":
            userMessage = "giấy phép lái xe";
        break;

    }


    const intent =
        findIntent(userMessage);


    if(intent){

        await sendMessage(
            senderId,
            {
                text:intent.answer
            }
        );

    }


    continue;

}
if(webhookEvent.message){


    const userMessage =
        webhookEvent.message.text;



    // Messenger có thể gửi message không có text
    if(!userMessage){

        continue;

    }



    console.log(
        "USER MESSAGE:",
        userMessage
    );



    // ==================================================
    // TÌM INTENT AI
    // ==================================================


    const intent =
    findIntent(userMessage);



console.log("======================");
console.log("USER MESSAGE:", userMessage);
console.log("SENDER ID:", senderId);
console.log("FOUND INTENT:", intent ? intent.id : "NULL");

console.log(
    "ANSWER LENGTH:",
    intent?.answer?.length
);

console.log("======================");


    if(intent){


        await sendMessage(
            senderId,
            {
                text:
                intent.answer
            }
        );


    }

    else{


        await sendMessage(
            senderId,
            {
                text:
                "❓ Xin lỗi, CA24 chưa nhận diện được nội dung bạn hỏi.\n\nVui lòng chọn chức năng trong menu hoặc nhập rõ hơn câu hỏi."
            }
        );


    }


}



   } // đóng for webhookEvent


    } // đóng for entry


    res.status(200)
    .send("EVENT_RECEIVED");



    } catch(error){


        console.log(
            "WEBHOOK ERROR:",
            error.message
        );


        res.sendStatus(500);

    }


});

// ===============================
// START SERVER
// ===============================


app.listen(PORT, ()=>{


    console.log(
        `CA24 BOT WEBHOOK RUNNING ON PORT ${PORT}`
    );


});




// ===============================
// CREATE GET STARTED BUTTON
// ===============================


async function createGetStarted(){


    try{


        await axios.post(


            "https://graph.facebook.com/v25.0/me/messenger_profile",


            {

                get_started:{

                    payload:"HOME"

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
            "CA24 GET STARTED CREATED"
        );



    }catch(error){


        console.log(
            "GET STARTED ERROR:",
            error.response?.data || error.message
        );


    }


}





// ===============================
// CREATE PERSISTENT MENU
// ===============================


async function createMenu(){


    try{


        await axios.post(


            "https://graph.facebook.com/v25.0/me/messenger_profile",


            {

                persistent_menu:[

                    {

                        locale:"default",

                        composer_input_disabled:false,


                        call_to_actions:[


                            {

                                type:"postback",

                                title:"🏠 Trang chủ CA24",

                                payload:"HOME"

                            },


                            {

                                type:"postback",

                                title:"📄 Dịch vụ công",

                                payload:"DV_CONG"

                            },


                            {

                                type:"postback",

                                title:"🚨 Báo tin ANTT",

                                payload:"BAO_TIN_ANTT"

                            },


                            {

                                type:"postback",

                                title:"🔥 Phòng cháy chữa cháy",

                                payload:"PCCC"

                            },


                            {

                                type:"postback",

                                title:"⚠️ Cảnh báo lừa đảo",

                                payload:"LUA_DAO"

                            },


                            {

                                type:"postback",

                                title:"⚖️ Pháp luật",

                                payload:"PHAP_LUAT"

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
            "CA24 MENU CREATED"
        );



    }catch(error){


        console.log(
            "MENU ERROR:",
            error.response?.data || error.message
        );


    }


}



// ===============================
// RUN FACEBOOK CONFIG
// ===============================


setTimeout(()=>{


    createGetStarted();


    createMenu();



},3000);




// ===============================
// GLOBAL ERROR HANDLER
// ===============================


process.on(
    "uncaughtException",
    (error)=>{


        console.log(
            "SYSTEM ERROR:",
            error.message
        );


    }
);



process.on(
    "unhandledRejection",
    (error)=>{


        console.log(
            "PROMISE ERROR:",
            error
        );


    }
);
