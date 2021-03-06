"use strict";

var isGlobal = null;

module.exports = function (){
  if (isGlobal !== null) return isGlobal;
  
  isGlobal = false;

  if (process.platform === "win32"){
    var paths = process.env.Path.split (";");
    for (var i=0; i<paths.length; i++){
      if (paths[i].indexOf ("npm") !== -1 &&
          process.mainModule.filename.indexOf (paths[i]) !== -1){
        isGlobal = true;
        break;
      }
    }
  }else{
    isGlobal = process.env._ !== process.execPath;
  }
  
  return isGlobal;
};