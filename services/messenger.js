// ======================================
// CA24 v2.0
// MESSENGER SERVICE
// ======================================

const axios = require("axios");

// ======================================
// CONFIG
// ======================================

const PAGE_ACCESS_TOKEN =
    process.env.PAGE_ACCESS_TOKEN;

const GRAPH_API =
    "https://graph.facebook.com/v26.0";

// ======================================
// STARTUP CHECK
// ======================================

console.log("================================");
console.log("CA24 MESSENGER SERVICE");
console.log(
    "PAGE_ACCESS_TOKEN:",
    PAGE_ACCESS_TOKEN ? "LOADED" : "MISSING"
);
console.log(
    "GRAPH API:",
    GRAPH_API
);
console.log("================================");

// ======================================
// SEND MESSAGE
// ======================================

async function sendMessage(senderId, message) {

    console.log("================================");
    console.log("CA24 SEND MESSAGE");
    console.log("SENDER ID:", senderId);
    console.log(
        "MESSAGE:",
        JSON.stringify(message)
    );
    console.log("================================");

    // ----------------------------------
    // CHECK TOKEN
    // ----------------------------------

    if (!PAGE_ACCESS_TOKEN) {

        console.error(
            "SEND MESSAGE ERROR: PAGE_ACCESS_TOKEN is missing"
        );

        return null;
    }

    // ----------------------------------
    // CHECK SENDER
    // ----------------------------------

    if (!senderId) {

        console.error(
            "SEND MESSAGE ERROR: senderId is missing"
        );

        return null;
    }

    // ----------------------------------
    // SEND MESSAGE TO FACEBOOK
    // ----------------------------------

    try {

        const response = await axios.post(

            `${GRAPH_API}/me/messages`,

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
                },

                timeout: 15000
            }

        );

        // --------------------------------
        // SUCCESS
        // --------------------------------

        console.log("================================");
        console.log("CA24 SEND SUCCESS");
        console.log(
            "SENDER ID:",
            senderId
        );
        console.log(
            "RESPONSE:",
            response.data
        );
        console.log("================================");

        return response.data;

    } catch (error) {

        // --------------------------------
        // ERROR
        // --------------------------------

        console.error("================================");
        console.error("CA24 SEND MESSAGE ERROR");

        console.error(
            "HTTP STATUS:",
            error.response?.status
        );

        console.error(
            "FACEBOOK ERROR:",
            JSON.stringify(
                error.response?.data,
                null,
                2
            )
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error("================================");

        return null;
    }
}

// ======================================
// CREATE GET STARTED
// ======================================

async function createGetStarted() {

    if (!PAGE_ACCESS_TOKEN) {

        console.error(
            "GET STARTED ERROR: PAGE_ACCESS_TOKEN missing"
        );

        return null;
    }

    try {

        const response = await axios.post(

            `${GRAPH_API}/me/messenger_profile`,

            {
                get_started: {
                    payload: "HOME"
                }
            },

            {
                params: {
                    access_token:
                        PAGE_ACCESS_TOKEN
                },

                timeout: 15000
            }

        );

        console.log("================================");
        console.log(
            "GET STARTED CREATED:",
            response.data
        );
        console.log("================================");

        return response.data;

    } catch (error) {

        console.error("================================");
        console.error("GET STARTED ERROR:");

        console.error(
            error.response?.data ||
            error.message
        );

        console.error("================================");

        return null;
    }
}

// ======================================
// CREATE PERSISTENT MENU
// ======================================

async function createMenu() {

    if (!PAGE_ACCESS_TOKEN) {

        console.error(
            "MENU ERROR: PAGE_ACCESS_TOKEN missing"
        );

        return null;
    }

    try {

        const response = await axios.post(

            `${GRAPH_API}/me/messenger_profile`,

            {
                persistent_menu: [

                    {
                        locale: "default",

                        composer_input_disabled:
                            false,

                        call_to_actions: [

                            // --------------------------
                            // HOME
                            // --------------------------

                            {
                                type: "postback",

                                title:
                                    "🏠 Trang chủ CA24",

                                payload:
                                    "HOME"
                            },

                            // --------------------------
                            // DỊCH VỤ CÔNG
                            // --------------------------

                            {
                                type: "postback",

                                title:
                                    "📄 Dịch vụ công",

                                payload:
                                    "DV_CONG"
                            },

                            // --------------------------
                            // BÁO TIN ANTT
                            // --------------------------

                            {
                                type: "postback",

                                title:
                                    "🚨 Báo tin ANTT",

                                payload:
                                    "BAO_TIN_ANTT"
                            },

                            // --------------------------
                            // PCCC
                            // --------------------------

                            {
                                type: "postback",

                                title:
                                    "🔥 PCCC",

                                payload:
                                    "PCCC"
                            },

                            // --------------------------
                            // LỪA ĐẢO
                            // --------------------------

                            {
                                type: "postback",

                                title:
                                    "⚠️ Lừa đảo",

                                payload:
                                    "LUA_DAO"
                            },

                            // --------------------------
                            // PHÁP LUẬT
                            // --------------------------

                            {
                                type: "postback",

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
                params: {
                    access_token:
                        PAGE_ACCESS_TOKEN
                },

                timeout: 15000
            }

        );

        console.log("================================");
        console.log(
            "MENU CREATED:",
            response.data
        );
        console.log("================================");

        return response.data;

    } catch (error) {

        console.error("================================");
        console.error("MENU ERROR:");

        console.error(
            error.response?.data ||
            error.message
        );

        console.error("================================");

        return null;
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
