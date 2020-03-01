console.log("[INFO] Starting...");

const Koa = require("koa");
const app = new Koa;
const Hooks = require("./hooks");
const hooks = new Hooks;

hooks.registerPlugins(app);

app.use(async ctx => {
    await hooks.runPlugins(ctx);
});

console.log("Plugins loaded, starting webserver");

app.listen(80, ()=>{
    console.log("Web ready");
})