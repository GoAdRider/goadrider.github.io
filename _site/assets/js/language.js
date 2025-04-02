// 전역 언어 관리 시스템
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
    const event = new CustomEvent('languageChanged', {
        detail: { language: lang, previousLanguage: prevLang }
    });
    document.dispatchEvent(event);
    console.log('[언어 시스템] 언어 변경 이벤트 발생:', lang);

    // **** 핵심 변경: 컨텐츠 요소 언어 전환에 단순하고 강력한 방식 사용 ****
    // 한국어 요소 제어
    document.querySelectorAll('.post-content-ko').forEach(function (el) {
        if (lang === 'ko') {
            // 우선순위가 높은 인라인 스타일 + 클래스 조합 사용
            el.classList.remove('content-hidden');
            el.classList.add('content-visible');
            el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
        } else {
            el.classList.remove('content-visible');
            el.classList.add('content-hidden');
            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        }
    });

    // 영어 요소 제어
    document.querySelectorAll('.post-content-en').forEach(function (el) {
        if (lang === 'en') {
            el.classList.remove('content-hidden');
            el.classList.add('content-visible');
            el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
        } else {
            el.classList.remove('content-visible');
            el.classList.add('content-hidden');
            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        }
    });

    // 모든 다국어 요소 업데이트
    document.querySelectorAll('[data-ko][data-en]').forEach(element => {
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

    // 포스트 페이지 전용 이벤트
    document.dispatchEvent(new CustomEvent('postLanguageChange', {
        detail: { language: lang }
    }));
    console.log('[언어 시스템] 포스트 언어 변경 이벤트 발생');

    // 실행 시간 측정 및 로깅
    const endTime = performance.now();
    console.log(`[언어 시스템] 언어 전환 완료 (${(endTime - startTime).toFixed(2)}ms)`);

    // 지연 후 컨텐츠 전환 확인 및 필요시 강제 변환
    setTimeout(() => {
        const koVisible = document.querySelectorAll('.post-content-ko:not([style*="display: none"])').length;
        const enVisible = document.querySelectorAll('.post-content-en:not([style*="display: none"])').length;

        console.log('[언어 시스템] 컨텐츠 전환 확인:', {
            한국어표시: koVisible,
            영어표시: enVisible,
            현재언어: lang,
            HTML언어속성: document.documentElement.lang
        });

        // 전환이 제대로 되지 않았으면 강제 언어 디버깅 함수 호출
        if ((lang === 'ko' && (koVisible === 0 || enVisible > 0)) ||
            (lang === 'en' && (enVisible === 0 || koVisible > 0))) {
            console.log('[언어 시스템] 언어 전환 불일치 감지, 강제 전환 시도');

            // languageDiagnostics가 있으면 사용 (더 효과적인 방법)
            if (window.languageDiagnostics) {
                if (lang === 'ko') {
                    window.languageDiagnostics.forceKorean();
                } else {
                    window.languageDiagnostics.forceEnglish();
                }
            }
            // languageDebug가 있으면 사용 (대체 방법)
            else if (window.languageDebug) {
                if (lang === 'ko') {
                    window.languageDebug.forceKorean();
                } else {
                    window.languageDebug.forceEnglish();
                }
            }
            // 모두 없으면 직접 DOM 조작
            else {
                document.querySelectorAll('.post-content-ko').forEach(el => {
                    el.style.display = lang === 'ko' ? 'block' : 'none';
                });
                document.querySelectorAll('.post-content-en').forEach(el => {
                    el.style.display = lang === 'en' ? 'block' : 'none';
                });
            }
        }
    }, 100);

    // 디버깅용 - localStorage 상태 출력
    console.log('[언어 시스템] 최종 localStorage 상태:', {
        lang: localStorage.getItem('lang'),
        preferred_language: localStorage.getItem('preferred_language')
    });
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