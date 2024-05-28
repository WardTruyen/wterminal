/* Author:      Ward Truyen
* Version:     1.0.0
* About:       Cookie data managing
*/

const POST_COOKIE_DATA = "; SameSite=strict; Secure"; // add domain here?

function getCookie(name, defaultValue = undefined){
  if(name === null || name === undefined || typeof name != "string" || name == ''){
    console.log('error: cookie needs a name');
    return;
  }
  let pair = document.cookie.split(/; */).find((row) => row.startsWith(name + '='))
  //console.log("cookie pair: ", pair); 
  if(pair === undefined)
    return defaultValue;
  else
    return pair.split('=')[1];
}

function setCookie(name, value = 1,days = 7){
  let date = new Date();
  date.setDate(date.getDate() + days); // add x days to date
  document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + POST_COOKIE_DATA;
}

function removeCookie(name){
  document.cookie = name + "=0; max-age=-1" + POST_COOKIE_DATA;
}

function doCookiesWork(){
  const name = "testCookie";
  setCookie(name);
  let itWorks = getCookie(name) !== undefined;
  if( itWorks ){
    removeCookie(name);
  }
  return itWorks;
}

// removeCookie("test1");
// removeCookie("test2");
// removeCookie("test3");
//
// setCookie("test1");
// setCookie("test2");
// setCookie("test3");
