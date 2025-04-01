// 전역 언어 관리 시스템
// 언어 전환 함수
function updateLanguage(lang) {
    console.log('[언어 시스템] 언어 변경:', lang);

    // 이전 언어 저장 (변경 감지용)
    const prevLang = localStorage.getItem('lang');

    // 모든 저장소에 언어 설정 저장 (통합)
    localStorage.setItem('lang', lang);
    localStorage.setItem('preferred_language', lang);
    document.documentElement.lang = lang;

    // 언어 변경 이벤트 발생 (다른 스크립트에 알림)
    const event = new CustomEvent('languageChanged', { detail: { language: lang, previousLanguage: prevLang } });
    document.dispatchEvent(event);
    console.log('[언어 시스템] 언어 변경 이벤트 발생:', lang);

    // 포스트 컨텐츠 언어 전환 직접 처리
    const koContents = document.querySelectorAll('.post-content-ko');
    const enContents = document.querySelectorAll('.post-content-en');

    console.log('[언어 시스템] 포스트 컨텐츠 요소 확인:', {
        한국어요소수: koContents.length,
        영어요소수: enContents.length
    });

    // 포스트 본문 언어 전환 - !important로 강제 적용
    koContents.forEach(el => {
        el.style.cssText = lang === 'ko'
            ? 'display: block !important; visibility: visible !important; opacity: 1 !important;'
            : 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
    });

    enContents.forEach(el => {
        el.style.cssText = lang === 'en'
            ? 'display: block !important; visibility: visible !important; opacity: 1 !important;'
            : 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
    });

    console.log('[언어 시스템] 포스트 본문 언어 전환 완료:', lang);

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

    // 언어 토글 버튼 업데이트
    const toggleButton = document.getElementById('language-toggle');
    if (toggleButton) {
        toggleButton.textContent = lang === 'ko' ? 'EN' : 'KO';
    }

    // 스토리지 이벤트 수동 발생 (같은 창의 다른 스크립트에 알림)
    try {
        const storageEvent = new StorageEvent('storage', {
            key: 'lang',
            oldValue: prevLang,
            newValue: lang,
            storageArea: localStorage
        });
        window.dispatchEvent(storageEvent);
        console.log('[언어 시스템] 스토리지 이벤트 발생');
    } catch (e) {
        console.error('[언어 시스템] 스토리지 이벤트 발생 실패:', e);
    }

    // 지연 후 컨텐츠 전환 확인 및 필요시 강제 변환
    setTimeout(() => {
        const koVisible = document.querySelectorAll('.post-content-ko:not([style*="display: none"])').length;
        const enVisible = document.querySelectorAll('.post-content-en:not([style*="display: none"])').length;

        console.log('[언어 시스템] 컨텐츠 전환 확인:', {
            한국어표시: koVisible,
            영어표시: enVisible,
            현재언어: lang
        });

        // 전환이 제대로 되지 않았으면 DOM 조작으로 강제 전환
        if ((lang === 'ko' && (koVisible === 0 || enVisible > 0)) ||
            (lang === 'en' && (enVisible === 0 || koVisible > 0))) {
            console.log('[언어 시스템] 강제 DOM 교체 수행');

            // 모든 포스트 컨텐츠 요소 찾기
            const postContentEls = document.querySelectorAll('.post-content');

            postContentEls.forEach(postEl => {
                const koEl = postEl.querySelector('.post-content-ko');
                const enEl = postEl.querySelector('.post-content-en');

                if (koEl && enEl) {
                    // HTML 내용 직접 설정
                    if (lang === 'ko') {
                        koEl.style.display = 'block';
                        enEl.style.display = 'none';

                        // 부모 요소에 명시적 높이 설정 (레이아웃 시프트 방지)
                        if (postEl.offsetHeight > 0) {
                            postEl.style.minHeight = postEl.offsetHeight + 'px';
                        }
                    } else {
                        koEl.style.display = 'none';
                        enEl.style.display = 'block';

                        // 부모 요소에 명시적 높이 설정 (레이아웃 시프트 방지)
                        if (postEl.offsetHeight > 0) {
                            postEl.style.minHeight = postEl.offsetHeight + 'px';
                        }
                    }
                }
            });
        }
    }, 100);
}

// 현재 저장된 언어 설정 가져오기 (통합 감지)
function getStoredLanguage() {
    // 우선순위: 1. localStorage의 lang, 2. localStorage의 preferred_language, 3. 기본값 'ko'
    return localStorage.getItem('lang') || localStorage.getItem('preferred_language') || 'ko';
}

// 언어 토글 버튼 설정
function setupLanguageToggle() {
    const toggleButton = document.getElementById('language-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentLang = getStoredLanguage();
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            console.log('[언어 시스템] 토글 버튼 클릭:', currentLang, '->', newLang);
            updateLanguage(newLang);

            // 포스트 페이지에서 전용 이벤트 발생
            // 일부 포스트는 자체 스크립트로 언어 전환 처리
            document.dispatchEvent(new CustomEvent('postLanguageChange', {
                detail: { language: newLang }
            }));
        });
    }
}

// 페이지 로드 시 즉시 언어 설정 적용
const savedLang = getStoredLanguage();
console.log('[언어 시스템] 저장된 언어:', savedLang);

// 문서가 아직 로딩 중이면 DOMContentLoaded 이벤트에 등록, 이미 로딩됐으면 즉시 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[언어 시스템] DOM 로드 완료 - 언어 적용');
        updateLanguage(savedLang);
        setupLanguageToggle();

        // 추가 지연 후 언어 적용 재확인 (늦게 로드되는 요소 처리)
        setTimeout(() => {
            console.log('[언어 시스템] 지연 후 언어 재적용');
            updateLanguage(savedLang);
        }, 500);
    });
} else {
    console.log('[언어 시스템] 즉시 언어 적용');
    updateLanguage(savedLang);
    setupLanguageToggle();

    // 추가 지연 후 언어 적용 재확인 (늦게 로드되는 요소 처리)
    setTimeout(() => {
        console.log('[언어 시스템] 지연 후 언어 재적용');
        updateLanguage(savedLang);
    }, 500);
} 