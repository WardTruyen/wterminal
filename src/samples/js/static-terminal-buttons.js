const TERMINAL_NAME = "static";

window.addEventListener("load", 
  ()=>getTerminal(TERMINAL_NAME).inputTextEl.focus());

function btn_terminalHelp() {
  let term = getTerminal(TERMINAL_NAME);
  term.terminalCommand("help");
  term.inputTextEl.focus();
}

function btn_promptSample() {
  let term = getTerminal(TERMINAL_NAME);
  term.printTitle("Prompt sample:");
  let age = prompt("Enter your age:", "404");
  term.printLn("Age-input: " + age);
  let days = age * 365;
  term.printLn(`Days alive: ${days}`);
  let weeks = Math.round(days / 7);
  term.printLn(`Weeks alive: ${weeks}`);
  let adult = age >= 18;
  term.printLn("Type: " + (adult ? "adult" : "minor"));
  term.inputTextEl.focus();
}

function btn_kittySample() {
  let term = getTerminal(TERMINAL_NAME);
  term.printTitle("Kitty sample:");
  term.printError("Error: Kitties are cute!");
  // term.printLn('<img src="img/kitty.jpg">Hello kitty!');
  let img = document.createElement("img");
  img.src = "img/kitty.jpg";
  term.printLn(img, "Hello kitty!");
  term.inputTextEl.focus();
}

function btn_printObjectSample() {
  let term = getTerminal(TERMINAL_NAME);
  term.printTitle("print Object sample 1:");
  term.printVar("hello");
  term.printVar(3.1419);
  term.printTitle("print Object sample 2:");
  let myObject = { hello: "World", number:100};
  myObject.InnerObject = { foo: "bar", myFunction: btn_printObjectSample}
  myObject.array = [1,2,4,8];
  term.printVar(myObject, "sample");
  term.inputTextEl.focus();
}

function btn_terminalClear(){
  let term = getTerminal(TERMINAL_NAME);
  term.clearOutput();
  term.inputTextEl.focus();
}

