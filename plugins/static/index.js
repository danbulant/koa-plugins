/**
 * Static pages
 */

const fs = require("fs");
const path = require("path")
const PassThrough = require('stream').PassThrough;
const mime = require('mime-types');

const useIndex = true;

module.exports = {
    enabled: true,
    exec(ctx){
        var p = path.join(__dirname, "../../contents", ctx.request.url);
        
        if(ctx.request.url.split("/")[ctx.request.url.split("/").length - 1] == "" && useIndex){
            p = path.join(p, "index.html");

            if(!fs.existsSync(p)){
                ctx.body = "Forbidden";
                ctx.status = 403;
                return;
            }
        }
        
        if(fs.lstatSync(path_string).isDirectory()){
            ctx.body = "Forbidden";
            ctx.status = 403;
            return;
        }

        if(!fs.existsSync(p)){
            ctx.body = "Not Found";
            ctx.status = 404;
            return;
        }

        ctx.set('Content-Type', mime.contentType(path.extname(p)));
        ctx.body = fs.createReadStream(p).on('error', (e)=>{ctx.onerror(e)}).pipe(PassThrough());
    },
    rules(ctx){
        return ctx.request.url.split('.').pop() != "php";
    },
    priority: -1
}