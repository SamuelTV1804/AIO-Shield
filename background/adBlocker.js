class AdBlocker {
  constructor() {
    this.blockLists = [];
  }

  async enable() {
    await this.updateBlockLists();
    chrome.webRequest.onBeforeRequest.addListener(
      this.filterRequest.bind(this),
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }

  disable() {
    chrome.webRequest.onBeforeRequest.removeListener(this.filterRequest);
  }

  async updateBlockLists() {
    const response = await fetch('https://easylist.to/easylist/easylist.txt');
    this.blockLists = (await response.text()).split('\n');
  }

  filterRequest(details) {
    const url = new URL(details.url);
    return this.blockLists.some(rule => url.hostname.includes(rule)) 
      ? { cancel: true } 
      : null;
  }
}