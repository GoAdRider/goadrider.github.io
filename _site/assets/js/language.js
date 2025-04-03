// 언어 관리 시스템 (2024년 5월 버그픽스 버전 1.3)
let preferredLanguage = 'ko';
let isProcessingLanguageChange = false;
let initialLoadComplete = false;

// 전역 언어 관리 객체
const languageManager = {
    // 현재 언어 가져오기
    getCurrentLanguage: function () {
        return localStorage.getItem('lang') || localStorage.getItem('preferred_language') || 'ko';
    },

    // 언어 직접 설정 (강제)
    setLanguage: function (lang) {
        if (lang !== 'ko' && lang !== 'en') return false;
        return applyLanguage(lang, true);
    },

    // 언어 토글
    toggleLanguage: function () {
        const currentLang = this.getCurrentLanguage();
        const newLang = currentLang === 'ko' ? 'en' : 'ko';
        return this.setLanguage(newLang);
    },

    initialize: function () {
        console.log('[언어 시스템] 초기화 시작');

        // 초기 언어 설정
        const initialLang = this.getCurrentLanguage();
        this.setLanguage(initialLang);

        // 언어 전환 버튼 이벤트 리스너 설정
        document.querySelectorAll('.language-switcher').forEach(button => {
            button.addEventListener('click', () => {
                this.toggleLanguage();
            });
        });

        console.log('[언어 시스템] 초기화 완료');
    }
};

// 기존 전역 함수들을 새로운 시스템으로 연결
window.changeLanguage = function (lang) {
    return languageManager.setLanguage(lang);
};

window.toggleLanguage = function () {
    return languageManager.toggleLanguage();
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
    languageManager.setLanguage(initialLang);

    // 언어 스위처 설정
    setupLanguageSwitcher();

    window.languageSystemInitialized = true;
    initialLoadComplete = true;
});

// 언어 스위처 설정
function setupLanguageSwitcher() {
    const switchers = document.querySelectorAll('#language-switcher, .language-switcher, .language-switcher-button');

    // 이전에 설정된 이벤트 리스너가 있는지 확인하기 위한 플래그
    if (window.switchersInitialized) {
        console.log('[언어 시스템] 스위처가 이미 초기화되어 있습니다.');
        return;
    }

    switchers.forEach(switcher => {
        // 이벤트 리스너만 설정하고 DOM 요소는 복제하지 않음
        switcher.setAttribute('data-current-lang', preferredLanguage);

        // 기존 이벤트 리스너를 모두 제거 (중복 방지)
        const newSwitcher = switcher.cloneNode(true);
        if (switcher.parentNode) {
            switcher.parentNode.replaceChild(newSwitcher, switcher);
        }

        newSwitcher.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[언어 시스템] 언어 전환 버튼 클릭됨');
            languageManager.toggleLanguage();
            return false;
        });

        updateSwitcherText(preferredLanguage);
    });

    // 초기화 완료 플래그 설정
    window.switchersInitialized = true;
}

// 언어 스위처 텍스트 업데이트
function updateSwitcherText(lang) {
    document.querySelectorAll('#language-switcher, .language-switcher, .language-switcher-button').forEach(switcher => {
        const textElement = switcher.querySelector('.language-text') || switcher;
        if (textElement && textElement !== switcher) {
            textElement.textContent = switcher.getAttribute(`data-${lang}`) || (lang === 'ko' ? '한국어' : 'English');
        } else {
            switcher.textContent = switcher.getAttribute(`data-${lang}`) || (lang === 'ko' ? '한국어' : 'English');
        }
    });
}

// 전역 언어 관리 시스템
// 언어 설정 관리
let currentLanguage = '';

// 언어 전환 함수
function applyLanguage(lang, isForced = false) {
    console.log('[언어 시스템] 언어 변경:', lang);

    try {
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

        // 1. 포스트 컨텐츠 직접 DOM 조작 (가장 강력한 방법)
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

        // 3. 이벤트 발생
        const event = new CustomEvent('languageChanged', { detail: { language: lang, previousLanguage: prevLang } });
        document.dispatchEvent(event);
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));

        // 실행 시간 및 상태 로깅
        const endTime = performance.now();
        console.log(`[언어 시스템] 언어 전환 완료 (${(endTime - startTime).toFixed(2)}ms)`);

        return true;
    } catch (err) {
        console.error('[언어 시스템] 언어 변경 오류:', err);
        return false;
    }
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
        applyLanguage(newLang);

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

// DOM이 로드되면 언어 관리자 초기화
document.addEventListener('DOMContentLoaded', () => {
    languageManager.initialize();
});
