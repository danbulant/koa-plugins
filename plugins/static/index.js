/**
 * Static pages
 */

const fs = require("fs");
const path = require("path")
const PassThrough = require('stream').PassThrough;

module.exports = {
    enabled: true,
    exec(ctx){
        var p = path.join(__dirname, "../../contents", ctx.request.url);
        if(!fs.existsSync(p)){
            ctx.body = "Not Found";
            ctx.status = 404;
            return;
        }
        ctx.set('Content-Type', 'text/html');
        ctx.body = fs.createReadStream(p).on('error', ctx.onerror).pipe(PassThrough());
    },
    rules(ctx){
        return ctx.request.url.split('.').pop() != "php";
    },
    priority: -5
}