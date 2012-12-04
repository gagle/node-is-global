is-global
=========

_Node.js project_

#### Checks whether Node.js is running a global module ####

Version: 0.0.1

There are times you need to know whether Node.js is executing a global module, typically when you're writing a third-party module. For these cases this little module can help you.

On Linux the `_` environment variable is compared with the `process.execPath`. Simple, quick and works in all situations because it doesn't depend on the current working directory.

On Windows there are two ways:

* __Synchronous__

	The PATH environment variable is used. Node.js scripts running inside `<npm_install_dir>/node_modules` will return always true, e.g.:

	```
	npm_install_dir = C:\Users\<user>\AppData\Roaming\npm
	node <npm_install_dir>\node_modules\myscript.js
	```

	Therefore, don't run scripts inside the npm install directory or this module will returns always true. No one does that so you can assume that on Windows platform it detects the global module execution correctly. To ensure that this module don't break your code you can put a big warning on your documentation.

* __Asynchronous__

	The approach consists on reading the `process.mainModule.paths[0]` variable and search for the package.json file, starting in the current path and ending at the `/` root's path. If the first package.json file found contains a bin property then Node.js is running a global module. Works in all situations. If an I/O error is produced while reading the `package.json` file the function will silently return false.

This library provides both versions. The first is typically used when you are in a synchronous context, for example inside a constructor function. On Linux both versions use the same described approach, that is, doesn't perform any I/O call.

#### Installation ####

```
npm install is-global
```

#### Example ####

```javascript
var isGlobal = require ("is-global");
//The result is cached, you don't need to save the result in your application

//Synchronous version
console.log (isGlobal ());

//Asynchronous version
isGlobal (console.log);
```