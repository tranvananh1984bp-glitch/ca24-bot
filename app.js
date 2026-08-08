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
// ======================================
// CA24 DATA DELETION PAGE
// ======================================

app.get("/data-deletion", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xóa dữ liệu người dùng - CA24</title>
    </head>

    <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6;">

      <h1>Xóa dữ liệu người dùng – CA24</h1>

      <p>
        CA24 – Trợ lý AI của bạn tôn trọng quyền riêng tư
        và quyền kiểm soát dữ liệu của người dùng.
      </p>

      <h2>Yêu cầu xóa dữ liệu</h2>

      <p>
        Nếu bạn muốn yêu cầu xóa dữ liệu liên quan đến việc
        sử dụng CA24 thông qua Facebook hoặc Messenger,
        vui lòng gửi yêu cầu đến địa chỉ email:
      </p>

      <p>
        <strong>
          tranvananh1984bp@gmail.com
        </strong>
      </p>

      <h2>Cách yêu cầu</h2>

      <ol>
        <li>Gửi email đến địa chỉ trên.</li>
        <li>Ghi tiêu đề: <strong>Yêu cầu xóa dữ liệu CA24</strong>.</li>
        <li>Nêu thông tin cần thiết để CA24 xác định dữ liệu cần xóa.</li>
      </ol>

      <p>
        Sau khi tiếp nhận yêu cầu, CA24 sẽ kiểm tra và xử lý
        yêu cầu xóa dữ liệu theo chính sách quyền riêng tư
        của ứng dụng.
      </p>

      <h2>Chính sách quyền riêng tư</h2>

      <p>
        <a href="/privacy">
          Xem Chính sách quyền riêng tư CA24
        </a>
      </p>

      <hr>

      <p>
        <strong>CA24 – Trợ lý AI của bạn</strong>
      </p>

      <p>
        Email hỗ trợ:
        <strong>tranvananh1984bp@gmail.com</strong>
      </p>

    </body>
    </html>
  `);
});

// Facebook gửi JSON
app.use(
    express.json()
);
app.get("/data-deletion-callback", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "CA24 Data Deletion Callback"
    });
});


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
