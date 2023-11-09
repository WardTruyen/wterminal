/* Author: Ward Truyen
* Version: 1.0.0
* About:   This started as a library of functions for output/printing to a 'terminal'
*               The 'terminal' is a <pre> tag with an id (see TERMINAL_OUTPUT_ID).
*          But then the terminal got bigger and more fun!
*/

//TERMINAL const
const TERMINAL_VERSION = "1.0.0" // terminal version, duh.
//css & html element relations:
const TERMINAL_BACKGROUND_ID = "terminal-background"; // blurred background div id, contains it all, hides it all.
const TERMINAL_CONTAINER_ID = "terminal-container"; // container div id for all the terminal elements below.
const TERMINAL_OUTPUT_ID = "terminal-output"; // the id from the <pre> tag where we will to print to.
const TERMINAL_FORM_ID = "terminal-form"; // <form> id.
const TERMINAL_INPUT_ID = "terminal-input"; // <input type text> id.
const TERMINAL_BUTTON_DOWN_ID = "terminal-down"; // <button>x</> id.
const TERMINAL_BUTTON_UP_ID = "terminal-up"; // <button>x</> id.
const TERMINAL_BUTTON_CLOSE_ID = "terminal-close"; // <button>x</> id.
const TERMINAL_VISIBLE_CLASS = "terminal-visible"; // the class that (by default) hides the terminal when set to the terminal-background div.
//globals (for fun experiments)
const TERMINAL_GLOBAL_FUNCTIONS = false; // when true: adds global terminal functions
const TERMINAL_GLOBAL_VARIABLES = false; // when true: adds global terminal variables
const TERMINAL_GLOBAL_TEST_VARIABLES = false; // when true: adds extra global terminal variables for testing terminalPrintVar
//start up values: auto insert & logo print
const TERMINAL_AUTO_INSERT_HTML = true; // when true: automaticly inserts a hidden div containing the terminal in html.body
const TERMINAL_AUTO_INSERT_CSS = true; // when true: automaticly inserts a stylesheet-link in the html.head
const TERMINAL_CSS_LINK = "term/terminal.css"; // the link to auto insert when terminal initializes and TERMINAL_AUTO_INSERT_CSS = true
const TERMINAL_PRINT_LOGO = true;
//Options: open/close
const TERMINAL_KEY_OPEN = 'Backquote'; // 'Backquote' is the event.code to look for on keyDown to open the terminal.
const TERMINAL_KEY_OPEN_CTRL = false; // When true: ctrl-key must be pressed together with TERMINAL_KEY_OPEN.
const TERMINAL_KEY_CLOSE = 'Escape'; // 'Escape' is the event.code to look for on keyDown to close the terminal.
const TERMINAL_KEY_HISTORY = 'ArrowUp'; // 'ArrowUp" is the event.code to look for on keyDown of the input-field to get previous command'
//Options: output
const TERMINAL_PRINT_TO_CONSOLE_LOG = false; // when true: printing logs to console too.
//Options: input
const TERMINAL_SLASH_COMMANDS = false; // when true: all the commands start with a forward slash.
const TERMINAL_INPUT_STRICT = true; // when true: input commands must strictly match.
const TERMINAL_PRINT_ALIAS_CHANGE = false; // when true: prints the change when an alias is used
const TERMINAL_PRINT_INNER_COMMANDS = false; // when true: prints the multiple-commands after && split
const TERMINAL_PRINT_COMMAND_RETURN = false; // when true: prints returned value of executed command, if anny
const TERMINAL_MAX_HISTORY = 32; // the maximum length of the history we keep
//Options: extensions
const TERMINAL_PRINT_ALIAS_ADD = false; // when true: prints anny added alias
const TERMINAL_PRINT_EXTENSION_ADD = false; // when true: prints anny extention command names that are added
//Options; TPO aka terminalPrintObject const
const TPO_UNKNOWN_OBJECT_PRINT = false; // when true and printVar detects an empty unkown object, then it prints prototype stuff
const TPO_OBJECT_PREFIX = "|  "; // when printVar is printing keys of an object, this is added in front.
const TPO_SPECIAL_PREFIX = " *" + TPO_OBJECT_PREFIX; // when printVar is printing special (keyless or HTMLElement) objects
const TPO_MAX_DEPTH = 8; // when printVar is gooing this deep in objects it stops
const TPO_INNER_MAX_LENGTH = 64; // when objects in objects are bigger than this it prints an empty code block { length=100  (too long) }
// const TPO_OBJECT_INDEX_START = 0;

const terminalOptions = {
  //open/close
  keyOpen: TERMINAL_KEY_OPEN,
  keyOpenCtrl: TERMINAL_KEY_OPEN_CTRL,
  keyClose: TERMINAL_KEY_CLOSE,
  keyHistory: TERMINAL_KEY_HISTORY,
  //output
  printToConsoleLog: TERMINAL_PRINT_TO_CONSOLE_LOG,
  //input
  slashCommands: TERMINAL_SLASH_COMMANDS,
  inputStrict: TERMINAL_INPUT_STRICT,
  printAliasChange: TERMINAL_PRINT_ALIAS_CHANGE,
  printInnerCommands: TERMINAL_PRINT_INNER_COMMANDS,
  printCommandReturn: TERMINAL_PRINT_COMMAND_RETURN,
  maxHistory: TERMINAL_MAX_HISTORY,
  //extensions
  printExtensionAdd: TERMINAL_PRINT_EXTENSION_ADD,
  printAliasAdd: TERMINAL_PRINT_ALIAS_ADD,
  //TPO aka terminalPrintObject const
  tpo_unknownObjectPrint: TPO_UNKNOWN_OBJECT_PRINT,
  tpo_objectPrefix: TPO_OBJECT_PREFIX,
  tpo_specialPrefix: TPO_SPECIAL_PREFIX,
  tpo_maxDepth: TPO_MAX_DEPTH,
  tpo_innerMaxLength: TPO_INNER_MAX_LENGTH,
  // tpo_objectIndexStart: TPO_OBJECT_INDEX_START,
};

const terminalConst = function() {
  const c = {};
  c.version = TERMINAL_VERSION;
  //css & html element relations:
  c.backgroundId = TERMINAL_BACKGROUND_ID;
  c.containerId = TERMINAL_CONTAINER_ID;
  c.outputId = TERMINAL_OUTPUT_ID;
  c.formId = TERMINAL_FORM_ID;
  c.inputId = TERMINAL_INPUT_ID;
  c.buttonDownId = TERMINAL_BUTTON_DOWN_ID;
  c.buttonUpId = TERMINAL_BUTTON_UP_ID;
  c.buttonCloseId = TERMINAL_BUTTON_CLOSE_ID;
  c.hiddenClass = TERMINAL_VISIBLE_CLASS;
  //globals
  c.globalFunctions = TERMINAL_GLOBAL_FUNCTIONS;
  c.globalVariables = TERMINAL_GLOBAL_VARIABLES;
  c.globalTestVariables = TERMINAL_GLOBAL_TEST_VARIABLES;
  //auto insert
  c.autoInsertHTML = TERMINAL_AUTO_INSERT_HTML;
  c.autoInsertCSS = TERMINAL_AUTO_INSERT_CSS;
  c.cssLink = TERMINAL_CSS_LINK;
  //Options: open/close
  c.keyOpen = TERMINAL_KEY_OPEN;
  c.keyOpenCtrl = TERMINAL_KEY_OPEN_CTRL;
  c.keyClose = TERMINAL_KEY_CLOSE;
  c.keyHistory = TERMINAL_KEY_HISTORY;
  //Options: output
  c.defaultPrintToConsoleLog = TERMINAL_PRINT_TO_CONSOLE_LOG;
  //Options: input
  c.defaultSlashCommands = TERMINAL_SLASH_COMMANDS;
  c.defaultInputStrict = TERMINAL_INPUT_STRICT;
  c.defaultPrintAliasChange = TERMINAL_PRINT_ALIAS_CHANGE;
  c.defaultPrintInnerCommands = TERMINAL_PRINT_INNER_COMMANDS;
  c.defaultPrintCommandReturn = TERMINAL_PRINT_COMMAND_RETURN;
  c.defaultMaxHistory = TERMINAL_MAX_HISTORY;
  //Options: extensions
  c.defaultPrintExtensionAdd = TERMINAL_PRINT_EXTENSION_ADD;
  c.defaultPrintAliasAdd = TERMINAL_PRINT_ALIAS_ADD;
  //Options: TPO aka terminalPrintObject const
  c.tpo_defaultUnknownObjectPrint = TPO_UNKNOWN_OBJECT_PRINT;
  c.tpo_defaultObjectPrefix = TPO_OBJECT_PREFIX;
  c.tpo_defaultSpecialPrefix = TPO_SPECIAL_PREFIX;
  c.tpo_defaultMaxDepth = TPO_MAX_DEPTH;
  c.tpo_defaultInnerMaxLength = TPO_INNER_MAX_LENGTH;
  // c.tpi_objectIndexStart = TPO_OBJECT_INDEX_START;
  return c;
}

//#region output 
const terminalPrint = function(...args) {
  if (terminalOptions.printToConsoleLog) {
    console.log("terminalPrint: ", ...args);
  }
  let text = "";
  for (let arg of args) {
    text += new String(arg);
  }
  terminalOutput.innerHTML += text;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const terminalPrintLn = function(...args) {
  if (terminalOptions.printToConsoleLog) {
    console.log("terminalPrintLn: ", ...args);
  }
  let text = "";
  for (let arg of args) {
    text += new String(arg);
  }
  terminalOutput.innerHTML += text + "<br>";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const terminalClear = function() {
  if (terminalOptions.printToConsoleLog) {
    console.log("Terminal cleared");
  }
  terminalOutput.innerHTML = "";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};
//#endregion

//#region extra-output
/* prints out underlined */
const terminalPrintTitle = function(title, useTags = true, char = "=") {
  if (title && typeof title === "string" && title.length > 0) {
    if (useTags == false) {
      terminalPrintLn(title);
      let underline = "";
      for (let i = 0; i < title.length; i++) {
        underline += char;
      }
      terminalPrintLn(underline);
    } else {
      terminalPrintLn("<u><b>" + title + "</u></b>");
    }
  }
};

/* prints out with red text */
const terminalPrintError = function(...args) {
  terminalPrintLn('<span style="color:red;">', ...args, '</span>');
};

const terminalPrintList = function(list, printKeys = true) {
  if (typeof list !== "object") {
    terminalPrintError("printList error: Not a list");
    return;
  }
  if (list === null) return;

  const keys = Object.keys(list);
  if (keys.length == 0) {
    if (list.length !== undefined && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const t = typeof (list[i]);
        if (t === "undefined") {
          terminalPrintLn("undefined");
        } else if (t === "string") {
          terminalPrintLn('`', list[i], '`');
        } else if (t === "object" && list[i] === null) {
          terminalPrintLn("null");
        } else {
          terminalPrintLn(list[i]);
        }
      }
    }
  } else if (printKeys) {
    keys.forEach((key) => {
      const t = typeof (list[key]);
      if (t === "undefined") {
        terminalPrintLn(key, " = undefined");
      } else if (t === "string") {
        terminalPrintLn(key, ' = `', list[key], '`');
      } else if (t === "object" && list[key] === null) {
        terminalPrintLn(key, " = null");
      } else {
        terminalPrintLn(key, " = ", list[key]);
      }
    });
  } else {
    keys.forEach((key) => {
      const t = typeof (list[key]);
      if (t === "undefined") {
        terminalPrintLn("undefined");
      } else if (t === "string") {
        terminalPrintLn('`', list[key], '`');
      } else if (t === "object" && obj === null) {
        terminalPrintLn("null");
      } else {
        terminalPrintLn(list[key]);
      }
    });
  }
};

/* prints out var/object content */
const terminalPrintVar = function(obj, name = "var", prefix = "") {
  if (terminalOptions.printToConsoleLog) {
    console.log("terminalPrintVar: ", name, " = ", obj);
  }
  const t = typeof (obj);
  if (t === "undefined") {
    terminalPrintLn(prefix, name, " = undefined");
    return;
  } else if (t === "string") {
    terminalPrintLn(prefix, name, ' = `', obj.replaceAll('<', '&lt;'), '`');
    return;
  } else if (t === "object" && obj === null) {
    terminalPrintLn(prefix, name, " = null");
    return;
  } else if (t !== "object") {
    if (t === "function") {
      terminalPrintLn(prefix, name, " = ", obj.toString().replaceAll('<', '&lt;'));
    } else if (t === "number" || t === "boolean") {
      terminalPrintLn(prefix, name, " = ", obj);
    } else {
      terminalPrintLn(prefix, name, " = ", "(", typeof (obj), ") ", obj);
    }
    return;
  }

  /* internal/private function: get Object Type */
  function _getObjType(obj) {
    let objType = typeof obj;
    if (obj !== null) {
      if (obj instanceof Date) {
        objType += " Date";
      } else {
        objType = Object.getPrototypeOf(obj).toString().replace('[', '').replace(']', '');
      }
    }
    return objType;
  }

  /* internal/private function: print Object*/
  function _printObject(obj, name, prefix = "", lvl = 0) {
    if (obj === null) {
      terminalPrintLn(prefix, name, " = null");
    } else if (lvl > terminalOptions.maxDepth) {
      terminalPrintLn(prefix, name, " = {} max depth reached(" + lvl + ")");
    } else {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        // special objects: no keys
        if (obj instanceof Date) {
          terminalPrintLn(prefix, name, " = (Date)", obj.toString());
        } else if (obj instanceof Array) {
          terminalPrintLn(prefix, name, " = []");
        } else if (obj instanceof HTMLElement) {
          terminalPrintLn(prefix, name, " = (", _getObjType(obj), "){");
          terminalPrintLn(prefix + terminalOptions.tpo_specialPrefix, "tagName = ", obj.tagName);
          if (obj.attributes.length != 0) {
            let attr = "";
            for (let i = 0; i < obj.attributes.length; i++) {
              let a = obj.attributes[i];
              if (a.value !== '') {
                if (attr.length != 0) attr += " ";
                attr += a.name + "=`" + a.value + "`";
              }
            }
            terminalPrintLn(prefix + terminalOptions.tpo_specialPrefix, "attributes = { ", attr, " }");
            if (obj.children && obj.children.length > 0) {
              terminalPrintLn(prefix + terminalOptions.tpo_specialPrefix, "childrenCount = ", obj.children.length);
            }
          }
          terminalPrintLn(prefix, "}");
        } else if (obj instanceof Error) {
          terminalPrintLn(prefix, name, " = (", _getObjType(obj), "){}");
          const pre = prefix + terminalOptions.tpo_specialPrefix;
          terminalPrintLn(pre, "message = ", obj.message);
          terminalPrintLn(pre, "name = ", obj.name);
          try { terminalPrintLn(pre, "fileName = ", obj.fileName); } catch { }
          try { terminalPrintLn(pre, "lineNumber = ", obj.lineNumber); } catch { }
          try { terminalPrintLn(pre, "columnNumber = ", obj.columnNumber); } catch { }
          try { terminalPrintLn(pre, "stack = ", obj.columnNumber); } catch { }
        } else if (Object.getPrototypeOf(obj) == "[object Object]") {
          terminalPrintLn(prefix, name, " = {}");
        } else {
          // all properties hidden
          terminalPrintLn(prefix, name, " = (", _getObjType(obj), "){}");
          if (terminalOptions.tpo_unknownObjectPrint) {
            const pre = prefix + terminalOptions.tpo_specialPrefix;
            terminalPrintLn(pre, "isSealed = ", Object.isSealed(obj))
            terminalPrintLn(pre, "isFrozen = ", Object.isFrozen(obj));
            terminalPrintLn(pre, "isExtensible = ", Object.isExtensible(obj));
            terminalPrintLn(pre, "prototype = ", Object.getPrototypeOf(obj));
            terminalPrintLn(pre, "prototype.prototype = ", Object.getPrototypeOf(Object.getPrototypeOf(obj)));
            terminalPrintVar(Object.getOwnPropertyNames(obj), ".propertyNames", pre);
            terminalPrintVar(Object.getOwnPropertyDescriptors(obj), "propertyDescriptors", pre);
          }
        }
      } else {
        // print keys of object
        const isArray = obj instanceof Array || obj instanceof HTMLCollection;
        if (isArray) {
          if (obj instanceof Array) {
            terminalPrintLn(prefix, name, " = [ length: ", keys.length);
          } else {
            terminalPrintLn(prefix, name, " = (", _getObjType(obj), ")[ length: ", keys.length);
          }
        } else {
          terminalPrintLn(prefix, name, " = (", _getObjType(obj), "){ length: ", keys.length);
        }
        if (lvl !== 0 && keys.length > TPO_INNER_MAX_LENGTH) {
          terminalPrintLn(prefix + terminalOptions.tpo_objectPrefix, "(too long)");
        } else {
          const prefixIn = prefix + terminalOptions.tpo_objectPrefix;
          keys.forEach((key, index) => {
            const type = typeof (obj[key]);
            // const position = isArray ? key : ((index+TPO_OBJECT_INDEX_START)+": "+key);
            const position = isArray ? key : (index + ": " + key);
            if (obj[key] === obj) {
              terminalPrintLn(prefixIn, position, " = (parent redefinition) ");
            } else if (type === "function" || type === "undefined") {
              terminalPrintLn(prefixIn, position, " = (", type, ") ");
            } else if (type === "boolean" || type === "number") {
              terminalPrintLn(prefixIn, position, ' = ', obj[key]);
            } else if (type === "string") {
              terminalPrintLn(prefixIn, position, ' = `', obj[key].replaceAll('<', '&lt;'), '`');
            } else if (type === "object") {
              _printObject(obj[key], position, prefixIn, lvl + 1);
            } else {
              terminalPrintLn(prefixIn, position, " = (", type, ") ", obj[key]);
            }
          });//-> forEach key
        }
        terminalPrintLn(prefix, isArray ? "]" : "}");
      }//-> if keys
    }//-> if obj, lvl
  }//-> function _printObject
  _printObject(obj, name, prefix);
};//-> function terminalPrintVar
//#endregion

//#region input
const splitToArguements = function(str) {
  function _countChar(str, char) {
    let index = str.indexOf(char);
    let count = 0;
    while (index != -1) {
      count++;
      index = str.indexOf(char, index + 1);
    }
    return count;
  }

  let words = str.split(" ");
  let quoteCounts = [];
  for (let i = 0; i < words.length; i++) {
    quoteCounts[i] = _countChar(words[i], '"');
  }
  for (let i = 0; i < words.length; i++) {
    quoteCounts[i] = quoteCounts[i] % 2;
  }
  let quotes = [];
  let quotesIndex = 0;
  let harvesting = false;
  for (let i = 0; i < quoteCounts.length; i++) {
    if (harvesting) {
      quotes[quotesIndex] += " " + words[i];
      if (quoteCounts[i] == 1) {
        harvesting = false;
        quotesIndex++;
      }
    } else {
      if (quoteCounts[i] == 1) {
        harvesting = true;
        quotes[quotesIndex] = words[i];
      }
    }
  }
  for (let i = 0; i < quotes.length; i++) {
    if (quotes[i].startsWith('"'))
      quotes[i] = quotes[i].replaceAll('"', '');
  }
  quotesIndex = 0;
  let removing = false;
  for (let i = quoteCounts.length - 1; i >= 0; i--) {
    if (removing) {
      words.splice(i, 1);
      if (quoteCounts[i] == 1) {
        removing = false;
        words.splice(i, 0, quotes[quotesIndex]);//insert quote
      }
    } else {
      if (quoteCounts[i] == 1) {
        removing = true;
        words.splice(i, 1);
      }
    }
  }
  return words;
};

const stringToValue = function(str) {
  if (typeof str !== "string") {
    throw new Error("StringToValue error: str must be a string!");
  }
  if (str === "true") return true;
  else if (str === "false") return false;
  else if (str.startsWith("(global)") || str.startsWith("(Global)")) {
    return terminalGetGlobal(str.substring(8));
  } else if (str.startsWith("(number)") || str.startsWith("(Number)")) {
    str = str.substring(8);
    return str.includes(".") ? parseFloat(str) : parseInt(str);
  } else if (str.startsWith("{")) {
    return JSON.parse(str);
  } else if (str.startsWith("(function)") || str.startsWith("(Function)")) {
    return new Function(str.substring(10));
  } else if (str.startsWith("'") || str.startsWith('"')) {
    return str.substring(1, str.length - 1);
  } else if (!isNaN(parseFloat(str)) && isFinite(str)) {
    return str.includes(".") ? parseFloat(str) : parseInt(str);
  } else {
    return str;
  }
}

const terminalGetGlobal = function(gName) {
  if (globalThis === undefined) {
    terminalPrintError("GetGlobal error: Missing globalThis");
  } else {
    if (gName == '') {
      terminalPrintError("GetGlobal error: Missing argument: VARIABLE_NAME");
    } else {
      const names = gName.split(".");
      if (names.length == 1) {
        return globalThis[gName];
      } else {
        let obj = globalThis;
        for (let i = 0; i < names.length - 1; i++) {
          const nobj = obj[names[i]]; // nobj is short for new object
          if (typeof nobj === "object" && nobj !== null) obj = nobj;
          else {
            let rem = names.length - 1 - i;
            names.splice(names.length - rem, rem);
            let name = names.join('.');
            terminalPrint('<span style="color:red;">Variable is ', nobj === null ? 'null' : 'not an object', ': </span>');
            terminalPrintVar(nobj, name);
            return;
          };
        }
        return obj[names[names.length - 1]];
      }
    }
  }
};

const terminalAliases = Object.freeze({ //freeze object to make it immutable/const-value
  "?": "help",
  cmdlist: "help",
  print: "echo",
  version: "const version ",
});

let terminalAliasesExt = {};
const terminalAddAlias = function(name, alias) {
  if (typeof name !== "string") {
    terminalPrintError("AddAlias error: name must be a string.");
    return false;
  }
  if (name.includes(' ')) {
    terminalPrintError("AddAlias error: name can not have spaces.")
    return false;
  }
  if (typeof alias !== "string") {
    terminalPrintError("AddAlias error: alias must be a string.");
    return false;
  }
  if (terminalOptions.printAliasAdd) terminalPrintLn(`Alias added: ${name} = \`${alias}\``);
  terminalAliasesExt[name] = alias;
  return true;
}

const terminalCommandList = Object.freeze({ //freeze object to make it immutable/const-value
  alias: {
    run: function() {
      terminalPrintList(terminalAliases);
      terminalPrintList(terminalAliasesExt);
    },
    help: function() {
      terminalPrintLn("<b>Usage:</b>");
      terminalPrintLn("alias               //Prints all aliases");
      terminalPrintLn("<b>About alias usage:</b>");
      terminalPrintLn("An alias-name has no spaces, but the alias-value can have multiple spaces.");
      terminalPrintLn("When the terminal detects an alias-name as the first input word, it gets replaced to the alias-value.");
      terminalPrintLn("When the alias-value contains a space, then the arguments will be");
      terminalPrintLn("  joined with the alias-value without a space joining them.");
      terminalPrintLn("<b>Samples of using an alias:</b>");
      terminalPrintLn("?                   //Changes to: `help`");
      terminalPrintLn("? clear             //Changes to: `help clear`");
      terminalPrintLn("version             //Changes to: `const version ` (space+space end)");
      terminalPrintLn("version clear       //Changes to: `const version clear`");
      terminalPrintLn("terminal            //Changes to: `printvar -r terminal` (space+no space end)");
      terminalPrintLn("terminal .history   //Joins without space to: `printvar -r terminal.history`");
    }
  },
  clear: {
    run: function() {
      terminalClear();
    },
    help: function() {
      terminalPrintLn("Clears terminal output.");
    }
  },
  close: {
    run: function() {
      terminalClose();
    },
    help: function() {
      terminalPrintLn("Closes terminal.");
    }
  },
  const: {
    run: function(argLine) {
      const c = terminalConst();

      if (argLine == "") {
        terminalPrintVar(c, "const");
        return c;
      } else if (c[argLine] !== undefined) {
        terminalPrintVar(c[argLine], argLine);
        return c[argLine];
      }
    },
    help: function() {
      terminalPrintLn("<b>Usage:</b>");
      terminalPrintLn("const               //Prints & returns all constant variables.");
      terminalPrintLn("const version       //Prints & returns only the version constant.");
    }
  },
  date: {
    run: function() {
      const d = new Date().toDateString();
      terminalPrintLn("The date is " + d);
      return d;
    },
    help: function() {
      terminalPrintLn("Returns the date.");
    }
  },
  echo: {
    run: function(argLine) {
      terminalPrintLn(argLine);
    },
    help: function() {
      terminalPrintLn("Prints arguments.");
    }
  },
  error: {
    run: function(argLine) {
      terminalPrintError(argLine);
    },
    help: function() {
      terminalPrintLn("Prints arguments in <span style='color:red'>red</span>.");
    }
  },
  exit: {
    run: function() {
      terminalClear();
      terminalClose();
    },
    help: function() {
      terminalPrintLn("Clears and closes terminal.");
    }
  },
  help: {
    run: function(argLine) {
      if (argLine == '') {
        terminalPrintLn(`Open the terminal with ${(terminalOptions.keyOpenCtrl ? "CTRL + " : "")}the ${terminalOptions.keyOpen}-key.`);
        terminalPrintLn(`Close the terminal with the ${terminalOptions.keyClose}-key.`);
        terminalPrintLn(`Use the ${terminalOptions.keyHistory}-key to get previous command.`)
        terminalPrintLn(`Enter a command, optionally some arguments, and press enter or submit.`);
        terminalPrintLn("<b>Basic commands:</b>");
        Object.keys(terminalCommandList).forEach((command, i) => {
          if (i == 0) {
            terminalPrint("  " + command);
          } else if (i % 8 == 0) {
            terminalPrintLn(", ");
            terminalPrint("    " + command);
          } else {
            terminalPrint(", " + command);
          }
        });
        terminalPrintLn();
        terminalPrintLn("<b>Extension commands:</b>");
        Object.keys(terminalCommandListExt).forEach((command, i) => {
          if (i == 0) {
            terminalPrint("  " + command);
          } else if (i % 8 == 0) {
            terminalPrintLn(", ");
            terminalPrint("    " + command);
          } else {
            terminalPrint(", " + command);
          }
        });
        terminalPrintLn();
        terminalPrintLn("<b>Using help:</b>");
        terminalPrintLn("help [COMMAND_NAME] //Prints help, optionally on a command");
        terminalPrintLn("<b>Samples of help:</b>");
        terminalPrintLn("help                //Prints this help again.");
        terminalPrintLn("help help           //Prints help on the help command.");
        terminalPrintLn("help error          //Prints help on the error command.");
        terminalPrintLn("help alias          //Prints help on the alias command.");
        terminalPrintLn("<b>Advanced usage:</b>")
        terminalPrintLn("Previous commands are stored in `terminal.history`")
        terminalPrintLn("Every command is a function, the result of executing this");
        terminalPrintLn("   will be stored in the global variable `terminal.lastResult`.");
        terminalPrintLn("Multiple commands can be chained, separated by `&&`.");
        terminalPrintLn("<b>Advanced samples:</b>");
        terminalPrintLn("const version && printvar terminal");
        terminalPrintLn("  //Gets version value, automatically stores it in terminal.lastResult");
        terminalPrintLn("  //  then prints out the terminal variable (you will see lastResult in there)");
        terminalPrintLn("dovar document.getElementById " + TERMINAL_CONTAINER_ID + " && printvar terminal.lastResult.children")
        terminalPrintLn("  //Gets the element with id " + TERMINAL_CONTAINER_ID);
        terminalPrintLn("  //  and prints out the children property of that element.");
      } else {
        if (terminalCommandList[argLine] !== undefined) {
          terminalCommandList[argLine].help();
        } else if (terminalCommandListExt[argLine] !== undefined) {
          if (typeof terminalCommandListExt[argLine].help === "function") {
            terminalCommandListExt[argLine].help();
          } else {
            terminalPrintLn("No help for command: \"" + argLine + "\"");
          }
        } else {
          terminalPrintError("Help error: Unkown command: \"" + argLine + "\"");
          // terminalCommandList.help.help();
        }
      }
    },
    help: function() {
      terminalPrintLn("Prints help about the terminal or given command.");
      terminalPrintLn("<b>For terminal help use:</b>");
      terminalPrintLn("help");
      terminalPrintLn("<b>For help on a command use:</b>");
      terminalPrintLn("help commandName");
      terminalPrintLn("<b>Samples of help:</b>");
      terminalPrintLn("help            //prints terminal help.");
      terminalPrintLn("help help       //prints this help again.");
      terminalPrintLn("help error      //prints help on the error command.");
      terminalPrintLn("help alias      //prints help on the alias command.");
    }
  },
  option: {
    run: function(argLine) {
      if (argLine == '') {
        terminalPrintList(terminalOptions);
      } else {
        let args = splitToArguements(argLine);
        for (const element of args) {
          if (!element.includes("=")) {
            throw new Error("Option set error: argument is missing \"=\"");
          }
          const keyValuePair = element.split("=");
          const name = keyValuePair[0];
          if (terminalOptions[name] === undefined) {
            throw new Error("Option set error: invalid option name `" + name + "`");
          }
          terminalOptions[name] = stringToValue(keyValuePair[1]);
        }
        return terminalOptions;
      }
    },
    help: function() {
      terminalPrintLn("<b>Usage:</b>");
      terminalPrintLn("option                           //Prints & returns all the options used.");
      terminalPrintLn("option [VARIABLE_NAME=VALUE]     //Sets option VARIABLE_NAME to the following value.");
      terminalPrintLn("<b>Samples:</b>");
      terminalPrintLn("option printAliasChange=true     //Sets option printAliasChange to true.");
      terminalPrintLn("option printCommandReturn=true   //Sets option printCommandReturn to true.");
      terminalPrintLn("option tpo_objectPrefix=\"#  \"    //Sets objectPrefix to `#  `.")
    }
  },
  reload: {
    run: function() {
      location.reload();
    },
    help: function() {
      terminalPrintLn("Reloads page.");
    }
  },
  time: {
    run: function() {
      const d = new Date();
      const t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      terminalPrintLn("The time is " + t);
      return t;
    },
    help: function() {
      terminalPrintLn("Returns the current time.");
    }
  },
  uptime: {
    run: function() {
      const newDate = new Date();
      let diffTime = Math.abs(newDate - terminalInitDate);

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        terminalPrint(diffDays + " days ");
        diffTime -= diffDays * (1000 * 60 * 60 * 24);
      }

      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours > 0) {
        terminalPrint(diffHours + " hours ");
        diffTime -= diffHours * (1000 * 60 * 60);
      }

      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes > 0) {
        terminalPrint(diffMinutes + " minutes ");
        diffTime -= diffMinutes * (1000 * 60);
      }

      const diffSeconds = Math.floor(diffTime / (1000));
      if (diffSeconds > 0) {
        terminalPrint(diffSeconds + " seconds ");
        diffTime -= diffSeconds * (1000);
      }

      if (diffTime > 0) {
        terminalPrint(diffTime + " milliseconds ");
      }
      terminalPrintLn();
    },
    help: function() {
      terminalPrintLn("Prints how long the terminal has been up.");
    }
  },
  starttime: {
    run: function() {
      terminalPrintLn("Terminal initialized on ", terminalInitDate);
      return terminalInitDate;
    },
    help: function() {
      terminalPrintLn("Returns when the terminal was started/initialized.");
    }
  },
});

const terminalCommandListExt = {};
const terminalAddCommand = function(name, run, help) {
  if (name === undefined || typeof name !== "string") {
    terminalPrintError("TerminalAddCommand error: Variable name must be a string.");
    return;
  }
  if (name === '') {
    terminalPrintError("TerminalAddCommand error: Variable name can not be empty.");
    return;
  }
  if (name.includes(' ')) {
    terminalPrintError("TerminalAddCommand error: Variable name can have spaces.");
    return;
  }
  if (run === undefined || typeof run !== "function") {
    terminalPrintError("TerminalAddCommand error: Variable run must be a function.");
    return;
  }
  if (help !== undefined && typeof run !== "function") {
    terminalPrintError("TerminalAddCommand error: Variable help must be a function or undefined.");
    return;
  }
  if (terminalOptions.printExtensionAdd) terminalPrintLn("Command extention added: " + name);
  terminalCommandListExt[name] = { run: run, help: help };
};

const terminalCommand = function(cmdLine, isSuperCommand = false) {
  if (typeof cmdLine !== "string") {
    terminalPrintError("Error: Wrong cmdLine type: " + typeof cmdLine);
    return;
  }
  if (cmdLine == '') return;

  function _terminalCommand(cmdLine) {
    if (cmdLine == '') return;
    // get target values
    const split = cmdLine.split(' ');
    let command = split.shift();
    let argLine = split.join(' ');

    // not strict
    if (!terminalOptions.inputStrict) {
      command = command.toLowerCase();
    }
    // check for alias
    let al;
    if (terminalAliases[command]) {
      al = terminalAliases[command];
    } else if (terminalAliasesExt[command]) {
      al = terminalAliasesExt[command];
    }
    if (al !== undefined) {
      if (al.includes(" ")) {
        //new command and argument
        al = al.split(" ");
        command = al.shift();
        argLine = (al.join(' ') + argLine).trim();
      } else {
        //new command only
        command = al;
      }
      if (terminalOptions.printAliasChange) {
        terminalPrintLn("Alias found#<b> " + command + " " + argLine + "</b>");
      }
    }
    // execute
    let result;
    if (terminalCommandList[command]) {
      result = terminalCommandList[command].run(argLine);
    } else if (terminalCommandListExt[command]) {
      result = terminalCommandListExt[command].run(argLine);
    } else {
      terminalPrintError("Error: Unknown command: \"" + command + "\"");
      terminalPrintLn("Try help");
      return;
    }
    // print result
    if (terminalOptions.printCommandReturn) {
      terminalPrintVar(result, `<b>Result of \`${cmdLine}\`</b>`);
    }
    // store result
    if (typeof terminal !== "object") {
      terminal = {};
    }
    terminal.lastResult = result;
    return result;
  }//-> function _terminalCommand

  cmdLine = cmdLine.trim();
  // print input
  if (isSuperCommand) {
    terminalPrintLn("<u>super-command#</u><b> " + cmdLine + "</b>");
  } else {
    let d = new Date();
    if (terminalOutput.innerHTML != '') terminalPrint('\n')
    terminalPrintLn("<u>(" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")#</u><b> " + cmdLine + "</b>");
  }
  // execute
  let result;
  try {
    if (cmdLine.includes("&&")) {
      // multiple commands
      let commands = cmdLine.split("&&");
      // terminalPrintList(commands); 
      for (let command of commands) {
        command = command.trim();
        if (terminalOptions.printInnerCommands) terminalPrintLn("<u>inner-command#</u> <b>", command, "</b>");
        result = _terminalCommand(command);
      }
    } else {
      // single command
      result = _terminalCommand(cmdLine);
    }
  } catch (e) {
    // terminalPrintError("Command error: ", e)
    terminalPrintVar(e, "<span style='color:red;'>Command error</span>");
    // return e;
  }
  // keep a history
  if (typeof terminal !== "object") {
    terminal = {};
  }
  if (terminal.history === undefined || !(terminal.history instanceof Array))
    terminal.history = [];
  terminal.history.unshift(cmdLine);
  if (terminal.history.length > terminalOptions.maxHistory) {
    terminal.history.splice(terminalOptions.maxHistory);
  }
  return result;
};

const submitTerminalInput = function() {
  const inputElement = document.getElementById(TERMINAL_INPUT_ID);
  const input = inputElement.value;
  if (input.length > 0) {
    if (terminalOptions.slashCommands && !input.startsWith("/")) {
      //# if not a command: print
      terminalPrintLn(input);
    } else {
      //# if it's a command: execute
      terminalCommand(terminalOptions.slashCommands ? input.substring(1) : input);
    }
  }
  inputElement.value = ""; //# clear the input field
  terminalRefocusInput();
  return false;  //# prevent <form> from submitting
};

const terminalRefocusInput = function() {
  document.getElementById(TERMINAL_INPUT_ID).focus(); //# set focus to input field
};

const terminalClose = function() {
  const terminalBackground = document.getElementById(TERMINAL_BACKGROUND_ID);
  if (terminalBackground && terminalBackground.classList.contains(TERMINAL_VISIBLE_CLASS)) {
    terminalBackground.classList.remove(TERMINAL_VISIBLE_CLASS);
  }
};

const terminalOpen = function() {
  // function terminalOpen(){
  const terminalBackground = document.getElementById(TERMINAL_BACKGROUND_ID);
  if (terminalBackground === null) return;
  if (!terminalBackground.classList.contains(TERMINAL_VISIBLE_CLASS)) {
    terminalBackground.classList.add(TERMINAL_VISIBLE_CLASS);
  }
  terminalRefocusInput();
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const terminalOpenClose = function() {
  const terminalBackground = document.getElementById(TERMINAL_BACKGROUND_ID);
  if (terminalBackground === null) return;
  if (!terminalBackground.classList.contains(TERMINAL_VISIBLE_CLASS)) {
    terminalBackground.classList.add(TERMINAL_VISIBLE_CLASS);
    terminalRefocusInput();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  } else {
    terminalBackground.classList.remove(TERMINAL_VISIBLE_CLASS);
  }
};

const isTerminalOpen = function() {
  const terminalBackground = document.getElementById(TERMINAL_BACKGROUND_ID);
  if (terminalBackground === null) return;
  return terminalBackground.classList.contains(TERMINAL_VISIBLE_CLASS);
};
//#endregion

//#region init
//Globals
const createTerminalGlobal = function() {
  terminal = {};
  if (TERMINAL_GLOBAL_VARIABLES) {
    terminal.isLoaded = false;
    terminal.version = TERMINAL_VERSION;
    terminal.options = terminalOptions;
  }
  if (TERMINAL_GLOBAL_TEST_VARIABLES) {
    terminal.testvars = {};
    const p = terminal.testvars;
    p.hello = "Hello World!";
    p.multilineStr = `one
two
three`;
    p.emptyArray = [];
    p.emptyObject = {};
    p.newArray = new Array();
    p.newDate = new Date();
    p.newSet = new Set();
    p.newMap = new Map();
    p.testArray1 = ["three", "two", "one"];
    p.testArray1 = ["three", 2, true, { 1: 1, '2': 2, 'three': 3 }];
    // p.testKeys = { 1:1, '2':2, 'three':3 };// 1 is a number. 2 is a string. => at runtime keys are always strings (even in an Array)
  }
  if (TERMINAL_GLOBAL_FUNCTIONS) {
    terminal.print = terminalPrint;
    terminal.printLn = terminalPrintLn;
    terminal.printVar = terminalPrintVar;

    terminal.printError = terminalPrintError;
    terminal.printTitle = terminalPrintTitle;
    terminal.doCommand = terminalCommand;

    terminal.isOpen = isTerminalOpen;
    terminal.open = terminalOpen;
    terminal.close = terminalClose;
    terminal.openClose = terminalOpenClose;
  }
}
createTerminalGlobal();
//Locals
let terminalOutput;
let terminalInitDate;

//Init
const terminalInitialize = function() {
  if (TERMINAL_AUTO_INSERT_CSS) {
    const cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("href", TERMINAL_CSS_LINK);
    document.head.append(cssLink);
  }
  if (TERMINAL_AUTO_INSERT_HTML) {
    let bg = document.getElementById(TERMINAL_BACKGROUND_ID);
    if (bg != null) {
      bg.remove();
      console.log("Removed previous terminal");
    }
    bg = document.createElement('div');
    bg.id = TERMINAL_BACKGROUND_ID;
    bg.title = "Close terminal";
    bg.innerHTML = `<div id="${TERMINAL_CONTAINER_ID}" title="Terminal">
  <pre title="Terminal output" id="${TERMINAL_OUTPUT_ID}"></pre>
  <form style="display: inline;" onsubmit="return false;" id="${TERMINAL_FORM_ID}">
    <label for="${TERMINAL_INPUT_ID}">Input:</label>
    <input title="Terminal input" type="text" name="${TERMINAL_INPUT_ID}" id="${TERMINAL_INPUT_ID}" placeholder="help">
    <input title="Submit input" type="submit" value="Enter">
  </form>
  <span style="float: right;">
    <button title="Scroll to top" id="${TERMINAL_BUTTON_UP_ID}">&uarr;</button>
    <button title="Scroll to bottom" id="${TERMINAL_BUTTON_DOWN_ID}">&darr;</button>
    <button title="Close terminal" id="${TERMINAL_BUTTON_CLOSE_ID}">&#10006;</button>
  </span>
</div>`;
    document.body.appendChild(bg);
  }
  // get terminal
  terminalOutput = document.getElementById(TERMINAL_OUTPUT_ID);
  if (terminalOutput == null) {
    console.log("Error: no terminal found!");
    return;
  }
  // insert submit function
  if (document.getElementById(TERMINAL_FORM_ID)) {
    document.getElementById(TERMINAL_FORM_ID).onsubmit = function(event) {
      event.stopPropagation();
      return submitTerminalInput();
    };
  } else terminalPrintError("Init error: Could not find id " + TERMINAL_FORM_ID);
  // insert button functions
  if (document.getElementById(TERMINAL_BUTTON_UP_ID)) {
    document.getElementById(TERMINAL_BUTTON_UP_ID).onclick = function() {
      terminalOutput.scrollTop = 0;
      terminalRefocusInput();
    }
  } else terminalPrintLn("Init warning: Could not find id " + TERMINAL_BUTTON_UP_ID);

  if (document.getElementById(TERMINAL_BUTTON_DOWN_ID)) {
    document.getElementById(TERMINAL_BUTTON_DOWN_ID).onclick = function() {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      terminalRefocusInput();
    }
  } else terminalPrintLn("Init warning: Could not find id " + TERMINAL_BUTTON_DOWN_ID);

  if (document.getElementById(TERMINAL_BUTTON_CLOSE_ID)) {
    document.getElementById(TERMINAL_BUTTON_CLOSE_ID).onclick = function() {
      const terminalBackground = document.getElementById(TERMINAL_BACKGROUND_ID);
      if (terminalBackground.classList.contains(TERMINAL_VISIBLE_CLASS)) {
        terminalBackground.classList.remove(TERMINAL_VISIBLE_CLASS);
        terminalRefocusInput();
      } else {
        terminalBackground.classList.add(TERMINAL_VISIBLE_CLASS);
      }
    };
  } else terminalPrintLn("Init warning: Could not find id " + TERMINAL_BUTTON_CLOSE_ID);

  // close terminal events
  if (document.getElementById(TERMINAL_BACKGROUND_ID)) {
    document.getElementById(TERMINAL_BACKGROUND_ID).onclick = function(event) {
      // clicking next to the terminal is closing it
      if (isTerminalOpen()) {
        terminalClose();
        event.stopPropagation();
      }
    };
  } else terminalPrintLn("Init warning: Could not find id " + TERMINAL_BACKGROUND_ID);
  if (document.getElementById(TERMINAL_CONTAINER_ID)) {
    document.getElementById(TERMINAL_CONTAINER_ID).onclick = function(event) {
      // clicking in the terminal should not close it
      event.stopPropagation();
    };
    // install shortcuts: open/close
    document.body.addEventListener("keydown", function(event) {
      // terminalPrintLn('keydown.code ' + event.code);
      //console.log('terminal keydown.code ' + event.code);
      //terminalPrintVar(event, "keydownEvent");
      if (event.repeat == false) {
        if (event.code == terminalOptions.keyOpen && (terminalOptions.keyOpenCtrl ? event.ctrlKey : !event.ctrlKey) && !isTerminalOpen()) {
          terminalOpen();
          event.preventDefault();
          return false;
        } else if (event.code == terminalOptions.keyClose && isTerminalOpen()) {
          terminalClose();
          event.preventDefault();
          return false;
        }
      }
    });
  } else terminalPrintLn("Init warning: Could not find id " + TERMINAL_CONTAINER_ID);

  // install shortcuts: up-history && close
  if (document.getElementById(TERMINAL_INPUT_ID)) {
    document.getElementById(TERMINAL_INPUT_ID).addEventListener("keydown", function(event) {
      if (event.repeat == false) {
        if (event.code == terminalOptions.keyHistory) {
          if (typeof terminal === "object" && terminal.history instanceof Array) {
            this.value = terminal.history[0];
            event.preventDefault();
            return false;
          }
        }
        if (event.code == terminalOptions.keyClose && isTerminalOpen()) {
          // while writing input, prevent key from bubbling down 
          terminalClose();
          event.preventDefault();
          return false;
        }
      }
    });
  } else terminalPrintLn("Init warning: Could not find id " + TERMINAL_INPUT_ID);

  // Store time and set status
  terminalInitDate = new Date();
  if (TERMINAL_GLOBAL_VARIABLES) {
    terminal.isLoaded = true;
    terminal.initDate = new Date();
  }
  // Welcome prints
  terminalPrintLn(`WTerminal ${TERMINAL_VERSION} initialized on `, terminalInitDate);
  if (TERMINAL_PRINT_LOGO) {
    terminalPrintLn(" _  .  _  _____ .----..----. .-.   .-..-..-. .-.  .--.  .-.   ");
    terminalPrintLn("| |/ \\| |[_   _]| {__ | {)  }| .`-'. ||~|| .`| | / {} \\ | |   ");
    terminalPrintLn("|  ,-,  |  | |  | {__ | .-. \\| |\\ /| || || |\\  |/  /\\  \\| `--.");
    terminalPrintLn("'-'   `-'  '-'  `----'`-' `-'`-' ` `-'`-'`-' `-'`-'  `-'`----'");
  }
};//-> function terminalInitialize

if (document.body) {
  terminalInitialize();
} else {
  window.addEventListener("load", terminalInitialize);
}
//#endregion
