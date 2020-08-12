const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.post('/n2o/locale', (req, res) => {
    res.status(200);
    res.send();
  });

  app.get("/n2o/config", (req, res) => {
    res.send({
      user: {
        username: null,
        testProperty: "testProperty"
      },
      messages: {},
      menu: {
        localeSelect: true,
        brand: "N2O",
        color: "inverse",
        fixed: false,
        collapsed: true,
        search: false,
        items: [
          {
            id: "menuItem0",
            label: "Контакты",
            href: "/proto",
            linkType: "inner",
            type: "link"
          }
        ],
        extraItems: []
      }
    });
  });

  app.use(
    proxy("/n2o", {
      target: "https://n2o.i-novus.ru/next/demo/",
      changeOrigin: true
    })
  );
};
