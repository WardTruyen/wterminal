/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/
{
  const addExtention = function() {
    const help = function(term) {
      term.printLn("Installs a logger at setTimeout and setInterval.");
    }
    const run = function(term) {
      //capture setTimeout
      const oldSetTimeout = setTimeout;
      setTimeout = function() {
        const e = new Error('Just for stack trace');
        const result = oldSetTimeout.apply(this, arguments);
        if (term) term.printLn(`New timeout ${result} registered.\n from: ${e.stack}`);
        else console.log(`New timeout ${result} registered from: ${e.stack}`);
        return result;
      };
      //capture setInterval
      const oldSetInterval = setInterval;
      setInterval = function() {
        const e = new Error('Just for stack trace');
        const result = oldSetInterval.apply(this, arguments);
        if (term) term.printLn(`New interval ${result} registered.\n from: ${e.stack}`);
        else console.log(`New interval ${result} registered from: ${e.stack}`);
        return result;
      }
      term.printLn("activated");
    }
    
    if (WTerminal === undefined) { //is WTerminal not available?
      console.error("WTerminal is missing!");
      return;
    }
    WTerminal.terminalAddCommand("timerdebug", run, help);
  };
  //init
  if (document.body) {
    addExtention();
  } else {
    window.addEventListener("load", addExtention);
  }
}
