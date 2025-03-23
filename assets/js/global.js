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
        // 1. 쿠키에서 언어 확인
        const cookieLang = getCookie('preferred_lang');
        if (cookieLang === 'ko' || cookieLang === 'en') {
            return cookieLang;
        }

        // 2. URL에서 언어 확인 (단순 패턴 확인)
        if (window.location.pathname.indexOf('/en/') >= 0) {
            return 'en';
        }

        // 3. 기본값은 한국어
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

            // 언어 전환 이벤트 리스너 설정 (필수 기능)
            setupLanguageSwitcher();
        } catch (e) {
            console.error('페이지 초기화 오류:', e);
        }
    }, 200);
});

/**
 * 언어 전환 버튼 설정 - 단순화된 버전
 */
function setupLanguageSwitcher() {
    try {
        // 언어 스위처 버튼 찾기
        var languageSwitchers = document.querySelectorAll('.language-switcher');
        if (!languageSwitchers || languageSwitchers.length === 0) return;

        // 각 언어 스위처에 이벤트 리스너 추가
        languageSwitchers.forEach(function (switcher) {
            switcher.addEventListener('click', function (e) {
                var lang = this.getAttribute('data-lang');
                if (!lang) return;

                // 언어 변경 이벤트 발생
                var event = new CustomEvent('languageChanged', {
                    detail: { language: lang }
                });
                document.dispatchEvent(event);
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