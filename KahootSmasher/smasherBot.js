var runningId = 0;
var currentBotArray = [];
var currentKahootId = 0;
//Need to set
var nameIdConvention = 0;
var nameBase = "";

var shouldGuess = -1;
var answerDelay = 0;

var currentBotAnswers = [];
var botsJoined = 0;

$( "body" ).append("<span id='smashingInfo' botsJoined = 0 redAnswers = 0 greenAnswers = 0 blueAnswers = 0 yellowAnswers = 0></span>")
var smashingInfoObject = $('#smashingInfo');

//Name generator
var namesExample = ["Ben Dover","Eileen Dover","Not in ur class","Stephanie","Sportacus","Robbie Rotten","Ziggy","L0kesh;)","RealPerson.mp4","ur search history","Cael Cooper:)","Kim-Jong Uno","Sernie Banders","lorcant","Not A Bot","setup.exe","admin1","Mack attack","mr moo moo man","boris","abdothepedo","pacothetaco","orman","herobine","chuck joris","nerd3","watergaminghd","marijona","DeathtoKahoot","whoami", "game_over", "mrteacherman", "crispylips", "dragon-rider", "nsa", "cerialkiller", "pixiedust", "ramenlover", "unclejerry", "dwight", "ICAPERATS", "supremecoat", "mostwanted", "moneymoves", "bet", "foxfire", "mathz", "sponsored", "orangeuglad", "knockknock", "clevername", "minion", "losername", "Basic", "Pump", "Head", "Shoulders", "Knees", "andtoes", "TOES", "sponsored", "serverfarm", "Frisbee", "Guacamole", "icarly", "madlad", "xD", "Hmmmmm", "rpi", "over9000", "dogblog", "winupdate", "linux", "blackhole", "garlicoin", "btc", "eth", "ltc", "blockchain", "hawaiifios", "Toy Yoda"];
function randomCaps(baseName) {
    var newName = "";
    for (var i = 0; i < baseName.length; i++) {
        if (Math.random() > 0.5) {
            newName += baseName[i].toUpperCase();
        } else {
            newName += baseName[i].toLowerCase();
        }
    }
    return newName;
}
function generateRandomLetter(length) {
    var randomLetters = "";
    var letters = "qwertyuiopasdfghjklzxcvbnm1234567890";
    for (var i = 0; i < length; i++) {
        randomLetters += letters[Math.floor(Math.random() * letters.length)];
    }
    return randomLetters;
}
function generateName(mode, base, currentNameId) {
    var name = "";
    switch (mode) {
        case 0:
            name = randomCaps(namesExample[Math.floor(Math.random() * namesExample.length)]);
            break;
        case 1:
            name = (base.substr(0, 11) + currentNameId).substr(0, 16);
            break;
        case 2:
            if (base.length < 7)
                name = randomCaps(base) + currentNameId;
            else
                name = randomCaps(base);
            break;
        default:
            name = "Smasher" + generateRandomLetter(5);
    }
    return name;
}

//End name generator
//Allow custom answers

function SetAnswerMode(ShouldGuess) {
    shouldGuess = ShouldGuess;
}

function UserSelectedAnswer(choosenResult) {
    for(var i=0; i<currentBotArray.length; i++) {
        if(currentBotArray[i].waitingForAnswer)
            currentBotArray[i].AnswerQuestion(choosenResult);
    }
}
//Answer refresh timeout (for speed)
var refreshAnswerSpan;

function GetChoice(maxChoice, id) {
    if(shouldGuess) {
        currentBotAnswers[id]=Math.floor(Math.random()*maxChoice);
        refreshAnswerSpan = setTimeout(RefreshAnswersSpan,10);
        return currentBotAnswers[id];
    }
    return -1;
}

function RemoveChoice(id) {
    currentBotAnswers[id] = -1;
    refreshAnswerSpan = setTimeout(RefreshAnswersSpan,10);
}

function AddBotToJoined() {
    botsJoined++;
    smashingInfoObject.attr('botsJoined',botsJoined);
}

function RefreshAnswersSpan() {
    var redAnswers = 0;
    var greenAnswers = 0;
    var blueAnswers = 0;
    var yellowAnswers = 0;
    for(var i=0; i<currentBotAnswers.length; i++) {
        switch(currentBotAnswers[i]) {
            case 0:
                redAnswers++;
                break;
            case 1:
                blueAnswers++;
                break;
            case 2:
                yellowAnswers++;
                break;
            case 3:
                greenAnswers++;
                break;
            default:
                console.log("This should never happen, maybe a bug?");
        }
    }
    smashingInfoObject.attr('redAnswers',redAnswers);
    smashingInfoObject.attr('greenAnswers',greenAnswers);
    smashingInfoObject.attr('yellowAnswers',yellowAnswers);
    smashingInfoObject.attr('blueAnswers',blueAnswers);
}

//End custom answers

function InitiateSmashAndAddBot(token,kahootId, nameConvention, baseName, delay) {
    currentKahootId = kahootId;
    runningId= 0;
    currentBotArray = [];
    nameIdConvention = nameConvention;
    nameBase = baseName;
    answerDelay = delay;
    AddBot(token);
}

function AddBot(token) {
    currentBotAnswers.push(-1);
    currentBotArray.push(new BotObject(token,runningId))
    runningId++;
}

function GenerateName(id) {
    return generateName(nameIdConvention,nameBase,id);
}

function StopSmash() {
    for(var i=0; i<currentBotArray.length; i++) {
        currentBotArray[i].SendDisconnectMessage();
    }
    currentBotArray = [];
    currentKahootId = 0;
    runningId = 0;
    
    nameIdConvention = 0;
    nameBase = "";

    shouldGuess = -1;
    answerDelay=0;

    currentBotAnswers = [];
    botsJoined = 0;
    
    smashingInfoObject.attr('botsJoined',0);
    smashingInfoObject.attr('redAnswers',0);
    smashingInfoObject.attr('greenAnswers',0);
    smashingInfoObject.attr('blueAnswers',0);
    smashingInfoObject.attr('yellowAnswers',0);
}

function BotObject(token,runningId) {
    var _self = this;
    
    this.token = token;
    this.uniqueId = runningId;
    
    this.recivedQuestion = false;
    
    this.subscriptionRepliesRecived = 0;
    this.initalSubscription = true;
    
    this.currentMessageId=0;
    this.clientId = "";
    this.openWebSocket = new WebSocket("wss://kahoot.it/cometd/" + currentKahootId + "/" + token);
    
    this.waitingForAnswer=false;
    
    this.openWebSocket.onopen = function(event) {
        this.send("[{\"version\":\"1.0\",\"minimumVersion\":\"1.0\",\"channel\":\"/meta/handshake\",\"supportedConnectionTypes\":[\"websocket\",\"long-polling\"],\"advice\":{\"timeout\":60000,\"interval\":0},\"id\":\"1\"}]");
    };
    
    this.openWebSocket.onmessage = function(event) {
        var recivedData = JSON.parse(event.data.substring(1,event.data.length-1));
        switch(recivedData.channel) {
            case "/meta/handshake":
                _self.Handshake(recivedData);
                break;
            case "/meta/subscribe":
                _self.Subscribe(recivedData);
                break;
            case "/meta/connect":
                _self.Connect(recivedData);
                break;
            case "/meta/unsubscribe":
                _self.Unsubscribe(recivedData);
                break;
            case "/service/player":
                _self.Player(recivedData);
                break;
            case "/service/controller":
                _self.Controller(recivedData);
                break;
            default:
                //console.log("Bad channel: "+ recivedData.channel);
        }
    };
    
    this.AnswerQuestion = function(choice) {
        if(choice==-1) {
            this.waitingForAnswer = true;
            return;
        }
        this.waitingForAnswer = false;
        this.openWebSocket.send("[{\"channel\":\"/service/controller\",\"data\":{\"id\":45,\"type\":\"message\",\"gameid\":"+currentKahootId+",\"host\":\"kahoot.it\",\"content\":\"{\\\"choice\\\":"+choice+",\\\"meta\\\":{\\\"lag\\\":10,\\\"device\\\":{\\\"userAgent\\\":\\\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36\\\",\\\"screen\\\":{\\\"width\\\":1920,\\\"height\\\":1040}}}}\"},\"id\":\""+(this.currentMessageId-1)+"\",\"clientId\":\""+this.clientId+"\"}]");
    }
    
    this.SendMessage = function(message, channel) {
        message.id = this.currentMessageId;
        this.currentMessageId++;
        message.channel = channel;
        
        if(this.clientId!="")
            message.clientId = this.clientId;
        
        this.openWebSocket.send("["+JSON.stringify(message)+"]");
    }
    
    this.SendLoginInfo = function() {
        var message = {data:{type:"login",gameid:currentKahootId,host:"kahoot.it",name:GenerateName(this.uniqueId)}};
        this.SendMessage(message,"/service/controller");
    }
    
    this.SendSubscription = function(subscribeTo, subscribe) {
        var message = {subscription:subscribeTo};
        this.SendMessage(message,subscribe?"/meta/subscribe":"/meta/unsubscribe");
    }
    
    this.SendConnectMessage = function() {
        this.currentMessageId++;
        this.openWebSocket.send("[{\"channel\":\"/meta/connect\",\"connectionType\":\"websocket\",\"id\":\"" +(this.currentMessageId-1)+ "\",\"clientId\":\""+ this.clientId +"\"}]");
    }
    
    this.SendDisconnectMessage = function() {
        this.currentMessageId++;
        this.openWebSocket.send("[{\"channel\":\"/meta/disconnect\",\"connectionType\":\"websocket\",\"id\":\"" +(this.currentMessageId-1)+ "\",\"clientId\":\""+ this.clientId +"\"}]");
        this.openWebSocket.close();
    }
    
    //Handles the switch block
    
    this.Handshake = function(message) {
        this.clientId = message.clientId;
        this.SendSubscription("/service/controller",true);
        this.SendSubscription("/service/player",true);
        this.SendSubscription("/service/status",true);
        this.currentMessageId++;
        this.openWebSocket.send("[{\"channel\":\"/meta/connect\",\"connectionType\":\"websocket\",\"advice\":{\"timeout\":0},\"id\":\""+(this.currentMessageId-1)+"\",\"clientId\":\""+this.clientId+"\"}]");
    }
    
    this.Subscribe = function(message) {
        this.subscriptionRepliesRecived++;
        
        if(this.initalSubscription&&this.subscriptionRepliesRecived==3) {
            this.initalSubscription = false;
            this.subscriptionRepliesRecived = 0;
            
            this.SendSubscription("/service/controller",false);
            this.SendSubscription("/service/player",false);
            this.SendSubscription("/service/status",false);

            this.SendSubscription("/service/controller",true);
            this.SendSubscription("/service/player",true);
            this.SendSubscription("/service/status",true);
            
            this.SendConnectMessage();
        }
        if(this.subscriptionRepliesRecived==6)
            this.SendLoginInfo();
    }
    
    this.Unsubscribe = function(message) {
        this.subscriptionRepliesRecived++;
        if(this.subscriptionRepliesRecived==6)
            this.SendLoginInfo();
    }
    
    this.Connect = function(message) {
        if(message.advice==undefined)
            this.SendConnectMessage();
        else
            console.log("Error: "+message.advice)
    }
    
    this.Player = function(message) {
        var data = JSON.parse(message.data.content);
        if(data.questionIndex!=undefined) {
            if(this.recivedQuestion) {
                this.recivedQuestion = false;
                //Allow answering
                if(shouldGuess)
                    setTimeout(function(){_self.AnswerQuestion(GetChoice(Object.keys(data.answerMap).length,_self.uniqueId));},answerDelay*Math.random())
                else
                    this.AnswerQuestion(GetChoice(Object.keys(data.answerMap).length,this.uniqueId));
            }
            else {
                RemoveChoice(this.uniqueId);
                this.recivedQuestion=true;
            }
        }
        else if(data.isCorrect != undefined) {
            this.waitingForAnswer = false;
            //Record result here
        }
    }
    
    this.Controller = function(message) {
        if(message.successful!=undefined)
            return;
        
        if(message.data.type == "loginResponse") {
            if(message.data.error!=undefined) {
                console.log("Bad name: "+this.uniqueId);
                this.SendLoginInfo();
            }
            else {
                AddBotToJoined();
                console.log("Logged in: "+this.uniqueId);
            }
        }
    }
}
