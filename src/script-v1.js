console.log('Hipduck Guide JS Loaded!');

function initializeApplication() {
    console.log('Initializing application functionalities...');
    // Place your initialization code here
    // Example: initSliders();
    // Example: setupEventListeners();
}

function handleError(error) {
    console.error('Error during script execution:', error);
}

(function () {
    //가이드 배경 텍스트 스크롤
    const sliderTexts = document.querySelectorAll('.Guide-parallel');
    const parallelArr = 'HIPDUCK GUIDE HIPDUCK GUIDE HIPDUCK GUIDE'.split(' ');
    let parallelCounts = [];

    // 모든 슬라이더 텍스트 초기화 및 각 슬라이더의 초기 카운트 설정
    sliderTexts.forEach((element, index) => {
        initTexts(element, [...parallelArr]); // 배열을 복사해서 전달
        parallelCounts[index] = 0; // 각 요소의 카운트를 저장
    });

    function initTexts(element, textArray) {
        textArray.push(...textArray); // 배열을 확장
        element.innerText = textArray.join('\u00A0\u00A0\u00A0\u00A0'); // 전체 텍스트를 한 번에 설정
    }

    function marqueeText(count, element, direction) {
        if (count > element.scrollWidth / 2) {
            element.style.transform = `translate3d(0, 0, 0)`;
            count = 0;
        }
        element.style.transform = `translate3d(${direction * count}px, 0, 0)`;

        return count;
    }

    function animate() {
        sliderTexts.forEach((element, index) => {
            parallelCounts[index]++;
            parallelCounts[index] = marqueeText(parallelCounts[index], element, -1);
        });

        window.requestAnimationFrame(animate);
    }

    function scrollHandler() {
        sliderTexts.forEach((element, index) => {
            parallelCounts[index] += 3;
        });
    }

    window.addEventListener('scroll', scrollHandler);
    animate();


    // 펼치기/숨기기
    document.querySelectorAll('.upload-button, .new-upload-button').forEach(button => {
        button.addEventListener('click', function () {
            const parentDiv = this.parentElement.parentElement;
            const expandableDiv = parentDiv.querySelector('.sr-expandable-div, .new-expandable-div');
            if (expandableDiv.classList.contains("hidden")) {
                expandableDiv.classList.remove("hidden", "animate__fadeOut");
                setTimeout(() => {
                    expandableDiv.style.maxHeight = expandableDiv.scrollHeight + "px";
                    expandableDiv.classList.add("animate__animated", "animate__fadeIn");
                    button.innerHTML = button.getAttribute('data-close-text');
                }, 10);
            } else {
                expandableDiv.classList.remove("animate__fadeIn");
                expandableDiv.style.maxHeight = "0px";
                expandableDiv.classList.add("animate__animated", "animate__fadeOut");
                setTimeout(() => {
                    if (!expandableDiv.style.maxHeight || expandableDiv.style.maxHeight === "0px") {
                        expandableDiv.classList.add("hidden");
                        expandableDiv.classList.remove("animate__fadeOut");
                        expandableDiv.style.maxHeight = "";
                        button.innerHTML = button.getAttribute('data-open-text');
                    }
                }, 350);
            }
        });
    });

    // 비디오 설정 통합 함수
    const setupVideo = (video, lazyLoad = false) => {
        const source = video.querySelector('source');
        if (lazyLoad && source.getAttribute('data-src')) {
            source.src = source.getAttribute('data-src');
            source.removeAttribute('data-src');
        }
        video.load();
    };

    // 특정 클래스를 가진 모든 비디오에 대해 설정 적용
    document.querySelectorAll('.SrHoverVideo').forEach(video => setupVideo(video, true));
    document.querySelectorAll('.SrLazyVideo').forEach(video => setupVideo(video, true));
    document.querySelectorAll('.SrScrollVideo').forEach(video => setupVideo(video, true));

    // 마우스 호버 및 스크롤 비디오 설정 함수
    const setupHoverAndScrollVideos = () => {
        const hoverVideos = document.querySelectorAll('.SrHoverVideo');
        hoverVideos.forEach(video => {
            let isPlaying = false, reversePlaybackRequestId;
            const container = video.closest('div.overflow-hidden');
            container.addEventListener('mouseover', async () => {
                if (!isPlaying) {
                    try {
                        await video.play();
                        isPlaying = true;
                        cancelAnimationFrame(reversePlaybackRequestId);
                    } catch (error) {
                        console.error('Error playing the video:', error);
                    }
                }
            });

            container.addEventListener('mouseout', () => {
                if (isPlaying) {
                    isPlaying = false;
                    reversePlaybackRequestId = requestAnimationFrame(function reversePlayback() {
                        if (video.currentTime > 0) {
                            video.currentTime -= 0.03;
                            reversePlaybackRequestId = requestAnimationFrame(reversePlayback);
                        } else {
                            video.pause();
                            cancelAnimationFrame(reversePlaybackRequestId);
                        }
                    });
                }
            });
        });

        const scrollVideos = document.querySelectorAll('.SrScrollVideo');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    setTimeout(() => video.play(), 3500);
                } else if (entry.intersectionRatio <= 0.5) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, { root: null, threshold: [0.5, 0.1] });

        scrollVideos.forEach(video => {
            observer.observe(video);
        });
    };
    setupHoverAndScrollVideos();


    // 컬러 및 해상도 설정 스크립트
    const aiGuideButtons = document.querySelectorAll('.AiGuide-Button');
    const psGuideButtons = document.querySelectorAll('.PsGuide-Button');
    const resColGuides = document.querySelectorAll('.ResColGuide');

    // 모든 resColGuide 요소에 애니메이션 효과 추가
    resColGuides.forEach(guide => guide.classList.add('sr-fade-effect'));

    // 모든 버튼에 애니메이션 효과 추가
    aiGuideButtons.forEach(button => button.classList.add('button-sr-fade-effect'));
    psGuideButtons.forEach(button => button.classList.add('button-sr-fade-effect'));

    // AI Guide 버튼 활성화 함수
    function activateAiGuide() {
        aiGuideButtons.forEach(button => {
            button.classList.add('button-sr-on');
            button.classList.remove('button-sr-off');
        });

        psGuideButtons.forEach(button => {
            button.classList.add('button-sr-off');
            button.classList.remove('button-sr-on');
        });

        resColGuides.forEach(guide => guide.classList.remove('sr-show'));
    }

    // PS Guide 버튼 활성화 함수
    function activatePsGuide() {
        psGuideButtons.forEach(button => {
            button.classList.add('button-sr-on');
            button.classList.remove('button-sr-off');
        });

        aiGuideButtons.forEach(button => {
            button.classList.add('button-sr-off');
            button.classList.remove('button-sr-on');
        });

        resColGuides.forEach(guide => guide.classList.add('sr-show'));
    }

    // 각 버튼에 대해 클릭 이벤트 리스너 설정
    aiGuideButtons.forEach(button => {
        button.addEventListener('click', activateAiGuide);
    });

    psGuideButtons.forEach(button => {
        button.addEventListener('click', activatePsGuide);
    });

    // 초기 활성화 설정
    if (aiGuideButtons.length > 0) {
        activateAiGuide();
    }

    // 클래스 추가 함수
    function addClasses(elements, ...classes) {
        elements.forEach(el => el.classList.add(...classes));
    }

    // 클래스 제거 함수
    function removeClasses(elements, ...classes) {
        elements.forEach(el => el.classList.remove(...classes));
    }

    function addMouseEnterListeners(elements, callback) {
        elements.forEach(element => {
            element.addEventListener('mouseenter', callback);
        });
    }

    // 각 요소에 대해 원래 클래스를 저장하는 함수
    function saveOriginalClasses(elements) {
        const originalClasses = {};
        elements.forEach((element, index) => {
            element.dataset.originalIndex = index;
            originalClasses[index] = element.className;
        });
        return originalClasses;
    }

    const SrWorkGuideArea = document.querySelectorAll('.sr-workguide-area');
    const SrCutGuideArea = document.querySelectorAll('.sr-cutguide-area');
    const SrSafeGuideArea = document.querySelectorAll('.sr-safeguide-area');
    const SrWorkGuideDic = document.querySelectorAll('.sr-workguide-dic');
    const SrCutGuideDic = document.querySelectorAll('.sr-cutguide-dic');
    const SrSafeGuideDic = document.querySelectorAll('.sr-safeguide-dic');

    // 작업영역 이벤트 설정
    function handleMouseEnterWorkArea() {
        addClasses(SrWorkGuideArea, 'bg-indigo-50');
        addClasses(SrCutGuideArea, 'bg-indigo-50', 'border-gray-500', 'border-dashed');
        addClasses(SrSafeGuideArea, 'bg-indigo-50', 'border-gray-500', 'border-dashed');
        addClasses(SrWorkGuideDic, 'bg-indigo-50', 'opacity-100');

        removeClasses(SrWorkGuideArea, 'bg-white');
        removeClasses(SrCutGuideArea, 'bg-red-50', 'border-solid', 'border-red-300');
        removeClasses(SrSafeGuideArea, 'bg-green-50', 'border-solid', 'border-green-300');
        removeClasses(SrWorkGuideDic, 'bg-white', 'opacity-0');
    }

    // 제단영역 이벤트 설정
    function handleMouseEnterCutArea() {
        addClasses(SrCutGuideArea, 'bg-red-100');
        addClasses(SrSafeGuideArea, 'bg-red-100', 'border-dashed', 'border-gray-500');
        addClasses(SrCutGuideDic, 'bg-red-100', 'opacity-100');

        removeClasses(SrCutGuideArea, 'bg-red-50');
        removeClasses(SrSafeGuideArea, 'bg-green-50', 'border-solid', 'border-green-300');
        removeClasses(SrCutGuideDic, 'bg-white', 'opacity-0');
    }

    // 안전영역 이벤트 설정
    function handleMouseEnterSafeArea() {
        addClasses(SrSafeGuideArea, 'bg-green-100');
        addClasses(SrSafeGuideDic, 'bg-green-100', 'opacity-100');
        addClasses(SrCutGuideArea, 'border-gray-500', 'border-dashed');

        removeClasses(SrCutGuideArea, 'bg-red-50', 'border-solid', 'border-red-300');
        removeClasses(SrSafeGuideArea, 'bg-green-50');
        removeClasses(SrSafeGuideDic, 'bg-white', 'opacity-0');
    }

    // 각 NodeList에 대해 이벤트 리스너 추가
    addMouseEnterListeners(SrWorkGuideArea, handleMouseEnterWorkArea);
    addMouseEnterListeners(SrCutGuideArea, handleMouseEnterCutArea);
    addMouseEnterListeners(SrSafeGuideArea, handleMouseEnterSafeArea);

    // 원래 클래스로 복원하는 함수
    function restoreClasses(elements, originalClasses) {
        elements.forEach(element => {
            const originalIndex = element.dataset.originalIndex;
            element.className = originalClasses[originalIndex];
        });
    }

    // 모든 요소에 대한 원래 클래스 저장
    const allElements = [...SrWorkGuideArea, ...SrCutGuideArea, ...SrSafeGuideArea, ...SrWorkGuideDic, ...SrCutGuideDic, ...SrSafeGuideDic];
    const originalClasses = saveOriginalClasses(allElements);

    // mouseleave 이벤트에 대한 핸들러 설정
    allElements.forEach(element => {
        element.addEventListener('mouseleave', () => restoreClasses(allElements, originalClasses));
    });
})();

