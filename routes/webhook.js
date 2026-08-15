const express = require("express");
const axios = require("axios");

const { findIntent } =
    require("../services/intent");

const router = express.Router();

const VERIFY_TOKEN =
    process.env.VERIFY_TOKEN;

const PAGE_ACCESS_TOKEN =
    process.env.PAGE_ACCESS_TOKEN;


// ======================================
// WEBHOOK VERIFY
// ======================================

router.get("/", (req, res) => {

    console.log("================================");
    console.log("WEBHOOK GET RECEIVED");
    console.log("QUERY:", req.query);
    console.log("================================");

    const mode =
        req.query["hub.mode"];

    const token =
        req.query["hub.verify_token"];

    const challenge =
        req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ) {

        console.log(
            "WEBHOOK VERIFY SUCCESS"
        );

        return res.status(200).send(
            challenge
        );

    }

    console.log(
        "WEBHOOK VERIFY FAILED"
    );

    return res.sendStatus(403);

});


// ======================================
// SEND MESSAGE
// ======================================

async function sendMessage(
    senderId,
    message
) {

    try {

        console.log(
            "SEND MESSAGE:",
            senderId
        );

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
                    access_token:
                        PAGE_ACCESS_TOKEN
                }

            }

        );

        console.log(
            "SEND MESSAGE SUCCESS:",
            senderId
        );

    }

    catch (error) {

        console.log(
            "SEND MESSAGE ERROR:",
            error.response?.data ||
            error.message
        );

    }

}


// ======================================
// MESSENGER POST
// ======================================

router.post("/", async (req, res) => {

    console.log("");
    console.log(
        "========== WEBHOOK POST RECEIVED =========="
    );

    console.log(
        "BODY:",
        JSON.stringify(
            req.body,
            null,
            2
        )
    );

    try {

        const body = req.body;

        if (
            body.object !== "page"
        ) {

            console.log(
                "NOT PAGE EVENT"
            );

            return res.sendStatus(404);

        }

        for (
            const entry of
            body.entry || []
        ) {

            for (
                const event of
                entry.messaging || []
            ) {

                console.log(
                    "================================"
                );

                console.log(
                    "MESSENGER EVENT:",
                    JSON.stringify(
                        event,
                        null,
                        2
                    )
                );

                console.log(
                    "================================"
                );


                // ==================================
                // SENDER
                // ==================================

                const senderId =
                    event.sender?.id;

                if (!senderId) {

                    console.log(
                        "NO SENDER ID"
                    );

                    continue;

                }


                // ==================================
                // MESSAGE
                // ==================================

                if (event.message) {

                    const message =
                        event.message;

                    let userMessage =
                        message.text || "";


                    // ==================================
                    // QUICK REPLY
                    // ==================================

                    if (
                        message.quick_reply
                    ) {

                        console.log(
                            "QUICK REPLY:",
                            message.quick_reply
                        );

                        const payload =
                            message
                                .quick_reply
                                .payload;

                        console.log(
                            "QUICK REPLY PAYLOAD:",
                            payload
                        );

                    }


                    // ==================================
                    // USER MESSAGE LOG
                    // ==================================

                    console.log(
                        "USER MESSAGE:",
                        userMessage
                    );

                    console.log(
                        "SENDER ID:",
                        senderId
                    );


                    // ==================================
                    // EMPTY MESSAGE
                    // ==================================

                    if (!userMessage) {

                        console.log(
                            "MESSAGE HAS NO TEXT"
                        );

                        continue;

                    }


                    // ==================================
                    // INTENT
                    // ==================================

                    const intent =
                        findIntent(
                            userMessage
                        );

                    console.log(
                        "FOUND INTENT:",
                        intent
                            ? intent.id
                            : "NULL"
                    );

                    console.log(
                        "ANSWER LENGTH:",
                        intent?.answer?.length
                    );


                    // ==================================
                    // RESPONSE
                    // ==================================

                    if (intent) {

                        await sendMessage(

                            senderId,

                            {
                                text:
                                    intent.answer
                            }

                        );

                    }

                    else {

                        await sendMessage(

                            senderId,

                            {

                                text:
                                    "❓ Xin lỗi, CA24 chưa nhận diện được nội dung bạn hỏi.\n\nVui lòng chọn chức năng trong menu hoặc nhập rõ hơn câu hỏi."

                            }

                        );

                    }

                }


                // ==================================
                // POSTBACK
                // ==================================

                if (event.postback) {

                    console.log(
                        "POSTBACK:",
                        event.postback
                    );

                    const payload =
                        event.postback.payload;

                    console.log(
                        "POSTBACK PAYLOAD:",
                        payload
                    );

                    await handlePostback(
                        senderId,
                        payload
                    );

                }


                // ==================================
                // READ
                // ==================================

                if (event.read) {

                    console.log(
                        "MESSENGER READ EVENT"
                    );

                }


                // ==================================
                // DELIVERY
                // ==================================

                if (event.delivery) {

                    console.log(
                        "MESSENGER DELIVERY EVENT"
                    );

                }

            }

        }

        return res.sendStatus(200);

    }

    catch (error) {

        console.log(
            "WEBHOOK ERROR:",
            error
        );

        return res.sendStatus(500);

    }

});


// ======================================
// POSTBACK HANDLER
// ======================================

async function handlePostback(
    senderId,
    payload
) {

    console.log(
        "HANDLE POSTBACK:",
        payload
    );


    const responses = {

        HOME:
            "🏠 Trang chủ CA24\n\nXin chào! Tôi là CA24 – Trợ lý AI. Bạn có thể gửi câu hỏi hoặc chọn chức năng trong menu.",

        DV_CONG:
            "📋 Dịch vụ công\n\nCA24 hỗ trợ Căn cước, cư trú, VNeID, đăng ký xe, giấy phép lái xe và các dịch vụ công khác.",

        BAO_TIN_ANTT:
            "🚨 Báo tin ANTT\n\nBạn hãy mô tả nội dung vụ việc, địa điểm và thời gian. Trường hợp khẩn cấp hãy liên hệ ngay cơ quan Công an gần nhất.",

        PCCC:
            "🔥 Phòng cháy chữa cháy\n\nCA24 hỗ trợ kiến thức PCCC, kỹ năng thoát nạn và hướng dẫn xử lý tình huống.",

        LUA_DAO:
            "🛡️ Phòng ngừa lừa đảo\n\nBạn có thể gửi nội dung tin nhắn hoặc mô tả tình huống để CA24 hỗ trợ nhận diện dấu hiệu lừa đảo.",

        PHAP_LUAT:
            "⚖️ Tra cứu pháp luật\n\nHãy nhập nội dung pháp luật bạn muốn tra cứu."

    };


    if (
        responses[payload]
    ) {

        await sendMessage(

            senderId,

            {
                text:
                    responses[payload]
            }

        );

    }

    else {

        console.log(
            "UNKNOWN POSTBACK:",
            payload
        );

    }

}


// ======================================
// EXPORT
// ======================================

module.exports =
    router;
