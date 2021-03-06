is-global
=========

#### Checks whether Node.js is running a global module ####

[![NPM version](https://badge.fury.io/js/is-global.png)](http://badge.fury.io/js/is-global "Fury Version Badge")

[![NPM installation](https://nodei.co/npm/is-global.png?mini=true)](https://nodei.co/npm/is-global "NodeICO Badge")

There are times that you need to know whether Node.js is executing a global module, typically when you're writing a third-party module and want to execute different pieces of code depending on the current context; local or global module.

On Windows the `PATH` environment variable is read to check the context. Node.js scripts running inside the npm install directory will always return true, eg:

```
cd C:\Users\<user>\AppData\Roaming\npm
node app.js
```

Therefore, don't run scripts from inside the npm install directory. No one does that so you can assume that on Windows platform it detects the global module execution correctly.

#### Functions ####

- [_module_() : Boolean](#isGlobal)

---

<a name="isGlobal"></a>
___module_() : Boolean__

Returns true if Node.js is executing a global module, otherwise false.

```javascript
var isGlobal = require ("is-global");
if (isGlobal ()){
  ...
}else{
  ...
}
```