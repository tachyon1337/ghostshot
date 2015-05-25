
var RESOLUTIONS='0';
var RES_SEP=':';
var TRUE='1';

var _=require('lodash');
var async=require('async');
var system = require('system');

//phantomjs <render_js_file> <url> <resolutions> <max-height> <format> <delay> <outputFile> <hasExtension>
var renderFile=system.args[0];
var url=system.args[1];
var resolutions_=system.args[2];
var maxHeight=parseInt(system.args[3]);
var format=system.args[4];
var delay=parseInt(system.args[5]);
var output=system.args[6];
var hasFileExtension=system.args[7];
hasFileExtension=(hasFileExtension===TRUE);

var resolutions=(resolutions_===RESOLUTIONS) ? getDefaultResolutions() : getResolutions(resolutions_);

var snapshots=captureFunctionsArray(resolutions,url,delay,maxHeight,format,output,hasFileExtension);

//run the asynchronous resolution snapshot tasks in series
async.series(snapshots,function(err,results){
    if(err){
        console.log('error: ' + err.toString());
    }else{
        console.log('completed...');
    }
    phantom.exit();
});


// functions

function takeSnapShot(url,res,delay,maxHeight,output,callback){
    var width=res.width;
    var height=res.height;
    var page = require('webpage').create();
    page.viewportSize = {
        width: width,
        height: height
    };
    if(maxHeight > 0){
        if (maxHeight < height){
            maxHeight=height;
        }
        page.clipRect = {
            top: 0,
            left: 0,
            width: width,
            height:maxHeight
        };
    }
    page.open(url, function() {
        setTimeout(function() {
            page.render(output);
            callback(null,true);
        }, delay);
    });
}

//loop the resolutions object array and push into a function array a partially invoked takeSnapShot function for each resolution
function captureFunctionsArray(r,url,delay,maxHeight,format,output,useFileName){
    var funcArray=[];
    r.forEach(function(obj){
        var o=output;
        if(!useFileName){
            o +=obj.width + 'x' + obj.height + format;
        }
        var func=_.partial(takeSnapShot,url,obj,delay,maxHeight,o);
        funcArray.push(func);
    });

    return funcArray;
}

function parsePx(v){
    var s=v.toString();
    return parseInt(s.replace('px',''),10);
}

function resolutionObject(s){
    var arr=s.split('x');
    var width=parsePx(arr[0]);
    var height=parsePx(arr[1]);
    return{
        height:height,
        width:width
    }
}

function getResolutions(r){
    var res=[];
    var arr=r.split(RES_SEP);
    var length=arr.length;
    for(var i=0;i<length;i++){
        var obj=resolutionObject(arr[i]);
        res.push(obj);
    }
    return res;
}

function getDefaultResolutions(){
    return [
        {
            height:320,
            width:480
        },
        {
            height:768,
            width:1024
        },
        {
            height:768,
            width:1366
        },
        {
            height:1080,
            width:1920
        },
        {
            height:1440,
            width:2560
        },
        {
            height:2880,
            width:5120
        }
    ];
}

