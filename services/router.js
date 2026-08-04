// ======================================
// CA24 v2.0
// Router Service
// ======================================

const menu = require("../data/menu.json");

const { sendMessage } = require("./messenger");

const { findIntent } = require("./intent");


// ======================================
// BUILD QUICK REPLIES
// ======================================

function buildQuickReplies(menuName){

    if(!menu[menuName]) return [];

    return menu[menuName].map(item=>({

        content_type:"text",

        title:item.title,

        payload:item.payload

    }));

}



// ======================================
// HOME
// ======================================

async function handleHome(senderId){

    await sendMessage(senderId,{

        text:
        "🏠 Chào mừng bạn đến với CA24 - Trợ lý AI của bạn.\n\nVui lòng chọn chức năng cần hỗ trợ.",

        quick_replies:
        buildQuickReplies("main_menu")

    });

}



// ======================================
// DỊCH VỤ CÔNG
// ======================================

async function handleService(senderId){

    await sendMessage(senderId,{

        text:
        "📄 Dịch vụ công\n\nChọn nội dung cần hỗ trợ:",

        quick_replies:
        buildQuickReplies("service_menu")

    });

}



// ======================================
// TEXT
// ======================================

async function handleText(senderId,text){

    const intent = findIntent(text);

console.log("================================");
console.log("USER:", text);

if (!intent) {

    console.log("INTENT: NOT FOUND");
    console.log("================================");

    return sendMessage(senderId, {
        text: "❓ Xin lỗi, CA24 chưa nhận diện được câu hỏi."
    });
}

console.log("INTENT:", intent.id);
console.log("NAME:", intent.intent);
console.log("GROUP:", intent.group);
console.log("================================");

return sendMessage(senderId, {
    text: intent.answer
});

}



// ======================================
// POSTBACK
// ======================================

async function handlePostback(senderId,payload){

    console.log("POSTBACK PAYLOAD:", payload);

    switch(payload){

        case "HOME":

            return handleHome(senderId);

        case "DV_CONG":

            return handleService(senderId);

         case "PCCC":

            return sendMessage(senderId,{

                text:
                "🔥 PCCC\n\nCA24 hỗ trợ kiến thức phòng cháy, chữa cháy, kỹ năng thoát nạn và xử lý khi có cháy."

            });


        case "LUA_DAO":

            return sendMessage(senderId,{

                text:
                "⚠️ Cảnh báo lừa đảo\n\nKhông cung cấp OTP, mật khẩu, mã xác thực hoặc thông tin cá nhân cho người lạ."

            });


        case "BAO_TIN_ANTT":

            return sendMessage(senderId,{

                text:
                "🚨 Báo tin ANTT\n\nKhi cần hỗ trợ khẩn cấp, vui lòng liên hệ Công an gần nhất hoặc gọi 113."

            });


        case "PHAP_LUAT":

            return sendMessage(senderId,{

                text:
                "⚖️ Pháp luật\n\nHãy nhập nội dung pháp luật bạn cần tra cứu."

            });

	case "GPLX_CAP_DOI":

    return sendMessage(senderId,{

        text:
        "🔄 Thủ tục cấp đổi GPLX\n\nCA24 hỗ trợ:\n✅ Điều kiện cấp đổi\n✅ Hồ sơ cần chuẩn bị\n✅ Nơi thực hiện\n✅ Thời gian giải quyết"

    });


case "GPLX_CAP_LAI":

    return sendMessage(senderId,{

        text:
        "♻️ Thủ tục cấp lại GPLX\n\nCA24 hỗ trợ:\n✅ Hồ sơ khi mất GPLX\n✅ Quy trình cấp lại\n✅ Thời gian giải quyết"

    });


case "GPLX_TRA_CUU":

    return sendMessage(senderId,{

        text:

`🚗 Tra cứu giấy phép lái xe (GPLX)

CA24 hướng dẫn người dân tra cứu thông tin giấy phép lái xe nhanh chóng, thuận tiện.

Bạn có thể kiểm tra:
✅ Thông tin giấy phép lái xe
✅ Hạng giấy phép lái xe
✅ Thời hạn sử dụng
✅ Tình trạng cấp đổi, cấp lại (nếu có)

📌 Để tra cứu, người dân thực hiện trên các kênh chính thức theo hướng dẫn của cơ quan có thẩm quyền.

CA24 có thể hỗ trợ:
✅ Hướng dẫn cách tra cứu GPLX
✅ Hướng dẫn thủ tục cấp đổi GPLX
✅ Hướng dẫn cấp lại GPLX khi bị mất hoặc hư hỏng

🤖 CA24 - Trợ lý AI của bạn luôn sẵn sàng hỗ trợ.`

    });
	default:

            return sendMessage(senderId,{

                text:"🚧 Chức năng đang cập nhật."

            });

    }

}



// ======================================
// QUICK REPLY
// ======================================

async function handleQuickReply(senderId,payload){

   	console.log("HANDLE QUICK:", payload);
	 console.log("QUICK PAYLOAD:", payload);


    // ===== GPLX MENU =====

    if(payload === "GPLX"){


        return sendMessage(senderId,{

            text:
            "🪪 Giấy phép lái xe\n\nCA24 hỗ trợ:",


            quick_replies:[


                {
                    content_type:"text",
                    title:"🔄 Cấp đổi GPLX",
                    payload:"GPLX_CAP_DOI"
                },


                {
                    content_type:"text",
                    title:"♻️ Cấp lại GPLX",
                    payload:"GPLX_CAP_LAI"
                },


                {
                    content_type:"text",
                    title:"🔎 Tra cứu GPLX",
                    payload:"GPLX_TRA_CUU"
                }


            ]

        });

    }



  switch (payload) {

    case "CCCD":
        return handleText(senderId, "làm căn cước");

    case "CU_TRU":
        return handleText(senderId, "đăng ký thường trú");

    case "VNEID":
        return handleText(senderId, "vneid");

    case "XE":
        return handleText(senderId, "đăng ký xe");

    default:
        return handleText(senderId, payload);
}

}

// ======================================
// EXPORT
// ======================================

module.exports={

    handlePostback,

    handleQuickReply,

    handleText,

    buildQuickReplies

};