/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/
{
  const initTerminalEvalCommand = function() {
    const help = function() {
      terminalPrintLn("Uses the function eval(string) on the argLine");
    }
    const run = function(argLine) {
      //todo: test (local) variable grabbing == works
      try {
        const result = eval(argLine);
        terminalPrintVar(result, '`' + argLine + '`');
        return result;
      } catch (error) {
        terminalPrintVar(error, `<span style='color:red;'>Eval error: \`${argLine}\`</span>`);
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
