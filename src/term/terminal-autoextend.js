/* Author: Ward Truyen
* Version: 1.0.0
* About:   This auromaticly adds the other terminal extention scripts.
* THIS SCRIPT DOES NOT WORK FOR A BROWSER-ADDON/EXTENTION!
*/

{// this code block hides the variables below from other scripts.
  const addScripts = function() {
    // location of script files
    const extentionScripts = [
      "term/terminal-variables.js",
      "term/terminal-cookies.js",
      "term/terminal-eval.js",
      "term/terminal-featuretest.js",
      "term/terminal-stresstest.js",
      "term/terminal-forcelocals.js",
      "term/terminal-timerdebug.js",
      // "term/terminal-transfer.js",
    ];

    for (let ext of extentionScripts) {
      const element = document.createElement("script");
      // element.addAttribute("src", ext);
      element.src = ext;
      document.head.append(element);
    }
  }

  if (document.body) {
    addScripts();
  } else {
    window.addEventListener("load", addScripts());
  }
}
