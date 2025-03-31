// 언어 전환 함수
function updateLanguage(lang) {
    // 모든 다국어 요소 업데이트
    document.querySelectorAll('[data-ko]').forEach(element => {
        // 프론트매터의 번역이 있으면 우선 사용
        if (element.hasAttribute('data-frontmatter-en') && lang === 'en') {
            element.textContent = element.getAttribute('data-frontmatter-en');
        }
        // 그 외의 경우 기본 번역 사용
        else {
            element.textContent = element.getAttribute(lang === 'ko' ? 'data-ko' : 'data-en');
        }

        // 태그 링크의 경우 '#' 추가
        if (element.classList.contains('tag-link')) {
            element.textContent = '#' + element.textContent;
        }
    });

    // 현재 언어 저장
    localStorage.setItem('lang', lang);

    // 언어 토글 버튼 업데이트
    const toggleButton = document.getElementById('language-toggle');
    if (toggleButton) {
        toggleButton.textContent = lang === 'ko' ? 'EN' : 'KO';
    }
}

// 페이지 로드 시 언어 설정 적용
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'ko';
    updateLanguage(savedLang);

    // 언어 토글 버튼 이벤트 리스너
    const toggleButton = document.getElementById('language-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentLang = localStorage.getItem('lang') || 'ko';
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            updateLanguage(newLang);
        });
    }
}); 