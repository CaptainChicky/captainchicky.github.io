//-----------------------------------------------------------------------------
// sortTable(id, col, rev)
//
//  id  - ID of the TABLE, TBODY, THEAD or TFOOT element to be sorted.
//  col - Index of the column to sort, 0 = first column, 1 = second column,
//        etc.
//  rev - If true, the column is sorted in reverse (descending) order
//        initially.
//
//-----------------------------------------------------------------------------

// Based on http://www.brainjar.com/dhtml/tablesort/demo.html

// Much nicer version here - http://www.frequency-decoder.com/2006/09/16/unobtrusive-table-sort-script-revisited/
// Try out one day
function sortTable(id, col, rev, secondCol, sortType, even,odd) {
var t;

   if(!odd) odd = '';
  // Get the table or table section to sort.
  var tblEl = document.getElementById(id);
  
  if (!tblEl)
    alert('Cannot find sorting id: '+id);
  
  // Look for a tbody because we don't want to sort thead/tfooter by sorting whole table
  for (var i=0; i<tblEl.childNodes.length;i++) {
    // skip text nodes and such
    if (tblEl.childNodes[i].nodeType == document.ELEMENT_NODE) 
    {
      t = tblEl.childNodes[i].tagName.toUpperCase();
      if (t=="TBODY") {
        tblEl = tblEl.childNodes[i];
        break;
      }
    }
  }
  
tblEl.style.cursor = "wait"
  // The first time this function is called for a given table, set up an
  // array of reverse sort flags.
  if (tblEl.reverseSort == null) {
    tblEl.reverseSort = new Array();
    // Also, assume the team name column is initially sorted.
    tblEl.lastColumn = 1;
  }

  // If this column has not been sorted before, set the initial sort direction.
  if (tblEl.reverseSort[col] == null)
    tblEl.reverseSort[col] = rev;

  // If this column was the last one sorted, reverse its sort direction.
  if (col == tblEl.lastColumn)
    tblEl.reverseSort[col] = !tblEl.reverseSort[col];

  // Remember this column as the last one sorted.
  tblEl.lastColumn = col;

  // Set the table display style to "none" - necessary for Netscape 6 
  // browsers.
  var oldDsply = tblEl.style.display;
  tblEl.style.display = "none";

  // Sort the rows based on the content of the specified column using a
  // selection sort.

  var tmpEl;
  var i, j;
  var minVal, minIdx;
  var testVal;
  var cmp;

  for (i = 0; i < tblEl.rows.length - 1; i++) {

    // Assume the current row has the minimum value.
    minIdx = i;
    minVal = getTextValue(tblEl.rows[i].cells[col], sortType);

    // Search the rows that follow the current one for a smaller value.
    for (j = i + 1; j < tblEl.rows.length; j++) {
      testVal = getTextValue(tblEl.rows[j].cells[col], sortType);
      cmp = compareValues(minVal, testVal);
      // Negate the comparison result if the reverse sort flag is set.
      if (tblEl.reverseSort[col])
        cmp = -cmp;
      // Sort by the second column (team name) if those values are equal.
      if (cmp == 0 && col != 1)
        cmp = compareValues(getTextValue(tblEl.rows[minIdx].cells[secondCol], sortType),
                            getTextValue(tblEl.rows[j].cells[secondCol], sortType));
      // If this row has a smaller value than the current minimum, remember its
      // position and update the current minimum value.
      if (cmp > 0) {
        minIdx = j;
        minVal = testVal;
      }
    }

    // By now, we have the row with the smallest value. Remove it from the
    // table and insert it before the current row.
    if (minIdx > i) {
      tmpEl = tblEl.removeChild(tblEl.rows[minIdx]);
      tblEl.insertBefore(tmpEl, tblEl.rows[i]);
    }
  }

  // Make it look pretty.
  stripeTable(tblEl,even,odd);

  // Restore the table's display style.
  tblEl.style.display = oldDsply;
    tblEl.style.cursor = "default"
  return false;
}

function stripeTable(tblEl,even,odd)
{    

    if (typeof(tblEl) == "string") {
      tblEl = document.getElementById(tblEl);
    }
  
    if (tblEl) {
      if(!even) even = '';
      if(!odd) odd = '';
      for (i = 0; i < tblEl.rows.length; i++) 
      {
         tblEl.rows[i].className =(i%2 == 0) ? odd : even;  
      }
    }
}

function stripeTableVisibleRows(tblEl,even,odd)
{    

    if (typeof(tblEl) == "string") {
      tblEl = document.getElementById(tblEl);
    }
  
    if (tblEl) {
      if(!even) even = '';
      if(!odd) odd = '';
      var curRow=0;
      for (i = 0; i < tblEl.rows.length; i++) 
      {
        if (tblEl.rows[i].style.display!="none")
        {
            tblEl.rows[i].className =(curRow%2 == 0) ? odd : even;
            curRow++;
        }
      }
    }
}


//header is the 'header' class name.  It isn't the actual header, but a group header row. such as "groupheaderOpen" in main.css
function stripeTableConditional(tblEl,even,odd, header, cellIndex)
{
    if (typeof(tblEl) == "string") {
      tblEl = document.getElementById(tblEl);
    }
  
    if (tblEl) {
      if(!even) even = '';
      if(!odd) odd = '';
      var indexCount=0;
      var startOver=false;
      for (i = 0; i < tblEl.rows.length; i++) 
      {
        startOver=false;
        if (arguments.length > 4)
        {
            for (m=4;m<arguments.length;m++)
            {
                if ((tblEl.rows[i].cells[cellIndex].innerHTML.indexOf(arguments[m])!=-1) && (arguments[m]!=''))
                {
                    startOver=true;
                }
            }
        }

         if (startOver)
         {
            indexCount=1;
            tblEl.rows[i].className = header;
         }
         else
             tblEl.rows[i].className =(indexCount%2 == 0) ? odd : even;
         
         indexCount++;
      }
    }
}

//header is the 'header' class name.  It isn't the actual header, but a group header row. such as "groupheaderOpen" in main.css
//this looks at the row ID instead of text in a cell.
function stripeTableConditionalByRowID(tblEl,even,odd, header)
{
    if (typeof(tblEl) == "string") {
      tblEl = document.getElementById(tblEl);
    }
  
    if (tblEl) {
      if(!even) even = '';
      if(!odd) odd = '';
      var indexCount=0;
      var startOver=false;
      for (i = 0; i < tblEl.rows.length; i++) 
      {
        startOver=false;
        if (arguments.length > 3)
        {
            for (m=3;m<arguments.length;m++)
            {
                if ((tblEl.rows[i].id.indexOf(arguments[m])!=-1) && (arguments[m]!=''))
                {
                    startOver=true;
                }
            }
        }

         if (startOver)
         {
            indexCount=1;
            tblEl.rows[i].className = header;
         }
         else
             tblEl.rows[i].className =(indexCount%2 == 0) ? odd : even;
         
         indexCount++;
      }
    }
}

//-----------------------------------------------------------------------------
// Functions to get and compare values during a sort.
//-----------------------------------------------------------------------------

// This code is necessary for browsers that don't reflect the DOM constants
// (like IE).
if (document.ELEMENT_NODE == null) {
  document.ELEMENT_NODE = 1;
  document.TEXT_NODE = 3;
}

function getTextValue(el,sortType) {
  var ignoreCase = true;
  var i;
  var s;

  // Find and concatenate the values of all text nodes contained within the
  // element.
  s = "";
  for (i = 0; i < el.childNodes.length; i++)
  {
  
    if (el.childNodes[i].nodeType == document.TEXT_NODE)
    {
        var value = el.childNodes[i].nodeValue;
        if(sortType == "FRACTION")
        {
            value = normalizeString(value);
            var position = value.indexOf('/');
            if(position != -1)
            {
                var num = value.substr(0,position);
                var den = value.substr(position+1, value.lenght);
                if(den !=0)
                {
                    value = num / den;
                }
            }
        }
        // Comment 20434
        // Make sure we're dealing with a string in "value" variable
        if (ignoreCase && value.toLowerCase)
          s += value.toLowerCase();
        else
          s += value;
    }
    else if (el.childNodes[i].nodeType == document.ELEMENT_NODE &&
             el.childNodes[i].tagName == "BR")
      s += " ";
    else if (el.childNodes[i].nodeType == document.ELEMENT_NODE &&
             el.childNodes[i].tagName == "IMG" && sortType == "IMG")
    {        
        el1 = el.childNodes[i];
        for (j = 0; j < el1.attributes.length; j++)
        {
            if(el1.attributes[j].nodeName.toLowerCase() == 'alt')
            {
                return normalizeString(el1.attributes[j].nodeValue);
            }
        }           
        s += getTextValue(el.childNodes[i]);      
    }
    else
      // Use recursion to get text within sub-elements.
      s += getTextValue(el.childNodes[i]);
  }
  if(sortType == "DATE")
    return getDate(normalizeString(s));
  return normalizeString(s);
}

function compareValues(v1, v2) {

  var f1, f2;

  // If the values are numeric, convert them to floats.

  f1 = parseFloat(v1);
  f2 = parseFloat(v2);
  if (!isNaN(f1) && !isNaN(f2)) {
    v1 = f1;
    v2 = f2;
  }

  // Compare the two values.
  if (v1 == v2)
    return 0;
  if (v1 > v2)
    return 1
  return -1;
}

// Regular expressions for normalizing white space.
var whtSpEnds = new RegExp("^\\s*|\\s*$", "g");
var whtSpMult = new RegExp("\\s\\s+", "g");

function normalizeString(s) {

  s = s.replace(whtSpMult, " ");  // Collapse any multiple whites space.
  s = s.replace(whtSpEnds, "");   // Remove leading or trailing white space.

  return s;
}

function getDate(s) {
    var datetime = s.split(" ");
    var d = new Date(0);
    
    if(datetime[0])
    {
        var parts = datetime[0].split("/"); //us standard
        if (parts.length === 1) {
            parts = datetime[0].split("."); //global
            if (parts.length === 1)
                parts = datetime[0].split("-");
        }
            

	    if(parts[0])
	        d.setFullYear(parts[0]);
	    if(parts[2])
	        d.setDate(parts[2]);
	    if(parts[1])
	        d.setMonth(parts[1] - 1);
	}
	
	if(datetime[1])
	{
	    var ampm = (datetime[2] == 'PM')?1:0;

	    parts = datetime[1].split(":");
	    if(parts[0])
	    {
	        if(ampm==1)
	        {
	            h = parseInt(parts[0])+12;
	            d.setHours((h==24)?0:h);
	        }
	        else
	        {
	            d.setHours(parts[0]);
	        }
	    }
	    else d.setHours(0);
	    if(parts[1])
	        d.setMinutes(parts[1]);
	    else d.setMinutes(0);
	    if(parts[2])
	        d.setSeconds(parts[2]);
	    else d.setSeconds(0);
	}
	
	return d.valueOf();
}

//XL-8036 sorting indicator---
function SortTableColumn(id, col, rev, secondCol, sortType, even, odd, controllerTh) {
    var check = sortTable(id, col, rev, secondCol, sortType, even, odd);

    if (!check) {
        var tblEl = document.getElementById(id);
        var isAccending = !tblEl.reverseSort[col];
        
        if (isAccending) {
            $(controllerTh).removeClass("descendingColumnHeader");
            if (!$(controllerTh).hasClass("ascendingColumnHeader"))
                $(controllerTh).addClass("ascendingColumnHeader");
        } else {
            $(controllerTh).removeClass("ascendingColumnHeader");
            if (!$(controllerTh).hasClass("descendingColumnHeader"))
                $(controllerTh).addClass("descendingColumnHeader");
        }
        $(controllerTh).siblings(".ascendingColumnHeader, .descendingColumnHeader").removeClass("ascendingColumnHeader").removeClass("descendingColumnHeader");
        
    }
}

