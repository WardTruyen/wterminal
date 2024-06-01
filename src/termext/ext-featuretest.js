/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/
{
  const help = function(term) {
    term.printLn("Runs a test (nothing).");
  }
  const run = function(term) {
    term.printLn("Feature test warning: Under construction, can have unexpected results, errors and crashes.");
    // todo: add test ... like throw errors and stuff

    // throw {name : "NotImplementedError", message : "too lazy to implement"};
    // throw new Error("too lazy to implement", "some name perhaps?");
    // class TerminalError extends Error{
    //   constructor(msg, name="TerminalError"){
    //     super(msg);
    //     this.name = name;
    //   }
    // }
    // throw new TerminalError("my message", "MyName");
    let num = 1;
    num.toPrecision(500);
  };

  const addExtention = function() {
    if (WTerminal === undefined) { //is WTerminal not available?
      console.error("AddExtention Error: WTerminal is missing!");
      return;
    }
    WTerminal.terminalAddCommand("featuretest", run, help);
    //add alias
    WTerminal.terminalAddAlias("ft", "featuretest");
  };
  //init
  if (document.body) {
    addExtention();
  } else {
    window.addEventListener("load", addExtention);
  }
}
