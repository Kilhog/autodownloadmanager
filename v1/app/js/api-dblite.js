"use strict";!function(){var i=require("path-extra"),r=require("dblite"),t=require("fs"),e=i.datadir("adm"),E=e+"/adm.sqlite";try{t.mkdirSync(e)}catch(n){}"win32"==process.platform?r.bin=__dirname+"/../lib/sqlite3/win32/sqlite3.exe":"darwin"==process.platform?r.bin=__dirname+"/../lib/sqlite3/darwin/sqlite3":"linux"==process.platform&&(r.bin=__dirname+"/../lib/sqlite3/linux/sqlite3");var T=function(){this.db=r(E),this.db.query("CREATE TABLE IF NOT EXISTS params (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, value TEXT)"),this.db.query("CREATE TABLE IF NOT EXISTS search_for_torrent (id INTEGER PRIMARY KEY AUTOINCREMENT, origin TEXT UNIQUE, target TEXT)"),this.db.query("CREATE TABLE IF NOT EXISTS search_for_sub (id INTEGER PRIMARY KEY AUTOINCREMENT, origin TEXT UNIQUE, target TEXT)")};T.prototype.createDb=function(i){},T.dropDb=function(i){t.unlink(E,i||Function)},T.prototype.query=function(i,r,t){var e=this;e.db.query(i,r,t||Function)},exports.apiDblite=T}();