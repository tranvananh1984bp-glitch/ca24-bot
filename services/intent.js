// ======================================
// CA24 v2.0
// INTENT ENGINE
// ======================================

const intents = require("../data/intents.json");

// ======================================
// INTENT PRIORITY
// ======================================

const intentPriority = {

    "INT035": 10, // Đổi GPLX online
    "INT034": 9,  // GPLX trên VNeID
    "INT033": 8,  // Tra cứu GPLX
    "INT032": 7,  // Cấp lại GPLX
    "INT031": 6,  // Cấp đổi GPLX
    "INT030": 5,  // Thông tin GPLX

    "INT005": 10, // CCCD online / VNeID
    "INT004": 9,  // CCCD hết hạn
    "INT003": 8,  // CCCD sai thông tin
    "INT002": 7,  // CCCD mất
    "INT001": 6,  // CCCD cấp mới

};

// ======================================
// INTENT RULES
// ======================================

/*
    Các intent chuyên sâu cần điều kiện
    để tránh keyword chung đánh nhầm.

    Ví dụ:

    "đổi cccd"
        KHÔNG được tự động = INT004

    "đổi cccd hết hạn"
        = INT004

    "cccd quá hạn"
        = INT004
*/

const intentRules = {

    // ==================================
    // CCCD HẾT HẠN
    // ==================================

    "INT004": {

        requiredAny: [

            [
                "het han"
            ],

            [
                "qua han"
            ],

            [
                "den han"
            ],

            [
                "sap het han"
            ]

        ],

        requiredDomain: [

            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"

        ]

    },

    // ==================================
    // CCCD MẤT
    // ==================================

    "INT002": {

        requiredAny: [

            [
                "mat"
            ],

            [
                "that lac"
            ],

            [
                "khong con"
            ],

            [
                "khong tim thay"
            ]

        ],

        requiredDomain: [

            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"

        ]

    },

    // ==================================
    // CCCD SAI THÔNG TIN
    // ==================================

    "INT003": {

        requiredAny: [

            [
                "sai thong tin"
            ],

            [
                "sai ten"
            ],

            [
                "sai ngay sinh"
            ],

            [
                "sai so"
            ],

            [
                "sai dia chi"
            ]

        ],

        requiredDomain: [

            "cccd",
            "can cuoc",
            "the can cuoc",
            "the cccd"

        ]

    },

    // ==================================
    // GPLX ONLINE
    // ==================================

    "INT035": {

        requiredAny: [

            [
                "online"
            ],

            [
                "qua mang"
            ],

            [
                "truc tuyen"
            ],

            [
                "tai nha"
            ]

        ],

        requiredDomain: [

            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"

        ]

    },

    // ==================================
    // GPLX VNEID
    // ==================================

    "INT034": {

        requiredAny: [

            [
                "vneid"
            ]

        ],

        requiredDomain: [

            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"

        ]

    },

    // ==================================
    // TRA CỨU GPLX
    // ==================================

    "INT033": {

        requiredAny: [

            [
                "tra cuu"
            ],

            [
                "kiem tra"
            ],

            [
                "xem thong tin"
            ],

            [
                "con han khong"
            ],

            [
                "thoi han"
            ]

        ],

        requiredDomain: [

            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"

        ]

    },

    // ==================================
    // CẤP LẠI GPLX
    // ==================================

    "INT032": {

        requiredAny: [

            [
                "cap lai"
            ],

            [
                "mat"
            ],

            [
                "that lac"
            ],

            [
                "lam lai"
            ],

            [
                "hong"
            ],

            [
                "rach"
            ],

            [
                "mo"
            ]

        ],

        requiredDomain: [

            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"

        ]

    },

    // ==================================
    // CẤP ĐỔI GPLX
    // ==================================

    "INT031": {

        requiredAny: [

            [
                "cap doi"
            ],

            [
                "doi"
            ]

        ],

        requiredDomain: [

            "gplx",
            "giay phep lai xe",
            "bang lai",
            "bang lai xe"

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

    if (!text) return "";

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

        return text.includes(
            normalize(domain)
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

    // Không có rule
    // → dùng engine keyword bình thường

    if (!rule) {

        return true;

    }

    // Kiểm tra domain

    if (
        rule.requiredDomain &&
        !hasDomain(
            normalizedUser,
            rule.requiredDomain
        )
    ) {

        return false;

    }

    // Kiểm tra điều kiện bắt buộc

    if (
        rule.requiredAny &&
        !hasRequiredAny(
            normalizedUser,
            rule.requiredAny
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
    // RULE
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

        if (!key) continue;

        if (
            normalizedUser.includes(key)
        ) {

            // keyword dài → quan trọng hơn

            score += key.length;

            // ==================================
            // CHUYÊN SÂU
            // ==================================

            if (
                key.includes("online") ||
                key.includes("qua mang") ||
                key.includes("truc tuyen") ||
                key.includes("vneid")
            ) {

                score += 20;

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

        if (
            score > highestScore ||
            (
                score === highestScore &&
                (
                    intentPriority[intent.id] || 0
                ) >
                (
                    intentPriority[
                        bestIntent?.id
                    ] || 0
                )
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