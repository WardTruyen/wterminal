/* Author: Ward Truyen
* Version: 1.0.0
* About:   This adds some password generation and testing functions
*/
{
  const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
  const NUMBERS = "1234567890";
  const SPECIAL_CHARACTERS = "!@#$%^&*()_-+=,./<>\\|[]{}";
  const ALL_CHARACTERS = UPPERCASE_LETTERS + LOWERCASE_LETTERS + NUMBERS + SPECIAL_CHARACTERS;

  const initTerminalPasswCommands = function() {
    const generatePasswordHelp = function(term) {
      term.printLn("Generates a new password and prints it out. But also copies it for you.");
    }
    const generatePassword = function(term, argLine) {
      let passwd = "";
      let length = 15;
      for (let i = 0; i < length; i++) {
        passwd += ALL_CHARACTERS.charAt(Math.floor(Math.random() * ALL_CHARACTERS.length));
      }
      const el = document.createElement('span');
      el.innerText = passwd;
      // el.style.fontSize = 'x-large';
      el.style.paddingLeft = '1em';
      term.printLn("Generated password(length=" + length + "):", el);
      navigator.clipboard.writeText(passwd);
    };
    //add command
    if (terminalAddCommand === undefined) {
      console.error("terminalAddCommand is missing!");
      return;
    }
    terminalAddCommand("generatepassword", generatePassword, generatePasswordHelp);
    const sha1 = function(string) {
      const buffer = new TextEncoder("utf-8").encode(string);
      return crypto.subtle.digest("SHA-1", buffer).then(function(buffer) {
        // Get the hex code
        let hexCodes = [];
        const view = new DataView(buffer);
        for (let i = 0; i < view.byteLength; i += 4) {
          // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
          const value = view.getUint32(i)
          // toString(16) will give the hex representation of the number without padding
          const stringValue = value.toString(16)
          // We use concatenation and slice for padding
          const padding = '00000000'
          const paddedValue = (padding + stringValue).slice(-padding.length)
          hexCodes.push(paddedValue);
        }
        // Join all the hex strings into one
        return hexCodes.join("");
      });
    };
    const isPasswordSafeHelp = function(term) {
      term.printLn("Checks if a password is posted as breached by pwnedpasswords.com");
    };
    const isPasswordSafe = function(term, argLine) {
      const password = argLine;
      term.printLn("Checking password, please wait...");

      sha1(password).then((hash) => {
        fetch("https://api.pwnedpasswords.com/range/" + hash.substr(0, 5)).then((response) => response.text()).then((response) => {

          const respLines = response.split('\n');
          const hashSub = hash.slice(5).toUpperCase();
          let isSafe = true;
          // console.log('hash: ' + hashSub);
          for (let i in respLines) {
            // console.log(i+': '+respLines[i])
            if (respLines[i].substring(0, hashSub.length) == hashSub) {
              isSafe = false;
              break;
            }
          }
          if (isSafe) {
            term.printLn("Password is safe.");
          } else {
            term.printLn("Password has been breached.");
          }
        }).catch((err) => {
          outputSafe.innerText = "Could not check if password is safe: " + err;
        });
      });
    };
    terminalAddCommand("ispasswordsafe", isPasswordSafe, isPasswordSafeHelp);
  };
  //init
  if (document.body) {
    initTerminalPasswCommands();
  } else {
    window.addEventListener("load", initTerminalPasswCommands);
  }
}
