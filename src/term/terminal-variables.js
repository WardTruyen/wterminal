/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/

{// this code block hides the variables below from other scripts.
  const initTerminalVariableCommands = function() {
    const ext =
    {
      dovar: {
        run: function(argLine) {
          function _doFunction(gVar, functionKey, args) {
            if (typeof gVar === "object" && typeof gVar[functionKey] === "function") {
              // terminalPrintVar(args, "do args");
              return gVar[functionKey](...args);
            } else {
              terminalPrintError("Do error: " + functionKey + " is not a function");
            }
          };
          /* To run a function of a Class (like document.getElementById(..))
          *  We need the parent- /class-object from witch we call it from, to prevent errors (illegal acces) 
          *  todo: ? --> use apply https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
          */
          if (globalThis === undefined) {
            terminalPrintError("Do error: Missing globalThis");
          } else if (argLine == '') {
            terminalPrintError("Do error: No name");
          } else {
            let args = splitToArguments(argLine);
            const verbal = args.includes("-v");
            if (verbal) {
              args = args.filter(e => e !== '-v');
            }
            const gName = args.shift(); //full global function name
            args.forEach(e => e = stringToValue(e));
            let pName = gName.split('.'); //last object's parent name
            let result;
            if (pName.length == 1) {
              result = _doFunction(globalThis, gName, args)
            } else {
              const lastName = pName.pop(); //last object name
              result = _doFunction(terminalGetGlobal(pName.join('.')), lastName, args);
            }
            if (verbal) terminalPrintVar(result, gName + "(" + args.join(' ') + ")");
            return result;
          }
        },
        help: function() {
          terminalPrintLn("Runs given global function with arguments, and returns result.");
          terminalPrintLn("<b>Usage:</b>");
          terminalPrintLn("dovar FUNCTION_NAME [ArgumentS]                 //Runs function FUNCTION_NAME with optional ArgumentS");
          terminalPrintLn("dovar -v FUNCTION_NAME [ArgumentS]              //Same as above but prints result too.");
          terminalPrintLn("<b>Samples:</b>");
          terminalPrintLn("dovar window.open https://developer.mozilla.org  //Runs function window.open() with the url as argument");
          terminalPrintLn("dovar -v document.getElementById terminal-up     //Runs function document.getElementById with terminal-up as argument")
          terminalPrintLn("dovar document.body.remove                       //Warning: removes all page content");
        }
      },
      getvar: {
        run: function(argLine) {
          if (globalThis === undefined) {
            terminalPrintError("Getvar error: Missing globalThis");
          } else if (argLine == '') {
            terminalPrintError("Getvar error: Missing argument: VARIABLE_NAME");
          } else {
            let result = {};
            const args = splitToArguments(argLine);
            for (const gName of args) {
              result[gName] = terminalGetGlobal(gName);
            }
            const keys = Object.keys(result);
            if (keys.length == 1) {
              return result[keys[0]];
            } else {
              return result;
            }
          }
        },
        help: function() {
          terminalPrintLn("Gets a global variable and returns it.");
          terminalPrintLn("The returned result will be found in terminal.lastResult")
          terminalPrintLn("<b>Usage:</b>");
          terminalPrintLn("getvar VARIABLE_NAME");
          terminalPrintLn("<b>Samples:</b>");
          terminalPrintLn("getvar terminal                  //Returns terminal");
          terminalPrintLn("getvar terminal.version          //Returns terminal.version");
          terminalPrintLn("getvar var1 var2 var3            //Returns an object with var1 var2 and var3 keys and their global found value.");
          terminalPrintLn("getvar document                  //Returns global document object.");
          terminalPrintLn("getvar document.body.children    //Returns a list of the children in the body.");
          terminalPrintLn("getvar document.head.children    //Returns a list of the children in the head.");
        }
      },
      globals: {
        run: function() {
          if (globalThis !== undefined) {
            terminalPrintVar(globalThis, "globalThis");
          } else if (self !== undefined) {
            terminalPrintVar(self, "self");
          } else if (global !== undefined) {
            terminalPrintVar(global, "global");
          } else {
            terminalPrintError("Globals error: No globals!?");
          }
          if (document !== undefined && globalThis.document !== document) terminalPrintVar(document, "document");
        },
        help: function() {
          terminalPrintLn("Prints all global variables.");
        }
      },
      logvar: {
        run: function(argLine) {
          if (globalThis === undefined) {
            terminalPrintError("LogVar error: Missing globalThis");
          } else if (argLine == '') {
            terminalPrintError("LogVar error: Missing argument: VARIABLE_NAME");
          } else {
            let result = {};
            let args = splitToArguments(argLine);
            const returnResult = args.includes("-r");
            if (returnResult) {
              args = args.filter(e => e !== '-r');
            }
            for (const gName of args) {
              result[gName] = terminalGetGlobal(gName);
            }
            if (Object.keys(result).length == 1) {
              result = result[Object.keys(result)[0]];
            }
            // terminalPrintVar(result);
            console.log(result);
            if (returnResult) return result;
          }
        },
        help: function() {
          terminalPrintLn("Like printvar but Logs variable(s) to console.");
        }
      },
      printvar: {
        run: function(argLine) {
          if (globalThis === undefined) {
            terminalPrintError("PrintVar error: Missing globalThis");
          } else if (argLine == '') {
            terminalPrintError("PrintVar error: Missing argument: VARIABLE_NAME");
          } else {
            let result = {};
            let args = splitToArguments(argLine);
            const returnResult = args.includes("-r");
            if (returnResult) {
              args = args.filter(e => e !== '-r');
            }
            for (const gName of args) {
              result[gName] = terminalGetGlobal(gName);
            }
            const keys = Object.keys(result);
            if (keys.length == 1) {
              result = result[keys[0]];
              terminalPrintVar(result, keys[0]);
            } else {
              terminalPrintVar(result);
            }
            if (returnResult) return result;
          }
        },
        help: function() {
          terminalPrintLn("Prints value of global variable.");
          terminalPrintLn("<b>Usage:</b>");
          terminalPrintLn("printvar VARIABLE_NAME           //Prints variable, returns nothing.");
          terminalPrintLn("printvar -r VARIABLE_NAME        //Prints variable, returns variable.");
          terminalPrintLn("<b>Samples:</b>");
          terminalPrintLn("printvar terminal                //Prints terminal");
          terminalPrintLn("printvar terminal.version        //Prints terminal.version");
          terminalPrintLn("printvar -r terminal.lastResult  //Prints terminal.lastResult and returns it.");
          terminalPrintLn("printvar document                //Prints global document object.");
          terminalPrintLn("printvar document.body.children  //Prints body elements.");
          terminalPrintLn("printvar document.head.children  //Prints head elements.");
        }
      },
      removevar: {
        run: function(argLine) {
          if (globalThis === undefined) {
            terminalPrintError("RemoveVar error: Missing globalThis");
          } else if (argLine == '') {
            terminalPrintError("RemoveVar error: Missing arguments");
          } else {
            let args = splitToArguments(argLine);
            const keys = Object.keys(globalThis);
            const verbal = args.includes("-v");
            if (verbal) {
              args = args.filter(e => e !== '-v');
            }
            let count = 0;
            if (args.includes("-a")) {
              count = keys.length;
              keys.forEach(key => {
                if (verbal) terminalPrintLn("removing: " + key)
                delete globalThis[key];
              });
              terminalPrintLn("Removed " + count + " keys.")
              return;
            } else if (args.includes("-n")) {
              args = args.filter(e => e !== '-n');
              keys.forEach(key => {
                if (globalThis[key] === null || globalThis[key] === undefined) {
                  if (verbal) terminalPrintLn("removing: " + key)
                  delete globalThis[key];
                  count++;
                }
              });
            } else if (args.includes("-f")) {
              args = args.filter(e => e !== '-f');
              keys.forEach(key => {
                if (globalThis[key] !== globalThis &&
                  !(typeof globalThis[key] === "function" && globalThis[key].toString().includes("[native code]"))) {
                  if (verbal) terminalPrintLn("removing: " + key)
                  delete globalThis[key];
                  count++;
                }
              });
            }
            while (args.length > 0) {
              const gName = args.shift(); //full global function name
              const pName = gName.split('.'); //last object's parent name
              const lastName = pName.pop(); //last object name
              let obj = globalThis;
              if (pName.length > 0) {
                obj = terminalGetGlobal(pName.join('.')); //parent object
              }
              if (obj !== undefined && obj[lastName] !== undefined) {
                if (verbal) terminalPrintLn("removing: " + gName)
                delete obj[lastName];
                count++;
              } else {
                if (obj === undefined) {
                  terminalPrintError("Variable " + pName.join(".") + " = undefined")
                } else {
                  terminalPrintError("Variable " + gName + " = undefined");
                }
              }
            }
            terminalPrintLn("Removed " + (count > 1 ? (count + " keys.") : (count === 0 ? "nothing" : "1 key")));
          }
        },
        help: function() {
          terminalPrintLn("Removes global variables.");
          terminalPrintLn("<b>Usage:</b>");
          terminalPrintLn("removevar -v ...            //Prints removing VARIABLE_NAME.");
          terminalPrintLn("removevar -f                //Removes all global variables that are not a parent redefinition or native function.");
          terminalPrintLn("removevar -n                //Removes all null or undefined global variables.");
          terminalPrintLn("removevar -a                //Removes ALL global variables.");
          terminalPrintLn("removevar VARIABLE_NAMES    //Removes the global variables provided.")
          terminalPrintLn("<b>Samples:</b>");
          terminalPrintLn("removevar terminal          //Removes the global variable terminal.");
          terminalPrintLn("removevar var1 var2         //Removes the 2 global variables var1 and var2.");
          terminalPrintLn("removevar terminal.history  //Removes history from terminal.");
          terminalPrintLn("removevar -n terminal.history  //Removes history from terminal, and all null or undefined global variables.");
          terminalPrintLn("removevar -n -v             //Prints variable names of all null or undefined global variables it removes.");
        }
      },
      setvar: {
        run: function(argLine) {
          if (globalThis === undefined) {
            terminalPrintError("Setvar error: Missing globalThis");
          } else {
            if (argLine == '') {
              terminalPrintError("Setvar error: no name");
            } else {
              let args = splitToArguments(argLine);
              for (const element of args) {
                const keyValuePair = element.split("=");
                const names = keyValuePair[0].split(".");
                const value = stringToValue(keyValuePair[1]);
                if (names.length == 1) {
                  globalThis[names[0]] = value;
                  terminalPrintVar(globalThis[names[0]], keyValuePair[0]);
                } else {
                  let obj = globalThis;
                  for (let i = 0; i < names.length - 1; i++) {
                    if (typeof obj[names[i]] === "object") obj = obj[names[i]];
                    else {
                      let rem = names.length - 1 - i;
                      names.splice(names.length - rem, rem);
                      let name = names.join('.');
                      terminalPrint('<span style="color:red;">Variable is not an object: </span>');
                      terminalPrintVar(obj[names[i]], name);
                      return;
                    };
                  }
                  obj[names[names.length - 1]] = value;
                  return obj[names[names.length - 1]];
                }
              }
            }
          }
        },
        help: function() {
          terminalPrintLn("<b>Usage:</b>");
          terminalPrintLn("setvar NAME=VALUE                                //Sets VALUE to a global variable, NAME, and returns it.");
          terminalPrintLn("<b>Samples:</b>");
          terminalPrintLn("setvar terminal                                  //Sets terminal to undefined");
          terminalPrintLn("setvar terminal.version=prehistoric              //Sets terminal.version to string `prehistoric`");
          terminalPrintLn("setvar myNumber=8                                //Sets myNumber to number 8");
          terminalPrintLn("setvar myNumber=(number)-8.1                     //Sets myNumber to number -8.1");
          terminalPrintLn("setvar var1 var2 var3                            //Creates 3 undefined variables");
          terminalPrintLn("setvar myName=\"Ward Truyen\"                      //Sets myName to string");
          terminalPrintLn('setvar obj={"1":"test","2":true}                 //Sets obj to JSON.stringified object');
          terminalPrintLn("setvar myFunc=(function)terminalPrintLn(\"Hello\") //Creates a function");
          terminalPrintLn("setvar myVar=(global)terminal.history            //Sets(binds) myVar to the contents of terminal.history");
        }
      },
    };
    const aliases = {
      db: "printvar -r document.body.children",
      dh: "printvar -r document.head.children",
      run: "dovar",
      pdo: "dovar -v ",
      g: "getvar",
      gg: "globals",
      gdb: "getvar document.body.children ",
      gdh: "getvar document.head.children ",
      gterminal: "getvar terminal",
      glast: "getvar terminal.lastResult",
      gresult: "getvar terminal.lastResult",
      ghistory: "getvar terminal.history",
      result: "printvar -r terminal.lastResult",
      last: "printvar -r terminal.lastResult",
      pv: "printvar -r ",
      terminal: "printvar -r terminal",
      history: "printvar terminal.history",
    };

    //add commands in ext
    if (terminalAddCommand === undefined) {
      console.error("terminalAddCommand is missing!");
      return;
    }
    for (let c of Object.keys(ext)) {
      terminalAddCommand(c, ext[c].run, ext[c].help);
    }
    //add aliases
    for (let c of Object.keys(aliases)) {
      terminalAddAlias(c, aliases[c]);
    }
  };
  //init
  if (document.body) {
    initTerminalVariableCommands();
  } else {
    window.addEventListener("load", initTerminalVariableCommands);
  }
}
