/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the eval command to the terminal.
*/
{
  const evalHelp = function(term) {
    term.printLn("Uses the function eval(string) on the argLine");
  }
  const evalRun = function(term, argLine) {
    try {
      const result = eval(argLine);
      term.printVar(result, '`' + argLine + '`');
      return result;
    } catch (error) {
      term.printError(`Eval error: \`${argLine}\` -> ${error.message}`);
    }
  };
  
  const initTerminalEvalCommand = function() {
    if (WTerminal === undefined) { //is WTerminal not available?
      console.error("WTerminal is missing!");
      return;
    }
    WTerminal.terminalAddCommand("eval", evalRun, evalHelp);
  };
  //init
  if (document.body) {
    initTerminalEvalCommand();
  } else {
    window.addEventListener("load", initTerminalEvalCommand);
  }
}
