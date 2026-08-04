// ======================================
// CA24 v2.0
// INTENT ENGINE
// ======================================


const intents =
require("../data/intents.json");
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
console.log(
"LOAD FROM INTENT.JS:",
intents.length,
intents.map(i=>i.id)
);
console.log(
"TOTAL INTENTS:",
intents.length
);


console.log(
"ALL IDS:",
intents.map(i=>i.id)
);


console.log(
"CHECK INT004:",
intents.find(i=>i.id==="INT004")
);


console.log(
"CA24 LOAD INTENTS:",
intents.length
);


console.log(
"FIRST INTENT:",
intents[0].id,
intents[0].intent
);
// ======================================
// NORMALIZE TEXT
// Chuẩn hóa câu hỏi
// ======================================


function normalize(text){


console.log(
"RAW NORMALIZE:",
text
);


return text

.toLowerCase()

.normalize(
"NFD"
)

.replace(
/[\u0300-\u036f]/g,
""
)

.replace(
/[^a-z0-9\s]/g,
" "
)

.replace(
(/\s+/g),
" "
)

.trim();


}




// ======================================
// TOKEN
// Tách từ
// ======================================


function tokenize(text){


return normalize(text)

.split(" ")

.filter(
word=>word.length>1
);


}





// ======================================
// TÍNH ĐIỂM MATCH
// ======================================


function calculateScore(
userText,
intent
){



let score = 0;



const normalizedUser =
normalize(userText);





// kiểm tra keywords

for (const keyword of intent.keywords || []) {

    const key = normalize(keyword);

    const matched = normalizedUser.includes(key);


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


        // keyword càng dài càng quan trọng
        score += key.length;


        // ===============================
        // ƯU TIÊN TỪ KHÓA CHUYÊN SÂU
        // ===============================

        if(
            key.includes("online") ||
            key.includes("qua mang") ||
            key.includes("truc tuyen") ||
            key.includes("vneid")
        ){

            score +=20;


            console.log(
                "⭐ BONUS CHUYEN SAU:",
                intent.id,
                key,
                "+20"
            );

        }


    }

}


// kiểm tra từng từ


const userWords =
tokenize(userText);



for(
const word of userWords
){


if(
intent.keywords.some(
k =>
normalize(k)
.split(" ")
.includes(word)
)

){

score +=1;

}


}



return score;


}





// ======================================
// FIND INTENT
// Hàm chính
// ======================================


function findIntent(
userText
){
console.log(
"INSIDE FIND INTENTS:",
intents.length
);

console.log(
"INSIDE IDS:",
intents.map(i=>i.id)
);


if(
!userText
)
return null;




let bestIntent = null;

let highestScore = 0;





for(
const intent of intents
){



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


if(
score > highestScore ||
(
score === highestScore &&
(intentPriority[intent.id] || 0) >
(intentPriority[bestIntent?.id] || 0)
)
){

highestScore = score;

bestIntent = intent;

}


}


console.log(
"=============================="
);

console.log(
"USER INPUT:",
userText
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


// ngưỡng nhận diện


if(
highestScore >= 4
){


return bestIntent;


}




return null;



}





// ======================================
// RELATED QUESTION
// ======================================


function getRelated(
intentId
){


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