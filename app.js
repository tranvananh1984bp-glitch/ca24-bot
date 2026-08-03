// ======================================
// CA24 v2.0 CORE
// Main Application
// ======================================


require("dotenv").config();

const express = require("express");

const webhookRouter = require("./routes/webhook");


// ======================================
// INIT APP
// ======================================

const app = express();


// Facebook gửi JSON
app.use(
    express.json()
);


// ======================================
// CONFIG
// ======================================

const PORT =
process.env.PORT || 10000;


// ======================================
// ROUTES
// ======================================


// Webhook Messenger

app.use(
    "/webhook",
    webhookRouter
);



// Health Check

app.get(
    "/",
    (req,res)=>{

        res.status(200).json({

            system:
            "CA24 AI Assistant",

            version:
            "2.0",

            status:
            "RUNNING"

        });

    }
);



// ======================================
// GLOBAL ERROR
// ======================================


process.on(
    "uncaughtException",
    error=>{

        console.log(
            "SYSTEM ERROR:",
            error.message
        );

    }
);



process.on(
    "unhandledRejection",
    error=>{

        console.log(
            "PROMISE ERROR:",
            error
        );

    }
);



// ======================================
// START SERVER
// ======================================


app.listen(
    PORT,
    ()=>{

        console.log(
            "================================"
        );

        console.log(
            "CA24 v2.0 CORE RUNNING"
        );

        console.log(
            "PORT:",
            PORT
        );

        console.log(
            "================================"
        );

    }
);