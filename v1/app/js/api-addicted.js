"use strict";!function(){function t(t){this.apiDB=t,this.url_addic="http://www.addic7ed.com"}var e=require("fs"),r=require("querystring"),i=require("cheerio"),n=require("path"),a=require("shell"),d=require("request");t.prototype.downloadStr=function(t,r,i,a,l){var c={url:this.url_addic+t,headers:{Referer:this.url_addic}};d.get(c).pipe(e.createWriteStream(i+n.sep+r+".srt",{defaultEncoding:"ISO-8859-1"})).on("error",l).on("finish",function(){e.readFile(i+n.sep+r+".srt",function(t,e){t||e.toString().startsWith("<!DOC")?l():a()})})},t.prototype.openUrl=function(t){var e=this;a.openExternal(e.url_addic+"/search.php?"+r.stringify({search:t}))},t.prototype.search=function(t,e){var n="",a=0;d({url:this.url_addic+"/search.php?"+r.stringify({search:t})},function(t,r,d){var l=i.load(d);$.each(l("div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr"),function(t,e){$.each(e.children,function(e,r){if(r.firstChild&&r.firstChild.data&&r.firstChild.data.toLowerCase()=="French".toLowerCase()){var i=l("div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr").get(t+1).children[1].children[2].data,d=i.split("·"),c=d[1].replace("Downloads","").replace("Download","").trim();~~c>=~~a&&(n=null==l("div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr").get(t).children[8].children[2].attribs?l("div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr").get(t).children[8].children[2].next.next.next.attribs.href:l("div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr").get(t).children[8].children[2].attribs.href,a=c)}})}),(e||Function)(n)})},exports.apiAddicted=t}();