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
}); 