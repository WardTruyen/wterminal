/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds the test command to the terminal.
*               current test is to get local variables
*/

{// this code block hides the variables below from other scripts.
  const extentionCommandName = "forcelocals";
  const addExtention = function() {
    const help = function(term) {
      term.printLn("Runs a test to find local variables.");
    }
    const run = function(term) {
      // const CHARACTERS_START = 65; // 65='A'
      const SYMBOLS_START = 91; // prev is 'Z'
      const SYMBOLS_END = 96; // next is 'a'
      const CHARACTERS_END = 122; // 122='z'
      const positionId = "foce-position";
      const foundId = "force-found";
      term.printLn("Feature test warning: Under construction, can have unexpected results, errors and crashes.");
      term.printLn(`Looking for variables: at:<span id="${positionId}">ctA</span> found:<span id="${foundId}"></span>`)

      function replaceCharAt(str, index, replacement) {
        return str.substring(0, index) + replacement + str.substring(index + replacement.length);
      }

      function getNextCharacter(char) {
        char = '' + char;
        let number = char.charCodeAt(0);
        if (number == CHARACTERS_END) return;

        number += number
        if (number >= SYMBOLS_START && number <= SYMBOLS_END) return 'a';
        return String.fromCharCode(number);
      }

      function getNextName() {
        let name = document.getElementById(positionId).innerHTML;
        if (name === '') name = 'A';
        let currentIndex = name.length - 1;
        let currentChar = name.charAt(currentIndex);
        //const start = currentChar;
        let count = 0;
        do {
          try {
            term.printLn("name: " + name);
            const result = eval(name);
            if (result !== undefined) {
              term.printVar(result, name);
              document.getElementById(positionId).innerHTML = name;
              const foundEl = document.getElementById(foundId);
              foundEl.innerHTML = Number(foundEl.innerHTML) + 1;
              return;
            }
          } catch (e) { }
          currentChar = getNextCharacter(currentChar);
          if (currentChar === undefined) {
            // at z 
            // set character at current position to 'A'
            name = name.substring(0, currentIndex) + 'A';
            // while position > 0
            let index = currentIndex - 1;
            while (index > 0) {
              // get character one position down and increment if not 'z' and break else go down again
              let char = name.charCodeAt(index);
              if (char !== 'z') {
                char = getNextName(char);
                replaceCharAt(name, index, char);
                break;
              } else {
                index -= index;
              }
            }
            if (index < 0) {
              // all is 'z', create a new name with 1 more letter: 'AA'
              let newName = '';
              for (let i = 0; i < name.length + 1; i++) newName += 'A';
              document.getElementById(positionId).innerHTML = newName;
              return;
            }
          }
          name = name.substring(0, currentIndex) + currentChar;
          count++;
        } while (count < 100);
        document.getElementById(positionId).innerHTML = name;
      }

      getNextName();
      getNextName();
    };
    //add command
    if (terminalAddCommand === undefined) {
      console.error("AddExtention Error: TerminalAddCommand is missing!");
      return;
    }
    terminalAddCommand(extentionCommandName, run, help);
  };
  //init
  if (document.body) {
    addExtention();
  } else {
    window.addEventListener("load", addExtention);
  }
}
