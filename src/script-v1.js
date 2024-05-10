console.log('Hipduck Guide JS Loaded!');

document.addEventListener('DOMContentLoaded', function () {
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

    //재단 영역 가이드 색상 변경용 스크립트
    function addMouseEnterListeners(elements, callback) {
        elements.forEach(element => {
            element.addEventListener('mouseenter', callback);
        });
    }
    // 각 NodeList의 요소에 대해 원래 클래스를 저장하는 함수
    function saveOriginalClasses(elements) {
        const originalClasses = {};
        elements.forEach(element => {
            originalClasses[element.classList[0]] = element.className; // 클래스의 첫 번째 이름을 키로 사용
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
        SrWorkGuideArea.forEach(el => el.classList.add('bg-indigo-50'));
        SrCutGuideArea.forEach(el => el.classList.add('bg-indigo-50', 'border-gray-500', 'border-dashed'));
        SrSafeGuideArea.forEach(el => el.classList.add('bg-indigo-50', 'border-gray-500', 'border-dashed'));
        SrWorkGuideDic.forEach(el => el.classList.add('bg-indigo-50', 'opacity-100'));
        SrWorkGuideArea.forEach(el => el.classList.remove('bg-white'));
        SrCutGuideArea.forEach(el => el.classList.remove('bg-red-50', 'border-solid', 'border-red-300'));
        SrSafeGuideArea.forEach(el => el.classList.remove('bg-green-50', 'border-solid', 'border-green-300'));
        SrWorkGuideDic.forEach(el => el.classList.remove('bg-white', 'opacity-0'));
    }

    // 제단영역 이벤트 설정
    function handleMouseEnterCutArea() {
        SrCutGuideArea.forEach(el => el.classList.add('bg-red-100'));
        SrSafeGuideArea.forEach(el => el.classList.add('bg-red-100', 'border-dashed', 'border-gray-500'));
        SrCutGuideDic.forEach(el => el.classList.add('bg-red-100', 'opacity-100'));
        SrCutGuideArea.forEach(el => el.classList.remove('bg-red-50'));
        SrSafeGuideArea.forEach(el => el.classList.remove('bg-green-50', 'border-solid', 'border-green-300'));
        SrCutGuideDic.forEach(el => el.classList.remove('bg-white', 'opacity-0'));
    }

    // 안전영역 이벤트 설정
    function handleMouseEnterSafeArea() {
        SrSafeGuideArea.forEach(el => el.classList.add('bg-green-100'));
        SrSafeGuideDic.forEach(el => el.classList.add('bg-green-100', 'opacity-100'));
        SrCutGuideArea.forEach(el => el.classList.add('border-gray-500', 'border-dashed'));
        SrCutGuideArea.forEach(el => el.classList.remove('bg-red-50', 'border-solid', 'border-red-300'));
        SrSafeGuideArea.forEach(el => el.classList.remove('bg-green-50'));
        SrSafeGuideDic.forEach(el => el.classList.remove('bg-white', 'opacity-0'));
    }

    // 각 NodeList에 대해 이벤트 리스너 추가
    addMouseEnterListeners(SrWorkGuideArea, handleMouseEnterWorkArea);
    addMouseEnterListeners(SrCutGuideArea, handleMouseEnterCutArea);
    addMouseEnterListeners(SrSafeGuideArea, handleMouseEnterSafeArea);

    // 원래 클래스로 복원하는 함수
    function restoreClasses(elements, originalClasses) {
        elements.forEach(element => {
            element.className = originalClasses[element.classList[0]]; // 첫 번째 클래스 이름을 키로 사용하여 복원
        });
    }

    // 모든 요소에 대한 원래 클래스 저장
    const allElements = [...SrWorkGuideArea, ...SrCutGuideArea, ...SrSafeGuideArea, ...SrWorkGuideDic, ...SrCutGuideDic, ...SrSafeGuideDic];
    const originalClasses = saveOriginalClasses(allElements);

    // mouseleave 이벤트에 대한 핸들러 설정
    allElements.forEach(element => {
        element.addEventListener('mouseleave', () => restoreClasses(allElements, originalClasses));
    });
});

