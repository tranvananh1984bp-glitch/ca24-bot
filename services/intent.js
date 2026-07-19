const intents = require("../data/intents.json");


// ===============================
// CHUẨN HÓA TEXT
// ===============================

function normalize(text) {

    if (!text) return "";

    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[.,!?]/g, "")
        .trim();

}



// ===============================
// TÌM INTENT
// ===============================

function findIntent(userText) {


    const message = normalize(userText);


    console.log(
        "TEXT SAU CHUAN HOA:",
        message
    );


    let bestIntent = null;

    let maxScore = 0;



    for (const intent of intents) {


        let score = 0;



        for (const keyword of intent.keywords) {


            const key = normalize(keyword);



            if (
                message.includes(key)
            ) {


                console.log(
                    "MATCH:",
                    intent.intent,
                    "<-",
                    key
                );


                score += key.length;


            }


        }



        if(score > maxScore){


            maxScore = score;

            bestIntent = intent;


        }


    }



    console.log(
        "INTENT TIM THAY:",
        bestIntent?.intent || "NULL"
    );


    return bestIntent;


}



module.exports = {

    findIntent

};