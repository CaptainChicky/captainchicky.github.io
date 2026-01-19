var resizeEventAttached = false;

var playerPointer;
var parentPointer;
var playerUnloadPrompt = "";
var playerDisableUnloadConfirmation = false;
var playerUnloadCheck; //js function to call
var playerEnableAjaxPost = false; //Used mainly for safari since safari won't allow player to post
// This is a magic offset added to the player height.  If poses a problem on exercise.aspx, so
// instead of completely removing it, we can make it overrideable on the page.
var playerMagicNumber = 5; 

//Hopefully, this will set the focus to the player on WIndows IE machines
function _ngpp() {
    if (playerPointer)
        playerPointer.focus();
}

function _NextGenPlayerOnLoad() {
    if (playerPointer) {
        setTimeout(_ngpp, 10);
    } else if (playerUnloadPointer)
        playerUnloadPointer.focus();
}

if(window.attachEvent) { 
  window.attachEvent("onload",_NextGenPlayerOnLoad); 
} else if(window.addEventListener) { 
  window.addEventListener("load",_NextGenPlayerOnLoad, false); 
}


function resizePlayer(playerId) {

  var p = document.getElementById(playerId);

  if (p == null) {
      return;
  }

    var pp = p;
  
  if (pp && pp.document) {
    //IE
    while (pp.nodeName != "BODY" && pp.document && pp.document.documentElement && pp.parentElement) {
        pp = pp.parentElement;
    }
  } else {
    //Mozilla
    while (pp.nodeName != "BODY" && pp.parentNode) {
        pp = pp.parentNode;
    }
  }

  playerPointer = p;
  parentPointer = pp;

  _resizePlayer();

    $(document).ready(function() {
        _resizePlayer();
    });
  
  if (! resizeEventAttached) {
    resizeEventAttached  = true;
    if(window.attachEvent) { 
        window.attachEvent("onresize", _resizePlayer);
    } else if(window.addEventListener) { 
        window.addEventListener("resize", _resizePlayer, false);
    }
  }
  
}

function _resizePlayer() {
  if (playerPointer && parentPointer) {
  
//        showProps(parentPointer,"parentPointer");
        //scrollHeight doesn't work in safari - clientHeight and offsetHeight are set
        //I'll try clientHeight first.
        //For some reason in IE on exercise.aspx page clientHEight was not working so I'll use offsetHeight
//       var extraHeight = parentPointer.scrollHeight - playerPointer.clientHeight;
       var extraHeight = parentPointer.clientHeight - playerPointer.offsetHeight;
       var winHeight = document.documentElement.clientHeight;
      playerPointer.height = winHeight - extraHeight+ playerMagicNumber;  //5 is a magic number.  I can't explain it, but it seems to work on all player pages in IE, FF and Chrome.  I'll leave it for now.

  }
}

var playerUnloadPointer;

function setupPlayerUnload(playerId) {
   playerUnloadPointer = document.getElementById(playerId);
   if (playerUnloadPointer) {
       if(window.attachEvent) { 
          window.attachEvent("onbeforeunload",_nextGenUnload); 
        } else if(window.addEventListener) { 
           //window.onbeforeunload = _nextGenUnload;
          window.addEventListener("beforeunload",_nextGenUnload, false); 
        }
    }
}

var playerVersion = "";
var playerPostInfo;

function _nextGenUnload(e) {
    
    if (playerDisableUnloadConfirmation)
        return;
    if (playerUnloadCheck && playerUnloadCheck())
        return;

    //playerVersion = playerUnloadPointer.getVersion();
    if (playerEnableAjaxPost && typeof(playerUnloadPointer.getUnloadPostInfo) != "undefined") {
        try {
            playerPostInfo = playerUnloadPointer.getUnloadPostInfo();
            if (playerPostInfo != null) {
                var url = playerPostInfo.url;
                var body = playerPostInfo.body;
                if (url && body) {
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: body,
                        async: false,
                        success: function (data, textStatus) {
                            playerUnloadPointer.processTicket(data);
                        }
                    });
                }
            }
        }
        catch (err) {
            alert(err);
        }
    }
    else {
        playerUnloadPointer.unload();
    }

    if (playerUnloadPrompt.length > 0) {
        if (!e)
            e = window.event;
        if (e)
            e.returnValue = playerUnloadPrompt;
        return playerUnloadPrompt;
    } else {
        return null;
    }
}



var NextGenPlayer_ExternalLinkUrl = "../Student/ExternalLink.aspx";

function goPlayerLink(linkName,linkText, linkOptions) {

    var params = "linkName="+escape(linkName)+"&linkText=" + escape(linkText);
    var url = NextGenPlayer_ExternalLinkUrl;
    if (NextGenPlayer_ExternalLinkUrl.indexOf("?") < 0)
        url += "?";
    else
        url += "&";
    url += params;

    var includeMenu = false;
    var width = 0;
    var height = 0;

    if (linkOptions)
    {
        includeMenu = linkOptions.includeMenu;
        width = linkOptions.popupWidth;
        height = linkOptions.popupHeight;
    }

    var popupOptions = {};
    popupOptions.BringToFront = false;
    popupOptions.Toolbar = includeMenu;
    popupOptions.Menubar = includeMenu;
    popupOptions.Location = includeMenu;
    //popupOptions.Statusbar = includeMenu;
    popupOptions.Titlebar = includeMenu;


    //Instead of using popup options for width and height send them as params to page.
    if (width > 0)
        url += "&width=" + width;
    if (height > 0)
        url += "&height=" + height;

    popupWindow("ExternalLink",url,popupOptions);

 }

 function linkClicked(linkName, linkText, linkOptions) {
     setTimeout(function () {
         goPlayerLink(linkName, linkText, linkOptions);
     }, 10);
  }


