/* Author: Ward Truyen
* Version: 1.0.0
* About:   This auromaticly adds the other terminal extention scripts.
* THIS SCRIPT DOES NOT WORK FOR A BROWSER-ADDON/EXTENTION!
*/

{// this code block hides the variables below from other scripts.
  const addScripts = function() {
    // location of script files
    const extentionScripts = [
      "../termext/ext-variables.js",
      "../termext/ext-cookies.js",
      "../termext/ext-eval.js",
      "../termext/ext-timerdebug.js",
      "../termext/ext-stresstest.js",
      "../termext/ext-popvar.js",
      "../termext/ext-passw.js",
      // "../termext/ext-featuretest.js",
      // "../termext/ext-forcelocals.js",
      // "../termext/ext-transfer.js", // only for browser-extention
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
