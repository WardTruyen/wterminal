/* Author: Ward Truyen
* Version: 1.0.0
* About:   This allows the terminal to transfer from add-on to page level, by using the extemtopm command 'transfer'.
* THIS SCRIPT ONLY WORKS FOR A BROWSER-ADDON/EXTENTION!
*/

{// this code block hides the variables below from other scripts.
  const TRANSFER_COMMAND_NAME = "transfer";
  const TRANSFER_SCRIPT_ID = "transfer-script";

  const initTerminalTransferCommand = function() {
    const help = function() {
      terminalPrintLn("Transfers all the terminal functions and variables, from the addon-scope to the document/page-scope");
    }
    const run = function() {
      terminalPrintLn("Transfer warning: Expect difficulties debugging errors.");

      try {
        //addon-terminal todo: try adding terminalPrint functions to the page!
        let scriptNode = document.getElementById(TRANSFER_SCRIPT_ID);
        if (scriptNode === null) {
          scriptNode = document.createElement("script");
          scriptNode.id = TRANSFER_SCRIPT_ID;
          document.body.append(scriptNode);
        }
        // terminalPrintVar(terminalPrintVar.toString(), "terminalPrintVar");
        let tempScript =
          `const TERMINAL_VERSION = "${TERMINAL_VERSION}"
//css & html element relations:
const TERMINAL_BACKGROUND_ID = "${TERMINAL_BACKGROUND_ID}";
const TERMINAL_CONTAINER_ID = "${TERMINAL_CONTAINER_ID}";
const TERMINAL_OUTPUT_ID = "${TERMINAL_OUTPUT_ID}";
const TERMINAL_FORM_ID = "${TERMINAL_FORM_ID}";
const TERMINAL_INPUT_ID = "${TERMINAL_INPUT_ID}";
const TERMINAL_BUTTON_DOWN_ID = "${TERMINAL_BUTTON_DOWN_ID}";
const TERMINAL_BUTTON_UP_ID = "${TERMINAL_BUTTON_UP_ID}";
const TERMINAL_BUTTON_CLOSE_ID = "${TERMINAL_BUTTON_CLOSE_ID}";
const TERMINAL_VISIBLE_CLASS = "${TERMINAL_VISIBLE_CLASS}";
//auto insert
const TERMINAL_AUTO_INSERT_HTML = ${TERMINAL_AUTO_INSERT_HTML};
const TERMINAL_AUTO_INSERT_CSS = ${TERMINAL_AUTO_INSERT_CSS};
const TERMINAL_CSS_LINK = "${TERMINAL_CSS_LINK}";
//open/close
const TERMINAL_KEY_OPEN = "${TERMINAL_KEY_OPEN}";
const TERMINAL_KEY_OPEN_CTRL = ${TERMINAL_KEY_OPEN_CTRL};
const TERMINAL_KEY_CLOSE = "${TERMINAL_KEY_CLOSE}";
const TERMINAL_KEY_HISTORY = "${TERMINAL_KEY_HISTORY}";
//output
const TERMINAL_PRINT_TO_CONSOLE_LOG = ${TERMINAL_PRINT_TO_CONSOLE_LOG};
//input
const TERMINAL_SLASH_COMMANDS = ${TERMINAL_SLASH_COMMANDS};
const TERMINAL_INPUT_STRICT = ${TERMINAL_INPUT_STRICT};
const TERMINAL_PRINT_ALIAS_CHANGE = ${TERMINAL_PRINT_ALIAS_CHANGE};
const TERMINAL_PRINT_INNER_COMMANDS = ${TERMINAL_PRINT_INNER_COMMANDS};
const TERMINAL_PRINT_COMMAND_RETURN = ${TERMINAL_PRINT_COMMAND_RETURN};
const TERMINAL_MAX_HISTORY = ${TERMINAL_MAX_HISTORY};
//command extentions
const TERMINAL_PRINT_EXTENTION_ADD = ${TERMINAL_PRINT_EXTENTION_ADD};
const TERMINAL_PRINT_ALIAS_ADD = ${TERMINAL_PRINT_ALIAS_ADD};
//global
const TERMINAL_GLOBAL_FUNCTIONS = ${TERMINAL_GLOBAL_FUNCTIONS};
const TERMINAL_GLOBAL_VARIABLES = ${TERMINAL_GLOBAL_VARIABLES};
const TERMINAL_GLOBAL_TEST_VARIABLES = ${TERMINAL_GLOBAL_TEST_VARIABLES};
//TPO aka terminalPrintObject const
const TPO_UNKNOWN_OBJECT_PRINT = ${TPO_UNKNOWN_OBJECT_PRINT};
const TPO_OBJECT_PREFIX = "${TPO_OBJECT_PREFIX}";
const TPO_SPECIAL_PREFIX = "${TPO_SPECIAL_PREFIX}";
const TPO_MAX_DEPTH = ${TPO_MAX_DEPTH};
const TPO_INNER_MAX_LENGTH = ${TPO_INNER_MAX_LENGTH};

const terminalOptions = ${JSON.stringify(terminalOptions)};
const terminalConst = ${terminalConst};

//#region output 
const terminalPrint = ${terminalPrint};
const terminalPrintLn = ${terminalPrintLn};
const terminalClear = ${terminalClear};
//#endregion
//#region extra-output
const terminalPrintTitle = ${terminalPrintTitle};
const terminalPrintError = ${terminalPrintError};
const terminalPrintList = ${terminalPrintList};
const terminalPrintVar = ${terminalPrintVar};
//#endregion

//#region input
const splitToArguements = ${splitToArguements};
const stringToValue = ${stringToValue};
const terminalGetGlobal = ${terminalGetGlobal};
const terminalAliases = ${JSON.stringify(terminalAliases)};
const terminalAliasesExt = ${JSON.stringify(terminalAliasesExt)};
const terminalAddAlias = ${terminalAddAlias};
const terminalCommandList = {};
const terminalCommandListExt = {};
const terminalAddCommand = ${terminalAddCommand};
const terminalCommand = ${terminalCommand};
const submitTerminalInput = ${submitTerminalInput};
const terminalRefocusInput = ${terminalRefocusInput};
const terminalClose = ${terminalClose};
const terminalOpen = ${terminalOpen};
const terminalOpenClose = ${terminalOpenClose};
const isTerminalOpen = ${isTerminalOpen};
//#endregion

//#region commandList, commandListExt transfer
`;
        //commandList
        for (let c of Object.keys(terminalCommandList)) {
          tempScript += `terminalCommandList.${c} = {};`;
          tempScript += `terminalCommandList.${c}.run = ${terminalCommandList[c].run};`
          if (typeof terminalCommandList[c].help === "function")
            tempScript += `terminalCommandList.${c}.help = ${terminalCommandList[c].help};`
        }
        tempScript += `Object.freeze(terminalCommandList);`;
        //commandListExt
        for (let c of Object.keys(terminalCommandListExt)) {
          if (c == TRANSFER_COMMAND_NAME) continue; // skip
          tempScript += `terminalCommandListExt.${c} = {};`;
          tempScript += `terminalCommandListExt.${c}.run = ${terminalCommandListExt[c].run};`
          if (typeof terminalCommandListExt[c].help === "function")
            tempScript += `terminalCommandListExt.${c}.help = ${terminalCommandListExt[c].help};`
        }

        tempScript +=
          `//#endregion

//#region init
//Globals
const createTerminalGlobal = ${createTerminalGlobal};
createTerminalGlobal();
//Locals
let terminalOutput;
let terminalInitDate;

//Init
const terminalInitialize = ${terminalInitialize};

//Relaunch
try{
  terminalInitialize();
  terminalOpen();
  terminalPrintLn("Terminal has been transfered.");
}catch(e){
  console.error(e);
}`;
        scriptNode.innerHTML = tempScript;

      } catch (e) {
        terminalPrintVar("Transfer error: ", e);
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
