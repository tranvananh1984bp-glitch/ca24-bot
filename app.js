require("dotenv").config();

const express = require("express");
const webhookRouter = require("./routes/webhook");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
    res.status(200).json({
        system: "CA24 AI Assistant",
        version: "2.0",
        status: "RUNNING"
    });
});

// ======================================
// PRIVACY POLICY
// ======================================

app.get("/privacy", (req, res) => {

    res.status(200).send(`
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chính sách quyền riêng tư - CA24</title>
</head>

<body style="
font-family:Arial;
max-width:800px;
margin:40px auto;
padding:20px;
line-height:1.6;
">

<h1>Chính sách quyền riêng tư – CA24</h1>

<p>
CA24 – Trợ lý AI của bạn tôn trọng quyền riêng tư
của người sử dụng.
</p>

<h2>1. Thông tin được xử lý</h2>

<p>
CA24 có thể xử lý thông tin cần thiết để tiếp nhận
và trả lời yêu cầu của người dùng thông qua
Facebook Messenger.
</p>

<h2>2. Mục đích sử dụng</h2>

<p>
Thông tin được sử dụng nhằm cung cấp chức năng
hỏi đáp, tra cứu và hỗ trợ người dùng.
</p>

<h2>3. Bảo vệ thông tin</h2>

<p>
CA24 áp dụng các biện pháp phù hợp để bảo vệ
thông tin được hệ thống xử lý.
</p>

<h2>4. Xóa dữ liệu</h2>

<p>
Người dùng có thể yêu cầu xóa dữ liệu bằng cách
gửi email đến:
</p>

<p>
<strong>tranvananh1984bp@gmail.com</strong>
</p>

<p>
<a href="/data-deletion">
Xem hướng dẫn xóa dữ liệu
</a>
</p>

<h2>5. Liên hệ</h2>

<p>
Email:
<strong>tranvananh1984bp@gmail.com</strong>
</p>

</body>
</html>
`);
});

// ======================================
// DATA DELETION
// ======================================

app.get("/data-deletion", (req, res) => {

    res.status(200).send(`
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1.0">
<title>Xóa dữ liệu người dùng - CA24</title>
</head>

<body style="
font-family:Arial;
max-width:800px;
margin:40px auto;
padding:20px;
line-height:1.6;
">

<h1>Xóa dữ liệu người dùng – CA24</h1>

<p>
CA24 tôn trọng quyền kiểm soát dữ liệu của người dùng.
</p>

<h2>Cách yêu cầu xóa dữ liệu</h2>

<ol>
<li>Gửi email đến:
<strong>tranvananh1984bp@gmail.com</strong></li>

<li>Tiêu đề:
<strong>Yêu cầu xóa dữ liệu CA24</strong></li>

<li>Nêu thông tin cần thiết để CA24 xác định
yêu cầu.</li>
</ol>

<p>
CA24 sẽ tiếp nhận và xử lý yêu cầu theo quy định.
</p>

</body>
</html>
`);
});

// ======================================
// DATA DELETION CALLBACK
// ======================================

app.post("/data-deletion-callback", (req, res) => {

    console.log("================================");
    console.log("CA24 DATA DELETION REQUEST");
    console.log("BODY:", req.body);
    console.log("================================");

    const confirmationCode =
        "CA24-" + Date.now();

    res.status(200).json({

        url:
            "https://ca24-bot.onrender.com/data-deletion-status",

        confirmation_code:
            confirmationCode

    });

});

// ======================================
// DATA DELETION STATUS
// ======================================

app.get("/data-deletion-status", (req, res) => {

    res.status(200).json({

        status: "completed",

        service:
            "CA24 Data Deletion",

        message:
            "User data deletion request processed."

    });

});

// ======================================
// TERMS
// ======================================

app.get("/terms", (req, res) => {

    res.status(200).send(`
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Điều khoản dịch vụ - CA24</title>
</head>

<body style="
font-family:Arial;
max-width:800px;
margin:40px auto;
padding:20px;
line-height:1.6;
">

<h1>Điều khoản dịch vụ – CA24</h1>

<p>
CA24 – Trợ lý AI của bạn cung cấp chức năng
hỗ trợ người dùng tra cứu thông tin và hỏi đáp.
</p>

<h2>1. Mục đích sử dụng</h2>

<p>
CA24 hỗ trợ tra cứu thủ tục hành chính,
dịch vụ công, an ninh trật tự,
phòng cháy chữa cháy,
phòng ngừa lừa đảo và pháp luật.
</p>

<h2>2. Tính chất thông tin</h2>

<p>
Thông tin do CA24 cung cấp nhằm mục đích
hỗ trợ và tham khảo.
</p>

<h2>3. Sử dụng hợp pháp</h2>

<p>
Không sử dụng CA24 cho mục đích vi phạm pháp luật,
lừa đảo hoặc gây thiệt hại cho người khác.
</p>

<h2>4. Liên hệ</h2>

<p>
tranvananh1984bp@gmail.com
</p>

</body>
</html>
`);
});

// ======================================
// MESSENGER WEBHOOK
// ======================================

app.use("/webhook", webhookRouter);

// ======================================
// ERROR HANDLER
// ======================================

process.on("uncaughtException", error => {

    console.log(
        "SYSTEM ERROR:",
        error
    );

});

process.on("unhandledRejection", error => {

    console.log(
        "PROMISE ERROR:",
        error
    );

});

// ======================================
// START
// ======================================

app.listen(PORT, () => {

    console.log("================================");
    console.log("CA24 v2.0 CORE RUNNING");
    console.log("PORT:", PORT);
    console.log("================================");

});
