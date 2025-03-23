/**
 * 검색 데이터 로더
 * Lunr.js 검색 기능 데이터 동적 로딩 처리
 */

// 검색 데이터를 저장할 전역 변수
var store = [];

// 페이지 로드 시 검색 데이터 초기화
document.addEventListener('DOMContentLoaded', function () {
    loadSearchData();
});

/**
 * 검색 데이터 로드 함수
 * AJAX를 통해 검색 데이터를 비동기적으로 로드
 */
function loadSearchData() {
    console.log('검색 데이터 로드 시작...');

    // 로딩 상태 표시
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'block';
    }

    // 시간 측정 시작
    var startTime = performance.now();

    // fetch API를 사용하여 데이터 요청
    fetch('/assets/js/lunr/search-data.json?v=' + new Date().getTime())
        .then(function (response) {
            if (!response.ok) {
                throw new Error('검색 데이터를 가져오는데 실패했습니다. 상태 코드: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            // 데이터 저장
            if (data && data.items && Array.isArray(data.items)) {
                store = data.items;

                // 로딩 상태 업데이트
                if (searchLoading) {
                    searchLoading.style.display = 'none';
                }

                // 로드 시간 측정
                var endTime = performance.now();
                console.log('검색 데이터 로드 완료 (' + (endTime - startTime).toFixed(2) + 'ms). 항목 수: ' + store.length);

                // 검색 데이터 로드 완료 이벤트 발생
                var event = new CustomEvent('searchDataLoaded', {
                    detail: {
                        storeSize: store.length
                    }
                });
                document.dispatchEvent(event);
            } else {
                throw new Error('응답 데이터 형식이 올바르지 않습니다.');
            }
        })
        .catch(function (error) {
            console.error('검색 데이터 로딩 오류:', error);

            // 로딩 상태 업데이트
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }

            // 오류 메시지 표시
            var searchError = document.getElementById('search-error');
            if (searchError) {
                searchError.style.display = 'block';
                searchError.textContent = '검색 데이터를 로드할 수 없습니다. 다시 시도해 주세요.';
            }
        });
}

/**
 * 검색 데이터 다시 로드
 * 언어 변경 또는 오류 발생 시 검색 데이터 리프레시
 */
function reloadSearchData() {
    // 기존 데이터 초기화
    store = [];

    // 검색 인덱스 초기화
    if (typeof idx !== 'undefined') {
        idx = null;
    }

    // 검색 결과 초기화
    var resultdiv = document.getElementById('results');
    if (resultdiv) {
        resultdiv.innerHTML = '';
    }

    // 새로운 데이터 로드
    loadSearchData();
} 