is-global
=========

_Node.js project_

#### Checks whether Node.js is running a global module ####

Version: 0.1.0

There are times you need to know whether Node.js is executing a global module, typically when you're writing a third-party module and want to execute different pieces of code depending on the current context; local or global module.

On Windows the `PATH` environment variable is read to check the context. Node.js scripts running inside the npm install directory will always return true, e.g.:

```
cd C:\Users\<user>\AppData\Roaming\npm
node app.js
```

Therefore, don't run scripts inside the npm install directory. No one does that so you can assume that on Windows platform it detects the global module execution correctly.

#### Installation ####

```
npm install is-global
```

#### Functions ####

- [isGlobal() : Boolean](#isGlobal)

---

<a name="isGlobal"></a>
__isGlobal() : Boolean__  
Returns true if Node.js is executing a global module, otherwise false.