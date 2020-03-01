const PHPFPM = require("./phpfpm");
const path = require("path");
const phpfpm = new PHPFPM({
    sockFile: "/run/php/php7.3-fpm.sock",
    documentRoot: path.join(__dirname, "../../contents")
});

module.exports = {
    enabled: true,
    exec(ctx){
        return new Promise((resolve, reject)=>{
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
                
                if (phpErrors) console.error(err, phpErrors);

                resolve();
            });
        })
    },
    rules(ctx){
        var ext = ctx.request.url.split('.').pop();
        console.log("Filetype: " + ext);
        return ext == "php";
    },
    priority: -2,
}