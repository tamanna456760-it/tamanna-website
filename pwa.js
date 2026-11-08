// Progressive Web App registration. GitHub Pages serves this under the repository path.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .then(() => document.documentElement.dataset.offlineReady = "true")
      .catch(() => document.documentElement.dataset.offlineReady = "false");
  });
}
