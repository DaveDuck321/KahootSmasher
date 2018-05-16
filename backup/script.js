var verficationCode = "";
var numberOfKahoots =50;

var alreadyStarted = false;

var namingMethod = 0;
var namingMethods = ["Random name","Random Ending","Random Caps"];
var namesExample= ["Ben Dover","Eileen Dover","Not in ur class","Stephanie","Sportacus","Robbie Rotten","Ziggy","L0kesh;)","RealPerson.mp4","ur search history","Cael Cooper:)","Kim-Jong Uno","Sernie Banders","lorcan't","Not A Bot","setup.exe","admin1"];

var addMoreButton= document.createElement("input");
addMoreButton.type = "button";
addMoreButton.value = "Smash More!";
addMoreButton.class="clickable";
addMoreButton.onmousedown=function (){addMoreKahoots();};
addMoreButton.style="margin-bottom:0.5%;margin-left:0.5%;width:99%;height:50px;position:fixed;display:block;bottom:0;background-color:#333;outline: 0;box-shadow: none;border: 1px solid #2e2e2e;color:white;font-family: montserrat,'helvetica neue',helvetica,arial,sans-serif;font-weight: 700;font-size:20px;";

var verifyButton= document.createElement("input");
verifyButton.id="verifyButton";
verifyButton.type = "button";
verifyButton.value = "Verify bots (needed to play)";
verifyButton.onmousedown=function (){$("#2step").slideDown()};
verifyButton.class="clickable";
verifyButton.style="margin-bottom:0.5%;margin-left:0.5%;width:99%;height:50px;position:fixed;display:block;bottom:0;background-color:#333;outline: 0;box-shadow: none;border: 1px solid #2e2e2e;color:white;font-family: montserrat,'helvetica neue',helvetica,arial,sans-serif;font-weight: 700;font-size:20px;margin-bottom:60px;";

$("#GamePin").keyup(function (e) {
    if (e.which == 13) {
        buttonClicked();
    }
 });

 function numberChanging()
 {
    if(Number($("#numberOfKahoots").val())>240)
    {
        $("#numberOfKahoots").val(240);
    }
 }
 
function randomCaps(baseName)
{
    var newName = "";
    for(var i=0; i< baseName.length; i++)
    {
        if(Math.random()>0.5)
        {
            newName+=baseName[i].toUpperCase();
        }
        else
        {
            newName+=baseName[i].toLowerCase();
        }
    }
    return newName;
}

function onLoadTestIfSmashing()
{
    chrome.runtime.sendMessage({type:'isSmashing'},function(response){
        if(response.smashingOn)
        {
            alreadyStarted = true;
            var newHTML = "<h1 style='background-color:#864cbf;margin-top:0;width:111%;margin-left:-5.5%;padding:10px;'>Kahoot smashing in progress...</h1><h2 id='joined'>Smashers joined: 12/50</h2><h2 id='verifiedH2' style='display:none;'>Smashers verified: 0/50</h2><h2 id='answered'>Smashers answered: 12/50</h2><div style='width:300px;margin: 0 auto;'><div style='width:200px;'><img src='images/blueAnswer.png' width=100 style='margin:20px'><p id='blueAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/greenAnswer.png' width=100 style='margin:20px'><p id='greenAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/redAnswer.png' width=100 style='margin:20px'><p id='redAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/yellowAnswer.png' width=100 style='margin:20px'><p id='yellowAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div></div>";
        $("#body").html(newHTML);
    
        document.body.appendChild(addMoreButton);
        }
    });
}

function generateRandomLetter(length)
{
    var randomLetters = "";
    var letters= "qwertyuiopasdfghjklzxcvbnm1234567890";
    for(var i=0; i<length; i++)
    {
        randomLetters += letters[Math.floor(Math.random()*letters.length)];
    }
    return randomLetters;
}

function generateName(mode)
{
    var name="";
    switch(mode)
    {
        case 0:
            name = randomCaps(namesExample[Math.floor(Math.random()*namesExample.length)]);
            break;
        case 1:
            name = ($("#base").val().substr(0,11) +"." +generateRandomLetter(5)).substr(0,16);
            break;
        case 2:
            if($("#base").val().length<7)
            {
                name = randomCaps($("#base").val()) + "." +generateRandomLetter(4);
                break;
            }
            else
            {
                name = randomCaps($("#base").val());
                break;
            }
        default:
            name = "Smasher"+generateRandomLetter(5);
    }
    return name;
}


function updateName()
{
    $("#nameExample").html("Example: " + generateName(namingMethod));
}

function showExtension()
{
    $("#install").show(100);
}
function hideExtension()
{
    $("#install").hide(100);
}

function addMoreKahoots()
{
    if(numberOfKahoots>=240)
    {
        document.body.removeChild(verifyButton);
        return;
    }
    else{
        numberOfKahoots=Math.min(numberOfKahoots+10,240);
        //$("#asdfghjklqwertyuio").attr("newRequests",10);
        chrome.runtime.sendMessage({type:'addMore', totalNumber:numberOfKahoots},function(response){});
    }
}

function showSettings()
{
    $("#settings").show(100)
}
function hideSettings(shouldSave)
{
    $("#settings").hide(100);
    if(shouldSave)
    {
        numberOfKahoots = parseInt($("#numberOfKahoots").val());
        var allData = {"number":numberOfKahoots, "base":$("#base").val(),"method":namingMethod, "delay":$("#answerDelay").val()}
        chrome.storage.local.set({'settingsData': allData}, function() {
            console.log("saved");
        });
    }
    else
    {
        $("#numberOfKahoots").val(numberOfKahoots);
    }
}

function GetSettingsFromFile(items)
{
    item = items.settingsData;
    if(item==undefined || item.number==undefined)
    {
      console.log("no save data");
      console.log("Making save data");
      hideSettings(true);
      console.log("Done")
   	return;
   }
   numberOfKahoots = parseInt(item.number);
   $("#numberOfKahoots").val(numberOfKahoots);
   $("#base").val(item.base);
   namingMethod = parseInt(item.method);
   $("#namingMethod").attr('value',namingMethods[namingMethod]);
   $("#answerDelay").val(parseInt(item.delay));
}

function showAbout()
{
    $("#info").show(100);
}
function hideAbout()
{
    $("#info").hide(100);
}

function changeNaming()
{
    namingMethod+=1;
    if(namingMethod==namingMethods.length)
    {
        namingMethod=0;
    }
    if(namingMethod==0)
    {
        $("#baseName").slideUp(100);
        $("#base").slideUp(100);
    }
    else
    {
        $("#baseName").slideDown(100);
        $("#base").slideDown(100);
    }
    $("#namingMethod").attr('value',namingMethods[namingMethod]);
    updateName();
}


function buttonClicked()
{
    gameID = $("#GamePin").val();
    
    if(gameID=="")
    {
        return;
    }
    for(var i=0; i<gameID.length; i++)
    {
        if(isNaN(parseInt(gameID[i])))
        {
            return;
        }
    }
   
    chrome.runtime.sendMessage({type:'startSmashing', id:gameID, baseName:$("#base").val(), namingConvention:namingMethod, number:numberOfKahoots,delay:parseInt($("#answerDelay").val())},function(response){alreadyStarted = true;});
    
    //Load here to check gamepin
    
    var newHTML = "<h1 style='background-color:#864cbf;margin-top:0;width:111%;margin-left:-5.5%;padding:10px;'>Kahoot smashing in progress...</h1><h2 id='joined'>Smashers joined: 12/50</h2><h2 id='verifiedH2' style='display:none;'>Smashers verified: 0/50</h2><h2 id='answered'>Smashers answered: 12/50</h2><div style='width:300px;margin: 0 auto;'><div style='width:200px;'><img src='images/blueAnswer.png' width=100 style='margin:20px'><p id='blueAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/greenAnswer.png' width=100 style='margin:20px'><p id='greenAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/redAnswer.png' width=100 style='margin:20px'><p id='redAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div><div style='width:200px;'><img src='images/yellowAnswer.png' width=100 style='margin:20px'><p id='yellowAnswers' style='text-align:left;margin-top:-100px;font-size:50px;margin-left:125px'>10/50</p></div></div>";
    $("#body").html(newHTML);
    $("#androidApp").css("display","none");
    
    document.body.appendChild(verifyButton);
    $("#verifyButton").hide();
    document.body.appendChild(addMoreButton);
    
    
}
$(document).ready(function(){
	onLoadTestIfSmashing();	
	$("#popupBackOnclick").click(function(){$('#2step').slideUp(100)});
	$("#hideSettingsButton").click(function(){hideSettings(true)});
	$("#hideAboutBtn").click( hideAbout);
	$("#settingsGear").click(showSettings);
	$("#aboutGear").click(showAbout);
	$("#smash").click(buttonClicked);
	$("#EnterButton").click(buttonClicked);
	$("#hideSettings2").click(function(){hideSettings(false)});
	$("#namingMethod").click(changeNaming);
	$("#popupBack1").click(hideAbout);
	$("#xSettings").click(function(){hideSettings(false)});
   $("#androidApp").slideDown(700);
       
   updateName();
   $('#GamePin').on('keyup', function (e) {
    	if (e.keyCode == 13) {buttonClicked();}
    });
    
    chrome.storage.local.get("settingsData", function(items){GetSettingsFromFile(items)})
});
    
    setInterval(function(){
        chrome.runtime.sendMessage({type: "progress"},
        function(response){
            if(!response.started && alreadyStarted)
            {
                window.close();
            }
            $("#joined").html("Smashers joined: "+response.botsJoined+"/"+numberOfKahoots);
            $("#answered").html("Smashers answered: "+(Number(response.redAnswers)+Number(response.blueAnswers)+Number(response.yellowAnswers)+Number(response.greenAnswers))+"/"+numberOfKahoots);
            
            $("#blueAnswers").html(response.blueAnswers+"/"+numberOfKahoots);
            $("#yellowAnswers").html(response.yellowAnswers+"/"+numberOfKahoots);
            $("#greenAnswers").html(response.greenAnswers+"/"+numberOfKahoots);
            $("#redAnswers").html(response.redAnswers+"/"+numberOfKahoots);
            $("#joinedVerify").html("Joined: "+response.number +"/"+numberOfKahoots);
            
            if(numberOfKahoots<response.number)
            {
                numberOfKahoots = response.number;
            }
            
            if(response.error!=undefined && response.error == "404")
            {
                alert("Kahoot ID not found!");
                alert("Please try again with a valid ID");
                chrome.runtime.sendMessage({type: "stopSmashing"},null);
                window.close();
            }
            
            });
    },50);