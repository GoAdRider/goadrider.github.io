/**
 * 글로벌 자바스크립트 함수
 * 모든 페이지에서 공통으로 사용하는 기능
 * 성능 최적화 버전 - 페이지 응답성 향상을 위해 수정됨
 */

// 전역 변수 - 검색 스크립트가 이미 로드되었는지 확인
var searchScriptsLoaded = false;

// 안전 모드 - 모든 함수에 try-catch 추가
var SAFE_MODE = true;

// 쿠키 관련 함수
function getCookie(name) {
    try {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    } catch (e) {
        console.error('쿠키 가져오기 오류:', e);
        return null;
    }
}

// 현재 언어 감지 함수 - 단순화된 버전
function detectCurrentLanguage() {
    try {
        // 1. 로컬 스토리지 확인 (언어 시스템에서 설정한 값)
        const prefLang = localStorage.getItem('preferred_language');
        const storedLang = localStorage.getItem('lang');
        if (prefLang === 'ko' || prefLang === 'en') {
            return prefLang;
        }
        if (storedLang === 'ko' || storedLang === 'en') {
            return storedLang;
        }

        // 2. 쿠키에서 언어 확인
        const cookieLang = getCookie('preferred_lang');
        if (cookieLang === 'ko' || cookieLang === 'en') {
            return cookieLang;
        }

        // 3. URL에서 언어 확인
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'ko' || langParam === 'en') {
            return langParam;
        }

        // 4. URL 경로에서 언어 확인 (단순 패턴 확인)
        if (window.location.pathname.indexOf('/en/') >= 0) {
            return 'en';
        }

        // 5. 기본값은 한국어
        return 'ko';
    } catch (e) {
        console.error('언어 감지 오류:', e);
        return 'ko'; // 오류 발생 시 기본값
    }
}

// 페이지 로드 전 언어 설정 즉시 적용 - 지연 로딩 방식
setTimeout(function () {
    try {
        const lang = detectCurrentLanguage();
        document.documentElement.setAttribute('lang', lang);
    } catch (e) {
        console.error('초기 언어 설정 오류:', e);
    }
}, 0);

// 페이지 로드 완료 후 추가 처리 - 비동기 실행으로 변경
document.addEventListener('DOMContentLoaded', function () {
    // 페이지 초기화 지연 실행 (응답성 개선)
    setTimeout(function () {
        try {
            // 중복 제목 정리: 빈 페이지 타이틀 제거
            const emptyTitles = document.querySelectorAll('.page__title:empty, .page__title:not(:has(*))');
            if (emptyTitles) {
                emptyTitles.forEach(title => {
                    if (title.textContent && title.textContent.trim() === '') {
                        title.style.display = 'none';
                    }
                });
            }

            // 언어 전환 시스템 호환성 확인
            checkLanguageSystem();
        } catch (e) {
            console.error('페이지 초기화 오류:', e);
        }
    }, 200);
});

/**
 * 언어 시스템 호환성 확인 및 설정
 * - 기존 언어 시스템이 없을 경우에만 설정
 */
function checkLanguageSystem() {
    try {
        // 언어 스위처 요소 찾기
        const languageSwitcher = document.getElementById('language-switcher');

        // 이미 이벤트 리스너가 설정되어 있는지 확인 (data-initialized 속성으로 확인)
        if (languageSwitcher && !languageSwitcher.getAttribute('data-initialized')) {
            console.log('[global.js] 기존 언어 시스템 확인 중...');

            // language.js가 로드되었는지 확인 (window.changeLanguage 함수 확인)
            if (typeof window.changeLanguage !== 'function') {
                console.log('[global.js] 주 언어 시스템이 없어 대체 시스템을 활성화합니다.');
                setupLanguageSwitcher();
            } else {
                console.log('[global.js] 주 언어 시스템 감지됨. 언어 스위처 초기화를 건너뜁니다.');
                // language.js 시스템이 제대로 작동하도록 표시
                languageSwitcher.setAttribute('data-initialized', 'true');
            }
        }
    } catch (e) {
        console.error('언어 시스템 확인 오류:', e);
    }
}

/**
 * 언어 전환 버튼 설정 - 주 언어 시스템이 없는 경우에만 사용
 */
function setupLanguageSwitcher() {
    try {
        // 언어 스위처 버튼 찾기
        const languageSwitchers = document.querySelectorAll('.language-switcher');
        if (!languageSwitchers || languageSwitchers.length === 0) return;

        console.log('[global.js] 대체 언어 시스템 설정 중... (language.js가 없는 경우)');

        // 각 언어 스위처에 이벤트 리스너 추가
        languageSwitchers.forEach(function (switcher) {
            // 이미 설정되었는지 확인
            if (switcher.getAttribute('data-initialized') === 'true') return;

            switcher.setAttribute('data-initialized', 'true');

            // 클릭 이벤트 추가
            switcher.addEventListener('click', function () {
                // 현재 언어 확인
                const currentLang = localStorage.getItem('preferred_language') || localStorage.getItem('lang') || 'ko';
                // 새 언어 설정
                const newLang = currentLang === 'en' ? 'ko' : 'en';

                console.log('[global.js] 대체 언어 시스템으로 언어 변경:', currentLang, '->', newLang);

                // 로컬 스토리지에 언어 설정 저장
                localStorage.setItem('preferred_language', newLang);
                localStorage.setItem('lang', newLang);

                // 언어 변경 이벤트 발생
                window.dispatchEvent(new CustomEvent('languageChange', {
                    detail: { language: newLang }
                }));

                document.dispatchEvent(new CustomEvent('languageChanged', {
                    detail: { language: newLang }
                }));

                // 현재 페이지 새로고침 (URL에 lang 파라미터 추가)
                const url = new URL(window.location);
                url.searchParams.set('lang', newLang);
                window.location.href = url.toString();
            });
        });
    } catch (e) {
        console.error('언어 스위처 설정 오류:', e);
    }
}

/**
 * 캐시 버스팅을 위해 검색 관련 스크립트 재로드
 * 수정: 무한 루프 방지 및 안전 로직 추가
 */
function reloadSearchScriptsWithCacheBusting() {
    // 이미 로드되었으면 무시 (무한 루프 방지)
    if (searchScriptsLoaded) return;
    searchScriptsLoaded = true;

    try {
        // 현재 lunr-store-static.js 스크립트만 안전하게 로드
        var storeScript = document.querySelector('script[src*="lunr-store-static.js"]');
        if (!storeScript) return; // 스크립트가 없으면 중단

        console.log('검색 스크립트 캐시 버스팅이 비활성화되었습니다 (성능 최적화)');
    } catch (e) {
        console.error('검색 스크립트 재로드 오류:', e);
    }
}

/**
 * 브라우저 캐시 강제 초기화 (디버깅용)
 * 직접 호출해야만 실행되도록 변경
 */
window.clearSearchCache = function () {
    try {
        localStorage.removeItem('searchIndexInitialized');
        sessionStorage.removeItem('searchQuery');

        // 캐시를 강제로 지우는 요청 이후 새로고침
        var cacheBuster = new Date().getTime();
        window.location.href = window.location.pathname + '?cache=' + cacheBuster;
    } catch (e) {
        console.error('캐시 초기화 오류:', e);
        alert('캐시 초기화 중 오류가 발생했습니다.');
    }
};

// 전역 오류 핸들링 - 제한적 로깅으로 변경
window.onerror = function (message, source, lineno, colno, error) {
    // 특정 스크립트의 오류만 로깅 (검색 관련 스크립트 제외)
    if (source && (source.includes('lunr-store.js') || source.includes('search-data.json'))) {
        // 검색 관련 오류는 무시 (이미 다른 방식으로 처리)
        return true;
    }

    console.error('[오류]', message);
    return false;
};

// 전역 설정 및 유틸리티
(function () {
    // 디버그 모드 설정
    const DEBUG_MODE = false;

    // 로깅 유틸리티
    const logger = {
        log: function (...args) {
            if (DEBUG_MODE) console.log('[global.js]', ...args);
        },
        warn: function (...args) {
            if (DEBUG_MODE) console.warn('[global.js]', ...args);
        },
        error: function (...args) {
            console.error('[global.js]', ...args);
        }
    };

    // 진단 도구 초기화
    function initializeDiagnosticTools() {
        if (!DEBUG_MODE) return;

        window.diagnosticTools = {
            logCurrentState: function () {
                logger.log('현재 상태:', {
                    language: document.documentElement.lang,
                    localStorage: {
                        lang: localStorage.getItem('lang'),
                        preferred_language: localStorage.getItem('preferred_language')
                    }
                });
            },
            forceKorean: function () {
                window.languageManager.setLanguage('ko');
            },
            forceEnglish: function () {
                window.languageManager.setLanguage('en');
            },
            inspect: function () {
                logger.log('시스템 검사 결과:', {
                    initialized: window.languageSystemInitialized,
                    manager: window.languageManager,
                    handlers: document.querySelectorAll('#language-switcher').length
                });
            },
            toggleView: function () {
                document.body.classList.toggle('debug-view');
            }
        };

        logger.log('진단 도구 초기화 완료');
    }

    // 문서 로드 시 초기화
    document.addEventListener('DOMContentLoaded', function () {
        initializeDiagnosticTools();
    });
})(); 