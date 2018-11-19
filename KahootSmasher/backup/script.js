var verficationCode = "";
var numberOfKahoots =75;

var alreadyStarted = false;

var namingMethod = 0;
var namingMethods = ["Random name","Name With Number","Random Caps"];
var namesExample= ["Ben Dover","Eileen Dover","Not in ur class","Stephanie","Sportacus","Robbie Rotten","Ziggy","L0kesh;)","RealPerson.mp4","ur search history","Cael Cooper:)","Kim-Jong Uno","Sernie Banders","lorcant","Not A Bot","setup.exe","admin1","Mack attack","mr moo moo man","boris","abdothepedo","pacothetaco","orman","herobine","chuck joris","nerd3","watergaminghd","marijona","DeathtoKahoot","whoami", "game_over", "mrteacherman", "crispylips", "dragon-rider", "nsa", "cerialkiller", "pixiedust", "ramenlover", "unclejerry", "dwight", "ICAPERATS", "supremecoat", "mostwanted", "moneymoves", "bet", "foxfire", "mathz", "sponsored", "orangeuglad", "knockknock", "clevername", "minion", "losername", "Basic", "Pump", "Head", "Shoulders", "Knees", "andtoes", "TOES", "sponsored", "serverfarm", "Frisbee", "Guacamole", "icarly", "madlad", "xD", "Hmmmmm", "rpi", "over9000", "dogblog", "winupdate", "linux", "blackhole", "garlicoin", "btc", "eth", "ltc", "blockchain", "hawaiifios", "Toy Yoda"];

const genericButtonStyle = "margin-bottom:0.5%;margin-left:0.5%;width:99%;height:50px;position:fixed;display:block;bottom:0;background-color:#333;outline: 0;box-shadow: none;border: 1px solid #2e2e2e;color:white;font-family: montserrat,'helvetica neue',helvetica,arial,sans-serif;font-weight: 700;font-size:20px;";
const htmlToChangeTo = "<h1 style='background-color:#864cbf;margin-top:0;width:111%;margin-left:-5.5%;padding:10px;'>Kahoot smashing in progress...</h1><h2 id='joined'>Smashers joined: 12/50</h2><h2 id='verifiedH2' style='display:none;'>Smashers verified: 0/50</h2><h2 id='answered'>Smashers answered: 12/50</h2><div style='width:300px;margin: 0 auto;'><div style='width:200px;'><img src='images/blueAnswer.png' width=100 style='margin:20px'><p id='blueAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/greenAnswer.png' width=100 style='margin:20px'><p id='greenAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/redAnswer.png' width=100 style='margin:20px'><p id='redAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/yellowAnswer.png' width=100 style='margin:20px'><p id='yellowAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div></div>";

var addMoreButton= document.createElement("input");
addMoreButton.type = "button";
addMoreButton.value = "Smash More!";
addMoreButton.class="clickable";
addMoreButton.onmousedown=function (){addMoreKahoots();};
addMoreButton.style=genericButtonStyle;

var verifyButton= document.createElement("input");
verifyButton.id="verifyButton";
verifyButton.type = "button";
verifyButton.value = "Verify bots (needed to play)";
verifyButton.onmousedown=function (){$("#2step").slideDown()};
verifyButton.class="clickable";
verifyButton.style=genericButtonStyle+"margin-bottom:60px;";

$("#GamePin").keyup(function (e) {
    if (e.which == 13)
        buttonClicked();
 });

 function numberChanging() {
    if(Number($("#numberOfKahoots").val())>255)
        $("#numberOfKahoots").val(255);
 }
 
function randomCaps(baseName) {
    var newName = "";
    for(var i=0; i< baseName.length; i++) {
        if(Math.random()>0.5)
            newName+=baseName[i].toUpperCase();
        else
            newName+=baseName[i].toLowerCase();
    }
    return newName;
}

function onLoadTestIfSmashing() {
    chrome.runtime.sendMessage({type:'isSmashing'}, function(response) {
        if(response.smashingOn){
            alreadyStarted = true;
            $("#body").html(htmlToChangeTo);
            $("#androidApp").css("display","none");
            document.body.appendChild(addMoreButton);
        }
    });
}

function generateRandomLetter(length) {
    var randomLetters = "";
    //Why not use ascii codes an do this without the alphabet (its the qwerty alphabet too)
    var letters= "qwertyuiopasdfghjklzxcvbnm1234567890";
    for(var i=0; i<length; i++) {
        randomLetters += letters[Math.floor(Math.random()*letters.length)];
    }
    return randomLetters;
}

function generateName(mode) {
    var name="";
    switch(mode) {
        case 0:
            name = randomCaps(namesExample[Math.floor(Math.random()*namesExample.length)]);
            break;
        case 1:
            name = $("#base").val().substr(0,11) + Math.floor(Math.random()*9+1);
            break;
        case 2:
            if($("#base").val().length<7)
                name = randomCaps($("#base").val()) + Math.floor(Math.random()*9+1);
            else
                name = randomCaps($("#base").val());
            break;
        default:
            name = "Smasher"+generateRandomLetter(5);
    }
    return name;
}


function updateName() {
    $("#nameExample").html("Example: " + generateName(namingMethod));
}

function showExtension() {
    $("#install").show(100);
}

function hideExtension() {
    $("#install").hide(100);
}

function addMoreKahoots() {
    if(numberOfKahoots>=255)
        document.body.removeChild(verifyButton);
    else{
        numberOfKahoots=Math.min(numberOfKahoots+10,255);
        //$("#asdfghjklqwertyuio").attr("newRequests",10);
        chrome.runtime.sendMessage({type:'addMore', totalNumber:numberOfKahoots},function(response){});
    }
}

function showSettings() {
    $("#settings").show(100);
}
function hideSettings(shouldSave){
    $("#settings").hide(100);
    if(shouldSave) {
        numberOfKahoots = parseInt($("#numberOfKahoots").val());
        
        var allData = {"number":numberOfKahoots,
                        "base":$("#base").val(),
                        "method":namingMethod,
                        "delay":$("#answerDelay").val()
                    };
        
        chrome.storage.local.set({'settingsData': allData}, function() {
            console.log("saved");
        });
    }
    else
        $("#numberOfKahoots").val(numberOfKahoots);
}

function GetSettingsFromFile(items) {
    item = items.settingsData;
    if(item.number==undefined) {
        console.log("no save data");
        return;
    }
    numberOfKahoots = parseInt(item.number);
    $("#numberOfKahoots").val(numberOfKahoots);
    $("#base").val(item.base);
    namingMethod = parseInt(item.method);
    $("#namingMethod").attr('value',namingMethods[namingMethod]);
    $("#answerDelay").val(parseInt(item.delay));
}

function showAbout() {
    $("#info").show(100);
}
function hideAbout() {
    $("#info").hide(100);
}

function changeNaming() {
    namingMethod+=1;
    if(namingMethod==namingMethods.length)
        namingMethod=0;
    if(namingMethod==0) {
        $("#baseName").slideUp(100);
        $("#base").slideUp(100);
    }
    else {
        $("#baseName").slideDown(100);
        $("#base").slideDown(100);
    }
    $("#namingMethod").attr('value',namingMethods[namingMethod]);
    updateName();
}

function buttonClicked() {
    gameID = $("#GamePin").val();
    if(gameID=="")
        return;
    
    for(var i=0; i<gameID.length; i++) {
        if(isNaN(parseInt(gameID[i])))
            return;
    }
   
    chrome.runtime.sendMessage({
        type:'startSmashing', 
        id:gameID, 
        baseName:$("#base").val(), 
        namingConvention:namingMethod, 
        number:numberOfKahoots,
        delay:parseInt($("#answerDelay").val()
        )}, function(response){alreadyStarted = true;}
        );
    
    $("#body").html(htmlToChangeTo);
    
    document.body.appendChild(verifyButton);
    $("#verifyButton").hide();
    $("#androidApp").css("display","none");
    document.body.appendChild(addMoreButton);
}
$(document).ready(()=>{
    onLoadTestIfSmashing();
    $("#popupBackOnclick").click(()=>{$('#2step').slideUp(100)});
    $("#hideSettingsButton").click(()=>{hideSettings(true)});
    $("#hideAboutBtn").click(hideAbout);
    $("#settingsGear").click(showSettings);
    $("#aboutGear").click(showAbout);
    $("#smash").click(buttonClicked);
    $("#EnterButton").click(buttonClicked);
    $("#hideSettings2").click(()=>{hideSettings(false)});
    $("#namingMethod").click(changeNaming);
    $("#popupBack1").click(hideAbout);
    $("#xSettings").click(()=>{hideSettings(false)});
    $("#androidApp").slideDown(700);
    $("#base").change(updateName);
    $("#numberOfKahoots").change(numberChanging);
    updateName();
    
    $('#GamePin').on('keyup', function (e) {
        if (e.keyCode == 13)
            buttonClicked();
    });
    
    chrome.storage.local.get("settingsData", function(items) {
        GetSettingsFromFile(items)
    });
});
    
setInterval(function() {
    chrome.runtime.sendMessage({type: "progress"},
    function(response) {
        if(!response.started && alreadyStarted)
            window.close();
        
        $("#joined").html("Smashers joined: "+response.botsJoined+"/"+numberOfKahoots);
        $("#answered").html("Smashers answered: "+(Number(response.redAnswers)+Number(response.blueAnswers)+Number(response.yellowAnswers)+Number(response.greenAnswers))+"/"+numberOfKahoots);
        
        $("#blueAnswers").html(response.blueAnswers+"/"+numberOfKahoots);
        $("#yellowAnswers").html(response.yellowAnswers+"/"+numberOfKahoots);
        $("#greenAnswers").html(response.greenAnswers+"/"+numberOfKahoots);
        $("#redAnswers").html(response.redAnswers+"/"+numberOfKahoots);
        $("#joinedVerify").html("Joined: "+response.number +"/"+numberOfKahoots);
        
        if(numberOfKahoots<response.number)
            numberOfKahoots = response.number;
        
        if(response.error!=undefined && response.error == "404") {
            alert("Kahoot ID not found!");
            alert("Please try again with a valid ID");
            chrome.runtime.sendMessage({type: "stopSmashing"},null);
            window.close();
        }
    });
},50);
