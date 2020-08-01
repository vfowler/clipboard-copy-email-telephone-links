// find all links with mailto: or tel:
const MAILTELLINKS = document.querySelectorAll(
  'a[href^="mailto:"],a[href^="tel:"]'
);

function copy(btnId) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
  // DOES NOT WORK: navigator.clipboard.writeText(copyText);
  // So despite Document.execCommand() marked as obsolete at https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#Using_execCommand
  // I'm resorting to it, as per https://css-tricks.com/native-browser-copy-clipboard/
  var range = document.createRange();
  // theBtn was appended after the link, so get the previousSibling of theBtn
  var mailOrTelA = document.getElementById(btnId).previousSibling;
  // Select the email or tel link anchor text.
  range.selectNode(mailOrTelA);
  window.getSelection().addRange(range);

  try {
    // Now that we've selected the anchor text, execute the copy command
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copy command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  // Remove the selections
  window.getSelection().removeAllRanges();
}

if (MAILTELLINKS) {
  // loop through all …
  MAILTELLINKS.forEach(function (mailtelLink) {
    // create a button
    let theBtn = document.createElement("button");
    // make it a non-submitting button
    theBtn.setAttribute("type", "button");
    // add text content in theBtn
    theBtn.appendChild(document.createTextNode("Copy"));
    // add inclusively hidden text for screen readers
    let visHiddenSpan = document.createElement("span");
    visHiddenSpan.setAttribute("class", "sr-only");
    // eg <span class=sr-only></span>
    visHiddenSpan.innerText = mailtelLink.innerText + " to clipboard";
    // insert visHiddenSpan in theBtn
    theBtn.insertAdjacentElement("beforeend", visHiddenSpan);

    // give it a class so it can be styled (and styled different to any other button[type=button] elements)
    theBtn.setAttribute("class", "copyBtn");
    // set an id on theBtn
    // NOTE: all the href=mailto and href=tel attributes must be unique otherwise the following will create non-unique id attributes and render the document invalid!
    theBtn.setAttribute("id", mailtelLink.href);

    // attach event listener with argument of theBtn.id
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Event_listener_with_anonymous_function
    theBtn.addEventListener(
      "click",
      function () {
        copy(theBtn.getAttribute("id"));
      },
      false
    );
    // insert theBtn after the link
    mailtelLink.insertAdjacentElement("afterend", theBtn);
  });
}
