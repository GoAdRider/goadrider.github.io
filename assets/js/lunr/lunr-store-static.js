/**
 * 검색 데이터 로더
 * searchData.json 파일을 비동기적으로 로드하여 store 변수를 생성합니다.
 */

// 전역 검색 데이터 저장소
var store = [];

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
    // 로딩 표시 요소
    var searchLoading = document.getElementById('search-loading');
    var searchResults = document.getElementById('results');
    var searchError = document.getElementById('search-error');

    // 로딩 상태 표시
    if (searchLoading) {
        searchLoading.style.display = 'block';
    }

    // 현재 페이지 경로에서 언어 감지
    var lang = document.documentElement.getAttribute('lang') || 'ko';

    // 캐시 버스팅을 위한 타임스탬프
    var cacheBuster = '?v=' + new Date().getTime();

    // 검색 데이터 JSON 파일 위치
    var searchDataUrl = '/assets/js/lunr/search-data.json' + cacheBuster;

    // AJAX로 검색 데이터 로드
    fetch(searchDataUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('검색 데이터를 불러오는데 실패했습니다. 상태 코드: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            // 데이터 로드 성공
            store = data;
            console.log('검색 데이터 로드 완료:', store.length + '개 항목');

            // 로딩 상태 업데이트
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }

            // 검색 인덱스 초기화 이벤트 발생
            var event = new CustomEvent('searchDataLoaded', { detail: { storeSize: store.length } });
            document.dispatchEvent(event);
        })
        .catch(function (error) {
            console.error('검색 데이터 로드 오류:', error);

            // 로딩 및 오류 상태 업데이트
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }
            if (searchError) {
                searchError.style.display = 'block';
            }
        });
}); 