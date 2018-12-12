var progress = {type:'RequestAction'};
if(window == window.top && window.location.href=="https://kahoot-smash.tk/")
    document.getElementsByTagName("iframe")[0].src = chrome.extension.getURL("backup/index.html");

if(window != window.top && window.location.href=="https://kahoot.it/") {
    function TestIfJQAval() {
        if($!=undefined)    Run();
        else                setTimeout(TestIfJQAval,300);
    }
    TestIfJQAval();
    
    function UpdateProgress() {
        let smashingInfoObject  = document.getElementById('smashingInfo').attributes;
        progress.redAnswers     = smashingInfoObject.redAnswers.value;
        progress.greenAnswers   = smashingInfoObject.greenAnswers.value;
        progress.yellowAnswers  = smashingInfoObject.yellowAnswers.value;
        progress.blueAnswers    = smashingInfoObject.blueAnswers.value;
        progress.botsJoined     = smashingInfoObject.botsJoined.value;
    }

    function Run() {
        let newScript = document.createElement('script');
        newScript.src = chrome.extension.getURL("smasherBot.js");
        newScript.onload = function() {this.remove()};
        (document.head || document.documentElement).appendChild(newScript);
        
        setInterval(function() {
            UpdateProgress();
            chrome.runtime.sendMessage(progress, function(response) {
                if(response != undefined){
                    if(response.toDecode != "" && response.toDecode != undefined) {
                        let script = document.createElement('script');
                        script.textContent = '$("head").attr("debug",eval("'+response.toDecode+'"))';
                        (document.head||document.documentElement).appendChild(script);
                        script.remove();
                        
                        chrome.runtime.sendMessage({type:'decoded',content:document.getElementsByTagName('head')[0].attributes.debug.value},null);
                    }
                    
                    if(response.tokenToAdd != "" && response.tokenToAdd != undefined) {
                        let script = document.createElement('script');
                        if(response.First && response.First!=undefined)
                            script.textContent =`InitiateSmashAndAddBot('${response.tokenToAdd}',${response.KahootId},${response.NamingConvention},'${response.BaseName}',${response.answerDelay})`
                        else    script.textContent = 'AddBot("'+ response.tokenToAdd +'")';
                        
                        (document.head||document.documentElement).appendChild(script);
                        script.remove();
                    }
                    
                    if(response.haltSmash && response.haltSmash != undefined) {
                        let script = document.createElement('script');
                        script.textContent = 'StopSmash()';
                        (document.head||document.documentElement).appendChild(script);
                        script.remove();
                    }
                }
            });
        }, 100);
    }
}