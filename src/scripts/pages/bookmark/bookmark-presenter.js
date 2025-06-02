export default class BookmarkPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async init() {
    try {
      this.view.showLoading();
      const bookmarks = await this.model.getBookmarkedStories(); // get from DB
      this.view.showBookmarks(bookmarks);
    } catch (err) {
      this.view.showError(err.message);
    } finally {
      this.view.hideLoading();
    }
  }
}
