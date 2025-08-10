class SecurityEngine {
  constructor() {
    this.malwareDomains = new Set();
    this.phishingDomains = new Set();
  }

  async init() {
    await this.updateThreatLists();
    setInterval(() => this.updateThreatLists(), 24 * 60 * 60 * 1000); // Tägliche Updates
  }

  async updateThreatLists() {
    const [malware, phishing] = await Promise.all([
      fetch('https://malware-filter.gitlab.io/malware-filter/urlhaus-filter-online.txt'),
      fetch('https://phishing.army/download/phishing_army_blocklist.txt')
    ]);

    this.malwareDomains = new Set((await malware.text()).split('\n'));
    this.phishingDomains = new Set((await phishing.text()).split('\n'));
  }

  async fullScan() {
    const tabs = await chrome.tabs.query({});
    const results = {
      threats: 0,
      scanned: tabs.length
    };

    for (const tab of tabs) {
      if (tab.url) {
        const domain = new URL(tab.url).hostname;
        if (this.malwareDomains.has(domain) || this.phishingDomains.has(domain)) {
          results.threats++;
          await chrome.tabs.update(tab.id, { url: 'warning.html' });
        }
      }
    }

    return results;
  }

  checkRequest(url) {
    const domain = new URL(url).hostname;
    return this.malwareDomains.has(domain) || this.phishingDomains.has(domain);
  }
}