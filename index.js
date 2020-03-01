console.log("[INFO] Starting...");

const Koa = require("koa");
const app = new Koa;
const Hooks = require("./hooks");
const hooks = new Hooks;
const isElevated = require('is-elevated');

const PORT = 80;

hooks.registerPlugins(app);

app.use(async ctx => {
    await hooks.runPlugins(ctx);
});

console.log("Plugins loaded, starting webserver");

(async()=>{
    if(!await isElevated() && PORT < 1024){
        console.error("Ports lower than 1024 requires elevated shell.");
        process.exit(1);
    }
    app.listen(PORT, ()=>{
        console.log("Web ready");
    })
})();