// 언어 관리 시스템 (2024년 5월 버그픽스 버전 1.3)
let preferredLanguage = 'ko';
let isProcessingLanguageChange = false;
let initialLoadComplete = false;

// 전역 언어 관리 객체
window.languageManager = {
    // 현재 언어 가져오기
    getCurrentLanguage: function () {
        return preferredLanguage;
    },

    // 언어 직접 설정 (강제)
    setLanguage: function (lang) {
        if (lang !== 'ko' && lang !== 'en') return false;
        preferredLanguage = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('preferred_language', lang);
        localStorage.setItem('lang', lang);
        return applyLanguage(lang, true);
    },

    // 언어 토글
    toggleLanguage: function () {
        if (isProcessingLanguageChange) {
            console.log('[언어 시스템] 이미 처리 중');
            return false;
        }

        isProcessingLanguageChange = true;
        const newLang = (preferredLanguage === 'en') ? 'ko' : 'en';
        const success = this.setLanguage(newLang);

        if (success) {
            const url = new URL(window.location);
            url.searchParams.set('lang', newLang);
            url.searchParams.set('t', Date.now());

            const isTestPage = window.location.pathname.includes('test.html');
            if (!isTestPage) {
                window.location.href = url.toString();
            }
        }

        isProcessingLanguageChange = false;
        return success;
    }
};

// 기존 전역 함수들을 새로운 시스템으로 연결
window.changeLanguage = function (lang) {
    return window.languageManager.setLanguage(lang);
};

window.toggleLanguage = function () {
    return window.languageManager.toggleLanguage();
};

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', function () {
    if (window.languageSystemInitialized) {
        console.log('[언어 시스템] 이미 초기화됨');
        return;
    }

    // URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    // 로컬 스토리지 확인
    const storedLang = localStorage.getItem('preferred_language') || localStorage.getItem('lang');

    // 초기 언어 결정
    let initialLang = langParam || storedLang || 'ko';
    if (initialLang !== 'ko' && initialLang !== 'en') {
        initialLang = 'ko';
    }

    // 언어 설정
    window.languageManager.setLanguage(initialLang);

    // 언어 스위처 설정
    setupLanguageSwitcher();

    window.languageSystemInitialized = true;
    initialLoadComplete = true;
});

// 언어 스위처 설정
function setupLanguageSwitcher() {
    const switchers = document.querySelectorAll('#language-switcher, .language-switcher, .language-switcher-button');

    switchers.forEach(switcher => {
        const newSwitcher = switcher.cloneNode(true);
        if (switcher.parentNode) {
            switcher.parentNode.replaceChild(newSwitcher, switcher);
        }

        newSwitcher.setAttribute('data-current-lang', preferredLanguage);

        newSwitcher.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.languageManager.toggleLanguage();
            return false;
        });

        updateSwitcherText(preferredLanguage);
    });
}

// 전역 언어 관리 시스템
// 언어 설정 관리
let currentLanguage = '';

// 언어 전환 함수
function updateLanguage(lang) {
    console.log('[언어 시스템] 언어 변경:', lang);

    // 시작 시간 기록 (성능 측정용)
    const startTime = performance.now();

    // 이전 언어 저장 (변경 감지용)
    const prevLang = localStorage.getItem('lang');

    // 모든 저장소에 언어 설정 저장 (통합)
    localStorage.setItem('lang', lang);
    localStorage.setItem('preferred_language', lang);

    // HTML lang 속성 설정 - 중요! CSS 선택자가 이를 기반으로 작동
    document.documentElement.lang = lang;
    console.log('[언어 시스템] HTML lang 속성 설정:', document.documentElement.lang);

    // HTML 클래스도 추가 (CSS 선택자 다양화)
    document.documentElement.classList.remove('lang-ko', 'lang-en');
    document.documentElement.classList.add('lang-' + lang);

    // 언어 변경 이벤트 발생 (다른 스크립트에 알림)
    const event = new CustomEvent('languageChanged', { detail: { language: lang, previousLanguage: prevLang } });
    document.dispatchEvent(event);
    console.log('[언어 시스템] 언어 변경 이벤트 발생:', lang);

    // 1. 포스트 컨텐츠 직접 DOM 조작 (가장 강력한 방법)
    try {
        // 포스트 컨텐츠 요소 선택
        const koContents = document.querySelectorAll('.post-content-ko');
        const enContents = document.querySelectorAll('.post-content-en');

        console.log('[언어 시스템] 포스트 컨텐츠 요소 발견:', {
            한국어요소수: koContents.length,
            영어요소수: enContents.length,
            현재언어: lang
        });

        // 한국어 요소 표시/숨김 처리
        koContents.forEach(el => {
            if (lang === 'ko') {
                el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: static !important;';
                el.classList.remove('content-hidden');
                el.classList.add('content-visible');
            } else {
                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important;';
                el.classList.remove('content-visible');
                el.classList.add('content-hidden');
            }
        });

        // 영어 요소 표시/숨김 처리
        enContents.forEach(el => {
            if (lang === 'en') {
                el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: static !important;';
                el.classList.remove('content-hidden');
                el.classList.add('content-visible');
            } else {
                el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important;';
                el.classList.remove('content-visible');
                el.classList.add('content-hidden');
            }
        });

        // 2. 다국어 텍스트 요소 업데이트
        document.querySelectorAll('[data-ko][data-en]').forEach(el => {
            el.textContent = el.getAttribute(lang === 'ko' ? 'data-ko' : 'data-en');

            // 태그 링크의 특수 처리
            if (el.closest('.tag-link')) {
                const tagSymbol = el.closest('.tag-link').querySelector('.tag-symbol');
                if (!tagSymbol) {
                    el.textContent = '#' + el.textContent;
                }
            }
        });

        console.log('[언어 시스템] DOM 조작 완료');
    } catch (err) {
        console.error('[언어 시스템] DOM 조작 오류:', err);
    }

    // 3. 언어 변경 이벤트 발생 (languageChange - 헤더에서 사용)
    window.dispatchEvent(new CustomEvent('languageChange', {
        detail: { language: lang }
    }));

    // 4. 언어 변경 이벤트 발생 (languageChanged - 포스트에서 사용)
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
    }));

    // 5. 스토리지 이벤트 수동 발생 (다른 스크립트에 알림)
    try {
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'lang',
            oldValue: prevLang,
            newValue: lang,
            storageArea: localStorage
        }));
    } catch (e) {
        console.error('[언어 시스템] 스토리지 이벤트 발생 실패:', e);
    }

    // 실행 시간 및 상태 로깅
    const endTime = performance.now();
    console.log(`[언어 시스템] 언어 전환 완료 (${(endTime - startTime).toFixed(2)}ms)`);
    console.log('[언어 시스템] 최종 상태:', {
        'HTML lang': document.documentElement.lang,
        'localStorage.lang': localStorage.getItem('lang'),
        'localStorage.preferred_language': localStorage.getItem('preferred_language'),
        '한국어요소 표시': document.querySelectorAll('.post-content-ko:not([style*="display: none"])').length,
        '영어요소 표시': document.querySelectorAll('.post-content-en:not([style*="display: none"])').length
    });

    // 100ms 후 상태 확인 및 필요시 강제 재적용
    setTimeout(() => {
        const koVisible = document.querySelectorAll('.post-content-ko:not([style*="display: none"])').length;
        const enVisible = document.querySelectorAll('.post-content-en:not([style*="display: none"])').length;

        const expectedKoVisible = lang === 'ko' ? (document.querySelectorAll('.post-content-ko').length) : 0;
        const expectedEnVisible = lang === 'en' ? (document.querySelectorAll('.post-content-en').length) : 0;

        const isCorrect = (koVisible === expectedKoVisible && enVisible === expectedEnVisible);

        console.log('[언어 시스템] 상태 확인:', {
            현재언어: lang,
            한국어표시: koVisible,
            영어표시: enVisible,
            기대한국어표시: expectedKoVisible,
            기대영어표시: expectedEnVisible,
            정상상태: isCorrect
        });

        if (!isCorrect) {
            console.warn('[언어 시스템] 상태 불일치 감지, 강제 재적용');

            // 진단 도구의 forceLanguageSwitch 함수 사용 시도
            if (window.languageDiagnostics && typeof window.languageDiagnostics[lang === 'ko' ? 'forceKorean' : 'forceEnglish'] === 'function') {
                console.log('[언어 시스템] 진단 도구로 강제 적용');
                window.languageDiagnostics[lang === 'ko' ? 'forceKorean' : 'forceEnglish']();
            } else {
                console.log('[언어 시스템] 기본 방식으로 재적용');
                // 기본 DOM 직접 조작 재시도
                document.querySelectorAll('.post-content-ko').forEach(el => {
                    el.style.cssText = lang === 'ko'
                        ? 'display: block !important; visibility: visible !important;'
                        : 'display: none !important; visibility: hidden !important;';
                });

                document.querySelectorAll('.post-content-en').forEach(el => {
                    el.style.cssText = lang === 'en'
                        ? 'display: block !important; visibility: visible !important;'
                        : 'display: none !important; visibility: hidden !important;';
                });
            }
        }
    }, 300);

    return lang;
}

// 저장된 언어 설정 가져오기
function getStoredLanguage() {
    // URL 파라미터에서 언어 확인
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    // 로컬 스토리지에서 언어 확인 (두 가지 키 모두 확인)
    const langStorage = localStorage.getItem('lang');
    const preferredLang = localStorage.getItem('preferred_language');

    // 우선순위: URL 파라미터 > 로컬 스토리지 > 기본값(한국어)
    const finalLang = langParam || preferredLang || langStorage || 'ko';

    console.log('[언어 시스템] 저장된 언어 확인:', {
        'URL 파라미터': langParam,
        'localStorage.lang': langStorage,
        'localStorage.preferred_language': preferredLang,
        '최종 선택': finalLang
    });

    return finalLang;
}

// 다국어 요소 업데이트
function updateMultilingualElements(lang) {
    // data-ko, data-en 속성이 있는 요소들 업데이트
    document.querySelectorAll('[data-ko][data-en]').forEach(el => {
        // 선택한 언어의 속성 값으로 텍스트 변경
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // 포스트 콘텐츠 업데이트를 위한 이벤트 발생 (post.html에서 처리)
    const postKoContent = document.querySelector('.post-content-ko');
    const postEnContent = document.querySelector('.post-content-en');

    // 포스트 페이지인 경우 콘텐츠 표시/숨김 처리
    if (postKoContent && postEnContent) {
        console.log('[language.js] 포스트 콘텐츠 업데이트:', lang);

        // 강제 표시/숨김 처리
        if (lang === 'ko') {
            postKoContent.style.cssText = 'display: block !important; visibility: visible !important;';
            postEnContent.style.cssText = 'display: none !important; visibility: hidden !important;';
        } else {
            postKoContent.style.cssText = 'display: none !important; visibility: hidden !important;';
            postEnContent.style.cssText = 'display: block !important; visibility: visible !important;';
        }
    }

    // html 태그의 lang 속성 업데이트
    document.documentElement.lang = lang;
}

// 언어 토글 설정
function setupLanguageToggle(toggleElement, koText = '한국어', enText = 'English') {
    if (!toggleElement) return;

    // 언어 토글 버튼 클릭 이벤트
    toggleElement.addEventListener('click', function () {
        // 현재 언어 상태 확인
        const storedLang = getStoredLanguage();
        // 언어 전환 (ko <-> en)
        const newLang = storedLang === 'en' ? 'ko' : 'en';

        // 언어 업데이트
        updateLanguage(newLang);

        // 버튼 텍스트 업데이트
        if (toggleElement.tagName === 'BUTTON' || toggleElement.tagName === 'A') {
            toggleElement.textContent = newLang === 'ko' ? koText : enText;
        }
    });

    // 초기 상태 설정
    const initialLang = getStoredLanguage();
    // 버튼 텍스트 초기화
    if (toggleElement.tagName === 'BUTTON' || toggleElement.tagName === 'A') {
        toggleElement.textContent = initialLang === 'ko' ? koText : enText;
    }

    console.log('언어 토글 설정 완료', {
        element: toggleElement,
        initialLang: initialLang
    });
}

console.log('[언어 시스템] 언어 관리 스크립트 초기화 완료'); // 20240430 수정: 언어 토글 버그 수정
// 20240501 수정: 언어 전환 시스템 중복 초기화 및 비동기 처리 문제 해결
// 20240501 수정: 언어 전환 시스템 중복 초기화 및 이벤트 처리 개선
