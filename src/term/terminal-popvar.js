/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/

{// this code block hides the variables below from other scripts.
  const PAUSE_SYMBOL = "&#9724;"

  class PopUpWindow {
    static popupCounter = 0;
    constructor(variableName, term) {
      this.variableName = variableName;
      this.printVar = term.printVar;
      this._getObjType = term._getObjType;
      this._printObject = term._printObject;
      this.printLn = term.printLn;
      this.options = {};
      let o = this.options;
      let to = term.options;
      o.printToConsoleLog = false;
      o.tpo_unknownObjectPrint = to.tpo_unknownObjectPrint;
      o.tpo_objectPrefix = to.tpo_objectPrefix;
      o.tpo_specialPrefix = to.tpo_specialPrefix;
      o.tpo_maxDepth = to.tpo_maxDepth;
      o.tpo_innerMaxLength = to.tpo_innerMaxLength;
      this.createPopup();
      this.printVariable();
      this.intervalId = setInterval(() => this.printVariable(), 1000);
    }

    createPopup() {
      const t = 2 + PopUpWindow.popupCounter++;
      let containerStyle = 'border: 1px solid black; z-index: 9990; position: absolute; background: #ffffffa0; border-radius: 2px; backdrop-filter: blur(3px); box-shadow: 3px 3px 3px #00000066;';
      containerStyle += ` top: ${t}em; left: ${t}em;`;
      this.container = createElement('div', { style: containerStyle, title: this.variableName });
      const outputStyle = 'margin: 2px; font-family: Monospace, Incosolata, Courier; font-size: 12px; line-height: 1.05;';// overflow-y: scroll; max-height: ' + (window.innerHeight-80) +'px;';
      this.outputEl = createElement('pre', { style: outputStyle });
      this.btnPauseContinue = createElement('button', { title: "pause" });
      this.btnPauseContinue.innerHTML = PAUSE_SYMBOL;
      this.btnPauseContinue.addEventListener("click", () => this.onPausePlay());
      let btnRefresh = createElement('button', { title: "refresh" });
      btnRefresh.innerHTML = '&#8635;';
      btnRefresh.addEventListener("click", () => this.printVariable());
      let btnClose = createElement('button', { title: 'close' });
      btnClose.addEventListener("click", () => this.closePopup());
      btnClose.innerHTML = "&#10006;";
      let headerDiv = createElement('div', { style: "border-bottom: 1px solid black; padding: 2px; background: #00000060" });
      headerDiv.appendChild(btnRefresh);
      headerDiv.appendChild(this.btnPauseContinue);
      headerDiv.appendChild(document.createTextNode(" Popvar " + PopUpWindow.popupCounter));
      let spanForClose = createElement('span', { style: "float: right;" }, btnClose);
      headerDiv.appendChild(spanForClose);
      this.container.appendChild(headerDiv);
      this.container.appendChild(this.outputEl);
      document.body.appendChild(this.container);

      headerDiv.onmousedown = (e) => this.startDrag(e);
    }

    onPausePlay() {
      if (this.intervalId === 0) {
        this.intervalId = setInterval(() => this.printVariable(), 1000);
        this.printVariable();
        this.btnPauseContinue.innerHTML = PAUSE_SYMBOL;
        this.btnPauseContinue.title = "pause";
      } else {
        clearInterval(this.intervalId);
        this.intervalId = 0;
        this.btnPauseContinue.innerHTML = "&#9658;";
        this.btnPauseContinue.title = "play";
      }
    }

    printVariable() {
      const oldOutput = this.outputEl;
      const outputStyle = 'margin: 2px; font-family: Monospace, Incosolata, Courier; font-size: 12px; line-height: 1.05;';// overflow-y: scroll; max-height: ' + (window.innerHeight-80) +'px;';
      this.outputEl = createElement('pre', { style: outputStyle });
      this.printVar(terminalGetGlobal(this.variableName), this.variableName);
      // this.printVar(this.options, "this.options");
      oldOutput.replaceWith(this.outputEl);
    }

    closePopup() {
      document.body.removeChild(this.container);
    }

    startDrag(e) {
      if( e.button !== 0) return;
      e.preventDefault();
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      document.onmouseup = () => this.endDrag();
      document.onmousemove = (e) => this.dragPopup(e);
    }

    dragPopup(e) {
      // e = e || window.event;
      e.preventDefault();
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      this.container.style.top = (this.container.offsetTop - this.pos2) + "px";
      this.container.style.left = (this.container.offsetLeft - this.pos1) + "px";
    }

    endDrag() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  const initTerminalVariableCommands = function() {
    const ext = {
      popvar: {
        run: function(term, argLine) {
          if (globalThis === undefined) {
            term.printError("Do error: Missing globalThis");
          } else if (argLine == '') {
            term.printError("Do error: No name");
          } else {
            // return new PopUpWindow(argLine, term);
            new PopUpWindow(argLine, term);
          }
        },
        help: function(term) {
          term.printLn("Creates a popup window with (refreshable) the given variable contents.");
          term.printBold("Usage:");
          term.printLn("popvar VARIABLE_NAME               //shows VARIABLE_NAME contents in a popup");
          term.printBold("Samples:");
          term.printLn("popvar terminal                    //Shows the terminal variable contents in a popup");
        }
      },
    };

    const aliases = {
      pop: "popvar",
      pt: "popvar terminal",
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
