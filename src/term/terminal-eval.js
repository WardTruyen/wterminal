/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the eval command to the terminal.
*/
{
  const initTerminalEvalCommand = function() {
    const help = function(term) {
      term.printLn("Uses the function eval(string) on the argLine");
    }
    const run = function(term, argLine) {
      try {
        const result = eval(argLine);
        term.printVar(result, '`' + argLine + '`');
        return result;
      } catch (error) {
        term.printError(`Eval error: \`${argLine}\` -> ${error.message}`);
      }
    };
    //add command
    if (terminalAddCommand === undefined) {
      console.error("terminalAddCommand is missing!");
      return;
    }
    terminalAddCommand("eval", run, help);
  };
  //init
  if (document.body) {
    initTerminalEvalCommand();
  } else {
    window.addEventListener("load", initTerminalEvalCommand);
  }
}
