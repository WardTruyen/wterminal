/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/
{
  const addExtention = function() {
    const help = function() {
      terminalPrintLn("Runs a test (nothing).");
    }
    const run = function() {
      //capture setTimeout
      const oldSetTimeout = globalThis.setTimeout;
      globalThis.setTimeout = function() {
        const e = new Error('Just for stack trace');
        const result = oldSetTimeout.apply(this, arguments);
        if (terminalPrintLn && terminalOutput) terminalPrintLn(`New timeout ${result} registered from: ${e.stack}`);
        else console.log(`New timeout ${result} registered from: ${e.stack}`);
        return result;
      };
      //capture setInterval
      const oldSetInterval = globalThis.setInterval;
      globalThis.setInterval = function() {
        const e = new Error('Just for stack trace');
        const result = oldSetInterval.apply(this, arguments);
        if (terminalPrintLn && terminalOutput) terminalPrintLn(`New interval ${result} registered from: ${e.stack}`);
        else console.log(`New interval ${result} registered from: ${e.stack}`);
        return result;
      }
      terminalPrintLn("activated");
    }
    terminalAddCommand("timerdebug", run, help);
    //add alias
    // terminalAddAlias("x", "y");
  };
  //init
  if (document.body) {
    addExtention();
  } else {
    window.addEventListener("load", addExtention);
  }
}
