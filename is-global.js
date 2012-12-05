"use strict";

var PATH = require ("path");
var FS = require ("fs");

var WIN = process.platform === "win32";
var SLASH = WIN ? "\\" : "/";

var isGlobalSync = function (){
	var g = WIN
			? (function (){
				var g = false;
				var paths = process.env.Path.split (";");
				for (var i=0, len=paths.length; i<len; i++){
					if (paths[i].indexOf ("npm") !== -1 &&
							process.mainModule.filename.indexOf (paths[i] + 
									"node_modules") !== -1){
						return true;
					}
				}
				return false;
			})()
			: process.env._ !== process.execPath;

	isGlobalSync = function (){
		return g;
	};
	
	return g;
};

var isGlobalAsync = function (cb){
	var ret = function (v){
		isGlobalAsync = function (cb){
			cb (v);
		};
		cb (v);
	};
	
	if (WIN){
		return ret (process.env._ !== process.execPath);
	}
	
	var getParent = function (path){
		var index = path.lastIndexOf (SLASH);
		if (index === -1) return null;
		if (index === 0) return path === SLASH ? null : SLASH;
		return path.substring (0, index);
	};
	
	var check = function (file){
		var buffer = "";
		var p = false;
		
		FS.createReadStream (file, { encoding: "utf8", bufferSize: 16384 })
				.on ("error", function (error){
					ret (false);
				})
				.on ("data", function (data){
					for (var i=0, len=data.length; i<len; i++){
						var c = data[i];
						if (c === "\""){
							if (!p){
								p = true;
							}else{
								p = false;
								if (buffer === "bin"){
									ret (true);
									this.destroy ();
									return;
								}else{
									buffer = "";
								}
							}
						}else if (p){
							buffer += c;
						}
					}
				})
				.on ("end", function (){
					ret (false);
				});
	};

	var search = function (path){
		//It's impossible to not find a package.json file
		//Sanity check
		if (!path) return ret (false);
		
		var file = path + SLASH + "package.json";
		FS.exists (prefix + file, function (exists){
			if (exists){
				check (file);
			}else{
				search (getParent (path));
			}
		});
	};
	
	var p = process.mainModule.paths[0];
	var index = p.indexOf (":") + 1;
	var prefix = p.substring (0, index);
	
	search (getParent (p.substring (index)));
};

module.exports = function (cb){
	if (cb){
		isGlobalAsync (cb);
	}else{
		return isGlobalSync ();
	}
};