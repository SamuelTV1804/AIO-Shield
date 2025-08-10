const adBlocker = new AdBlocker();
const urlCleaner = new UrlCleaner();
const tabManager = new TabManager();
const securityEngine = new SecurityEngine();

let enabledFeatures = new Set(['adblock', 'urlclean']);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'toggleFeature':
      toggleFeature(request.feature).then(sendResponse);
      return true;
    case 'saveTabs':
      tabManager.saveAllTabs().then(sendResponse);
      return true;
    case 'runScan':
      securityEngine.fullScan().then(sendResponse);
      return true;
  }
});

async function toggleFeature(feature) {
  const enable = !enabledFeatures.has(feature);
  
  if (enable) {
    enabledFeatures.add(feature);
    await this[`${feature}Module`]?.enable();
  } else {
    enabledFeatures.delete(feature);
    await this[`${feature}Module`]?.disable();
  }

  await chrome.storage.local.set({ enabledFeatures: [...enabledFeatures] });
  return enable;
}

async function loadSettings() {
  const { enabledFeatures = [] } = await chrome.storage.local.get('enabledFeatures');
  return new Set(enabledFeatures);
}