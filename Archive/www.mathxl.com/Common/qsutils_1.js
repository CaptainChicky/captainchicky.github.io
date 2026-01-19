// Netscape's Javascript escape implementation doesn't escape spaces
// causes a parameter error when used in querystring
// This function will escape the string including spacses
// as well as Javascript escape single and double quotes
function _escape(str)
{
  var escstr = new String(str);

  // Unencode quotes so escape function doesn't re-encode later (only Netscape encodes them again IE doesn't)
  escstr = escstr.replace(/\%22/ig,"\"");
  escstr = escstr.replace(/\%27/ig,"'");

  
  escstr = escape(escstr);

  // spaces to pluses
  escstr = escstr.replace(/\s/ig,"+");

  // NS 6.2 on MACK needs to have forward slashes escaped when going to a page that contains java applet
  escstr.replace(/\//ig,"%2F");

return escstr;
}



// Javascript unescape doesn't replace '+' with ' ' so we add that
function _unescape(str)
{
  var re = /\+/g;
  var newstr=str.replace(re, " ");
  return unescape(newstr);
}

// Retrieves the value of a paramater in the reqstr
function getParam(reqstr,param)
{
  var regexp, tmpstr, found;

  tmpstr = new String(reqstr);

  regexp = new RegExp("[\\?|\\&]" + param +"=([^\\&]+)", "i");

  found = tmpstr.match(regexp);
  // our parameter is actually the second element of the array of matches, the first is the whole match
  if (found && found[1]) 
    return _unescape(found[1]);
  else
    return false;
}

// Remove parameter from reqstr
function removeParam(reqstr,param)
{
  var evstr, dest;
  dest = new String(reqstr); 

  // strip out existing parameter
  //FOUND A BUG MAD 10/25/00
  //Routine did not handle "param=" at end of string
  //evstr = "dest = dest.replace(/[\\?|\\&]"+param+"=[^\\&]+/ig,\"\");"

  //FOUND A BUG AAL 03/27/03
  //Routine didn't handle removing empty param
  //evstr = "dest = dest.replace(/[\\?|\\&]"+param+"=(([^\\&]+)|\s*$)/ig,\"\");"  

  evstr = new RegExp("[\\?|\\&]" + param + "=(([^\\&]*)|\s*$)", "ig");
  dest = dest.replace(evstr, "");

  // if we stripped out the first param, make the following param have the ampersand
  if (dest.indexOf("?")==-1 && dest.indexOf("&")!=-1)
    dest = dest.replace(/\&/,"?");

  return dest;
}

// Remove parameter that starts with this beginning from reqstr
function removeParamSubStr(reqstr,param)
{
  var evstr, dest;
  dest = new String(reqstr); 

  // strip out existing parameter

  evstr = new RegExp("[\\?|\\&]" + param + "[a-zA-Z0-9]*=(([^\\&]*)|\s*$)", "ig");
  dest = dest.replace(evstr, "");
  // if we stripped out the first param, make the following param have the ampersand
  if (dest.indexOf("?")==-1 && dest.indexOf("&")!=-1)
    dest = dest.replace(/\&/,"?");

  return dest;
}

// If parameter exists in reqstr, change its value
// If not, add it
function replaceParam(reqstr,param,value)
{
  var evstr, dest;
  dest = new String(reqstr); 

  // strip out existing parameter
  dest = removeParam(dest,param)

  if (dest.indexOf("?")>=0)
    dest=dest+"&"+param+"="+value;
  else
    dest=dest+"?"+param+"="+value;

  return dest;
}

// this is for url with angular hashbang
function replaceParamWithHashbang(reqstr, param, value) {
    var dest = new String(reqstr);
    var hasQueryParams = dest.indexOf("?") >= 0 ? true : false;
    var pattern = new RegExp("(" + param + "=)([^&|#]*)", "ig");

    var match = dest.match(pattern);
    if (match != null) {
        dest = dest.replace(pattern, "$1" + value);
    } else {
        dest = dest.replace(/(.*)(#\/tab\/)(.*)/ig, "$1" + (hasQueryParams ? "&" : "?") + param + "=" + value + "$2$3");
    }

    return dest;
}