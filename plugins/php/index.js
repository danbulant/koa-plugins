const PHPFPM = require("./phpfpm");
const path = require("path");
const fs = require("fs");
const phpfpm = new PHPFPM({
    sockFile: "/run/php/php7.3-fpm.sock",
    documentRoot: path.join(__dirname, "../../contents")
});

const useIndex = true;

module.exports = {
    enabled: true,
    exec(ctx){
        return new Promise((resolve, reject)=>{
            if(ctx.request.url.split("/")[ctx.request.url.split("/").length - 1] == "")ctx.request.url += "index.php";

            phpfpm.run({
                hostname: ctx.hostname,
                remote_addr: ctx.request.ip,
                method: ctx.request.method,
                referer : '',
                url: ctx.request.url,
                queryString : ctx.request.querystring
            }, 
            function(err, output, phpErrors){
                if (err == 99) ctx.body = "PHP Server error";
                
                ctx.body = output;
                
                if (phpErrors) console.error(phpErrors);

                resolve();
            });
        })
    },
    rules(ctx){
        var p = path.join(__dirname, "../../contents/", ctx.request.url);
        if(ctx.request.url.split("/")[ctx.request.url.split("/").length - 1] == "" && useIndex)p = path.join(p, "index.php");
        

        if(!fs.existsSync(p))return false;

        if(ctx.request.url.split("/")[ctx.request.url.split("/").length - 1] == "" && useIndex)return true;

        var ext = ctx.request.url.split('.').pop();
        return ext == "php";
    },
    priority: -2,
}