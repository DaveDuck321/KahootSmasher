document.getElementById('startSmash').onclick = function()
{
    //chrome.runtime.sendMessage({type:'startSmashing', id:document.getElementById("kahootId").value},function(response){});
    window.open("backup/index.html");
}

if(document.getElementById('stopSmash')!=undefined)
{
    document.getElementById('stopSmash').onclick = function()
    {
        chrome.runtime.sendMessage({type:'stopSmashing'},function(response){});
    }
}


chrome.runtime.sendMessage({type:'isSmashing'},function(response){
    if(response.smashingOn)
    {

        document.getElementById('progess').innerHTML = "In progress: <a href='' id = 'stopSmash'>Stop</a>";
        
        document.getElementById('stopSmash').onclick = function()
        {
            chrome.runtime.sendMessage({type:'stopSmashing'},function(response){});
        }
    }
});