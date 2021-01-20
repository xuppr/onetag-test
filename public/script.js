function onetagObserver(adBox, callback, timeMs = 1000) {
  let timeout = null;
  let currentEntry = null;
  let observer = null;

  const blur = () => {
    clearTimeout(timeout);
  };

  const focus = () => {
    if (currentEntry?.isIntersecting) {
      launchViewedTimeout();
    }
  };

  const unobserve = () => {
    observer.unobserve(adBox);
    window.removeEventListener("focus", focus);
    window.removeEventListener("blur", blur);
    clearTimeout(timeout);
  };

  const launchViewedTimeout = () => {
    timeout = setTimeout(() => {
      callback();
      unobserve();
    }, timeMs);
  };

  const startObserving = () => {
    observer.observe(adBox);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
  };

  if (typeof IntersectionObserver != "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        currentEntry = entries[0];
        if (currentEntry.isIntersecting && document.hasFocus()) {
          launchViewedTimeout();
        } else {
          clearTimeout(timeout);
        }
      },
      { threshold: [0.5] }
    );

    startObserving();

    return unobserve;
  }

  return null;
}

function logCreativeView() {
  console.log("CREATIVE_VIEW");
}

const unobserve = onetagObserver(
  document.querySelector(".onetag"),
  logCreativeView
);
