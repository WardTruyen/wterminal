/* Author: Ward Truyen
* Version: 1.0.0
* About:   Cookie data managing
*/

if (typeof terminalAddCommand === "function") {
  //getcookie
  terminalAddCommand("getcookie", (argLine) => {
    function getCookie(name, defaultValue = undefined) {
      if (name === null || name === undefined || typeof name != "string" || name == '') {
        console.log('error: cookie needs a name');
        return;
      }
      let pair = document.cookie.split(/; */).find((row) => row.startsWith(name + '='))
      //console.log("cookie pair: ", pair); 
      if (pair === undefined)
        return defaultValue;
      else
        return pair.split('=')[1];
    }
    return getCookie(...splitToArguements(argLine));
  });
  //setcookie
  terminalAddCommand("setcookie", (argLine) => {
    function setCookie(name, value = 1, days = 7) {
      let date = new Date();
      date.setDate(date.getDate() + days); // add x days to date
      document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; SameSite=strict; Secure";
    }
    return setCookie(...splitToArguements(argLine));
  });
  //removecookies
  terminalAddCommand("removecookies", function() {
    function removeCookie(name) {
      document.cookie = name + "=0; max-age=-1" + "; SameSite=strict; Secure";
    }
    if (document.cookie == '') {
      terminalPrintError("No cookies found.");
      return;
    }
    const cookies = document.cookie.split(/; */);
    terminalPrintLn("Cookies found: " + cookies.length);
    cookies.forEach(c => {
      const name = c.split('=')[0];
      terminalPrintLn("removing: " + name);
      removeCookie(name);
    });
  });
  //cookies
  terminalAddCommand("cookies",
    function(argLine) {
      if (document.cookie === '') {
        if (!argLine.includes("-s")) terminalPrintError("No cookies found.")
      } else {
        terminalPrintList(document.cookie.split(/; */), false);
      }
    },
    function() {
      terminalPrintLn("Usage:");
      terminalPrintLn("  cookies        //Prints all cookies.");
      terminalPrintLn("  cookies -s     //(silent)Prints only cookies, no error.");
    });
  //doCookiesWork
  terminalAddCommand("docookieswork", () => {
    function getCookie(name, defaultValue = undefined) {
      if (name === null || name === undefined || typeof name != "string" || name == '') {
        console.log('error: cookie needs a name');
        return;
      }
      let pair = document.cookie.split(/; */).find((row) => row.startsWith(name + '='))
      //console.log("cookie pair: ", pair); 
      if (pair === undefined)
        return defaultValue;
      else
        return pair.split('=')[1];
    }
    function setCookie(name, value = 1, days = 7) {
      let date = new Date();
      date.setDate(date.getDate() + days); // add x days to date
      document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; SameSite=strict; Secure";
    }
    function removeCookie(name) {
      document.cookie = name + "=0; max-age=-1" + "; SameSite=strict; Secure";
    }
    const name = "testCookie";
    setCookie(name);
    let itWorks = getCookie(name) !== undefined;
    if (itWorks) {
      removeCookie(name);
    }
    terminalPrintLn(itWorks);
    return itWorks;
  })
}
