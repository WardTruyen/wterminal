/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/

{// this code block hides the variables below from other scripts.
  const initTerminalStressTestCommand = function() {
    const help = function(term) {
      term.printLn("Runs a stress test on the terminal.");
    };
    const run = function(term, argLine) {
      const testArgLine = function(str) {
        term.printVar(WTerminal.splitToArguments(str), '`' + argLine + '`.<b>splitToArguments()</b>');
      };
      if (argLine != '') testArgLine(argLine);
      term.terminalCommand("? && alias && const && option && date && time && uptime && starttime && echo OK", true);
      term.terminalCommand("? help && help alias && ? const && ? option && ? date && ? time && ? uptime", true);
      term.terminalCommand("thisterminal && gg", true);
      term.terminalCommand('gdb && result .2 && result .children.0 && result .innerHTML', true);
      term.terminalCommand('eval 10000+4*(1+4*10) + Math.PI', true);
      term.terminalCommand('dovar alert "finished stresstest"', true);
      // term.terminalCommand('dovar document.getElementById ' + TERMINAL_OUTPUT_ID + ' && result .innerHTML', true);

      return term.lastResult;
    };
    //add command
    if (WTerminal === undefined) {
      console.error("WTerminal is missing!");
      return;
    }
    WTerminal.terminalAddCommand("stresstest", run, help);
  };
  //init
  if (document.body) {
    initTerminalStressTestCommand();
  } else {
    window.addEventListener("load", initTerminalStressTestCommand);
  }
}
