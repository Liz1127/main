// const cds = require("@sap/cds");
// const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");
// cds.on("bootstrap", (app) => app.use(cov2ap()));
// module.exports = cds.server;


const cds = require("@sap/cds");
 const cov2ap = require("@cap-js-community/odata-v2-adapter");
  cds.on("bootstrap", async(app) =>
  {const db = await cds.connect.to("db");
  console.log("connecting to db",db)
   
  app.use(cov2ap())});
 
   module.exports = cds.server;