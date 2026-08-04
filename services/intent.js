// ======================================
// CA24 v2.0
// INTENT ENGINE
// ======================================


const intents =
require("../data/intents.json");
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

    console.log(
        "KEY CHECK:",
        intent.id,
        "| USER:",
        normalizedUser,
        "| KEY:",
        key,
        "| MATCH:",
        normalizedUser.includes(key)
    );

    if (normalizedUser.includes(key)) {
        score += 10;
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
.includes(word)
)

){

score +=2;

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
score >
highestScore
){


highestScore =
score;


bestIntent =
intent;


}



}





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