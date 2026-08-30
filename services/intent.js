// ======================================
// CA24 v2.1
// INTENT ENGINE
// ======================================

const intents = require("../data/intents.json");

// ======================================
// INTENT PRIORITY
// ======================================

const intentPriority = {

    // ==================================
    // VNeID CHUYÊN SÂU
    // ==================================

    "INT043": 100, // Kích hoạt VNeID
    "INT042": 99,  // VNeID sai thông tin
    "INT041": 98,  // VNeID làm được gì

    // ==================================
    // GPLX
    // ==================================

    "INT035": 90,  // Đổi GPLX online
    "INT034": 89,  // GPLX trên VNeID
    "INT033": 88,  // Tra cứu GPLX
    "INT032": 87,  // Cấp lại GPLX
    "INT031": 86,  // Cấp đổi GPLX
    "INT030": 85,  // Giấy phép lái xe

    // ==================================
    // CCCD / CĂN CƯỚC
    // ==================================

    "INT004": 80,  // Hết hạn
    "INT003": 79,  // Sai thông tin
    "INT002": 78,  // Mất
    "INT008": 77,  // Hỏng
    "INT011": 76,  // Đổi thẻ
    "INT001": 75,  // Cấp mới
    "INT005": 74,  // Căn cước online
    "INT006": 73,  // Tra cứu
    "INT007": 72,  // Nhận thẻ

    // ==================================
    // VNeID CHUNG
    // ==================================

    "INT009": 10

};

// ======================================
// INTENT RULES
// ======================================

const intentRules = {

    // ==================================
    // INT004
    // CCCD HẾT HẠN
    // ==================================

    "INT004": {

        requiredAny: [
            ["het han"],
            ["qua han"],
            ["den han"],
            ["sap het han"],
            ["het thoi han"]
        ],

        requiredDomain: [
            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"
        ]

    },

    // ==================================
    // INT002
    // CCCD MẤT
    // ==================================

    "INT002": {

        requiredAny: [
            ["mat"],
            ["bi mat"],
            ["that lac"],
            ["bi that lac"],
            ["khong con"],
            ["khong tim thay"]
        ],

        requiredDomain: [
            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"
        ]

    },

    // ==================================
    // INT003
    // CCCD SAI THÔNG TIN
    // ==================================

    "INT003": {

        requiredAny: [
            ["sai thong tin"],
            ["sai ten"],
            ["sai ngay sinh"],
            ["sai so"],
            ["sai dia chi"]
        ],

        requiredDomain: [
            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"
        ]

    },

    // ==================================
    // INT008
    // CCCD BỊ HỎNG
    // QUAN TRỌNG:
    // Chỉ nhận khi thực sự có dấu hiệu hỏng
    // ==================================

    "INT008": {

        requiredAny: [
            ["bi hong"],
            ["hong"],
            ["rach"],
            ["gay"],
            ["vo"],
            ["mo"],
            ["hu hong"],
            ["bi hu"]
        ],

        requiredDomain: [
            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"
        ]

    },

    // ==================================
    // INT011
    // ĐỔI THẺ CĂN CƯỚC
    // QUAN TRỌNG:
    // "Đổi thẻ căn cước" phải vào INT011
    // Không để INT008 tranh điểm
    // ==================================

    "INT011": {

        requiredAny: [
            ["doi the"],
            ["doi the can cuoc"],
            ["doi cccd"],
            ["cap doi"],
            ["lam lai the"],
            ["muon doi the"]
        ],

        requiredDomain: [
            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"
        ]

    },

    // ==================================
    // INT035
    // ĐỔI GPLX ONLINE
    // ==================================

    "INT035": {

        requiredAny: [
            ["online"],
            ["qua mang"],
            ["truc tuyen"],
            ["tai nha"]
        ],

        requiredDomain: [
            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"
        ]

    },

    // ==================================
    // INT034
    // GPLX TRÊN VNeID
    // ==================================

    "INT034": {

        requiredAny: [
            ["vneid"]
        ],

        requiredDomain: [
            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"
        ]

    },

    // ==================================
    // INT033
    // TRA CỨU GPLX
    // ==================================

    "INT033": {

        requiredAny: [
            ["tra cuu"],
            ["kiem tra"],
            ["xem thong tin"],
            ["con han khong"],
            ["thoi han"]
        ],

        requiredDomain: [
            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"
        ]

    },

    // ==================================
    // INT032
    // CẤP LẠI GPLX
    // ==================================

    "INT032": {

        requiredAny: [
            ["cap lai"],
            ["mat"],
            ["bi mat"],
            ["that lac"],
            ["bi that lac"],
            ["lam lai"],
            ["hong"],
            ["rach"],
            ["mo"]
        ],

        requiredDomain: [
            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"
        ]

    },

    // ==================================
    // INT031
    // CẤP ĐỔI GPLX
    // ==================================

    "INT031": {

        requiredAny: [
            ["cap doi"],
            ["doi bang"],
            ["doi bang lai"],
            ["doi gplx"],
            ["doi giay phep lai xe"]
        ],

        requiredDomain: [
            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"
        ]

    },

    // ==================================
    // INT042
    // VNeID SAI THÔNG TIN
    // ==================================

    "INT042": {

        requiredAny: [
            ["sai thong tin"],
            ["sai ten"],
            ["sai ngay sinh"],
            ["sai so"],
            ["sai dia chi"],
            ["thong tin bi sai"]
        ],

        requiredDomain: [
            "vneid"
        ]

    },

    // ==================================
    // INT043
    // KÍCH HOẠT VNeID
    // ==================================

    "INT043": {

        requiredAny: [
            ["kich hoat"],
            ["kich hoat vneid"],
            ["kich hoat tai khoan"],
            ["kich hoat tai khoan vneid"]
        ],

        requiredDomain: [
            "vneid"
        ]

    },

    // ==================================
    // INT041
    // VNeID LÀM ĐƯỢC GÌ
    // ==================================

    "INT041": {

        requiredAny: [
            ["lam gi"],
            ["dung de lam gi"],
            ["lam duoc gi"],
            ["co the lam gi"],
            ["co chuc nang gi"],
            ["ho tro gi"],
            ["lam duoc nhung gi"],
            ["vneid dung de lam gi"],
            ["vneid lam gi"],
            ["vneid lam duoc gi"]
        ],

        requiredDomain: [
            "vneid"
        ]

    },

    // ==================================
    // INT009
    // VNeID VÀ CĂN CƯỚC - CHUNG
    //
    // Không cho INT009 tranh với:
    // INT041 / INT042 / INT043
    // ==================================

    "INT009": {

        requiredDomain: [
            "vneid"
        ]

    }

};

// ======================================
// LOAD CHECK
// ======================================

console.log("======================================");
console.log("CA24 LOAD INTENTS:", intents.length);
console.log("ALL IDS:", intents.map(i => i.id));
console.log("======================================");

// ======================================
// NORMALIZE
// ======================================

function normalize(text) {

    if (!text) {
        return "";
    }

    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

// ======================================
// TOKENIZE
// ======================================

function tokenize(text) {

    return normalize(text)
        .split(" ")
        .filter(word => word.length > 1);

}

// ======================================
// CHECK DOMAIN
// ======================================

function hasDomain(text, domains) {

    if (!domains || !domains.length) {
        return true;
    }

    return domains.some(domain => {

        const normalizedDomain =
            normalize(domain);

        return text.includes(
            normalizedDomain
        );

    });

}

// ======================================
// CHECK REQUIRED ANY
// ======================================

function hasRequiredAny(text, groups) {

    if (!groups || !groups.length) {
        return true;
    }

    return groups.some(group => {

        return group.every(keyword => {

            return text.includes(
                normalize(keyword)
            );

        });

    });

}

// ======================================
// RULE VALIDATION
// ======================================

function validateIntentRule(
    normalizedUser,
    intent
) {

    const rule =
        intentRules[intent.id];

    if (!rule) {
        return true;
    }

    // ==================================
    // REQUIRED ANY
    // ==================================

    if (
        rule.requiredAny &&
        !hasRequiredAny(
            normalizedUser,
            rule.requiredAny
        )
    ) {
        return false;
    }

    // ==================================
    // REQUIRED DOMAIN
    // ==================================

    if (
        rule.requiredDomain &&
        !hasDomain(
            normalizedUser,
            rule.requiredDomain
        )
    ) {
        return false;
    }

    // ==================================
    // EXCLUDE
    // ==================================

    if (
        rule.excludeAny &&
        rule.excludeAny.some(keyword =>
            normalizedUser.includes(
                normalize(keyword)
            )
        )
    ) {
        return false;
    }

    return true;

}

// ======================================
// CALCULATE SCORE
// ======================================

function calculateScore(
    userText,
    intent
) {

    const normalizedUser =
        normalize(userText);

    // ==================================
    // RULE VALIDATION
    // ==================================

    if (
        !validateIntentRule(
            normalizedUser,
            intent
        )
    ) {
        return -1;
    }

    let score = 0;

    // ==================================
    // KEYWORDS
    // ==================================

    for (
        const keyword
        of intent.keywords || []
    ) {

        const key =
            normalize(keyword);

        if (!key) {
            continue;
        }

        if (
            normalizedUser.includes(key)
        ) {

            // Keyword dài → điểm cao hơn
            score += key.length;

            // ==================================
            // ONLINE / TRỰC TUYẾN
            // ==================================

            if (
                key.includes("online") ||
                key.includes("qua mang") ||
                key.includes("truc tuyen")
            ) {
                score += 20;
            }

            // ==================================
            // VNeID
            // ==================================

            if (
                key === "vneid" &&
                intent.id !== "INT009"
            ) {
                score += 5;
            }

        }

    }

    // ==================================
    // TOKEN MATCH
    // ==================================

    const userWords =
        tokenize(userText);

    for (
        const word
        of userWords
    ) {

        const matched =
            (intent.keywords || [])
                .some(keyword => {

                    return normalize(keyword)
                        .split(" ")
                        .includes(word);

                });

        if (matched) {
            score += 1;
        }

    }

    // ==================================
    // RULE BONUS
    // ==================================

    const rule =
        intentRules[intent.id];

    if (rule) {
        score += 10;
    }

    // ==================================
    // INT043
    // KÍCH HOẠT VNeID
    // ==================================

    if (
        intent.id === "INT043" &&
        normalizedUser.includes("kich hoat")
    ) {

        score += 60;

    }

    // ==================================
    // INT042
    // VNeID SAI THÔNG TIN
    // ==================================

    if (
        intent.id === "INT042"
    ) {

        if (
            normalizedUser.includes("sai thong tin") ||
            normalizedUser.includes("sai ngay sinh") ||
            normalizedUser.includes("sai ten") ||
            normalizedUser.includes("sai dia chi") ||
            normalizedUser.includes("sai so")
        ) {

            score += 60;

        }

    }

    // ==================================
    // INT041
    // VNeID LÀM ĐƯỢC GÌ
    // ==================================

    if (
        intent.id === "INT041"
    ) {

        if (
            normalizedUser.includes("lam gi") ||
            normalizedUser.includes("dung de lam gi") ||
            normalizedUser.includes("lam duoc gi") ||
            normalizedUser.includes("co chuc nang gi") ||
            normalizedUser.includes("co the lam gi") ||
            normalizedUser.includes("ho tro gi") ||
            normalizedUser.includes("lam duoc nhung gi")
        ) {

            score += 60;

        }

    }

    // ==================================
    // INT011
    // ĐỔI THẺ CĂN CƯỚC
    // ==================================

    if (
        intent.id === "INT011"
    ) {

        if (
            normalizedUser.includes("doi the") ||
            normalizedUser.includes("doi the can cuoc") ||
            normalizedUser.includes("doi cccd") ||
            normalizedUser.includes("lam lai the")
        ) {

            score += 50;

        }

    }

    // ==================================
    // INT008
    // CCCD BỊ HỎNG
    // ==================================

    if (
        intent.id === "INT008"
    ) {

        if (
            normalizedUser.includes("bi hong") ||
            normalizedUser.includes("hu hong") ||
            normalizedUser.includes("bi hu") ||
            normalizedUser.includes("rach") ||
            normalizedUser.includes("gay") ||
            normalizedUser.includes("vo")
        ) {

            score += 45;

        }

    }

    return score;

}

// ======================================
// FIND INTENT
// ======================================

function findIntent(userText) {

    if (!userText) {
        return null;
    }

    const normalizedUser =
        normalize(userText);

    console.log(
        "======================================"
    );

    console.log(
        "USER INPUT:",
        userText
    );

    console.log(
        "NORMALIZED:",
        normalizedUser
    );

    console.log(
        "======================================"
    );

    let bestIntent = null;
    let highestScore = 0;

    // ==================================
    // TEST ALL INTENTS
    // ==================================

    for (
        const intent
        of intents
    ) {

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

        const currentPriority =
            intentPriority[intent.id] || 0;

        const bestPriority =
            intentPriority[
                bestIntent?.id
            ] || 0;

        if (
            score > highestScore ||
            (
                score === highestScore &&
                currentPriority > bestPriority
            )
        ) {

            highestScore = score;
            bestIntent = intent;

        }

    }

    // ==================================
    // RESULT
    // ==================================

    console.log(
        "=============================="
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
    // MINIMUM SCORE
    // ==================================

    if (
        !bestIntent ||
        highestScore < 4
    ) {

        return null;

    }

    return bestIntent;

}

// ======================================
// RELATED QUESTION
// ======================================

function getRelated(intentId) {

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