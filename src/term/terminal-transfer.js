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
      term.printLn("When, after transfer, the new (transfered) terminal does not open check the console,");
      term.printLn("if the error points to document.body.appendChild(scriptNode);, the generated script has a bug.");

      try {
        term.terminalClose();
        //addon-terminal todo: try adding terminalPrint functions to the page!
        let scriptNode = document.getElementById(TRANSFER_SCRIPT_ID);
        if (scriptNode === null) {
          scriptNode = document.createElement("script");
          scriptNode.id = TRANSFER_SCRIPT_ID;
          scriptNode.type = "text/javascript";
        } else{
          while (scriptNode.firstChild) {
            scriptNode.removeChild(scriptNode.lastChild);
          }
        }
 
        //create script
        let tempScript = `
console.log("loading ${TRANSFER_SCRIPT_ID}");
const TERMINAL_VERSION = "${TERMINAL_VERSION}";
const TERMINAL_CSS_LINK_URL = "${TERMINAL_CSS_LINK_URL}";
const TERMINAL_CSS_LINK_ID = "${TERMINAL_CSS_LINK_ID}";
const TERMINAL_BACKGROUND_CLASS = "${TERMINAL_BACKGROUND_CLASS}";
const TERMINAL_CONTAINER_CLASS = "${TERMINAL_CONTAINER_CLASS}";
const TERMINAL_OUTPUT_CLASS = "${TERMINAL_OUTPUT_CLASS}";
const TERMINAL_INPUT_CLASS = "${TERMINAL_INPUT_CLASS}";
const TERMINAL_VISIBLE_CLASS = "${TERMINAL_VISIBLE_CLASS}";
const TERMINAL_GLOBAL_LAST_RESULT = ${TERMINAL_GLOBAL_LAST_RESULT};
const TERMINAL_GLOBAL_LAST_ERROR = ${TERMINAL_GLOBAL_LAST_ERROR};
const TERMINAL_GLOBAL_HISTORY = ${TERMINAL_GLOBAL_HISTORY};
const TERMINAL_GLOBAL_TEST_VARIABLES = ${TERMINAL_GLOBAL_TEST_VARIABLES};
const TERMINAL_AUTO_INSERT_DROPDOWN = ${TERMINAL_AUTO_INSERT_DROPDOWN};
const TERMINAL_AUTO_INSERT_CSS = ${TERMINAL_AUTO_INSERT_CSS};
const TERMINAL_PRINT_LOGO = ${TERMINAL_PRINT_LOGO};
const TERMINAL_KEY_OPEN = "${TERMINAL_KEY_OPEN}";
const TERMINAL_KEY_OPEN_CTRL = ${TERMINAL_KEY_OPEN_CTRL};
const TERMINAL_KEY_CLOSE = "${TERMINAL_KEY_CLOSE}";
const TERMINAL_KEY_HISTORY = "${TERMINAL_KEY_HISTORY}";
const TERMINAL_PRINT_TO_CONSOLE_LOG = ${TERMINAL_PRINT_TO_CONSOLE_LOG};
const TERMINAL_SLASH_COMMANDS = ${TERMINAL_SLASH_COMMANDS};
const TERMINAL_INPUT_STRICT = ${TERMINAL_INPUT_STRICT};
const TERMINAL_PRINT_ALIAS_CHANGE = ${TERMINAL_PRINT_ALIAS_CHANGE};
const TERMINAL_PRINT_INNER_COMMANDS = ${TERMINAL_PRINT_INNER_COMMANDS};
const TERMINAL_PRINT_COMMAND_RETURN = ${TERMINAL_PRINT_COMMAND_RETURN};
const TERMINAL_MAX_HISTORY = ${TERMINAL_MAX_HISTORY};
const TERMINAL_PRINT_ALIAS_ADD = ${TERMINAL_PRINT_ALIAS_ADD};
const TERMINAL_PRINT_EXTENSION_ADD = ${TERMINAL_PRINT_EXTENSION_ADD};
const TPO_UNKNOWN_OBJECT_PRINT = ${TPO_UNKNOWN_OBJECT_PRINT};
const TPO_OBJECT_PREFIX = "${TPO_OBJECT_PREFIX}";
const TPO_SPECIAL_PREFIX = "${TPO_SPECIAL_PREFIX}";
const TPO_MAX_DEPTH = ${TPO_MAX_DEPTH};
const TPO_INNER_MAX_LENGTH = ${TPO_INNER_MAX_LENGTH};
`;
        tempScript += `
createElement = ${createElement};
splitToArguments = ${splitToArguments};
stringToValue = ${stringToValue};
terminalGetGlobal = ${terminalGetGlobal};
createTerminalGlobal = ${createTerminalGlobal};
createTerminalGlobal();
instalDropdownTerminal = ${instalDropdownTerminal};
terminalAddCommand = ${terminalAddCommand};
terminalAddAlias = ${terminalAddAlias};
terminalPrint = ${terminalPrint};
terminalPrintLn = ${terminalPrintLn};
getTerminal = ${getTerminal};
`;
        tempScript += `
${WTerminal};
`;
        tempScript += `
//Relaunch
function relaunchTerminal(){
  try{
    let terminal = new WTerminal("dropdown", null, null);
    terminal.terminalOpen();
    terminal.printLn("This Terminal was transfered.");
    terminal.commandListExtension = {`;
        for(let el in term.commandListExtension){
          if(el == "transfer") continue;
          tempScript += `${el}: { run: ${term.commandListExtension[el].run}, help: ${term.commandListExtension[el].help} },`
        }
        tempScript += `
    };
    terminal.aliasExtensionList = ${JSON.stringify(term.aliasExtensionList)};
    terminal.inputTextEl.focus();
  } catch(e){
    console.log("failed to transfer terminal");
    console.error(e);
  }
};
relaunchTerminal();
`;
        /* tempScript = `console.log("ik werk wel!");`;*/
        scriptNode.appendChild(document.createTextNode(tempScript));
        // scriptNode.innerHTML = tempScript;
        if(document.getElementById(TRANSFER_SCRIPT_ID) === null){
          document.body.appendChild(scriptNode);
        }
        term.printLn("transfer done");
      } catch (e) {
        term.printVar("Transfer error: ", e);
        return e;
      }
    };

    terminalAddCommand(TRANSFER_COMMAND_NAME, run, help);
  };

  if (document.body) {
    initTerminalTransferCommand();
  } else {
    window.addEventListener("load", initTerminalTransferCommand);
  }
}
