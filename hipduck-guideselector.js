function runGuideSelector() {
    // 상품 ID와 클래스 리스트 매핑
    const products = {
        //Test
        SrHdTest: ["PaperCal", "GuideUni", "NotiPin", "NotiEdge", "NotiDust", "NotiCoating", "GuideAcryl", "GuideCutting", "GuideTubeWhite", "GuideTubeCutting"],
        //틴케이스
        SrHdThincase: ["GuideUni", "NotiPin", "NotiDust", "GuideTubeWhite"],
        //종이 제품
        SrHdSticker: ["GuideUni", "NotiCoating", "GuideCutting", "GuideTubeCutting"],
        SrHdCard: ["GuideUni", "NotiCoating"],
        SrHdSlogan: ["GuideUni", "NotiCoating"],
        SrHdLetter: ["GuideUni", "NotiCoating"],
        SrHdPoster: ["GuideUni", "NotiCoating"],
        //아크릴 제품
        SrHdKeyring: ["PaperCal", "GuideUni", "NotiPin", "NotiEdge", "NotiDust", "GuideAcryl", "GuideCutting", "GuideTubeWhite", "GuideTubeCutting"],
        SrHdStand: ["PaperCal", "GuideUni", "NotiPin", "NotiEdge", "NotiDust", "GuideAcryl", "GuideCutting", "GuideTubeWhite", "GuideTubeCutting"],
        SrHdCoaster: ["PaperCal", "GuideUni", "NotiPin", "NotiEdge", "NotiDust", "GuideAcryl", "GuideCutting", "GuideTubeWhite", "GuideTubeCutting"],
        SrHdSmarttok: ["PaperCal", "GuideUni", "NotiPin", "NotiEdge", "NotiDust", "GuideAcryl", "GuideCutting", "GuideTubeWhite", "GuideTubeCutting"]
    };

    // 각 상품에 대해 처리
    for (let productId in products) {
        let element = document.getElementById(productId);
        console.log(`Checking for productId: ${productId}`);
        if (element) {
            console.log(`Element found: ${productId}`);
            let classList = products[productId];
            classList.forEach(className => {
                let elements = document.querySelectorAll(`.${className}`);
                console.log(`Number of elements with class ${className}: ${elements.length}`);
                elements.forEach(el => {
                    console.log(`Removing hidden class from element with class ${className}`);
                    el.classList.remove("hidden");
                });
            });
        } else {
            console.log(`Element not found: ${productId}`);
        }
    }
}

window.addEventListener("load", () => {
    initializePage().then(runGuideSelector).catch(error => {
        console.error('Failed to initialize page and run guide selector:', error);
    });
});
