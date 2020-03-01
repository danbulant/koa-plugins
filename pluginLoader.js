const fs = require("fs");
const path = require("path");

module.exports = (app)=>{
    var folders = fs.readdirSync(path.join(__dirname, "plugins"));

    for(var i in folders){
        folders[i] = path.join(__dirname, "plugins", folders[i]);
    }

    var plugins = [];

    for(var folder of folders){
        var packageLoc = path.join(folder, "package.json");
        if(!fs.existsSync(packageLoc)){
            console.warn("Folder " + folder + " doesn't contain package.json");
            continue;
        }
        try {
            var package = fs.readFileSync(packageLoc, "utf8");
        } catch(e){
            console.warn("Couldn't read package.json at " + packageLoc + ":");
            console.error(e);
            continue;
        }
        try {
            package = JSON.parse(package);
        } catch(e){
            console.warn("Package.json at " + packageLoc + " is corrupted:");
            console.error(e);
            continue;
        }
        var scriptLoc = path.join(folder, package.main);
        if(!package.main){
            console.warn("Missing main entry in " + packageLoc);
            continue;
        }
        if(!fs.existsSync(scriptLoc)){
            console.warn("Main entry of " + packageLoc + " (" + scriptLoc + ") doesn't exist");
            continue;
        }
        plugins.push(scriptLoc);
    }
    return plugins;
}