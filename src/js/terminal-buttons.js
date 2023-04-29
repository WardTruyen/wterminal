window.addEventListener("load", terminalRefocusInput);

function btn_terminalHelp() {
  terminalCommand("help");
  terminalRefocusInput();
}

function btn_promptSample() {
  terminalPrintTitle("Prompt sample:");
  let age = prompt("Enter your age:", "404");
  terminalPrintLn("Age-input: " + age);
  let days = age * 365;
  terminalPrintLn(`Days alive: ${days}`);
  let weeks = Math.round(days / 7);
  terminalPrintLn(`Weeks alive: ${weeks}`);
  let adult = age >= 18;
  terminalPrintLn("Type: " + (adult ? "adult" : "minor"));
  terminalRefocusInput();
}

function btn_kittySample() {
  terminalPrintTitle("Kitty sample:");
  terminalPrintError("Error: Kitties are cute!");
  terminalPrintLn('<img src="img/kitty.jpg">Hello kitty!');
  terminalRefocusInput();
}

function btn_printObjectSample() {
  terminalPrintTitle("print Object sample 1:");
  terminalPrintVar("hello");
  terminalPrintVar(3.1419);
  terminalPrintTitle("print Object sample 2:");
  let myObject = { hello: "World", number:100};
  myObject.InnerObject = { foo: "bar", myFunction: btn_printObjectSample}
  myObject.array = [1,2,4,8];
  terminalPrintVar(myObject, "sample");
  terminalRefocusInput();
}

function btn_terminalClear(){
  terminalClear();
  terminalRefocusInput();
}
