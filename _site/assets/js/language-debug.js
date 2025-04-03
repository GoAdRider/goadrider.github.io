// 언어 전환 시스템 디버그 스크립트
// 언어 전환 문제를 해결하기 위한 도구

(function () {
    // 디버그 모드 활성화
    const DEBUG = true;

    // DOM이 로드되면 실행
    document.addEventListener('DOMContentLoaded', function () {
        console.log('언어 디버그 도구 로드됨');

        // 언어 전환 버튼 찾기
        const buttons = document.querySelectorAll('#language-switcher, .language-switcher');
        console.log(`발견된 언어 전환 버튼: ${buttons.length}개`);

        // 각 버튼 정보 출력
        buttons.forEach((btn, i) => {
            console.log(`버튼 ${i + 1}: ID=${btn.id}, 클래스=${btn.className}`);
            // 이벤트 강제 추가
            btn.onclick = function (e) {
                console.log('디버그 언어 전환 함수 호출됨');
                e.preventDefault();
                e.stopPropagation();

                // 언어 토글
                const currentLang = localStorage.getItem('lang') || 'ko';
                const newLang = currentLang === 'ko' ? 'en' : 'ko';

                // 저장소 업데이트
                localStorage.setItem('lang', newLang);
                localStorage.setItem('preferred_language', newLang);

                // 페이지 새로고침
                window.location.reload();

                return false;
            };
        });
    });
})(); 