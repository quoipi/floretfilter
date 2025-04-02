document.addEventListener('DOMContentLoaded', () => {
    function updateCheckboxes(filters) {
        console.log("Updating checkboxes with:", filters); // Debug log
        document.getElementById('swear-checkbox').checked = !!filters.swear;
        document.getElementById('full-checkbox').checked = !!filters.full;
    }

    // Load stored settings
    chrome.storage.sync.get(['filters'], (data) => {
        console.log("Loaded storage data:", data); // Debug log

        let filters = data.filters;

        // If `filters` is undefined, set default values
        if (!filters) {
            filters = { swear: false, full: false };
            chrome.storage.sync.set({ filters }, () => console.log("Initialized storage with defaults:", filters));
        }

        updateCheckboxes(filters);
    });

    function saveFilters() {
        const filters = {
            swear: document.getElementById('swear-checkbox').checked,
            full: document.getElementById('full-checkbox').checked
        };

        console.log("Saving filters:", filters); // Debug log

        chrome.storage.sync.set({ filters }, () => {
            console.log("Filters successfully saved in storage.");
            chrome.storage.sync.get(['filters'], (newData) => {
                console.log("Storage after saving:", newData); // Debug log
            });
        });
    }

    document.getElementById('swear-checkbox').addEventListener('change', saveFilters);
    document.getElementById('full-checkbox').addEventListener('change', saveFilters);

    // Listen for storage changes and update UI
    chrome.storage.onChanged.addListener((changes) => {
        console.log("Storage changed:", changes); // Debug log
        if (changes.filters && changes.filters.newValue) {
            updateCheckboxes(changes.filters.newValue);
        }
    });
});