// http://qnimate.com/measuring-web-page-performance-using-modern-javascript-apis/
// High Resolution Time API(performance.now())
function myonload()
{
    if("performance" in window)
    {
        if("now" in window.performance || "mozNow" in window.performance || "msNow" in window.performance || "oNow" in window.performance || "webkitNow" in window.performance)
        {
//            document.getElementById("result").innerHTML = "Page Performance API supported";           
            var start_time = performance.now() || performance.mozNow() || performance.msNow() || performance.oNow() || performance.webkitNow();
             myRender();
            var end_time = performance.now() || performance.mozNow() || performance.msNow() || performance.oNow() || performance.webkitNow();
            document.getElementById("time_taken").innerHTML = "Time taken to render formul&aelig; : " + Math.round(end_time - start_time) +" ms <br />(using High Resolution Time API)";
        }
        else
        {
             document.getElementById("time_taken").innerHTML = "High Resolution Time API not supported";
        }
    }
    else
    {
        document.getElementById("time_taken").innerHTML = "Page Performance API not supported";
    }
}
