/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/

{// this code block hides the variables below from other scripts.

  class PopUpWindow{
    constructor(variableName, term){
      this.variableName = variableName;
      this.printVar = term.printVar;
      this._getObjType = term._getObjType;
      this._printObject = term._printObject;
      this.printLn = term.printLn;
      this.options = {};
      let o = this.options;
      let to = term.options;
      o.printToConsoleLog = false;
      o.tpo_unknownObjectPrint = to.tpo_unknownObjectPrint ;
      o.tpo_objectPrefix = to.tpo_objectPrefix;
      o.tpo_specialPrefix = to.tpo_specialPrefix;
      o.tpo_maxDepth = to.tpo_maxDepth;
      o.tpo_innerMaxLength = to.tpo_innerMaxLength;
      this.createPopup();
      this.printVariable();
    }

    createPopup(){
      const containerAttributes = {
        style: 'border: 1px solid black; z-index: 9990; position: absolute; top: 3em; left: 3em; background: white;'
      };
      this.container = createElement('div', containerAttributes);
      this.outputEl = createElement('pre', {style: 'margin: 2px;'}, this.variableName);
      let btnRefresh = createElement('button', null, 'refresh');
      btnRefresh.addEventListener("click", ()=>this.printVariable());
      let btnClose = createElement('button',null, 'X');
      btnClose.addEventListener("click", ()=>this.closePopup());
      let headerDiv = createElement('div', {style: "border-bottom: 1px solid black; padding: 2px; background: #00000060"});
      headerDiv.appendChild(btnRefresh);
      let spanForClose = createElement('span', {style: "float: right;"}, btnClose);
      headerDiv.appendChild(spanForClose);
      this.container.appendChild(headerDiv);
      this.container.appendChild(this.outputEl);
      document.body.appendChild(this.container);

      headerDiv.onmousedown = (e)=>this.startDrag(e);
    }
    
    printVariable(){
      this.outputEl.innerHTML = '';
      this.printVar(terminalGetGlobal(this.variableName), this.variableName);
      // this.printVar(this.options, "this.options");
    }

    closePopup(){
      document.body.removeChild(this.container);
    }

    startDrag(e){
      e.preventDefault();
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      document.onmouseup = ()=>this.endDrag();
      document.onmousemove = (e)=>this.dragPopup(e);
    }

    dragPopup(e){
      // e = e || window.event;
      e.preventDefault();
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      this.container.style.top = (this.container.offsetTop - this.pos2) + "px";
      this.container.style.left = (this.container.offsetLeft - this.pos1) + "px";
    }

    endDrag(){
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
