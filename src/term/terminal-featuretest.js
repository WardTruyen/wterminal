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
      terminalPrintLn("Feature test warning: Under construction, can have unexpected results, errors and crashes.");
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
    //add command
    if (terminalAddCommand === undefined) {
      console.error("AddExtention Error: TerminalAddCommand is missing!");
      return;
    }
    terminalAddCommand("featuretest", run, help);
    //add alias
    terminalAddAlias("ft", "featuretest");
  };
  //init
  if (document.body) {
    addExtention();
  } else {
    window.addEventListener("load", addExtention);
  }
}
