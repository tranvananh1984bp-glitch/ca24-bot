// ======================================
// CA24 v2.0
// MESSENGER SERVICE
// ======================================

const axios = require("axios");

// ======================================
// CONFIG
// ======================================

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
if (PAGE_ACCESS_TOKEN) {
  console.log("PAGE_ACCESS_TOKEN: LOADED");

  axios.get("https://graph.facebook.com/v26.0/me", {
    params: {
      fields: "id,name",
      access_token: PAGE_ACCESS_TOKEN
    }
  })
  .then(response => {
    console.log("================================");
    console.log("TOKEN PAGE CHECK:", response.data);
    console.log("================================");
  })
  .catch(error => {
    console.log("================================");
    console.log(
      "TOKEN PAGE CHECK ERROR:",
      error.response?.data || error.message
    );
    console.log("================================");
  });
axios.get("https://graph.facebook.com/v26.0/1231937556670247/subscribed_apps", {
  params: {
    access_token: PAGE_ACCESS_TOKEN
  }
})
.then(response => {
  console.log("================================");
  console.log("PAGE SUBSCRIBED APPS CHECK:", response.data);
  console.log("================================");
})
.catch(error => {
  console.log("================================");
  console.log(
    "PAGE SUBSCRIBED APPS ERROR:",
    error.response?.data || error.message
  );
  console.log("================================");
});

} else {
  console.log("WARNING: PAGE_ACCESS_TOKEN NOT FOUND");
}

const GRAPH_API =
    "https://graph.facebook.com/v26.0";

// ======================================
// CHECK TOKEN
// ======================================

if (!PAGE_ACCESS_TOKEN) {

    console.log("================================");
    console.log("WARNING: PAGE_ACCESS_TOKEN NOT FOUND");
    console.log("================================");

} else {

    console.log("================================");
    console.log("PAGE_ACCESS_TOKEN: LOADED");
    console.log("================================");

}

// ======================================
// SEND MESSAGE
// ======================================

async function sendMessage(senderId, message) {

    console.log("================================");
    console.log("SEND MESSAGE");
    console.log("SENDER ID:", senderId);
    console.log("MESSAGE:", JSON.stringify(message));
    console.log("================================");

    if (!PAGE_ACCESS_TOKEN) {

        console.log(
            "SEND MESSAGE ERROR: PAGE_ACCESS_TOKEN is missing"
        );

        return null;
    }

    if (!senderId) {

        console.log(
            "SEND MESSAGE ERROR: senderId is missing"
        );

        return null;
    }

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
                    access_token: PAGE_ACCESS_TOKEN
                },

                timeout: 15000
            }

        );

        console.log("================================");
        console.log("SEND SUCCESS");
        console.log("SENDER ID:", senderId);
        console.log("RESPONSE:", response.data);
        console.log("================================");

        return response.data;

    } catch (error) {

        console.log("================================");
        console.log("SEND MESSAGE ERROR");

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "DATA:",
            error.response?.data
        );

        console.log(
            "MESSAGE:",
            error.message
        );

        console.log("================================");

        return null;
    }
}

// ======================================
// CREATE GET STARTED
// ======================================

async function createGetStarted() {

    if (!PAGE_ACCESS_TOKEN) {

        console.log(
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
                    access_token: PAGE_ACCESS_TOKEN
                },

                timeout: 15000
            }

        );

        console.log(
            "GET STARTED CREATED:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.log(
            "GET STARTED ERROR:",
            error.response?.data ||
            error.message
        );

        return null;
    }
}

// ======================================
// CREATE PERSISTENT MENU
// ======================================

async function createMenu() {

    if (!PAGE_ACCESS_TOKEN) {

        console.log(
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

                        composer_input_disabled: false,

                        call_to_actions: [

                            {
                                type: "postback",
                                title: "🏠 Trang chủ CA24",
                                payload: "HOME"
                            },

                            {
                                type: "postback",
                                title: "📄 Dịch vụ công",
                                payload: "DV_CONG"
                            },

                            {
                                type: "postback",
                                title: "🚨 Báo tin ANTT",
                                payload: "BAO_TIN_ANTT"
                            },

                            {
                                type: "postback",
                                title: "🔥 PCCC",
                                payload: "PCCC"
                            },

                            {
                                type: "postback",
                                title: "⚠️ Lừa đảo",
                                payload: "LUA_DAO"
                            },

                            {
                                type: "postback",
                                title: "⚖️ Pháp luật",
                                payload: "PHAP_LUAT"
                            }

                        ]

                    }

                ]

            },

            {
                params: {
                    access_token: PAGE_ACCESS_TOKEN
                },

                timeout: 15000
            }

        );

        console.log(
            "MENU CREATED:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.log(
            "MENU ERROR:",
            error.response?.data ||
            error.message
        );

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