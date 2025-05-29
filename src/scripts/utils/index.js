import { getAccessToken, removeAccesToken } from "../models/auth-model";

export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function checkAuthenticatedRoute(page) {
  const isLogin = getAccessToken();

  if (!isLogin) {
    location.hash = "/login";

    return null;
  }
  return page;
}

export function logout() {
  localStorage.clear();
}

export function setupSkipToContent(element, mainContent) {
  console.log(mainContent);
  console.log("element", element);

  element.addEventListener("click", () => {
    console.log("BUTTON CLICK");

    const scrollParent = mainContent.closest("[data-scrollable]");
    console.log(scrollParent);
    if (!mainContent.hasAttribute("tabindex")) {
      mainContent.setAttribute("tabindex", "-1");
    }

    mainContent.focus();

    const rect = mainContent.getBoundingClientRect();
    const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (fullyVisible) {
      window.scrollBy({ top: 10, behavior: "smooth" });
    }
  });
}

export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(
      () => undefined
    );

    return {
      ready: Promise.reject(Error("View transitions unsupported")),
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }

  return document.startViewTransition(updateDOM);
}

export function getCoords() {
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export function updateAuthLinks() {
  const loginLink = document.querySelector('a[href="#/login"]');
  const logoutLink = document.querySelector('a[href="#/logout"]');
  const isLoggedIn = !!getAccessToken();

  if (loginLink) loginLink.style.display = isLoggedIn ? 'none' : 'inline';
  if (logoutLink) logoutLink.style.display = isLoggedIn ? 'inline' : 'none';
}
