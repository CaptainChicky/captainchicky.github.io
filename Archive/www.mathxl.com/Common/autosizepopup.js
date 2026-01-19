// Retrieves the value of a paramater in the reqstr
function AutoSizeGetParam(reqstr,param)
{
  var regexp, tmpstr, found;

  tmpstr = new String(reqstr);

  regexp = new RegExp('[\\?|\\&]' + param + '=([^\\&]+)');

  found = tmpstr.match(regexp);

  // our parameter is actually the second element of the array of matches, the first is the whole match
  if (found && found[1]) 
    return unescape(found[1]);
  else
    return false;
}

// JScript File
var AutoSize_HeightBuffer = 50;
var AutoSize_WidthBuffer = 20;

var AutoSize_MinHeight = 0
var AutoSize_MinWidth = 0

if(window.attachEvent) { 
  window.attachEvent("onload",_AutoSizeThisPopup); 
} else if(window.addEventListener) { 
  window.addEventListener("load",_AutoSizeThisPopup, false); 
}

function _AutoSizeThisPopup() {
  var centerWin = AutoSizeGetParam(location,"centerwin") == "yes";
  AutoSizeThisPopup(centerWin || window.CenterWindow);
}

function AutoSizeCenterWindow() {
    //VL: changed form offsetWidth/offsetHeight to clientWidth/clientHeight to support popup windows with content larger than the window size
    var x = (screen.availWidth - window.document.documentElement.clientWidth) / 2;
    if (x < 0) x = 0;
    var y = (screen.availHeight - window.document.documentElement.clientHeight) / 2 - AutoSize_HeightBuffer;
    if (y < 0) y = 0;
    window.moveTo(x,y);
}

function GetMainWindow(w)
{
    if (w.IsPopup)
        return GetMainWindow(w.opener);
    else
        return w;
}

function AutoSizeThisPopup(centerWindow) {

  var heightDiff = 0;
  var widthDiff = 0;
  var targetHeight = 0;

  var autoH = AutoSizeGetParam(location,"autoh") == "yes";
  var autoW = AutoSizeGetParam(location, "autow") == "yes";
  var popover = AutoSizeGetParam(location, "popover") == "yes";
  
    
  if (autoH || window.AutoHeight) {
    targetHeight = Math.min(window.document.documentElement.scrollHeight,screen.availHeight-AutoSize_HeightBuffer);
    if (window.ConstrainToParent) {
      var mainWindow = GetMainWindow(opener);
      if (mainWindow.document.documentElement.clientHeight-AutoSize_WidthBuffer < targetHeight) {
        // don't allow popup window height to be bigger than parent
        targetHeight = mainWindow.document.documentElement.clientHeight-AutoSize_HeightBuffer;
      }
    }
    
    var minHeight = Math.min(screen.availHeight-AutoSize_HeightBuffer,AutoSize_MinHeight);
    if (targetHeight < minHeight)
      targetHeight = minHeight;
      
    heightDiff = targetHeight-window.document.documentElement.clientHeight;
  }
 
  if (autoW || window.AutoWidth) {
    var targetWidth = Math.min(window.document.documentElement.scrollWidth,screen.availWidth-AutoSize_WidthBuffer);
    
    var minWidth = Math.min(screen.availWidth-AutoSize_WidthBuffer,AutoSize_MinWidth);
    if (targetWidth < minWidth)
        targetWidth = minWidth;
        
    widthDiff = screen.availWidth-window.document.documentElement.clientWidth;
  }

  if (widthDiff != 0 || heightDiff != 0) {
      if (popover) {
          if (window.frameElement && jQuery) {
              if (targetHeight > 0) 
                $(window.frameElement).height(Math.ceil(targetHeight)+1); //Needed to add one for prereqwarning dialog.
          }
      } else {
          if (centerWindow) {
              window.moveBy(-widthDiff, -heightDiff);
          }
          window.resizeBy(widthDiff, heightDiff);
      }
  }

  if (centerWindow && ! popover) {
    setTimeout('AutoSizeCenterWindow();', 10);
  }

}

function windowclose() {
    if (window.closePopover)
        window.closePopover();
    else
        window.close();
}


