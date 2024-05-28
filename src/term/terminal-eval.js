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
    if (terminalAddCommand === undefined) { //is terminalAddCommand not available?
      console.error("terminalAddCommand is missing!");
      return;
    }
    terminalAddCommand("eval", evalRun, evalHelp);
  };
  //init
  if (document.body) {
    initTerminalEvalCommand();
  } else {
    window.addEventListener("load", initTerminalEvalCommand);
  }
}
