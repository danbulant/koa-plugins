const arrayEqual = require("./arrayEqual");


module.exports = class Hooks {
    _plugins = [];

    registerPlugin(exec, rules = []){
        this._plugins.push({
            enabled: true,
            exec,
            rules
        })
    }

    registerPlugins(app){
        const plugins = require("./pluginLoader")(app);

        for(var plugin of plugins){
            var e = require(plugin);

            if(typeof e == "function"){
                e(this);
            } else {
                if(!e.enabled || !e.exec)continue;
                this._plugins.push(e);
            }
        }
    }

    matches(plugin, ctx){
        if(typeof plugin.rules == "function"){
            return plugin.rules(ctx);
        }
        const request = ctx.request;
        const {method, path, protocol, subdomains, accepts} = request;

        var use = true;
        for(var rule in plugin.rules){
            switch(rule){
                case "path":
                    if(path != plugin.rules[rule]){
                        if(Array.isArray(plugin.rules[rule])){
                            if(!plugin.rules[rule].includes(path))
                                use = false;
                        } else {
                            use = false;
                        }
                    }
                    break;
                case "pathReg":
                    if(!plugin.rules[rule].test){
                        console.warn("pathReg must be of type RegExp (or at least contain test method)");
                        break;
                    }
                    if(!plugin.rules[rule].test(path))
                        use = false;
                    break;

                case "method":
                    if(method != plugin.rules[rule]){
                        if(Array.isArray(plugin.rules[rule])){
                            if(!plugin.rules[rule].includes(method))
                                use = false;
                        } else {
                            use = false;
                        }
                    }
                    break;
                case "secure":
                    if((protocol == "https")!=plugin.rules[rule])
                        use = false;
                    break;
                case "accepts":
                    if(Array.isArray(plugin.rules[rule])){
                        if(!accepts(...plugins.rules[rule]))
                            use = false;
                    } else {
                        if(!accepts(plugins.rules[rule]))
                            use = false;
                    }
                case "subdomains":
                    if(!arrayEqual(subdomains, plugins.rules[rule]))
                        use = false;
                    break;
                default:
                    console.warn("Unknown rule " + rule);
            }
        }
        return use;
    }

    compare( a, b ) {
        if ( a.priority | 0 < b.priority | 0){
            return -1;
        }
        if ( a.priority | 0 > b.priority | 0){
            return 1;
        }
        return 0;
    }
    async runPlugins(ctx){
        var usable = [];
    
        for(var plugin of this._plugins){
            if(!plugin.rules){
                usable.push(plugin);
                continue;
            }
            
            if(this.matches(plugin, ctx))
                usable.push(plugin);
        }
        
        usable.sort(this.compare);

        for(var plugin of usable){
            await plugin.exec(ctx);
        }
    }
}