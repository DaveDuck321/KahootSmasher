var toDecode ="";
var xKahootToken ="";

var currentKahootId = 0;
var leftToAdd = 0;
var AddedTotal =0;

var namingMethod = 0;
var basename = "Smasher";
var answerDelay = 0;

var tokensToProcess = [];

//stopping the smash
var stopSmash = false;
var addedFirstBot = false;

var SmashingStatus = {started:false, redAnswers:0,greenAnswers:0,yellowAnswers:0,blueAnswers:0, botsJoined:0, joined:0};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type == "startSmashing") {
        if($("#frames").children().length ==0)
            $("#frames").append("<iframe id='kahoot-stuff' src='https://kahoot.it'></iframe>");

        baseName = request.baseName;
        namingMethod = request.namingConvention;
        answerDelay=request.delay;
        
        toDecode="";
        xKahootToken = ""
        tokensToProcess=[]
        SmashingStatus = {started:true, redAnswers:0,greenAnswers:0,yellowAnswers:0,blueAnswers:0, botsJoined:0,joined:0};
        addedFirstBot= false;
        stopSmash=false;
        AddedTotal=request.number;
        currentKahootId= request.id
        leftToAdd = request.number;
        GetChallenge(currentKahootId);
    }
    if(request.type =="isSmashing")
        sendResponse({"smashingOn":SmashingStatus.started});
    
    if(request.type == "addMore") {
        if(leftToAdd>0)
            leftToAdd+=request.totalNumber-AddedTotal;
        else {
            leftToAdd+=request.totalNumber-AddedTotal;
            GetChallenge(currentKahootId);
        }
        AddedTotal = request.totalNumber
    }
    
    if(request.type == "stopSmashing") {
        SmashingStatus = {started:false, redAnswers:0,greenAnswers:0,yellowAnswers:0,blueAnswers:0, botsJoined:0,joined:0};
        stopSmash = true;
        addedFirstBot= false;
        toDecode ="";
        xKahootToken ="";
        currentKahootId = 0;
        AddedTotal=0;
        answerDelay=0;
        leftToAdd = 0;
        setTimeout(function(){$("#kahoot-stuff").remove()},5000);
    }
    
    if(request.type == "RequestAction") {
        SmashingStatus.redAnswers = request.redAnswers;
        SmashingStatus.greenAnswers = request.greenAnswers;
        SmashingStatus.yellowAnswers = request.yellowAnswers;
        SmashingStatus.blueAnswers = request.blueAnswers;
        
        SmashingStatus.botsJoined = request.botsJoined;
        if(stopSmash)
            sendResponse({"haltSmash":true});
        else if(tokensToProcess.length != 0) {
            SmashingStatus.joined += 1;
            if(!addedFirstBot) {
                addedFirstBot = true;
                sendResponse({"tokenToAdd":tokensToProcess.pop(),"First":true,"KahootId":currentKahootId,"NamingConvention":namingMethod, "BaseName":baseName, "answerDelay":answerDelay});
            }
            else
                sendResponse({"tokenToAdd":tokensToProcess.pop()});
        }
        else if(toDecode!="") {
            sendResponse({"toDecode":toDecode});
            toDecode = "";
        }
    }
    if(request.type == "decoded") {
        tokensToProcess.push(CompleteChallenge(xKahootToken,request.content));
        leftToAdd--;
        if(leftToAdd>0)
            GetChallenge(currentKahootId);
    }
    if(request.type =="progress")
        sendResponse(SmashingStatus);
});

function GetChallenge(id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
        if(event.currentTarget.readyState ==4) {
            if(event.currentTarget.status == 200) {
                toDecode = (xhr.responseText.slice(0,-2).split('challenge":"')[1]);
                xKahootToken = xhr.getResponseHeader("x-kahoot-session-token");
            }
            else {
                //GetChallenge(id)
                if(event.currentTarget.status==404)
                    SmashingStatus.error = "404";
                else
                    GetChallenge(id);
            }
        }
    }
    xhr.open("GET", "https://kahoot.it/reserve/session/"+id, true);
    xhr.send();
}

function CompleteChallenge(xToken, mask) {
    mask = toByteArray(mask);
    
    var base64Array = toByteArray(atob(xToken));
    for(var i=0; i<base64Array.length; i++) {
        base64Array[i] ^= mask[i%mask.length];
    }
    return toStringFromBytes(base64Array);
}

function toByteArray(start) {
    var returnArray = [];
    for(var i=0; i<start.length; i++) {
        returnArray.push(start.charCodeAt(i));
    }
    return returnArray;
}

function toStringFromBytes(start) {
    var returnStr = "";
    for(var i=0; i<start.length; i++) {
        returnStr += String.fromCharCode(start[i]);
    }
    return returnStr;
}


chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    for (var i = 0; i < details.requestHeaders.length; i++) {
        if(details.requestHeaders[i].name === 'Cookie')
            details.requestHeaders.splice(i,1);
    }
    return {requestHeaders: details.requestHeaders};
},{urls: ["*://kahoot.it/*"]},["requestHeaders","blocking"]);
