// 언어 전환 시스템 디버그 스크립트 v1.0
// 언어 전환 문제를 해결하기 위한 도구

(function () {
    // 디버그 모드 활성화
    const DEBUG = true;

    // DOM이 로드되면 실행
    document.addEventListener('DOMContentLoaded', function () {
        console.log('언어 디버그 도구 v1.0 로드됨');

        // 언어 전환 버튼 찾기
        const buttons = document.querySelectorAll('#language-switcher, .language-switcher');
        console.log(`발견된 언어 전환 버튼: ${buttons.length}개`);

        // 각 버튼 정보 출력
        buttons.forEach((btn, i) => {
            console.log(`버튼 ${i + 1}: ID=${btn.id}, 클래스=${btn.className}`);

            // 이벤트 리스너 확인
            const clone = btn.cloneNode(true);
            // 강제로 새 이벤트 리스너 추가
            btn.addEventListener('click', function debugClick(e) {
                console.log('디버그 언어 전환 함수 호출됨');

                // 현재 언어 상태 출력
                const lang = localStorage.getItem('lang') || 'ko';
                const prefLang = localStorage.getItem('preferred_language') || 'ko';
                const htmlLang = document.documentElement.lang;

                console.log('현재 언어 상태:', {
                    'localStorage.lang': lang,
                    'localStorage.preferred_language': prefLang,
                    'html[lang]': htmlLang,
                    '버튼ID': btn.id,
                    '버튼클래스': btn.className
                });
            }, true);
        });

        // 전역 디버그 객체 생성
        window.languageDebug = {
            // 현재 언어 상태 확인
            status: function () {
                const lang = localStorage.getItem('lang') || 'ko';
                const prefLang = localStorage.getItem('preferred_language') || 'ko';
                const htmlLang = document.documentElement.lang;
                const buttonCount = document.querySelectorAll('#language-switcher, .language-switcher').length;

                console.log('언어 시스템 상태 진단:', {
                    'localStorage.lang': lang,
                    'localStorage.preferred_language': prefLang,
                    'html[lang]': htmlLang,
                    '언어전환버튼수': buttonCount,
                    '한국어콘텐츠요소수': document.querySelectorAll('.post-content-ko').length,
                    '영어콘텐츠요소수': document.querySelectorAll('.post-content-en').length,
                    '이벤트초기화여부': window.switchersInitialized || false
                });

                return '언어 시스템 상태 확인 완료';
            },

            // 강제로 언어 변경
            forceLanguage: function (lang) {
                if (lang !== 'ko' && lang !== 'en') lang = 'ko';

                localStorage.setItem('lang', lang);
                localStorage.setItem('preferred_language', lang);
                document.documentElement.lang = lang;

                // 콘텐츠 요소 직접 제어
                document.querySelectorAll('.post-content-ko').forEach(el => {
                    el.style.display = lang === 'ko' ? 'block' : 'none';
                    el.style.visibility = lang === 'ko' ? 'visible' : 'hidden';
                });

                document.querySelectorAll('.post-content-en').forEach(el => {
                    el.style.display = lang === 'en' ? 'block' : 'none';
                    el.style.visibility = lang === 'en' ? 'visible' : 'hidden';
                });

                console.log(`언어를 ${lang}로 강제 변경함`);
                return `언어를 ${lang}로 변경 완료`;
            },

            // 모든 버튼 이벤트 재설정
            resetButtons: function () {
                document.querySelectorAll('#language-switcher, .language-switcher').forEach((btn, i) => {
                    const clone = btn.cloneNode(true);
                    if (btn.parentNode) {
                        btn.parentNode.replaceChild(clone, btn);
                    }

                    clone.addEventListener('click', function (e) {
                        e.preventDefault();
                        const currentLang = localStorage.getItem('lang') || 'ko';
                        const newLang = currentLang === 'ko' ? 'en' : 'ko';

                        localStorage.setItem('lang', newLang);
                        localStorage.setItem('preferred_language', newLang);

                        console.log(`디버그 도구에서 언어를 ${newLang}로 변경함`);
                        window.location.reload();
                    });
                });

                console.log('모든 언어 전환 버튼 이벤트 재설정 완료');
                return '버튼 재설정 완료';
            }
        };

        console.log('언어 디버그 도구 초기화 완료 - window.languageDebug 객체로 접근 가능합니다.');
    });
})(); 