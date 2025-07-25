document.addEventListener("DOMContentLoaded", function () {
  const checkElement = setInterval(() => {
    const commandDialog = document.querySelector(".quick-input-widget");
    if (commandDialog) {
      // Apply the blur effect immediately if the command dialog is visible
      if (commandDialog.style.display !== "none") {
        runMyScript();
      }
      // Create an DOM observer to 'listen' for changes in element's attribute.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if (commandDialog.style.display === "none") {
              handleEscape();
            } else {
              // If the .quick-input-widget element (command palette) is in the DOM
              // but no inline style display: none, show the backdrop blur.
              runMyScript();
            }
          }
        });
      });

      observer.observe(commandDialog, { attributes: true });

      // Clear the interval once the observer is set
      clearInterval(checkElement);
    } else {
      console.log("Command dialog not found yet. Retrying...");
    }

    const container = document.querySelector(".composite.title .title-label");
    if (container) {
      const normalh2 = container.querySelector("h2[custom-hover]");
      normalh2.style.display = "none";
      if (!container.querySelector("h2:not([custom-hover])")) {
        const newH2 = document.createElement("h2");
        newH2.style.fontWeight = "400";
        newH2.style.fontSize = "12px";
        newH2.style.color = "#ffffff";
        newH2.style.textTransform = "none";
        newH2.textContent = normalh2.textContent.replace("Explorer: ", "");
        container.appendChild(newH2);
      }
    }
  }, 500); // Check every 500ms

  // Execute when command palette was launched.
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "p") {
      event.preventDefault();
      runMyScript();
    } else if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      handleEscape();
    }
  });

  // Ensure the escape key event listener is at the document level
  document.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        handleEscape();
      }
    },
    true
  );

  function runMyScript() {
    const targetDiv = document.querySelector(".monaco-workbench");

    // Remove existing element if it already exists
    const existingElement = document.getElementById("command-blur");
    existingElement && existingElement.remove();

    // Create and configure the new element
    const newElement = document.createElement("div");
    newElement.setAttribute("id", "command-blur");

    newElement.addEventListener("click", function () {
      newElement.remove();
    });

    // Append the new element as a child of the targetDiv
    targetDiv.appendChild(newElement);

    // Hide the sticky widget
    const widgets = document.querySelectorAll(".sticky-widget");
    widgets.forEach((widget) => {
      widget.style.opacity = 0;
    });

    // Hide the tree sticky widget
    const treeWidget = document.querySelector(".monaco-tree-sticky-container");
    treeWidget && (treeWidget.style.opacity = 0);
  }

  // Remove the backdrop blur from the DOM when esc key is pressed.
  function handleEscape() {
    const element = document.getElementById("command-blur");
    element && element.click();

    // Show the sticky widget
    const widgets = document.querySelectorAll(".sticky-widget");
    widgets.forEach((widget) => {
      widget.style.opacity = 1;
    });

    // Show the tree sticky widget
    const treeWidget = document.querySelector(".monaco-tree-sticky-container");
    treeWidget && (treeWidget.style.opacity = 1);
  }
});
