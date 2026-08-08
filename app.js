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
// FACEBOOK GỬI JSON
// ======================================

app.use(express.json());

// ======================================
// CONFIG
// ======================================

const PORT = process.env.PORT || 10000;

// ======================================
// DATA DELETION PAGE
// ======================================

app.get("/data-deletion", (req, res) => {

    res.status(200).send(`
<!DOCTYPE html>
<html lang="vi">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Xóa dữ liệu người dùng - CA24</title>

</head>

<body
style="
font-family: Arial, sans-serif;
max-width: 800px;
margin: 40px auto;
padding: 20px;
line-height: 1.6;
"
>

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

<h2>Cách yêu cầu xóa dữ liệu</h2>

<ol>

<li>
Gửi email đến địa chỉ hỗ trợ CA24.
</li>

<li>
Ghi tiêu đề:
<strong>
Yêu cầu xóa dữ liệu CA24
</strong>
</li>

<li>
Nêu thông tin cần thiết để CA24 xác định
dữ liệu cần xóa.
</li>

</ol>

<p>
Sau khi tiếp nhận yêu cầu, CA24 sẽ kiểm tra
và xử lý yêu cầu xóa dữ liệu theo chính sách
quyền riêng tư của ứng dụng.
</p>

<h2>Chính sách quyền riêng tư</h2>

<p>

<a href="/privacy">
Xem Chính sách quyền riêng tư CA24
</a>

</p>

<hr>

<p>
<strong>
CA24 – Trợ lý AI của bạn
</strong>
</p>

<p>
Email hỗ trợ:
<strong>
tranvananh1984bp@gmail.com
</strong>
</p>

</body>

</html>
`);

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
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    line-height: 1.6;
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

    <h2>4. Yêu cầu xóa dữ liệu</h2>

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

    <hr>

    <p>
        <strong>CA24 – Trợ lý AI của bạn</strong>
    </p>

</body>
</html>
    `);

});

// ======================================
// DATA DELETION CALLBACK
// ======================================

// GET - kiểm tra callback

app.get("/data-deletion-callback", (req, res) => {

    console.log("DATA DELETION CALLBACK GET");

    res.status(200).json({

        status: "OK",

        service: "CA24 Data Deletion Callback"

    });

});

// ======================================
// POST - nhận yêu cầu xóa dữ liệu
// ======================================

app.post("/data-deletion-callback", (req, res) => {

    console.log("================================");

    console.log(
        "CA24 DATA DELETION REQUEST"
    );

    console.log(
        "REQUEST BODY:",
        req.body
    );

    console.log("================================");

    const confirmationCode =
        "CA24-" + Date.now();

    res.status(200).json({

        url:
            "https://ca24-bot.onrender.com/data-deletion",

        confirmation_code:
            confirmationCode

    });

});

// ======================================
// WEBHOOK MESSENGER
// ======================================

app.use(
    "/webhook",
    webhookRouter
);

// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {

    res.status(200).json({

        system:
            "CA24 AI Assistant",

        version:
            "2.0",

        status:
            "RUNNING"

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

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Chính sách quyền riêng tư - CA24</title>

</head>

<body
style="
font-family: Arial, sans-serif;
max-width: 800px;
margin: 40px auto;
padding: 20px;
line-height: 1.6;
"
>

<h1>
Chính sách quyền riêng tư – CA24
</h1>

<p>
CA24 – Trợ lý AI của bạn tôn trọng quyền riêng tư
của người sử dụng.
</p>

<h2>
1. Thông tin được xử lý
</h2>

<p>
CA24 có thể xử lý thông tin cần thiết để tiếp nhận
và trả lời yêu cầu của người dùng thông qua
Facebook Messenger.
</p>

<h2>
2. Mục đích sử dụng
</h2>

<p>
Thông tin được sử dụng nhằm cung cấp chức năng
hỏi đáp, tra cứu và hỗ trợ người dùng.
</p>

<h2>
3. Bảo vệ thông tin
</h2>

<p>
CA24 áp dụng các biện pháp phù hợp để bảo vệ
thông tin được hệ thống xử lý.
</p>

<h2>
4. Yêu cầu xóa dữ liệu
</h2>

<p>
Người dùng có thể yêu cầu xóa dữ liệu bằng cách
gửi email đến:
</p>

<p>

<strong>
tranvananh1984bp@gmail.com
</strong>

</p>

<p>

<a href="/data-deletion">
Xem hướng dẫn xóa dữ liệu
</a>

</p>

<h2>
5. Liên hệ
</h2>

<p>

Email:
<strong>
tranvananh1984bp@gmail.com
</strong>

</p>

<hr>

<p>
CA24 – Trợ lý AI của bạn
</p>

</body>

</html>
`);

});

// ======================================
// TERMS OF SERVICE
// ======================================

app.get("/terms", (req, res) => {

    res.status(200).send(`
<!DOCTYPE html>
<html lang="vi">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Điều khoản dịch vụ - CA24</title>

</head>

<body
style="
font-family: Arial, sans-serif;
max-width: 800px;
margin: 40px auto;
padding: 20px;
line-height: 1.6;
"
>

<h1>
Điều khoản dịch vụ – CA24
</h1>

<p>
CA24 – Trợ lý AI của bạn cung cấp chức năng
hỗ trợ người dùng tra cứu thông tin và hỏi đáp.
</p>

<h2>
1. Mục đích sử dụng
</h2>

<p>
CA24 được cung cấp nhằm hỗ trợ người dùng
tra cứu thông tin về thủ tục hành chính,
dịch vụ công, an ninh trật tự, phòng cháy
chữa cháy, phòng ngừa lừa đảo và thông tin
pháp luật.
</p>

<h2>
2. Tính chất thông tin
</h2>

<p>
Thông tin do CA24 cung cấp nhằm mục đích
hỗ trợ và tham khảo. Người dùng nên kiểm tra
thông tin chính thức từ cơ quan có thẩm quyền
khi thực hiện các thủ tục.
</p>

<h2>
3. Sử dụng hợp pháp
</h2>

<p>
Người dùng không được sử dụng CA24 cho mục đích
vi phạm pháp luật, lừa đảo, giả mạo hoặc gây
thiệt hại cho người khác.
</p>

<h2>
4. Liên hệ
</h2>

<p>

Email:
<strong>
tranvananh1984bp@gmail.com
</strong>

</p>

</body>

</html>
`);

});

// ======================================
// GLOBAL ERROR
// ======================================

process.on(
    "uncaughtException",
    error => {

        console.log(
            "SYSTEM ERROR:",
            error.message
        );

    }
);

process.on(
    "unhandledRejection",
    error => {

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
    () => {

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