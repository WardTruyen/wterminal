/* Author: Ward Truyen
* Version: 1.0.0
* About:   This auromaticly adds the other terminal extention scripts.
* THIS SCRIPT DOES NOT WORK FOR A BROWSER-ADDON/EXTENTION!
*/

{// this code block hides the variables below from other scripts.
  const addScripts = function() {
    // location of script files
    const extentionScripts = [
      "../termext/terminal-variables.js",
      "../termext/terminal-cookies.js",
      "../termext/terminal-eval.js",
      "../termext/terminal-timerdebug.js",
      "../termext/terminal-stresstest.js",
      "../termext/terminal-popvar.js",
      "../termext/terminal-passw.js",
      // "../termext/terminal-featuretest.js",
      // "../termext/terminal-forcelocals.js",
      // "../termext/terminal-transfer.js", // only for browser-extention
    ];

    for (let ext of extentionScripts) {
      const element = document.createElement("script");
      // element.addAttribute("src", ext);
      element.src = ext;
      document.head.append(element);
    }
  }//--> addScripts = function()  {

  if (document.body) {
    addScripts();
  } else {
    window.addEventListener("load", addScripts);
  }
}
