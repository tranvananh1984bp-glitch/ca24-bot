// ======================================
// CA24 v2.0
// Reply Builder
// ======================================

const menu = require("../data/menu.json");

function buildQuickReplies(menuName) {

    if (!menu[menuName]) {
        return [];
    }

    return menu[menuName].map(item => ({
        content_type: "text",
        title: item.title,
        payload: item.payload
    }));
}

module.exports = {
    buildQuickReplies
};