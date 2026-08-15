// ======================================
// CA24 v2.0
// MESSENGER WEBHOOK ROUTER
// ======================================

const express = require("express");

const router = express.Router();

// ======================================
// LOAD MESSENGER SERVICE
// ======================================

const {
    sendMessage
} = require("../services/messenger");

// ======================================
// LOAD ROUTER SERVICE
// ======================================

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
// CHECK CONFIG
// ======================================

console.log("================================");
console.log("CA24 WEBHOOK CONFIG");
console.log(
    "VERIFY_TOKEN:",
    VERIFY_TOKEN ? "LOADED" : "MISSING"
);
console.log("================================");

// ======================================
// GET /webhook
// FACEBOOK WEBHOOK VERIFICATION
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

    console.log("VERIFY MODE:", mode);
    console.log(
        "VERIFY TOKEN RECEIVED:",
        token ? "YES" : "NO"
    );
    console.log(
        "VERIFY CHALLENGE:",
        challenge ? "YES" : "NO"
    );

    // ==================================
    // VERIFY SUCCESS
    // ==================================

    if (
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ) {

        console.log("================================");
        console.log("CA24 WEBHOOK VERIFIED");
        console.log("================================");

        return res
            .status(200)
            .send(challenge);
    }

    // ==================================
    // VERIFY FAILED
    // ==================================

    console.log("================================");
    console.log("WEBHOOK VERIFY FAILED");
    console.log("MODE:", mode);
    console.log(
        "TOKEN MATCH:",
        token === VERIFY_TOKEN
    );
    console.log("================================");

    return res.sendStatus(403);
});

// ======================================
// POST /webhook
// RECEIVE FACEBOOK MESSENGER EVENTS
// ======================================

router.post("/", async (req, res) => {

    console.log("================================");
    console.log("MESSENGER POST RECEIVED");
    console.log("================================");

    try {

        const body = req.body;

        console.log(
            "WEBHOOK BODY:",
            JSON.stringify(body, null, 2)
        );

        // ==================================
        // CHECK OBJECT
        // ==================================

        if (!body || body.object !== "page") {

            console.log(
                "INVALID WEBHOOK OBJECT:",
                body?.object
            );

            return res.sendStatus(404);
        }

        // ==================================
        // CHECK ENTRY
        // ==================================

        if (
            !Array.isArray(body.entry)
        ) {

            console.log(
                "WEBHOOK ENTRY MISSING"
            );

            return res.sendStatus(200);
        }

        // ==================================
        // LOOP ENTRY
        // ==================================

        for (
            const entry of body.entry
        ) {

            console.log(
                "PAGE ENTRY:",
                entry.id
            );

            // ==================================
            // MESSAGING EVENTS
            // ==================================

            const messaging =
                entry.messaging || [];

            console.log(
                "MESSAGING EVENTS COUNT:",
                messaging.length
            );

            for (
                const event of messaging
            ) {

                console.log("================================");
                console.log("MESSENGER EVENT");
                console.log(
                    JSON.stringify(
                        event,
                        null,
                        2
                    )
                );
                console.log("================================");

                // ==================================
                // SENDER
                // ==================================

                const senderId =
                    event.sender?.id;

                console.log(
                    "SENDER ID:",
                    senderId
                );

                if (!senderId) {

                    console.log(
                        "EVENT WITHOUT SENDER ID"
                    );

                    continue;
                }

                // ==================================
                // IGNORE ECHO
                // ==================================

                if (
                    event.message &&
                    event.message.is_echo
                ) {

                    console.log(
                        "IGNORE BOT ECHO"
                    );

                    continue;
                }

                // ==================================
                // POSTBACK
                // ==================================

                if (event.postback) {

                    console.log(
                        "POSTBACK PAYLOAD:",
                        event.postback.payload
                    );

                    await handlePostback(
                        senderId,
                        event.postback.payload
                    );

                    continue;
                }

                // ==================================
                // QUICK REPLY
                // ==================================

                if (
                    event.message &&
                    event.message.quick_reply
                ) {

                    const payload =
                        event.message.quick_reply.payload;

                    console.log(
                        "QUICK REPLY PAYLOAD:",
                        payload
                    );

                    await handleQuickReply(
                        senderId,
                        payload
                    );

                    continue;
                }

                // ==================================
                // USER TEXT MESSAGE
                // ==================================

                if (
                    event.message &&
                    event.message.text
                ) {

                    const userMessage =
                        event.message.text;

                    console.log("================================");
                    console.log(
                        "USER MESSAGE:",
                        userMessage
                    );
                    console.log("SENDER ID:", senderId);
                    console.log("================================");

                    await handleText(
                        senderId,
                        userMessage
                    );

                    continue;
                }

                // ==================================
                // OTHER EVENT
                // ==================================

                console.log(
                    "EVENT NOT TEXT / POSTBACK / QUICK REPLY"
                );
            }
        }

        // ==================================
        // FACEBOOK REQUIRES 200
        // ==================================

        console.log("================================");
        console.log(
            "WEBHOOK EVENT PROCESSING COMPLETE"
        );
        console.log("================================");

        return res
            .status(200)
            .send("EVENT_RECEIVED");

    } catch (error) {

        console.log("================================");
        console.log("WEBHOOK ERROR");
        console.log(
            "MESSAGE:",
            error.message
        );
        console.log(
            "STACK:",
            error.stack
        );
        console.log("================================");

        return res.sendStatus(500);
    }
});

// ======================================
// EXPORT
// ======================================

module.exports = router;
