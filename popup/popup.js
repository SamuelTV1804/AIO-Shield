document.addEventListener('DOMContentLoaded', () => {
  const toggles = {
    adblock: document.getElementById('adblock-toggle'),
    clearurls: document.getElementById('clearurls-toggle')
  };

  chrome.storage.local.get(['enabledFeatures'], ({ enabledFeatures = [] }) => {
    enabledFeatures.forEach(feature => {
      if (toggles[feature]) toggles[feature].checked = true;
    });
  });

  Object.entries(toggles).forEach(([feature, toggle]) => {
    toggle.addEventListener('change', () => {
      chrome.runtime.sendMessage(
        { action: 'toggleFeature', feature },
        (enabled) => {
          document.getElementById('status-bar').textContent = 
            `${feature} ${enabled ? 'enabled' : 'disabled'}`;
        }
      );
    });
  });

  document.getElementById('save-tabs').addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { action: 'saveTabs' },
      (response) => {
        document.getElementById('status-bar').textContent = 
          `Saved ${response.count} tabs`;
      }
    );
  });
});