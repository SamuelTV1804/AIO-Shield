class UrlCleaner {
  constructor() {
    this.trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign',
      'fbclid', 'gclid', 'msclkid'
    ];
  }

  enable() {
    chrome.webRequest.onBeforeRequest.addListener(
      this.cleanUrl.bind(this),
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }

  disable() {
    chrome.webRequest.onBeforeRequest.removeListener(this.cleanUrl);
  }

  cleanUrl(details) {
    const url = new URL(details.url);
    let cleaned = false;

    this.trackingParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        cleaned = true;
      }
    });

    return cleaned ? { redirectUrl: url.toString() } : null;
  }
}