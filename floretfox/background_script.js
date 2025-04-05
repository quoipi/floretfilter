// Function to replace specific words in text nodes
function replaceTextNode(node) {
    // Only replace text that contains these words
    if (node.nodeType === 3) {  // Text node
        let text = node.nodeValue;

        // Function to match and replace word while preserving case
        const replaceWithCase = (word, replacement) => {
            return word.replace(/(\b\w+\b)/gi, (match) => {
                if (match === match.toUpperCase()) {
                    return replacement.toUpperCase();
                } else if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
                    return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
                }
                return replacement.toLowerCase();
            });
        };

        // Get current filter settings
        browser.storage.sync.get(['filters'], (data) => {
            const filters = data.filters || {};
            
            if (filters.swear || filters.full) {
                // Replace swear words
                text = text.replace(/fuck/gi, (match) => replaceWithCase(match, "fluff"))
                            .replace(/fukc/gi, (match) => replaceWithCase(match, "fluff"))
                            .replace(/bullshit/gi, (match) => replaceWithCase(match, "dirt"))
                            .replace(/shit/gi, (match) => replaceWithCase(match, "dirt"))
                            .replace(/cunt/gi, (match) => replaceWithCase(match, "pal"))
                            .replace(/bitches/gi, (match) => replaceWithCase(match, "puppies"))
                            .replace(/bitch/gi, (match) => replaceWithCase(match, "puppy"))          
                            .replace(/faggot/gi, (match) => replaceWithCase(match, "floret"))
                            .replace(/fag/gi, (match) => replaceWithCase(match, "flort"))
                            .replace(/retard/gi, (match) => replaceWithCase(match, "floret"))
                            .replace(/trannies/gi, (match) => replaceWithCase(match, "florets"))
                            .replace(/tranny/gi, (match) => replaceWithCase(match, "floret"))
                            .replace(/\b(troon)/gi, (match) => replaceWithCase(match, "floret"));
                           
            }
            
            if (filters.full) {
                // Replace other bad words
                text = text.replace(/nazism/gi, (match) => replaceWithCase(match, "feralism"))
                            .replace(/nazi/gi, (match) => replaceWithCase(match, "feralist"))
                            .replace(/capitalis/gi, (match) => replaceWithCase(match, "feralis"))
                            .replace(/fascis/gi, (match) => replaceWithCase(match, "feralis"))
                            .replace(/porn/gi, (match) => replaceWithCase(match, "florn"))
                            .replace(/sex/gi, (match) => replaceWithCase(match, "s*x"))
                            .replace(/cock/gi, (match) => replaceWithCase(match, "c*ck"))
                            .replace(/dick/gi, (match) => replaceWithCase(match, "d*ck"))
                            .replace(/\b(drug)/gi, (match) => replaceWithCase(match, "xenodrug"))
                            .replace(/\b(hate)/gi, (match) => replaceWithCase(match, "dislike"))
                            .replace(/\b(kill)/gi, (match) => replaceWithCase(match, "end"))
                            .replace(/stupid/gi, (match) => replaceWithCase(match, "silly"))
                            .replace(/\b(idiots)\b/gi, (match) => replaceWithCase(match, "dummies"))
                            .replace(/\b(idiot)\b/gi, (match) => replaceWithCase(match, "dummy"))
                            .replace(/\b(died)\b/gi, (match) => replaceWithCase(match, "wilted"))
                            .replace(/\b(dies)\b/gi, (match) => replaceWithCase(match, "wilts"))
                            .replace(/\b(dying)\b/gi, (match) => replaceWithCase(match, "wilting"))
                            .replace(/person/gi, (match) => replaceWithCase(match, "sophont"))
                            .replace(/\b(bastard)\b/gi, (match) => replaceWithCase(match, "meanie"))
                            .replace(/\b(bastards)\b/gi, (match) => replaceWithCase(match, "meanies"))
                            .replace(/\b(die)\b/gi, (match) => replaceWithCase(match, "wilt"));
            }

            // Only update the text if changes were made
            if (text !== node.nodeValue) {
                node.nodeValue = text;
            }

        });
    }
}

// Function to traverse the DOM and replace text
function replaceText() {
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        {
            acceptNode: function(node) {
                // Ignore text nodes in certain elements like links and buttons
                const parent = node.parentNode;
                if (parent && (parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA' || parent.isContentEditable)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
        replaceTextNode(currentNode);
    }
}

// Function to start polling every 2 seconds for new content
function startPolling() {
    setInterval(() => {
        replaceText();  // Check for and replace text every 2 seconds
    }, 500);  // Adjust the frequency as needed
}

// Start polling as soon as the script is loaded
startPolling();