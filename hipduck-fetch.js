function loadHTMLContentWithResources(url, elementId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const htmlContent = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            // Append CSS links to the document head
            const links = doc.querySelectorAll('link[rel="stylesheet"]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = href.startsWith('http') ? href : `${href}`;  // Adjust path as needed
                newLink.onerror = () => {
                    console.error('Stylesheet failed to load:', href);
                };
                document.head.appendChild(newLink);
            });

            // Find the target div element by ID
            const targetDiv = document.getElementById(elementId);
            if (!targetDiv) {
                throw new Error('Target element not found');
            }

            // Set the innerHTML of the div to the fetched HTML content
            targetDiv.innerHTML = doc.body.innerHTML;  // Only copy the body's inner HTML

            // Execute scripts after the HTML is inserted
            executeScripts(doc);

            console.log('HTML, CSS, and JS content successfully loaded and inserted!');
            resolve();
        } catch (error) {
            console.error('Failed to load HTML, CSS, and JS content:', error);
            reject(error);
        }
    });
}

function executeScripts(doc) {
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';

        if (script.src) {
            newScript.src = script.src.startsWith('http') ? script.src : `${script.src}`;
            newScript.async = false;
            newScript.onload = () => eval(script.textContent);
            document.body.appendChild(newScript);
        } else {
            eval(script.textContent);  // Execute inline scripts directly
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
        }
    });
}

// Example usage: load HipduckGuide.html and its resources into the 'HipduckGuide' div
function initializePage() {
    return Promise.all([
        loadHTMLContentWithResources('/src/HipduckGuide.html', 'HipduckGuide'),
        loadHTMLContentWithResources('/src/HipduckNoti.html', 'HipduckNoti'),
        loadHTMLContentWithResources('/src/paper-cal.html', 'PaperCal')
    ]);
}
