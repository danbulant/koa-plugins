/**
 * Simple logging utility
 */
module.exports = {
    native: true,
    async exec(ctx, next){
        var start = process.hrtime();
        await next();
        var end = process.hrtime(start);

        end = (end[0] * 1000) + (end[1] / 10000);

        process.stdout.write("[" + ctx.request.method + "] " + ctx.status + " " + end + "ms " + ctx.request.path + "\n");
    }
}