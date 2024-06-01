/* Author: Ward Truyen
* Version: 1.0.0
* About:   Cookie data managing
*/

if (typeof terminalAddCommand === "function") {
  //getcookie
  WTerminal.WterminalAddCommand("getcookie", (term, argLine) => {
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
    return getCookie(...WTerminal.splitToArguments(argLine));
  });
  //setcookie
  WTerminal.terminalAddCommand("setcookie", (term, argLine) => {
    function setCookie(name, value = 1, days = 7) {
      let date = new Date();
      date.setDate(date.getDate() + days); // add x days to date
      document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; SameSite=strict; Secure";
    }
    return setCookie(...WTerminal.splitToArguments(argLine));
  });
  //removecookies
  WTerminal.terminalAddCommand("removecookies", function(term) {
    function removeCookie(name) {
      document.cookie = name + "=0; max-age=-1" + "; SameSite=strict; Secure";
    }
    if (document.cookie == '') {
      term.printError("No cookies found.");
      return;
    }
    const cookies = document.cookie.split(/; */);
    term.printLn("Cookies found: " + cookies.length);
    cookies.forEach(c => {
      const name = c.split('=')[0];
      term.printLn("removing: " + name);
      removeCookie(name);
    });
  });
  //cookies
  WTerminal.terminalAddCommand("cookies",
    function(term, argLine) {
      if (document.cookie === '') {
        if (!argLine.includes("-s")) term.printError("No cookies found.")
      } else {
        term.printList(document.cookie.split(/; */), false);
      }
    },
    function(term) {
      term.printLn("Usage:");
      term.printLn("  cookies        //Prints all cookies.");
      term.printLn("  cookies -s     //(silent)Prints only cookies, no error.");
    });
  //doCookiesWork
  WTerminal.terminalAddCommand("docookieswork", (term) => {
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
    term.printLn(itWorks);
    return itWorks;
  })
}
