// HTML 파일과 연관된 리소스를 로드하는 함수
function loadHTMLResource(url, targetElementId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const targetElement = document.getElementById(targetElementId);
            targetElement.innerHTML = doc.body.innerHTML; // HTML 삽입

            // CSS 로드
            const links = doc.querySelectorAll('link');
            links.forEach(link => {
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = link.href;
                document.head.appendChild(newLink);
            });

            // JS 로드
            const scripts = doc.querySelectorAll('script');
            let promises = [];
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                    promises.push(new Promise((resolve) => {
                        newScript.onload = resolve;
                    }));
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });

            return Promise.all(promises); // 모든 스크립트가 로드될 때까지 기다림
        })
        .then(() => {
            console.log(`${url} has been loaded and executed.`);
        })
        .catch(e => {
            console.error(`Failed to load and execute ${url}: ${e}`);
        });
}

// 페이지가 로드되면 각 HTML 파일을 순차적으로 로드
document.addEventListener('DOMContentLoaded', () => {
    const htmlFiles = [
        //{ url: "htmlname.html", id: "idname" } 형식으로 추가 가능
        { url: "src/HipduckGuide.html", id: "HipduckGuide" }
    ];

    htmlFiles.reduce((chain, file) => {
        return chain.then(() => loadHTMLResource(file.url, file.id));
    }, Promise.resolve());
});
