// 언어 전환 진단 스크립트
(function () {
    console.log('===== 언어 전환 진단 스크립트 실행 =====');

    // 현재 상태 출력
    function logCurrentState() {
        const htmlLang = document.documentElement.lang;
        const storedLang = localStorage.getItem('lang');
        const preferredLang = localStorage.getItem('preferred_language');
        const bodyClasses = document.body.className;
        const htmlClasses = document.documentElement.className;

        // 콘텐츠 요소 찾기
        const koElements = document.querySelectorAll('.post-content-ko');
        const enElements = document.querySelectorAll('.post-content-en');

        console.log('[진단] 현재 언어 상태:', {
            'HTML lang 속성': htmlLang,
            'localStorage.lang': storedLang,
            'localStorage.preferred_language': preferredLang,
            'HTML 클래스': htmlClasses,
            'Body 클래스': bodyClasses,
            '한국어 요소 수': koElements.length,
            '영어 요소 수': enElements.length
        });

        // 요소별 상태 확인
        koElements.forEach((el, idx) => {
            const computed = window.getComputedStyle(el);
            console.log(`[진단] 한국어 요소 #${idx + 1}:`, {
                'display': computed.display,
                'visibility': computed.visibility,
                'opacity': computed.opacity,
                'position': computed.position,
                'inline style': el.getAttribute('style'),
                'classes': el.className,
                'has content': el.innerHTML.trim().length > 0
            });
        });

        enElements.forEach((el, idx) => {
            const computed = window.getComputedStyle(el);
            console.log(`[진단] 영어 요소 #${idx + 1}:`, {
                'display': computed.display,
                'visibility': computed.visibility,
                'opacity': computed.opacity,
                'position': computed.position,
                'inline style': el.getAttribute('style'),
                'classes': el.className,
                'has content': el.innerHTML.trim().length > 0
            });
        });

        return {
            koElements,
            enElements,
            htmlLang,
            storedLang
        };
    }

    // 강제 언어 전환 함수
    function forceLanguageSwitch(lang) {
        console.log(`[진단] 강제로 언어 전환: ${lang}`);

        // HTML 속성 설정
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);

        // 클래스 설정
        document.documentElement.classList.remove('lang-ko', 'lang-en');
        document.documentElement.classList.add(`lang-${lang}`);

        document.body.classList.remove('body-lang-ko', 'body-lang-en');
        document.body.classList.add(`body-lang-${lang}`);

        // 콘텐츠 요소 찾기
        const koElements = document.querySelectorAll('.post-content-ko');
        const enElements = document.querySelectorAll('.post-content-en');

        // 저장소 설정
        localStorage.setItem('lang', lang);
        localStorage.setItem('preferred_language', lang);

        console.log(`[진단] 콘텐츠 요소 발견:`, {
            '한국어': koElements.length,
            '영어': enElements.length
        });

        // 한국어 요소 처리
        koElements.forEach(el => {
            if (lang === 'ko') {
                el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: static !important; height: auto !important;';
                el.classList.remove('content-hidden');
                el.classList.add('content-visible');
                console.log('[진단] 한국어 요소 표시');
            } else {
                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; height: 0 !important;';
                el.classList.remove('content-visible');
                el.classList.add('content-hidden');
                console.log('[진단] 한국어 요소 숨김');
            }
        });

        // 영어 요소 처리
        enElements.forEach(el => {
            if (lang === 'en') {
                el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: static !important; height: auto !important;';
                el.classList.remove('content-hidden');
                el.classList.add('content-visible');
                console.log('[진단] 영어 요소 표시');
            } else {
                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; height: 0 !important;';
                el.classList.remove('content-visible');
                el.classList.add('content-hidden');
                console.log('[진단] 영어 요소 숨김');
            }
        });

        // 강력한 DOM 수정 방식 적용 (콘텐츠를 복제하여 새로 삽입)
        const containers = document.querySelectorAll('.post-content');

        if (containers.length > 0) {
            console.log(`[진단] ${containers.length}개의 콘텐츠 컨테이너 발견, DOM 재구성 시도`);

            containers.forEach((container, idx) => {
                const koEl = container.querySelector('.post-content-ko');
                const enEl = container.querySelector('.post-content-en');

                if (koEl && enEl) {
                    console.log(`[진단] 컨테이너 #${idx + 1}의 콘텐츠 요소 찾음`);

                    // 완전히 새로운 컨테이너 생성
                    const newContainer = document.createElement('div');
                    newContainer.className = container.className;

                    // 표시할 콘텐츠 복제 및 설정
                    const visibleContent = lang === 'ko' ? koEl.cloneNode(true) : enEl.cloneNode(true);
                    visibleContent.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
                    visibleContent.classList.add('content-visible');
                    visibleContent.classList.remove('content-hidden');

                    // 숨길 콘텐츠 복제 및 설정
                    const hiddenContent = lang === 'ko' ? enEl.cloneNode(true) : koEl.cloneNode(true);
                    hiddenContent.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
                    hiddenContent.classList.add('content-hidden');
                    hiddenContent.classList.remove('content-visible');

                    // 새 요소를 컨테이너에 추가
                    newContainer.appendChild(visibleContent);
                    newContainer.appendChild(hiddenContent);

                    // 기존 컨테이너 교체
                    container.parentNode.replaceChild(newContainer, container);
                    console.log(`[진단] 컨테이너 #${idx + 1} 교체 완료`);
                } else {
                    console.log(`[진단] 컨테이너 #${idx + 1}에 다국어 요소가 없음`);
                }
            });
        }

        // 해당 언어에 맞게 다국어 텍스트 요소도 업데이트
        document.querySelectorAll('[data-ko][data-en]').forEach(el => {
            el.textContent = el.getAttribute(lang === 'ko' ? 'data-ko' : 'data-en');
        });

        // 이벤트 발생 - 다른 스크립트에 알림
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        // 언어 토글 버튼 업데이트
        const toggleButton = document.getElementById('language-toggle');
        if (toggleButton) {
            toggleButton.textContent = lang === 'ko' ? 'EN' : 'KO';
        }

        // 후처리: localStorage 이벤트 수동 발생
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'lang',
            newValue: lang,
            storageArea: localStorage
        }));

        console.log('[진단] 강제 언어 전환 완료:', lang);

        // 결과 확인을 위해 상태 반환
        return logCurrentState();
    }

    // 진단 함수에 접근할 수 있도록 전역 객체로 노출
    window.languageDiagnostics = {
        logCurrentState: logCurrentState,
        forceKorean: function () { return forceLanguageSwitch('ko'); },
        forceEnglish: function () { return forceLanguageSwitch('en'); },
        inspect: function (selector) {
            const elements = document.querySelectorAll(selector);
            console.log(`[진단] 선택자 "${selector}"로 ${elements.length}개 요소 발견:`);

            elements.forEach((el, idx) => {
                const computed = window.getComputedStyle(el);
                console.log(`요소 #${idx + 1}:`, {
                    tagName: el.tagName,
                    classes: el.className,
                    id: el.id,
                    display: computed.display,
                    visibility: computed.visibility,
                    position: computed.position,
                    inlineStyle: el.getAttribute('style'),
                    content: el.innerHTML.substring(0, 100) + '...'
                });
            });

            return elements;
        },
        toggleView: function () {
            const current = logCurrentState();
            if (current.storedLang === 'ko') {
                return forceLanguageSwitch('en');
            } else {
                return forceLanguageSwitch('ko');
            }
        }
    };

    // 초기 상태 로깅
    const initialState = logCurrentState();
    console.log('[진단] 초기 진단 완료');
    console.log('[진단] 사용 방법: 콘솔에서 다음 명령어 실행');
    console.log('  - window.languageDiagnostics.logCurrentState() - 현재 상태 확인');
    console.log('  - window.languageDiagnostics.forceKorean() - 한국어로 강제 전환');
    console.log('  - window.languageDiagnostics.forceEnglish() - 영어로 강제 전환');
    console.log('  - window.languageDiagnostics.toggleView() - 현재 언어 토글');
    console.log('  - window.languageDiagnostics.inspect(".selector") - 특정 요소 검사');
    console.log('===== 진단 스크립트 준비 완료 =====');
})(); 