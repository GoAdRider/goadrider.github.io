/**
 * 글로벌 자바스크립트 함수
 * 모든 페이지에서 공통으로 사용하는 기능
 */

// 전역 언어 관리 스크립트

// 쿠키 관련 함수
function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 현재 언어 감지 함수
function detectCurrentLanguage() {
    // 1. 쿠키에서 언어 확인
    const cookieLang = getCookie('preferred_lang');
    if (cookieLang === 'ko' || cookieLang === 'en') {
        return cookieLang;
    }

    // 2. URL에서 언어 확인
    if (window.location.pathname.startsWith('/en/')) {
        return 'en';
    }

    // 3. 기본값은 한국어
    return 'ko';
}

// 페이지 로드 전 언어 설정 즉시 적용
(function () {
    const lang = detectCurrentLanguage();
    document.documentElement.setAttribute('lang', lang);
})();

// 페이지 로드 완료 후 추가 처리
document.addEventListener('DOMContentLoaded', function () {
    // 중복 제목 정리: 빈 페이지 타이틀 제거
    const emptyTitles = document.querySelectorAll('.page__title:empty, .page__title:not(:has(*))');
    emptyTitles.forEach(title => {
        if (title.textContent.trim() === '' || title.textContent.trim() === ' ') {
            title.style.display = 'none';
        }
    });

    // 언어 변경 후 페이지 제목 업데이트 이벤트 등록
    document.addEventListener('languageChanged', function (e) {
        // 필요한 추가 UI 업데이트 작업
    });

    // 언어 전환 이벤트 리스너 설정
    setupLanguageSwitcher();

    // 캐시 버스팅을 위한 검색 스크립트 재로드
    reloadSearchScriptsWithCacheBusting();
});

/**
 * 언어 전환 버튼 설정
 */
function setupLanguageSwitcher() {
    // 언어 스위처 버튼 찾기
    var languageSwitchers = document.querySelectorAll('.language-switcher');

    // 각 언어 스위처에 이벤트 리스너 추가
    languageSwitchers.forEach(function (switcher) {
        switcher.addEventListener('click', function (e) {
            // 언어 변경 이벤트 발생
            var event = new CustomEvent('languageChanged', {
                detail: { language: this.getAttribute('data-lang') }
            });
            document.dispatchEvent(event);
        });
    });
}

/**
 * 캐시 버스팅을 위해 검색 관련 스크립트 재로드
 * 브라우저 캐시로 인한 문제 방지
 */
function reloadSearchScriptsWithCacheBusting() {
    // 현재 타임스탬프로 캐시 버스팅
    var cacheBuster = '?v=' + new Date().getTime();

    // lunr-store.js 스크립트 찾기
    var storeScript = document.querySelector('script[src*="lunr-store.js"]');

    // 스크립트가 있으면 캐시 버스팅 쿼리 추가하여 재로드
    if (storeScript) {
        var originalSrc = storeScript.src.split('?')[0];
        var newScript = document.createElement('script');
        newScript.src = originalSrc + cacheBuster;
        newScript.defer = true;

        // 이전 스크립트 제거 후 새 스크립트 추가
        storeScript.parentNode.replaceChild(newScript, storeScript);

        console.log('검색 스크립트가 캐시 버스팅으로 재로드되었습니다.');
    }
}

/**
 * 브라우저 캐시 강제 초기화
 * 검색 기능에 문제가 있을 때 호출
 */
function clearSearchCache() {
    localStorage.removeItem('searchIndexInitialized');
    sessionStorage.removeItem('searchQuery');

    // 현재 페이지 새로고침
    window.location.reload(true);
}

// 전역 오류 핸들링 - 디버깅 목적
window.onerror = function (message, source, lineno, colno, error) {
    console.error('전역 오류 발생:', message, 'at', source, lineno, colno);
    return false;
}; 