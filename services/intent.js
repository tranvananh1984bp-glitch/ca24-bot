// ======================================
// CA24 v2.0
// INTENT ENGINE
// ======================================

const intents = require("../data/intents.json");

// ======================================
// INTENT PRIORITY
// Ưu tiên intent chuyên sâu
// ======================================

const intentPriority = {
    "INT035": 10, // Đổi GPLX online
    "INT034": 9,  // GPLX trên VNeID
    "INT033": 8,  // Tra cứu GPLX
    "INT032": 7,  // Cấp lại GPLX
    "INT031": 6,  // Cấp đổi GPLX
    "INT030": 5   // Thông tin GPLX
};

// ======================================
// LOAD INTENTS
// ======================================

console.log(
    "======================================"
);

console.log(
    "CA24 LOAD INTENTS:",
    intents.length
);

console.log(
    "ALL IDS:",
    intents.map(i => i.id)
);

console.log(
    "CHECK INT004:",
    intents.find(i => i.id === "INT004")
);

console.log(
    "FIRST INTENT:",
    intents[0]?.id,
    intents[0]?.intent
);

console.log(
    "======================================"
);

// ======================================
// NORMALIZE TEXT
// Chuẩn hóa câu hỏi tiếng Việt
// ======================================

function normalize(text) {

    console.log(
        "RAW NORMALIZE:",
        text
    );

    if (text === null || text === undefined) {
        return "";
    }

    return String(text)

        // Chuyển tất cả về chữ thường
        .toLowerCase()

        // QUAN TRỌNG:
        // Unicode NFD không tự chuyển "đ" thành "d"
        // nên phải xử lý riêng trước khi bỏ dấu
        .replace(/đ/g, "d")

        // Tách dấu tiếng Việt
        .normalize("NFD")

        // Xóa dấu
        .replace(/[\u0300-\u036f]/g, "")

        // Chỉ giữ chữ cái a-z, số và khoảng trắng
        .replace(/[^a-z0-9\s]/g, " ")

        // Gom nhiều khoảng trắng thành một
        .replace(/\s+/g, " ")

        // Xóa khoảng trắng đầu/cuối
        .trim();
}

// ======================================
// TOKEN
// Tách từ
// ======================================

function tokenize(text) {

    const normalized = normalize(text);

    if (!normalized) {
        return [];
    }

    return normalized
        .split(" ")
        .filter(word => word.length > 1);
}

// ======================================
// TÍNH ĐIỂM MATCH
// ======================================

function calculateScore(
    userText,
    intent
) {

    let score = 0;

    const normalizedUser =
        normalize(userText);

    // ==================================
    // KIỂM TRA KEYWORDS
    // ==================================

    for (const keyword of intent.keywords || []) {

        const key = normalize(keyword);

        if (!key) {
            continue;
        }

        const matched =
            normalizedUser.includes(key);

        console.log(
            "KEY CHECK:",
            intent.id,
            "| USER:",
            normalizedUser,
            "| KEY:",
            key,
            "| MATCH:",
            matched
        );

        if (matched) {

            // Keyword càng dài càng quan trọng
            score += key.length;

            // ==================================
            // BONUS TỪ KHÓA CHUYÊN SÂU
            // ==================================

            if (
                key.includes("online") ||
                key.includes("qua mang") ||
                key.includes("truc tuyen") ||
                key.includes("vneid")
            ) {

                score += 20;

                console.log(
                    "⭐ BONUS CHUYEN SAU:",
                    intent.id,
                    key,
                    "+20"
                );
            }
        }
    }

    // ==================================
    // KIỂM TRA TỪNG TOKEN
    // ==================================

    const userWords =
        tokenize(userText);

    for (const word of userWords) {

        const hasWord =
            (intent.keywords || []).some(
                keyword =>
                    normalize(keyword)
                        .split(" ")
                        .includes(word)
            );

        if (hasWord) {
            score += 1;
        }
    }

    return score;
}

// ======================================
// FIND INTENT
// Hàm chính
// ======================================

function findIntent(userText) {

    console.log(
        "======================================"
    );

    console.log(
        "INSIDE FIND INTENTS:",
        intents.length
    );

    console.log(
        "INSIDE IDS:",
        intents.map(i => i.id)
    );

    // Không có nội dung
    if (
        userText === null ||
        userText === undefined ||
        String(userText).trim() === ""
    ) {

        console.log(
            "EMPTY USER INPUT"
        );

        return null;
    }

    let bestIntent = null;

    let highestScore = 0;

    // ==================================
    // DUYỆT TOÀN BỘ INTENT
    // ==================================

    for (const intent of intents) {

        const score =
            calculateScore(
                userText,
                intent
            );

        console.log(
            "INTENT TEST:",
            intent.id,
            intent.intent,
            score
        );

        // ==================================
        // CHỌN INTENT CÓ ĐIỂM CAO NHẤT
        // ==================================

        if (
            score > highestScore ||
            (
                score === highestScore &&
                (
                    intentPriority[intent.id] || 0
                ) >
                (
                    intentPriority[bestIntent?.id] || 0
                )
            )
        ) {

            highestScore = score;

            bestIntent = intent;
        }
    }

    // ==================================
    // KẾT QUẢ
    // ==================================

    console.log(
        "=============================="
    );

    console.log(
        "USER INPUT:",
        userText
    );

    console.log(
        "NORMALIZED:",
        normalize(userText)
    );

    console.log(
        "WIN INTENT:",
        bestIntent?.id,
        bestIntent?.intent
    );

    console.log(
        "SCORE:",
        highestScore
    );

    console.log(
        "=============================="
    );

    // ==================================
    // NGƯỠNG NHẬN DIỆN
    // ==================================

    if (
        highestScore >= 4
    ) {

        return bestIntent;
    }

    console.log(
        "NO INTENT MATCH - SCORE BELOW 4"
    );

    return null;
}

// ======================================
// RELATED QUESTION
// ======================================

function getRelated(
    intentId
) {

    const intent =
        intents.find(
            item =>
                item.id === intentId
        );

    return intent?.related || [];
}

// ======================================
// EXPORT
// ======================================

module.exports = {

    findIntent,

    getRelated,

    normalize

};