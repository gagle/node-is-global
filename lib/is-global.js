"use strict";

var path = require ("path");
var fs = require ("fs");

var WIN = process.platform === "win32";
if (!path.sep) path.sep = process.platform === "win32" ? "\\" : "/";

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
	
	var getParent = function (p){
		var index = p.lastIndexOf (path.sep);
		if (index === -1) return null;
		if (index === 0) return p === path.sep ? null : path.sep;
		return p.substring (0, index);
	};
	
	var check = function (file){
		var buffer = "";
		var p = false;
		
		fs.createReadStream (file, { encoding: "utf8", bufferSize: 16384 })
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

	var search = function (p){
		//It's impossible to not find a package.json file
		//Sanity check
		if (!p) return ret (false);
		
		var file = p + path.sep + "package.json";
		fs.exists (prefix + file, function (exists){
			if (exists){
				check (file);
			}else{
				search (getParent (p));
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