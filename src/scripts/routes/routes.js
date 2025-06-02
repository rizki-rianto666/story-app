import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";

import { checkAuthenticatedRoute, logout } from "../utils";
import detailStoryPage from "../pages/detailStory/detail-story-page";
import AddStoryPage from "../pages/add/add-page";
import BookmarkPage from "../pages/bookmark/bookmark-page";

const routes = {
  "/register": () => new RegisterPage(),
  "/login": () => new LoginPage(),
  "/logout": () => {
    if(confirm("Yaqueen mau logot?")){
      checkAuthenticatedRoute(logout());
      return new LoginPage();
    }
    return
  },

  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/detail/:id": () => checkAuthenticatedRoute(new detailStoryPage()),
  "/bookmark":()=>checkAuthenticatedRoute(new BookmarkPage()),
  "/add": () => checkAuthenticatedRoute(new AddStoryPage()),
};

export default routes;
