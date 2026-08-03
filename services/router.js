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

    const intent =
    findIntent(text);

    if(!intent){

        return sendMessage(senderId,{

            text:
            "❓ Xin lỗi, CA24 chưa nhận diện được câu hỏi."

        });

    }

    return sendMessage(senderId,{

        text:intent.answer

    });

}



// ======================================
// POSTBACK
// ======================================

async function handlePostback(senderId,payload){

    switch(payload){

        case "HOME":

            return handleHome(senderId);

        case "DV_CONG":

            return handleService(senderId);

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

    const map={

        CCCD:"căn cước",

        CU_TRU:"cư trú",

        VNEID:"vneid",

        XE:"đăng ký xe",

        GPLX:"giấy phép lái xe"

    };

    return handleText(

        senderId,

        map[payload] || payload

    );

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