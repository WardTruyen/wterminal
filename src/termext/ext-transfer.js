/* Author: Ward Truyen
* Version: 1.0.0
* About:   This allows the terminal to transfer from add-on to page level, by using the extemtopm command 'transfer'.
* THIS SCRIPT ONLY WORKS FOR A BROWSER-ADDON/EXTENTION!
*/

{// this code block hides the variables below from other scripts.
  const TRANSFER_COMMAND_NAME = "transfer";
  const TRANSFER_SCRIPT_ID = "terminal-transfer-script";

  const initTerminalTransferCommand = function() {
    const help = function(term) {
      term.printLn("Transfers all the terminal functions and variables, from the addon-scope to the document/page-scope");
    }
    const run = function(term) {
      term.printLn("Transfer warning: Expect difficulties debugging errors.");
      term.print("When, after transfer, the new (transfered) terminal does not open check the console,");
      term.printLn("if the error points to document.body.appendChild(scriptNode); then the generated script has a bug."); //generated script == tempScript

      try {
        //addon-terminal todo: try adding terminalPrint functions to the page!
        let scriptNode = document.getElementById(TRANSFER_SCRIPT_ID);
        if (scriptNode === null) {
          scriptNode = document.createElement("script");
          scriptNode.id = TRANSFER_SCRIPT_ID;
          scriptNode.type = "text/javascript";
        } else {
          while (scriptNode.firstChild) {
            scriptNode.removeChild(scriptNode.lastChild);
          }
        }

        //create script
        let tempScript = `{
console.log("loading ${TRANSFER_SCRIPT_ID}");
`;
        tempScript += `
${WTerminal};
`;
        tempScript += `
//Relaunch
const relaunchWTerminal = function(){
  try{
    let terminal = new WTerminal("dropdown", null, null);
    terminal.terminalOpen();
    terminal.printLn("This Terminal was transfered.");
    terminal.commandListExtension = {`;
        for (let el in term.commandListExtension) {
          if (el == "transfer") continue;
          tempScript += `${el}: { run: ${term.commandListExtension[el].run}, help: ${term.commandListExtension[el].help} },`
        }
        tempScript += `
    };
    terminal.aliasExtensionList = ${JSON.stringify(term.aliasExtensionList)};
    terminal.printLn("Extentions transfered.");
    terminal.printLn("Press '"+terminal.options.keyOpen + ((!terminal.options.keyOpenCtrl)?'" + CTRL':'"')+" to open the other terminal.");
  } catch(e){
    console.log("failed to transfer terminal");
    console.error(e);
  }
};
relaunchWTerminal();
}`;
        /* tempScript = `console.log("ik werk wel!");`;*/
        scriptNode.appendChild(document.createTextNode(tempScript));
        // scriptNode.innerHTML = tempScript;
        if (document.getElementById(TRANSFER_SCRIPT_ID) === null) {
          document.body.appendChild(scriptNode);
        }
        term.printLn("Transfer done");
        term.options.keyOpenCtrl = !term.options.keyOpenCtrl;
        term.printLn(`Press '${term.options.keyOpen + ((!term.options.keyOpenCtrl) ? '" + CTRL' : '"')} to open the other terminal.`);
        term.terminalClose();
      } catch (e) {
        term.printVar("Transfer error: ", e);
        return e;
      }
    };

    WTerminal.terminalAddCommand(TRANSFER_COMMAND_NAME, run, help);
  };

  if (document.body) {
    initTerminalTransferCommand();
  } else {
    window.addEventListener("load", initTerminalTransferCommand);
  }
}
