class TabManager {
  constructor() {
    this.savedSessions = [];
  }

  async saveAllTabs() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      tabs: tabs.map(tab => ({
        url: tab.url,
        title: tab.title
      }))
    };

    this.savedSessions.push(session);
    await chrome.storage.local.set({ savedSessions: this.savedSessions });
    await chrome.tabs.remove(tabs.map(tab => tab.id));
    
    return { count: tabs.length };
  }
}