/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/

{// this code block hides the variables below from other scripts.
  const initTerminalStressTestCommand = function() {
    const help = function() {
      terminalPrintLn("Runs a stress test on the terminal.");
    };
    const run = function(argLine) {
      const testArgLine = function(str) {
        terminalPrintVar(splitToArguements(str), '`' + argLine + '`.<b>splitToArguements()</b>');
      };
      if (argLine != '') testArgLine(argLine);
      terminalCommand("? && alias && const && gg", true);
      terminalCommand('gdb && gresult .2 && gresult .children.0 && result .children.0.innerHTML', true);
      terminalCommand('dovar document.getElementById ' + TERMINAL_OUTPUT_ID + ' && result .innerHTML', true);

      if (terminal === undefined) return;
      return terminal.lastResult;
    };
    //add command
    if (terminalAddCommand === undefined) {
      console.error("terminalAddCommand is missing!");
      return;
    }
    terminalAddCommand("stresstest", run, help);
  };
  //init
  if (document.body) {
    initTerminalStressTestCommand();
  } else {
    window.addEventListener("load", initTerminalStressTestCommand);
  }
}
