const menu = {
  persistent_menu: [
    {
      locale: "default",
      composer_input_disabled: false,
      call_to_actions: [
        {
          type: "postback",
          title: "🏠 Trang chủ CA24",
          payload: "HOME"
        },
        {
          type: "postback",
          title: "📄 Dịch vụ công",
          payload: "DV_CONG"
        },
        {
          type: "postback",
          title: "🚨 Báo tin ANTT",
          payload: "BAO_TIN_ANTT"
        },
        {
          type: "postback",
          title: "🔥 Phòng cháy chữa cháy",
          payload: "PCCC"
        },
        {
          type: "postback",
          title: "🛡️ Phòng ngừa lừa đảo",
          payload: "LUA_DAO"
        },
        {
          type: "postback",
          title: "⚖️ Tra cứu pháp luật",
          payload: "PHAP_LUAT"
        }
      ]
    }
  ]
};

module.exports = menu;