/* Author: Ward Truyen
* Version: 1.3.0
* About:   This started as a library of functions for output/printing to a 'terminal'
*          But then the terminal got bigger and more fun!
*/
class WTerminal {
  //TERMINAL const
  static get VERSION() { return "1.3.0"; }; // terminal version, duh.
  static get CSS_LINK_URL() { return "../term/wterminal.css"; }; // the link to auto insert when terminal initializes and WTerminal.AUTO_INSERT_CSS = true
  static get CSS_LINK_ID() { return "wterminal-css"; }; // just in case we need to remove it later
  //css & html element relations:
  static get BACKGROUND_CLASS() { return "wterminal-background"; }; // blurred background div class, contains it all, hides it all.
  static get CONTAINER_CLASS() { return "wterminal-container"; }; // container div class for all the terminal elements.
  static get OUTPUT_CLASS() { return "wterminal-output"; }; // the class from the <pre> tag where we will to print to.
  static get INPUT_CLASS() { return "wterminal-input"; }; // <input type text> class.
  static get VISIBLE_CLASS() { return "wterminal-visible"; }; // the class that (by default) hides the terminal when set to the terminal-background div.
  //globals (for fun experiments)
  static get GLOBAL_LAST_RESULT() { return true; }; // when true: creates global terminal variable lastResult when a command reurns something
  static get GLOBAL_LAST_ERROR() { return true; }; // when true: creates global terminal variable lastError when a command throws an error
  static get GLOBAL_HISTORY() { return false; }; // when true: creates global terminal variable history and stores entered commands
  //start up values: auto insert & logo print
  static get AUTO_INSERT_GLOBAL_TEST_VARIABLES() { return false; }; // when true: adds extra global terminal variables for testing printVar (commands: gg, terminal)
  static get AUTO_INSERT_DROPDOWN() { return false; }; // when true: automaticly inserts a hidden div containing the terminal in html.body
  static get AUTO_INSERT_CSS() { return true; }; // when true: automaticly inserts a stylesheet-link in the html.head
  static get PRINT_LOGO() { return true; }; // when true: prints the WTerminal logo after terminal construction
  //Options: open/close
  static get KEY_OPEN() { return 'Backquote'; }; // 'Backquote' is the event.code to look for on keyDown to open the terminal.
  static get KEY_OPEN_CTRL() { return false; }; // When true: ctrl-key must be pressed together with WTerminal.KEY_OPEN.
  static get KEY_CLOSE() { return 'Escape'; }; // 'Escape' is the event.code to look for on keyDown to close the terminal.
  static get KEY_HISTORY() { return 'ArrowUp'; }; // 'ArrowUp' is the event.code to look for on keyDown of the input-field to get previous command'
  //Options: output
  static get PRINT_TO_CONSOLE_LOG() { return false; }; // when true: printing logs to console too.
  //Options: input
  static get SLASH_COMMANDS() { return false; }; // when true: all the commands start with a forward slash.
  static get INPUT_STRICT() { return true; }; // when true: input commands must strictly match.
  static get PRINT_ALIAS_CHANGE() { return false; }; // when true: prints the change when an alias is used
  static get PRINT_INNER_COMMANDS() { return false; }; // when true: prints the multiple-commands after && split
  static get PRINT_COMMAND_RETURN() { return false; }; // when true: prints returned value of executed command, if anny
  static get MAX_HISTORY() { return 32; }; // the maximum length of the history we keep
  //Options: extensions
  static get PRINT_ALIAS_ADD() { return false; }; // when true: prints anny added alias
  static get PRINT_EXTENSION_ADD() { return false; }; // when true: prints anny extension command names that are added
  //Options; }; TPO aka terminalPrintObject static get
  static get TPO_UNKNOWN_OBJECT_PRINT() { return false; }; // when true and printVar detects an empty unkown object, then it prints prototype stuff
  static get TPO_OBJECT_PREFIX() { return "|  "; }; // when printVar is printing keys of an object, this is added in front.
  static get TPO_SPECIAL_PREFIX() { return " *" + WTerminal.TPO_OBJECT_PREFIX; }; // when printVar is printing special (keyless or HTMLElement) objects
  static get TPO_MAX_DEPTH() { return 8; }; // when printVar is gooing this deep in objects it stops
  static get TPO_INNER_MAX_LENGTH() { return 64; }; // when objects in objects are bigger than this it prints an empty code block { length=100  (too long) }

  static terminals = {};

  static createElement(tagName, tagAttributes, ...tagContents) {
    const el = document.createElement(tagName);
    if (typeof tagAttributes === 'object' && tagAttributes != null) {
      for (let ta of Object.keys(tagAttributes)) {
        el.setAttribute(ta, tagAttributes[ta]);
      }
    }
    for (let tc of tagContents) {
      if (typeof tc === "string") {
        el.appendChild(document.createTextNode(tc))
        continue;
      } else if (typeof tc === 'object') {
        if (tc instanceof HTMLElement) {
          el.appendChild(tc)
          continue;
        }
      }
      el.appendChild(document.createTextNode(tc.toString()))
    }
    return el;
  };

  static splitToArguments(str) {
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
      if (quotes[i].startsWith('"')) quotes[i] = quotes[i].replaceAll('"', '');
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

  static stringToValue(str) {
    if (typeof str !== "string") {
      throw new Error("StringToValue error: str must be a string!");
    }
    if (str === "true") return true;
    else if (str === "false") return false;
    else if (str.startsWith("(global)") || str.startsWith("(Global)")) {
      return WTerminal.getGlobalVariable(str.substring(8));
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

  static getGlobalVariable(gName) {
    if (globalThis === undefined) {
      throw new Error("Missing globalThis");
      // this.printError("GetGlobal error: Missing globalThis");
    } else {
      if (gName == '') {
        throw new Error("Missing argument: VARIABLE_NAME");
        // this.printError("GetGlobal error: Missing argument: VARIABLE_NAME");
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
              // terminalPrint('<span style="color:red;">Variable is ', nobj === null ? 'null' : 'not an object', ': </span>');
              // this.printError(nobj === null ? 'null' : 'not an object');
              // this.printVar(nobj, name);
              throw new Error(name + " is " + nobj === null ? 'null' : 'not an object');
              // return;
            };
          }
          return obj[names[names.length - 1]];
        }
      }
    }
  };

  constructor(name, locationId, options) {
    // use name in static storage of terminals
    this.name = name;
    this.locationId = location;
    WTerminal.terminals[name] = this;

    //create terminal elements
    const container = WTerminal.createElement('div', { class: WTerminal.CONTAINER_CLASS, title: "Terminal" });
    const output = WTerminal.createElement('pre', { class: WTerminal.OUTPUT_CLASS, title: "Terminal output" });
    const inputForm = WTerminal.createElement('form', { style: "display: inline;", onsubmit: "return false;" });
    const inputLabel = WTerminal.createElement('label', null, "Input:");
    const inputText = WTerminal.createElement('input', { class: WTerminal.INPUT_CLASS, title: "Terminal input", type: "text", name: WTerminal.INPUT_CLASS, placeholder: "help" });
    const inputSubmit = WTerminal.createElement('input', { title: "Submit input", type: "submit", value: "Enter" });
    const controls = WTerminal.createElement('span', { style: "float: right;" });
    const btnScrollTop = WTerminal.createElement('button', { title: "Scroll to top" });//, "&uarr;")
    btnScrollTop.innerHTML = "&uarr;";
    const btnScrollBottom = WTerminal.createElement('button', { title: "Scroll to bottom" });//, "&darr;")
    btnScrollBottom.innerHTML = "&darr;";
    this.outputEl = output;
    this.inputTextEl = inputText;

    // insert submit function
    this.onInputFormSubmit = function(event) {
      event.stopPropagation();
      this.submitTerminalInput();
      return false;
    };
    inputForm.onsubmit = (e) => this.onInputFormSubmit(e);

    // insert button functions
    this.scrollToTop = function() {
      this.outputEl.scrollTop = 0;
      this.inputTextEl.focus();
    }
    btnScrollTop.onclick = () => this.scrollToTop();

    this.scrollToBottom = function() {
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
      this.inputTextEl.focus();
    }
    btnScrollBottom.onclick = () => this.scrollToBottom();

    container.onclick = function(event) {
      // clicking in the terminal should not close it
      event.stopPropagation();
    };

    // install shortcuts: up-history && close
    this.onInputTextKeyDown = function(event) {
      if (event.repeat == false) {
        if (event.code == this.options.keyHistory) {
          if (this.history instanceof Array) {
            this.inputTextEl.value = this.history[0];
            event.preventDefault();
            return false;
          }
        }
        if (event.code == this.options.keyClose && this.isTerminalOpen()) {
          if (typeof this.backgroundEl !== "undefined") {
            this.terminalClose();
          }
          event.preventDefault();
          return false;
        }
      }
    };
    inputText.addEventListener("keydown", (e) => this.onInputTextKeyDown(e));

    inputForm.appendChild(inputLabel);
    inputForm.appendChild(inputText);
    inputForm.appendChild(inputSubmit);
    controls.appendChild(btnScrollTop);
    controls.appendChild(btnScrollBottom);
    container.appendChild(output);
    container.appendChild(inputForm);
    if (locationId === null) {    // use location to insert terminal in a div(string id) or dropdown (null)
      const background = WTerminal.createElement('div', { class: WTerminal.BACKGROUND_CLASS, title: "Close terminal" });
      this.backgroundEl = background;

      const btnClose = WTerminal.createElement('button', { title: "Close terminal" });//, "&#10006;")
      btnClose.innerHTML = "&#10006;";
      btnClose.onclick = (e) => this.terminalClose();
      this.onDocBodyKeyDown = function(event) {
        //this.printLn('keydown.code ' + event.code);
        //console.log('terminal keydown.code ' + event.code);
        //this.printVar(event, "keydownEvent");
        if (event.repeat == false) {
          if (event.code == this.options.keyOpen && (this.options.keyOpenCtrl ? event.ctrlKey : !event.ctrlKey) && !this.isTerminalOpen()) {
            this.terminalOpen();
            event.preventDefault();
            return false;
          } else if (event.code == this.options.keyClose && this.isTerminalOpen()) {
            if (typeof this.backgroundEl !== "undefined") {
              this.terminalClose();
            }
            event.preventDefault();
            return false;
          }
        }
      };
      document.body.addEventListener("keydown", (e) => this.onDocBodyKeyDown(e));

      // close terminal events
      this.onBackgroundClick = function(event) {
        // clicking next to the terminal is closing it
        if (this.isTerminalOpen()) {
          this.terminalClose();
          event.stopPropagation();
        }
      };
      background.onclick = (e) => this.onBackgroundClick(e);

      controls.appendChild(btnClose);
      container.appendChild(controls);
      background.appendChild(container);
      document.body.appendChild(background);
    } else {
      let locEl = document.getElementById(locationId);

      container.appendChild(controls);
      locEl.appendChild(container);
    }

    // use function-options-var to overwrite default options todo: !!
    this.options = {
      //open/close
      keyOpen: WTerminal.KEY_OPEN,
      keyOpenCtrl: WTerminal.KEY_OPEN_CTRL,
      keyClose: WTerminal.KEY_CLOSE,
      keyHistory: WTerminal.KEY_HISTORY,
      //output
      printToConsoleLog: WTerminal.PRINT_TO_CONSOLE_LOG,
      //input
      slashCommands: WTerminal.SLASH_COMMANDS,
      inputStrict: WTerminal.INPUT_STRICT,
      printAliasChange: WTerminal.PRINT_ALIAS_CHANGE,
      printInnerCommands: WTerminal.PRINT_INNER_COMMANDS,
      printCommandReturn: WTerminal.PRINT_COMMAND_RETURN,
      maxHistory: WTerminal.MAX_HISTORY,
      //extensions
      printExtensionAdd: WTerminal.PRINT_EXTENSION_ADD,
      printAliasAdd: WTerminal.PRINT_ALIAS_ADD,
      //TPO aka terminalPrintObject const
      tpo_unknownObjectPrint: WTerminal.TPO_UNKNOWN_OBJECT_PRINT,
      tpo_objectPrefix: WTerminal.TPO_OBJECT_PREFIX,
      tpo_specialPrefix: WTerminal.TPO_SPECIAL_PREFIX,
      tpo_maxDepth: WTerminal.TPO_MAX_DEPTH,
      tpo_innerMaxLength: WTerminal.TPO_INNER_MAX_LENGTH,
    };

    // finish loading: Welcome prints
    this.aliasExtensionList = {};
    this.commandListExtension = {};
    this.startupDate = new Date();
    this.printLn(`WTerminal ${WTerminal.VERSION} initialized on `, this.startupDate);
    if (WTerminal.PRINT_LOGO) {
      this.printLn(" _  .  _  _____ .----..----. .-.   .-..-..-. .-.  .--.  .-.   ");
      this.printLn("| |/ \\| |[_   _]| {__ | {)  }| .`-'. ||~|| .`| | / {} \\ | |   ");
      this.printLn("|  ,-,  |  | |  | {__ | .-. \\| |\\ /| || || |\\  |/  /\\  \\| `--.");
      this.printLn("'-'   `-'  '-'  `----'`-' `-'`-' ` `-'`-'`-' `-'`-'  `-'`----'");
    }
  }

  //#region output 
  print(...args) {
    if (this.options.printToConsoleLog) {
      console.log("terminalPrint: ", ...args);
    }
    for (let arg of args) {
      if (arg instanceof HTMLElement) {
        this.outputEl.appendChild(arg);
      } else {
        this.outputEl.appendChild(document.createTextNode(new String(arg)));
      }
    }
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  };
  printLn(...args) {
    if (this.options.printToConsoleLog) {
      console.log("terminalPrintLn: ", ...args);
    }
    for (let arg of args) {
      if (arg instanceof HTMLElement) {
        this.outputEl.appendChild(arg);
      } else {
        this.outputEl.appendChild(document.createTextNode(new String(arg)));
      }
    }
    this.outputEl.appendChild(document.createElement('br'));
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  };

  clearOutput() {
    if (this.options.printToConsoleLog) {
      console.log("Terminal cleared");
    }
    this.outputEl.replaceChildren();
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  };
  //#endregion

  static print(...args) {
    for (const tName in this.terminals) {
      const t = this.terminals[tName];
      t.print(...args)
    }
  }

  static printLn(...args) {
    for (const tName in this.terminals) {
      const t = this.terminals[tName];
      t.printLn(...args)
    }
  }

  //#region extra-output
  /* prints out bold */
  printBold = function(text) {
    this.printLn(WTerminal.createElement('b', null, text));
  }
  /* prints out underlined */
  printTitle(title, useTags = true, char = "=") {
    if (title && typeof title === "string" && title.length > 0) {
      if (useTags == false) {
        this.printLn(title);
        let underline = "";
        for (let i = 0; i < title.length; i++) {
          underline += char;
        }
        this.printLn(underline);
      } else {
        this.printLn(WTerminal.createElement('u', null, WTerminal.createElement('b', null, title)));
      }
    }
  };

  /* prints out with red text */
  printError(...args) {
    this.printLn(WTerminal.createElement('span', { style: "color: red;" }, ...args));
  };

  printList(list, printKeys = true) {
    if (typeof list !== "object") {
      this.printError("printList error: Not a list");
      return;
    }
    if (list === null) return;

    const keys = Object.keys(list);
    if (keys.length == 0) {
      if (list.length !== undefined && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const t = typeof (list[i]);
          if (t === "undefined") {
            this.printLn("undefined");
          } else if (t === "string") {
            this.printLn('`', list[i], '`');
          } else if (t === "object" && list[i] === null) {
            this.printLn("null");
          } else {
            this.printLn(list[i]);
          }
        }
      }
    } else if (printKeys) {
      keys.forEach((key) => {
        const t = typeof (list[key]);
        if (t === "undefined") {
          this.printLn(key, " = undefined");
        } else if (t === "string") {
          this.printLn(key, ' = `', list[key], '`');
        } else if (t === "object" && list[key] === null) {
          this.printLn(key, " = null");
        } else {
          this.printLn(key, " = ", list[key]);
        }
      });
    } else {
      keys.forEach((key) => {
        const t = typeof (list[key]);
        if (t === "undefined") {
          this.printLn("undefined");
        } else if (t === "string") {
          this.printLn('`', list[key], '`');
        } else if (t === "object" && obj === null) {
          this.printLn("null");
        } else {
          this.printLn(list[key]);
        }
      });
    }
  };

  /* prints out var/object content */
  printVar(obj, name = "var", prefix = "") {
    if (this.options.printToConsoleLog) {
      console.log("terminalPrintVar: ", name, " = ", obj);
    }
    const t = typeof (obj);
    if (t === "undefined") {
      this.printLn(prefix, name, " = undefined");
      return;
    } else if (t === "string") {
      this.printLn(prefix, name, ' = `', obj, '`');
      return;
    } else if (t === "object" && obj === null) {
      this.printLn(prefix, name, " = null");
      return;
    } else if (t !== "object") {
      if (t === "function") {
        this.printLn(prefix, name, " = ", obj.toString());
      } else if (t === "number" || t === "boolean") {
        this.printLn(prefix, name, " = ", obj);
      } else {
        this.printLn(prefix, name, " = ", "(", typeof (obj), ") ", obj);
      }
      return;
    }
    this._printObject(obj, name, prefix);
  };//-> function printVar

  /* internal/private function: get Object Type */
  _getObjType(obj) {
    let objType = typeof obj;
    if (obj !== null) {
      if (obj instanceof Date) {
        objType += " Date";
      } else if (obj instanceof Float32Array) {
        objType += " Float32Array";
      } else if (obj instanceof Float64Array) {
        objType += " Float64Array";
      } else {
        try {
          let className = Object.getPrototypeOf(obj).toString().replace('[', '').replace(']', '');
          if (className == 'object Object' && typeof obj.constructor != 'undefined') {
            objType += ' ' + obj.constructor.name;
          } else {
            objType = className;
          }
        } catch (e) {
          if (obj instanceof Element) {
            objType += " Element";
          } else {
            // this.printError("Bad prototype toString");
            try {
              if (className == 'object Object' && typeof obj.constructor != 'undefined') {
                objType += ' ' + obj.constructor.name;
              }
            } catch { }
          }
        }
      }
    }
    return objType;
  }

  /* internal/private function: print Object*/
  _printObject(obj, name, prefix = "", lvl = 0) {
    if (obj === null) {
      this.printLn(prefix, name, " = null");
    } else if (lvl > this.options.tpo_maxDepth) {
      this.printLn(prefix, name, " = {} max depth reached(" + lvl + ")");
    } else {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        // special objects: no keys
        if (obj instanceof Date) {
          this.printLn(prefix, name, " = (Date)", obj.toString());
        } else if (obj instanceof Array) {
          this.printLn(prefix, name, " = []");
        } else if (obj instanceof HTMLElement) {
          this.printLn(prefix, name, " = (", this._getObjType(obj), "){");
          this.printLn(prefix + this.options.tpo_specialPrefix, "tagName = ", obj.tagName);
          if (obj.attributes.length != 0) {
            let attr = {};
            for (let i = 0; i < obj.attributes.length; i++) {
              let a = obj.attributes[i];
              if (a.value !== '') {
                attr[a.name] = a.value;
              }
            }
            // this.printLn(prefix + this.options.tpo_specialPrefix, "attributes = { ", attr, " }");
            this.printVar(attr, "attributes", prefix + this.options.tpo_specialPrefix);
          }
          if (obj.children && obj.children.length > 0) {
            this.printLn(prefix + this.options.tpo_specialPrefix, "childrenCount = ", obj.children.length);
          }
          this.printLn(prefix, "}");
        } else if (obj instanceof Error) {
          this.printLn(prefix, name, " = (", this._getObjType(obj), "){}");
          const pre = prefix + this.options.tpo_specialPrefix;
          this.printLn(pre, "message = ", obj.message);
          this.printLn(pre, "name = ", obj.name);
          try { this.printLn(pre, "fileName = ", obj.fileName); } catch { }
          try { this.printLn(pre, "lineNumber = ", obj.lineNumber); } catch { }
          try { this.printLn(pre, "columnNumber = ", obj.columnNumber); } catch { }
          try { this.printLn(pre, "stack = ", obj.columnNumber); } catch { }
        } else if (Object.getPrototypeOf(obj) == "[object Object]") {
          this.printLn(prefix, name, " = {}");
        } else {
          // all properties hidden
          this.printLn(prefix, name, " = (", this._getObjType(obj), "){}");
          if (this.options.tpo_unknownObjectPrint) {
            const pre = prefix + this.options.tpo_specialPrefix;
            this.printLn(pre, "isSealed = ", Object.isSealed(obj))
            this.printLn(pre, "isFrozen = ", Object.isFrozen(obj));
            this.printLn(pre, "isExtensible = ", Object.isExtensible(obj));
            this.printLn(pre, "prototype = ", Object.getPrototypeOf(obj));
            this.printLn(pre, "prototype.prototype = ", Object.getPrototypeOf(Object.getPrototypeOf(obj)));
            this.printVar(Object.getOwnPropertyNames(obj), ".propertyNames", pre);
            this.printVar(Object.getOwnPropertyDescriptors(obj), "propertyDescriptors", pre);
          }
        }
      } else {
        // print keys of object
        const isArray = obj instanceof Array || obj instanceof HTMLCollection;
        if (isArray) {
          if (obj instanceof Array) {
            this.printLn(prefix, name, " = [ length: ", keys.length);
          } else {
            let t = "unknown Object";
            try {
              t = this._getObjType(obj);
            } catch (e) { }
            this.printLn(prefix, name, " = (", t, ")[ length: ", keys.length);
          }
        } else {
          let t = "unknown Object";
          try {
            t = this._getObjType(obj);
          } catch (e) { }
          this.printLn(prefix, name, " = (", t, "){ length: ", keys.length);
        }
        if (lvl !== 0 && keys.length > this.options.tpo_innerMaxLength) {
          this.printLn(prefix + this.options.tpo_objectPrefix, "(too long)");
        } else {
          const prefixIn = prefix + this.options.tpo_objectPrefix;
          keys.forEach((key, index) => {
            const type = typeof (obj[key]);
            const position = isArray ? key : (index + ": " + key);
            if (obj[key] === obj) {
              this.printLn(prefixIn, position, " = (parent redefinition) ");
            } else if (type === "function" || type === "undefined") {
              this.printLn(prefixIn, position, " = (", type, ") ");
            } else if (type === "boolean" || type === "number") {
              this.printLn(prefixIn, position, ' = ', obj[key]);
            } else if (type === "string") {
              this.printLn(prefixIn, position, ' = `', obj[key], '`');
            } else if (type === "object") {
              this._printObject(obj[key], position, prefixIn, lvl + 1);
            } else {
              this.printLn(prefixIn, position, " = (", type, ") ", obj[key]);
            }
          });//-> forEach key
        }
        this.printLn(prefix, isArray ? "]" : "}");
      }//-> if keys
    }//-> if obj, lvl
  }//-> function _printObject
  //#endregion

  submitTerminalInput() {
    const input = this.inputTextEl.value;
    if (input.length > 0) {
      if (this.options.slashCommands && !input.startsWith("/")) {
        //# if not a command: print
        this.printLn(input);
      } else {
        //# if it's a command: execute
        this.terminalCommand(this.options.slashCommands ? input.substring(1) : input);
      }
    }
    this.inputTextEl.value = ""; //# clear the input field
    this.inputTextEl.focus();
    return false;  //# prevent <form> from submitting
  };

  terminalClose() {
    const terminalBackground = this.backgroundEl;
    if (terminalBackground && terminalBackground.classList.contains(WTerminal.VISIBLE_CLASS)) {
      terminalBackground.classList.remove(WTerminal.VISIBLE_CLASS);
    } else if (typeof terminalBackground === "undefined") {
      this.printError("This is not a dropdown terminal.");
    }
  };

  terminalOpen() {
    const terminalBackground = this.backgroundEl;
    if (terminalBackground === null) return;
    if (!terminalBackground.classList.contains(WTerminal.VISIBLE_CLASS)) {
      terminalBackground.classList.add(WTerminal.VISIBLE_CLASS);
    }
    // this.inputTextEl.focus();
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
    setInterval(() => this.inputTextEl.focus(), 100);
  };

  terminalOpenClose() {
    const terminalBackground = this.backgroundEl;
    if (terminalBackground === null) return;
    if (!terminalBackground.classList.contains(WTerminal.VISIBLE_CLASS)) {
      terminalBackground.classList.add(WTerminal.VISIBLE_CLASS);
      // this.inputTextEl.focus();
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
      setInterval(() => this.inputTextEl.focus(), 100);
    } else {
      terminalBackground.classList.remove(WTerminal.VISIBLE_CLASS);
    }
  }

  isTerminalOpen() {
    const terminalBackground = this.backgroundEl;
    if (terminalBackground)
      return terminalBackground.classList.contains(WTerminal.VISIBLE_CLASS);
    return true;
  };

  terminalConst() {
    const c = {};
    c.version = WTerminal.VERSION;
    //css & html element relations:
    c.cssLinkUrl = WTerminal.CSS_LINK_URL;
    c.cssLinkId = WTerminal.CSS_LINK_ID;
    c.backgroundClass = WTerminal.BACKGROUND_CLASS;
    c.containerClass = WTerminal.CONTAINER_CLASS;
    c.outputClass = WTerminal.OUTPUT_CLASS;
    c.inputClass = WTerminal.INPUT_CLASS;
    c.visibleClass = WTerminal.VISIBLE_CLASS;
    //globals
    c.globalLastResult = WTerminal.GLOBAL_LAST_RESULT;
    c.globalLastError = WTerminal.GLOBAL_LAST_ERROR;
    c.globalHistory = WTerminal.GLOBAL_HISTORY;
    //auto insert
    c.globalTestVariables = WTerminal.AUTO_INSERT_GLOBAL_TEST_VARIABLES;
    c.autoInsertDropdown = WTerminal.AUTO_INSERT_DROPDOWN;
    c.autoInsertCSS = WTerminal.AUTO_INSERT_CSS;
    c.printLogo = WTerminal.PRINT_LOGO;
    //Options: open/close
    c.keyOpen = WTerminal.KEY_OPEN;
    c.keyOpenCtrl = WTerminal.KEY_OPEN_CTRL;
    c.keyClose = WTerminal.KEY_CLOSE;
    c.keyHistory = WTerminal.KEY_HISTORY;
    //Options: output
    c.defaultPrintToConsoleLog = WTerminal.PRINT_TO_CONSOLE_LOG;
    //Options: input
    c.defaultSlashCommands = WTerminal.SLASH_COMMANDS;
    c.defaultInputStrict = WTerminal.INPUT_STRICT;
    c.defaultPrintAliasChange = WTerminal.PRINT_ALIAS_CHANGE;
    c.defaultPrintInnerCommands = WTerminal.PRINT_INNER_COMMANDS;
    c.defaultPrintCommandReturn = WTerminal.PRINT_COMMAND_RETURN;
    c.defaultMaxHistory = WTerminal.MAX_HISTORY;
    //Options: extensions
    c.defaultPrintExtensionAdd = WTerminal.PRINT_EXTENSION_ADD;
    c.defaultPrintAliasAdd = WTerminal.PRINT_ALIAS_ADD;
    //Options: TPO aka terminalPrintObject const
    c.tpo_defaultUnknownObjectPrint = WTerminal.TPO_UNKNOWN_OBJECT_PRINT;
    c.tpo_defaultObjectPrefix = WTerminal.TPO_OBJECT_PREFIX;
    c.tpo_defaultSpecialPrefix = WTerminal.TPO_SPECIAL_PREFIX;
    c.tpo_defaultMaxDepth = WTerminal.TPO_MAX_DEPTH;
    c.tpo_defaultInnerMaxLength = WTerminal.TPO_INNER_MAX_LENGTH;
    return c;
  }

  //#region input
  static aliasList = Object.freeze({ //freeze object to make it immutable/const-value
    "?": "help",
    cmdlist: "help",
    print: "echo",
    version: "const version ",
  });

  static commandList = Object.freeze({ //freeze object to make it immutable/const-value
    alias: {
      run: function(term) {
        term.printList(WTerminal.aliasList);
        term.printList(term.aliasExtensionList);
      },
      help: function(term) {
        term.printBold("Usage:");
        term.printLn("alias               //Prints all aliases");
        term.printBold("About alias usage:");
        term.printLn("An alias-name has no spaces, but the alias-value can have multiple spaces.");
        term.printLn("When the terminal detects an alias-name as the first input word, it gets replaced to the alias-value.");
        term.printLn("When the alias-value contains a space, then the arguments will be");
        term.printLn("  joined with the alias-value without a space joining them.");
        term.printBold("Samples of using an alias:");
        term.printLn("?                   //Changes to: `help`");
        term.printLn("? clear             //Changes to: `help clear`");
        term.printLn("version             //Changes to: `const version ` (command, space at the end)");
        term.printLn("version clear       //Changes to: `const version clear`");
        term.printLn("terminal            //Changes to: `printvar -r terminal` (command, no space at the end)");
      }
    },
    clear: {
      run: function(term) {
        term.clearOutput();
      },
      help: function(term) {
        term.printLn("Clears terminal output.");
      }
    },
    close: {
      run: function(term) {
        term.terminalClose();
      },
      help: function(term) {
        term.printLn("Closes dropdown terminal.");
      }
    },
    const: {
      run: function(term, argLine) {
        const c = term.terminalConst();

        if (argLine == "") {
          term.printVar(c, "const");
          return c;
        } else if (c[argLine] !== undefined) {
          term.printVar(c[argLine], argLine);
          return c[argLine];
        }
      },
      help: function(term) {
        term.printBold("Usage:");
        term.printLn("const               //Prints & returns all constant variables.");
        term.printLn("const version       //Prints & returns only the version constant.");
      }
    },
    date: {
      run: function(term) {
        const d = new Date().toDateString();
        term.printLn("The date is " + d);
        return d;
      },
      help: function(term) {
        term.printLn("Returns the date.");
      }
    },
    echo: {
      run: function(term, argLine) {
        if (argLine.charAt(0) == '-') {
          if (argLine.charAt(1) == 'r') {
            term.printError(argLine.substring(3));
            return;
          } else if (argLine.charAt(1) == 'g') {
            term.printLn(WTerminal.createElement('span', { style: "color: green;" }, argLine.substring(3)));
            return;
          } else if (argLine.charAt(1) == 'b') {
            term.printLn(WTerminal.createElement('span', { style: "color: blue;" }, argLine.substring(3)));
            return;
          }
        }
        term.printLn(argLine);
      },
      help: function(term) {
        term.printLn("Prints arguments.");
        term.printBold("Usage:");
        term.printLn('echo hello          //Prints "hello".');
        term.printLn('echo -r hello       //Prints "hello", but in red.');
        term.printLn('echo -g hello       //Prints "hello", but in green.');
        term.printLn('echo -b hello       //Prints "hello", but in blue.');
      }
    },
    height: {
      run: function(term, argLine) {
        if (argLine) {
          term.outputEl.style.minHeight = argLine; // sample 40em (40 lines)
          term.outputEl.style.maxHeight = argLine;
        } else {
          term.printLn("height: " + term.outputEl.style.minHeight)
        }
      },
      help: function(term) {
        term.printLn("gets or sets the height of the terminal-output element")
        term.printLn("height 40em    // sets terminal-output height to 40 lines")
      }
    },
    help: {
      run: function(term, argLine) {
        if (argLine == '') {
          term.print(`Open the terminal with ${(term.options.keyOpenCtrl ? "CTRL + " : "")}the ${term.options.keyOpen}-key. `);
          term.print(`Close the terminal with the ${term.options.keyClose}-key. `);
          term.printLn(`Use the ${term.options.keyHistory}-key to get previous command. `)
          term.printLn(`Type a command, optionally add some arguments, and press enter or click on submit.`);
          term.printBold("Basic commands:");
          Object.keys(WTerminal.commandList).forEach((command, i) => {
            if (i == 0) {
              term.print("  " + command);
            } else if (i % 10 == 0) {
              term.printLn(", ");
              term.print("    " + command);
            } else {
              term.print(", " + command);
            }
          });
          term.printLn();
          term.printBold("Extension commands:");
          Object.keys(term.commandListExtension).forEach((command, i) => {
            if (i == 0) {
              term.print("  " + command);
            } else if (i % 10 == 0) {
              term.printLn(", ");
              term.print("    " + command);
            } else {
              term.print(", " + command);
            }
          });
          term.printLn();
          term.printBold("Using help:");
          term.printLn("help [COMMAND_NAME] //Prints help, optionally on a command");
          term.printBold("Samples of help:");
          term.printLn("help                //Prints this help again.");
          term.printLn("help help           //Prints more help.");
          term.printLn("help option         //Prints help on the option command.");
          term.printLn("help alias          //Prints help on the alias command.");
        } else {
          if (WTerminal.commandList[argLine] !== undefined) {
            WTerminal.commandList[argLine].help(term);
          } else if (term.commandListExtension[argLine] !== undefined) {
            if (typeof term.commandListExtension[argLine].help === "function") {
              term.commandListExtension[argLine].help(term);
            } else {
              term.printLn("No help for command: \"" + argLine + "\"");
            }
          } else {
            term.printError("Help error: Unknown command: \"" + argLine + "\"");
          }
        }
      },
      help: function(term) {
        term.printLn("Prints help about the terminal or given command.");
        term.printBold("For terminal help use:");
        term.printLn("help");
        term.printBold("For help on a command use:");
        term.printLn("help commandName");
        term.printBold("Samples of help:");
        term.printLn("help            //prints terminal help.");
        term.printLn("help help       //prints this help again.");
        term.printLn("help option      //prints help on the option command.");
        term.printLn("help alias      //prints help on the alias command.");
        term.printBold("Advanced usage:")
        term.printLn("Previous commands are stored in `terminal.history`")
        term.printLn("Every command is a function, the result of executing this");
        term.printLn("   will be stored in the global variable `terminal.lastResult`.");
        term.printLn("Multiple commands can be chained, separated by `&&`.");
        term.printBold("Advanced samples:");
        term.printLn("const version && printvar terminal");
        term.printLn("  //Gets version value, automatically stores it in terminal.lastResult");
        term.printLn("  //  then prints out the terminal variable (you will see lastResult in there)");
        term.printLn("printvar -r document.body.children && printvar -r terminal.lastResult.0.children");
        term.printLn("  //Get, print and return html body tag's children");
        term.printLn("  //  && print out the children property of first element (of body).");
        term.printLn("gdb && result .0.children  // does the same as above");
      }
    },
    history: {
      run: function(term) {
        term.printList(term.history, "history");
      },
      help: function(term) {
        term.printLn("prints this terminal's history");
      }
    },
    option: {
      run: function(term, argLine) {
        if (argLine == '') {
          term.printList(term.options);
        } else {
          let args = WTerminal.splitToArguments(argLine);
          for (const element of args) {
            if (!element.includes("=")) {
              throw new Error("Option set error: argument is missing \"=\"");
            }
            const keyValuePair = element.split("=");
            const name = keyValuePair[0];
            if (term.options[name] === undefined) {
              throw new Error("Option set error: invalid option name `" + name + "`");
            }
            term.options[name] = stringToValue(keyValuePair[1]);
          }
          return this.options; //todo: make clone for security?
        }
      },
      help: function(term) {
        term.printBold("Usage:");
        term.printLn("option                           //Prints & returns all the options used.");
        term.printLn("option [VARIABLE_NAME=VALUE]     //Sets option VARIABLE_NAME to the following value.");
        term.printBold("Samples:");
        term.printLn("option printAliasChange=true     //Sets option printAliasChange to true.");
        term.printLn("option printCommandReturn=true   //Sets option printCommandReturn to true.");
        term.printLn("option tpo_objectPrefix=\"#  \"    //Sets objectPrefix to `#  `.")
      }
    },
    reload: {
      run: function(term) {
        location.reload();
      },
      help: function(term) {
        term.printLn("Reloads page.");
      }
    },
    thisterminal: {
      run: function(term) {
        term.printVar(term, "terminal");
      },
      help: function(term) {
        term.printLn("prints this terminal object")
      }
    },
    terminalnames: {
      run: function(term) {
        term.printList(Object.keys(WTerminal.terminals));
      },
      help: function(term) {
        term.printLn("prints the names of all terminal objects")
      }
    },
    time: {
      run: function(term) {
        const d = new Date();
        const t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        term.printLn("The time is " + t);
        return t;
      },
      help: function(term) {
        term.printLn("Returns the current time.");
      }
    },
    uptime: {
      run: function(term) {
        const newDate = new Date();
        let diffTime = Math.abs(newDate - term.startupDate);

        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          term.print(diffDays + " days ");
          diffTime -= diffDays * (1000 * 60 * 60 * 24);
        }

        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours > 0) {
          term.print(diffHours + " hours ");
          diffTime -= diffHours * (1000 * 60 * 60);
        }

        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes > 0) {
          term.print(diffMinutes + " minutes ");
          diffTime -= diffMinutes * (1000 * 60);
        }

        const diffSeconds = Math.floor(diffTime / (1000));
        if (diffSeconds > 0) {
          term.print(diffSeconds + " seconds ");
          diffTime -= diffSeconds * (1000);
        }

        if (diffTime > 0) {
          term.print(diffTime + " milliseconds ");
        }
        term.printLn();
      },
      help: function(term) {
        term.printLn("Prints how long the terminal has been up.");
      }
    },
    starttime: {
      run: function(term) {
        term.printLn("Terminal initialized on ", term.startupDate);
        return term.startupDate;
      },
      help: function(term) {
        term.printLn("Returns when the terminal was started/initialized.");
      }
    },
  });

  terminalAddComand(name, run, help) {
    if (name === undefined || typeof name !== "string") {
      this.printError("TerminalAddCommand error: Variable name must be a string.");
      return;
    }
    if (name === '') {
      this.printError("TerminalAddCommand error: Variable name can not be empty.");
      return;
    }
    if (name.includes(' ')) {
      this.printError("TerminalAddCommand error: Variable name can have spaces.");
      return;
    }
    if (run === undefined || typeof run !== "function") {
      this.printError("TerminalAddCommand error: Variable run must be a function.");
      return;
    }
    if (help !== undefined && typeof run !== "function") {
      this.printError("TerminalAddCommand error: Variable help must be a function or undefined.");
      return;
    }
    if (this.options.printExtensionAdd) this.printLn("Command extension added: " + name);
    this.commandListExtension[name] = { run: run, help: help };
  }

  static terminalAddCommand(name, run, help) {
    for (const tName in this.terminals) {
      const t = this.terminals[tName];
      t.terminalAddComand(name, run, help);
    }
  }

  terminalAddAlias(name, alias) {
    if (typeof name !== "string") {
      this.printError("AddAlias error: name must be a string.");
      return false;
    }
    if (name.includes(' ')) {
      this.printError("AddAlias error: name can not have spaces.")
      return false;
    }
    if (typeof alias !== "string") {
      this.printError("AddAlias error: alias must be a string.");
      return false;
    }
    if (this.options.printAliasAdd) this.printLn(`Alias added: ${name} = \`${alias}\``);
    this.aliasExtensionList[name] = alias;
    return true;
  }

  static terminalAddAlias(name, alias) {
    for (const tName in this.terminals) {
      const t = this.terminals[tName];
      t.terminalAddAlias(name, alias);
    }
  }

  terminalCommand(cmdLine, isSuperCommand = false) {
    if (typeof cmdLine !== "string") {
      this.printError("Error: Wrong cmdLine type: " + typeof cmdLine);
      return;
    }
    if (cmdLine == '') return;

    cmdLine = cmdLine.trim();
    // print input
    if (isSuperCommand) {
      this.printLn(WTerminal.createElement('u', null, 'super-command#'), WTerminal.createElement('b', null, " ", cmdLine));
    } else {
      let d = new Date();
      if (this.outputEl.innerHTML != '') this.print('\n')
      this.printLn(WTerminal.createElement('u', null, "(" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")#"), WTerminal.createElement('b', null, " ", cmdLine));
    }
    // execute
    let result;
    try {
      if (cmdLine.includes("&&")) {
        // multiple commands
        let commands = cmdLine.split("&&");
        // this.printList(commands); 
        for (let command of commands) {
          command = command.trim();
          if (this.options.printInnerCommands) this.printLn(WTerminal.createElement("u", null, "inner-command#"), WTerminal.createElement("b", null, " ", command));
          result = this._terminalCommand(command);
        }
      } else {
        // single command
        result = this._terminalCommand(cmdLine);
      }
    } catch (e) {
      // this.printError("Command error: ", e)
      this.printError("Command error:");
      this.printVar(e, "error");
      this.lastError = e;
      if (WTerminal.GLOBAL_LAST_ERROR) {
        if (typeof globalThis.terminal !== "object") {
          globalThis.terminal = {};
        }
        globalThis.terminal.lastError = e;
      }
      // return e;
    }
    // keep a history
    if (this.history === undefined || !(this.history instanceof Array)) {
      this.history = [];
    }
    this.history.unshift(cmdLine);
    if (this.history.length > this.options.maxHistory) {
      this.history.splice(this.options.maxHistory);
    }
    if (WTerminal.GLOBAL_HISTORY) {
      if (typeof globalThis.terminal !== "object") {
        globalThis.terminal = {};
      }
      if (globalThis.terminal.history === undefined || !(globalThis.terminal.history instanceof Array)) {
        globalThis.terminal.history = [];
      }
      globalThis.terminal.history.unshift(cmdLine);
      if (globalThis.terminal.history.length > this.options.maxHistory) {
        globalThis.terminal.history.splice(this.options.maxHistory);
      }
    }
    return result;
  };

  _terminalCommand(cmdLine) {
    if (cmdLine == '') return;
    // get target values
    const split = cmdLine.split(' ');
    let command = split.shift();
    let argLine = split.join(' ');

    // not strict
    if (!this.options.inputStrict) {
      command = command.toLowerCase();
    }
    // check for alias
    let al;
    if (WTerminal.aliasList[command]) {
      al = WTerminal.aliasList[command];
    } else if (this.aliasExtensionList[command]) {
      al = this.aliasExtensionList[command];
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
      if (this.options.printAliasChange) {
        this.printLn("Alias found#", WTerminal.createElement('b', null, command + " " + argLine));
      }
    }
    // execute
    let result;
    if (WTerminal.commandList[command]) {
      result = WTerminal.commandList[command].run(this, argLine);
    } else if (this.commandListExtension[command]) {
      result = this.commandListExtension[command].run(this, argLine);
    } else {
      this.printError("Error: Unknown command: \"" + command + "\"");
      this.printLn("Try help");
      return;
    }
    // print result
    if (this.options.printCommandReturn) {
      this.printVar(result, `Result of \`${cmdLine}\``);
    }
    // store result
    this.lastResult = result;
    if (WTerminal.GLOBAL_LAST_RESULT) {
      if (typeof globalThis.terminal !== "object" && typeof result !== "undefined") {
        globalThis.terminal = {};
      }
      if (typeof globalThis.terminal === 'object' &&
        (typeof globalThis.terminal.lastResult !== "undefined" || typeof result !== "undefined")) {
        globalThis.terminal.lastResult = result;
      }
    }
    return result;
  }//-> function _terminalCommand
  //#endregion

  static instalDropdownTerminal() {
    if (WTerminal.terminals.dropdown) return;
    if (document.body) {
      new WTerminal('dropdown', null, null);
    } else {
      window.addEventListener("load", () => new WTerminal('dropdown', null, null));
    }
  }

  static open() {
    if (WTerminal.terminals.dropdown) {
      WTerminal.terminals.dropdown.terminalOpen();
    } else {
      if (confirm("Dropdown terminal is not available. Create terminal?")) {
        instalDropdownTerminal();
        WTerminal.terminals.dropdown.terminalOpen();
      }
    }
  }

}//-> class WTerminal

//#region init
//Globals
if (WTerminal.AUTO_INSERT_GLOBAL_TEST_VARIABLES) {
  globalThis.terminal = {};
  globalThis.terminal.version = WTerminal.VERSION;
  globalThis.terminal.terminals = WTerminal.terminals;
  globalThis.terminal.wterminal = WTerminal;
  // terminal.options = options;
  globalThis.terminal.testvars = {};
  const p = globalThis.terminal.testvars;
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

if (WTerminal.AUTO_INSERT_CSS) {
  if (document.getElementById(WTerminal.CSS_LINK_ID) === null) {
    document.head.append(WTerminal.createElement(
      'link', { id: WTerminal.CSS_LINK_ID, rel: "stylesheet", href: WTerminal.CSS_LINK_URL }));
  }
}
if (WTerminal.AUTO_INSERT_DROPDOWN) {
  WTerminal.instalDropdownTerminal();
}
//#endregion

const getWTerminal = function(name) {
  return WTerminal.terminals[name];
}
