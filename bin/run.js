#!/usr/bin/env node

var VERSION='1.0.0';
var MAC_OS_10_10='phantomjs-osx-10-10';
var DELAY='2000';
var FORMAT='.png';
var HEIGHT='0';
var RESOLUTIONS='0';
var RES_SEP=':';
var RENDER_FILE='./render.js';
var argv=require('optimist').argv;
var cp = require('child_process');
var parseUrl = require('node-parse-url');
var path=require('path');


//test for version
if(argv.v!==undefined || argv.version!==undefined){
    console.log('ghostshot ' + VERSION);
    process.exit(0);
}

//test for help
if(argv.help!==undefined){
    console.log('please refer to the repo readme for help...')
    process.exit(0);
}


//get url,domain and underscored path
var urlArray=argv._;
if(!isArray(urlArray) || urlArray.length===0){
    console.log('error: url required\nghostshot --help for help');
    process.exit(0);
}
var url=getUrl(urlArray[0]);
var domainName=getDomainName(url);
if(!domainName){
    console.log('error: invalid url\nghostshot --help for help');
    process.exit(0);
}
var underscoredUrlPath=getUrlPath(url);

//input params
var programDir=__dirname;
var currentWorkingDir=process.cwd();
var resolutions=argv.r;
var height=argv.h;
var format=argv.f;
var delay=argv.d;
var output=argv.o;

//build input params string: <render_js_file> <url> <resolutions> <max-height> <format> <delay> <outputFile>
var hasExtension=hasFileExtension(output);
var renderFile=path.join(programDir,RENDER_FILE);
var input=renderFile + ' ' + url;
resolutions=(resolutions===undefined) ? RESOLUTIONS : formatResolutions(resolutions.toString());
input += ' ' + resolutions;
height=(height===undefined) ? HEIGHT : parseHeight(height);
input += ' ' + height;
var outputFormat=path.extname(output);
if(outputFormat !==''){
    format=outputFormat;
}
format=(format===undefined) ? FORMAT : getFormat(format);
input += ' ' + format;
delay=(delay===undefined) ? DELAY : parseDelay(delay);
input += ' ' + delay;
output=(output===undefined) ? getDefaultOutput(domainName,underscoredUrlPath,format,resolutions) : getOutput(output,domainName,underscoredUrlPath,format,resolutions);
input += ' ' + output;
input += ' ' + hasExtension;

//write executing notification to console
console.log(notify(resolutions));

//program exe + input params string
var program=getPlatformBinaryName() + ' ' + input;
//run the program
cp.exec(program,function(error,stdout,stderr){
    if(error){
        console.log(error);
    }
    if(stdout){
        console.log(stdout);
    }
    process.exit(0);
});


///helper functions

function notify(r){
    if (r !== RESOLUTIONS) {
        var length = resolutionsLength(r);
        return 'executing ' + length + ' snapshot(s)...'
    } else return 'executing 6 responsive snapshots...'
}

function hasFileExtension(output){
    return (path.extname(output) !== '') ? '1' : '0';
}

function isArray(obj){
    return (/Array/).test(Object.prototype.toString.call(obj));
}

function getPlatformBinaryName(){
    return MAC_OS_10_10;
}

function formatResolutions(r){
    var result='';
    var arr=r.split(RES_SEP);
    if (!(arr.length && arr.length > 0)) {
        return r.trim();
    } else {
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            result += (i === 0) ? arr[i].trim() : RES_SEP + arr[i].trim();
        }
        return result;
    }
}

function getFormat(f){
    var fChar=f.charAt(0);
    if(fChar!=='.'){
        f='.' + f.toLowerCase();
    }
    return f === '.png' || f === '.jpg' ? f : f === '.jpeg' ? '.jpg' : f === '.gif' ? f : f === '.pdf' ? f : FORMAT;
}

function parseHeight(h){
    try{
        return parseInt(h).toString();
    }catch(ex){
        return HEIGHT;
    }
}

function parseDelay(d){
    try{
        return parseInt(d).toString();
    }catch(ex){
        return DELAY;
    }
}

function getUrl(url){
    var urlObj = parseUrl(url);
    return (urlObj.protocol) ? url : 'http://' + url;
}

function getDomainName(url){
    var urlObj = parseUrl(url);
    return urlObj.domain;
}

function getUrlPath(url){
    var urlObj = parseUrl(url);
    var urlPath=urlObj.path;
    var pathNoExt=urlPath.split('.');
    return pathNoExt[0].replace(/\//g,'_');
}

function getBaseFileName(s){
    var arr=s.split('.');
    return arr[0];
}

function formatFileName(f){
    return (f.slice(-1)==='_') ? f : f + '_';
}

function createFileName(domain,p){
    var d=getBaseFileName(domain);
    return (p) ? d + p : d;
}

function resolutionsLength(r){
    var arr=r.split(RES_SEP);
    return arr.length;
}


function getDefaultOutput(domain,p,format,resolutions){
    var fileName=createFileName(domain,p);
    if(resolutionsLength(resolutions)===1 && resolutions !==RESOLUTIONS){
        fileName=createFileName(domain,p) + format;
    }
    return path.join(currentWorkingDir,fileName);
}

function getOutput(output,domain,p,format,resolutions){
    var fileName=createFileName(domain,p);
    var absolutePath=path.resolve(output);
    var filePath;
    if(resolutionsLength(resolutions)===1 && resolutions !==RESOLUTIONS)if (path.extname(absolutePath) === '') {
        fileName = createFileName(domain, p) + format;
        filePath = path.join(absolutePath, fileName);
    } else {
        filePath = absolutePath;
    }else if (path.extname(absolutePath) === '') {
        fileName=formatFileName(fileName);
        filePath = path.join(absolutePath, fileName);
    } else {
        fileName = getBaseFileName(path.basename(absolutePath));
        fileName=formatFileName(fileName);
        absolutePath = path.dirname(absolutePath);
        filePath = path.join(absolutePath, fileName);
    }

    return filePath;
}


