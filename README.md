# Easy plugins

Make web development easier with plugins.

## API

Easy plugins is based on Koa, so the ctx variable that's passed is koa's context.


## Plugin

The plugin must export object or function. Object should contain these:

| Name | Descripption |
| ---- | ---- |
| enabled | Whether the plugin is enabled and should be used |
| exec | Function to call when plugin is enabled and request matches rules |
| rules | Object containing rules to be passed before calling exec. Can be function, in which case the context is passed and must return boolean (or Promise<boolean>). If empty, automatically evaluates to true.|
| Native | If native is selected, plugin is registered directly to koa. This means, that the exec gets also function `next` and ignores rules & enabled properties |

If the exported is function, it works as `multi-plugin`:

The function gets parameter `hooks` which is a class for managing plugins. Then it should call function `hooks.registerPlugin` with the following parameters:


* `exec`  Function to call when request rules matches
* `rules` *optional*, same as in object plugin

### Rules

Following rules can be used

| Rule | Type | Description |
| ---- | ---- | ----------- |
| path | String or String[] | If path matches **exactly**. |
| pathReg | Regex | Regex to be checked against (must be instance of regex) |
| method | String or String[] | Method used |
| accepts | String or String[] | Using koa's accepts method. Used as arguments (array expanded) |
| secure | bool | If using HTTPS |
| subdomains | String[] | If subdomains matches. (compares koa's subdomains) |
