/* Author:  Ward Truyen
* Version:  1.1.0
* Requires: cookie.js
* About:    Darkmode button sample
*/

//Settings:
const DARKMODE_BUTTON_ID = "btnDarkmode";
const DARKMODE_CSS_CLASS = "dark-mode";
const DARKMODE_KEY = "darkmode";

//#region init
window.addEventListener("load", function () {
  if( !doCookiesWork() ){
    console.log("Darkmode Warning: Cookies not working!");
    terminalPrintError( "Darkmode Warning: Cookies not working!" );
    return;
  }
  const res = getCookie(DARKMODE_KEY, false); // localStorage.getItem(DARKMODE_KEY);
  let isDarkmodeOn = (String(res).toLowerCase() === 'true');// make sure it is a boolean
  if( isDarkmodeOn ){
    document.getElementsByTagName("html")[0].classList.add(DARKMODE_CSS_CLASS);
  }
} );
//#endregion

function btn_darkmode_switch(){
  let isDarkmodeOn;
  if(doCookiesWork()){
    const res = getCookie(DARKMODE_KEY); // localStorage.getItem(DARKMODE_KEY);
    if(res === undefined){
      isDarkmodeOn = document.getElementsByTagName("html")[0].classList.contains(DARKMODE_CSS_CLASS);
    }else{
      isDarkmodeOn = (String(res).toLowerCase() === 'true');// make sure it is a boolean
    }
    isDarkmodeOn = !isDarkmodeOn;
    setCookie(DARKMODE_KEY, isDarkmodeOn); //localStorage.setItem(DARKMODE_KEY, isDarkmodeOn.toString())
  }else{
    isDarkmodeOn = !document.getElementsByTagName("html")[0].classList.contains(DARKMODE_CSS_CLASS);
  }
  if( isDarkmodeOn ){
    document.getElementsByTagName("html")[0].classList.add(DARKMODE_CSS_CLASS);
  }else{
    document.getElementsByTagName("html")[0].classList.remove(DARKMODE_CSS_CLASS);
  }

  const btn = document.getElementById(DARKMODE_BUTTON_ID);//# set focus to input field
  if( btn === null) return;
  if( isDarkmodeOn ){
    btn.innerHTML = "light mode"; // sun
  }else{
    btn.innerHTML = "dark mode"; // moon
  }
}
terminalAddCommand("darkmode", btn_darkmode_switch);

/*  About: this removes the style attribute(s) that might be added by 
  * the "inver colors" button/feature whitch breaks the use of the darkmode-css-class
  */
// function btn_clearTerminalStyle(){
//   if(terminal.style.length > 0){
//     terminalPrintLn("Removing terminal style");
//     terminal.style = "";
//   }else{
//     terminalError("No style found to remove. Use \"invert colors\" first.")
//   }
// }
