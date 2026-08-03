// ======================================
// CA24 v2.0
// INTENT ENGINE
// ======================================


const intents =
require("../data/intents.json");

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


for(
const keyword of intent.keywords || []
){


const key =
normalize(keyword);



if(
normalizedUser.includes(key)
){

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
highestScore >= 5
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