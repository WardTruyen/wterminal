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
        run: function(term, argLine) {
          function _doFunction(gVar, functionKey, args) {
            if (typeof gVar === "object" && typeof gVar[functionKey] === "function") {
              // term.printVar(args, "do args");
              return gVar[functionKey](...args);
            } else {
              term.printError("Do error: " + functionKey + " is not a function");
            }
          };
          /* To run a function of a Class (like document.getElementById(..))
          *  We need the parent- /class-object from witch we call it from, to prevent errors (illegal acces) 
          *  todo: ? --> use apply https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
          */
          if (globalThis === undefined) {
            term.printError("Do error: Missing globalThis");
          } else if (argLine == '') {
            term.printError("Do error: No name");
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
            if (verbal) term.printVar(result, gName + "(" + args.join(' ') + ")");
            return result;
          }
        },
        help: function(term) {
          term.printLn("Runs given global function with arguments, and returns result.");
          term.printLn("<b>Usage:</b>");
          term.printLn("dovar FUNCTION_NAME [ArgumentS]                 //Runs function FUNCTION_NAME with optional ArgumentS");
          term.printLn("dovar -v FUNCTION_NAME [ArgumentS]              //Same as above but prints result too.");
          term.printLn("<b>Samples:</b>");
          term.printLn("dovar window.open https://developer.mozilla.org  //Runs function window.open() with the url as argument");
          term.printLn("dovar -v document.getElementById terminal-up     //Runs function document.getElementById with terminal-up as argument")
          term.printLn("dovar document.body.remove                       //Warning: removes all page content");
        }
      },
      getvar: {
        run: function(term, argLine) {
          if (globalThis === undefined) {
            term.printError("Getvar error: Missing globalThis");
          } else if (argLine == '') {
            term.printError("Getvar error: Missing argument: VARIABLE_NAME");
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
        help: function(term) {
          term.printLn("Gets a global variable and returns it.");
          term.printLn("The returned result will be found in terminal.lastResult")
          term.printLn("<b>Usage:</b>");
          term.printLn("getvar VARIABLE_NAME");
          term.printLn("<b>Samples:</b>");
          term.printLn("getvar terminal                  //Returns terminal");
          term.printLn("getvar terminal.version          //Returns terminal.version");
          term.printLn("getvar var1 var2 var3            //Returns an object with var1 var2 and var3 keys and their global found value.");
          term.printLn("getvar document                  //Returns global document object.");
          term.printLn("getvar document.body.children    //Returns a list of the children in the body.");
          term.printLn("getvar document.head.children    //Returns a list of the children in the head.");
        }
      },
      globals: {
        run: function(term) {
          if (globalThis !== undefined) {
            term.printVar(globalThis, "globalThis");
          } else if (self !== undefined) {
            term.printVar(self, "self");
          } else if (global !== undefined) {
            term.printVar(global, "global");
          } else {
            term.printError("Globals error: No globals!?");
          }
          if (document !== undefined && globalThis.document !== document) term.printVar(document, "document");
        },
        help: function(term) {
          term.printLn("Prints all global variables.");
        }
      },
      logvar: {
        run: function(term, argLine) {
          if (globalThis === undefined) {
            term.printError("LogVar error: Missing globalThis");
          } else if (argLine == '') {
            term.printError("LogVar error: Missing argument: VARIABLE_NAME");
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
            // term.printVar(result);
            console.log(result);
            if (returnResult) return result;
          }
        },
        help: function(term) {
          term.printLn("Like printvar but Logs variable(s) to console.");
        }
      },
      printvar: {
        run: function(term, argLine) {
          if (globalThis === undefined) {
            term.printError("PrintVar error: Missing globalThis");
          } else if (argLine == '') {
            term.printError("PrintVar error: Missing argument: VARIABLE_NAME");
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
              term.printVar(result, keys[0]);
            } else {
              term.printVar(result);
            }
            if (returnResult) return result;
          }
        },
        help: function(term) {
          term.printLn("Prints value of global variable.");
          term.printLn("<b>Usage:</b>");
          term.printLn("printvar VARIABLE_NAME           //Prints variable, returns nothing.");
          term.printLn("printvar -r VARIABLE_NAME        //Prints variable, returns variable.");
          term.printLn("<b>Samples:</b>");
          term.printLn("printvar terminal                //Prints terminal");
          term.printLn("printvar terminal.version        //Prints terminal.version");
          term.printLn("printvar -r terminal.lastResult  //Prints terminal.lastResult and returns it.");
          term.printLn("printvar document                //Prints global document object.");
          term.printLn("printvar document.body.children  //Prints body elements.");
          term.printLn("printvar document.head.children  //Prints head elements.");
        }
      },
      removevar: {
        run: function(term, argLine) {
          if (globalThis === undefined) {
            term.printError("RemoveVar error: Missing globalThis");
          } else if (argLine == '') {
            term.printError("RemoveVar error: Missing arguments");
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
                if (verbal) term.printLn("removing: " + key)
                delete globalThis[key];
              });
              term.printLn("Removed " + count + " keys.")
              return;
            } else if (args.includes("-n")) {
              args = args.filter(e => e !== '-n');
              keys.forEach(key => {
                if (globalThis[key] === null || globalThis[key] === undefined) {
                  if (verbal) term.printLn("removing: " + key)
                  delete globalThis[key];
                  count++;
                }
              });
            } else if (args.includes("-f")) {
              args = args.filter(e => e !== '-f');
              keys.forEach(key => {
                if (globalThis[key] !== globalThis &&
                  !(typeof globalThis[key] === "function" && globalThis[key].toString().includes("[native code]"))) {
                  if (verbal) term.printLn("removing: " + key)
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
                if (verbal) term.printLn("removing: " + gName)
                delete obj[lastName];
                count++;
              } else {
                if (obj === undefined) {
                  term.printError("Variable " + pName.join(".") + " = undefined")
                } else {
                  term.printError("Variable " + gName + " = undefined");
                }
              }
            }
            term.printLn("Removed " + (count > 1 ? (count + " keys.") : (count === 0 ? "nothing" : "1 key")));
          }
        },
        help: function(term) {
          term.printLn("Removes global variables.");
          term.printLn("<b>Usage:</b>");
          term.printLn("removevar -v ...            //Prints removing VARIABLE_NAME.");
          term.printLn("removevar -f                //Removes all global variables that are not a parent redefinition or native function.");
          term.printLn("removevar -n                //Removes all null or undefined global variables.");
          term.printLn("removevar -a                //Removes ALL global variables.");
          term.printLn("removevar VARIABLE_NAMES    //Removes the global variables provided.")
          term.printLn("<b>Samples:</b>");
          term.printLn("removevar terminal          //Removes the global variable terminal.");
          term.printLn("removevar var1 var2         //Removes the 2 global variables var1 and var2.");
          term.printLn("removevar terminal.history  //Removes history from terminal.");
          term.printLn("removevar -n terminal.history  //Removes history from terminal, and all null or undefined global variables.");
          term.printLn("removevar -n -v             //Prints variable names of all null or undefined global variables it removes.");
        }
      },
      setvar: {
        run: function(term, argLine) {
          if (globalThis === undefined) {
            term.printError("Setvar error: Missing globalThis");
          } else {
            if (argLine == '') {
              term.printError("Setvar error: no name");
            } else {
              let args = splitToArguments(argLine);
              for (const element of args) {
                const keyValuePair = element.split("=");
                const names = keyValuePair[0].split(".");
                const value = stringToValue(keyValuePair[1]);
                if (names.length == 1) {
                  globalThis[names[0]] = value;
                  term.printVar(globalThis[names[0]], keyValuePair[0]);
                } else {
                  let obj = globalThis;
                  for (let i = 0; i < names.length - 1; i++) {
                    if (typeof obj[names[i]] === "object") obj = obj[names[i]];
                    else {
                      let rem = names.length - 1 - i;
                      names.splice(names.length - rem, rem);
                      let name = names.join('.');
                      term.print('<span style="color:red;">Variable is not an object: </span>');
                      term.printVar(obj[names[i]], name);
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
        help: function(term) {
          term.printLn("<b>Usage:</b>");
          term.printLn("setvar NAME=VALUE                                //Sets VALUE to a global variable, NAME, and returns it.");
          term.printLn("<b>Samples:</b>");
          term.printLn("setvar terminal                                  //Sets terminal to undefined");
          term.printLn("setvar terminal.version=prehistoric              //Sets terminal.version to string `prehistoric`");
          term.printLn("setvar myNumber=8                                //Sets myNumber to number 8");
          term.printLn("setvar myNumber=(number)-8.1                     //Sets myNumber to number -8.1");
          term.printLn("setvar var1 var2 var3                            //Creates 3 undefined variables");
          term.printLn("setvar myName=\"Ward Truyen\"                      //Sets myName to string");
          term.printLn('setvar obj={"1":"test","2":true}                 //Sets obj to JSON.stringified object');
          term.printLn("setvar myFunc=(function)terminalPrintLn(\"Hello\");//Creates a function");
          term.printLn("setvar myVar=(global)myFunc                      //Sets(binds) myVar to the contents of myFunc");
        }
      },
    };
    const aliases = {
      run: "dovar",
      pdo: "dovar -v ",
      g: "getvar",
      gg: "globals",
      db: "printvar -r document.body.children",
      dh: "printvar -r document.head.children",
      gdb: "printvar -r document.body.children ",
      gdh: "printvar -r document.head.children ",
      result: "printvar -r terminal.lastResult",
      error: "printvar terminal.lastError",
      pv: "printvar -r ",
      terminal: "printvar -r terminal",
      // history: "printvar terminal.history",
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
