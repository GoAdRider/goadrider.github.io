/**
 * 검색 데이터 로더
 * Lunr.js 검색 기능 데이터 동적 로딩 처리 
 * 성능 및 안정성 개선 버전
 */

// 전역변수: 디버깅 모드 설정
var SEARCH_DEBUG = true;

// 전역변수: 검색 데이터 저장소
var store = [];

// 전역변수: 검색 초기화 상태
var searchInitialized = false;
var searchInitializing = false;
var searchInitError = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
    // 디버깅용 로그 기록
    if (SEARCH_DEBUG) {
        console.log('[검색 디버그] 페이지 로드 완료, 검색 초기화 예정');
    }

    // 검색 토글 버튼 클릭 이벤트를 감지
    var searchToggle = document.querySelector('.search__toggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', function () {
            // 검색 활성화 시 데이터 로드
            if (!searchInitialized && !searchInitializing) {
                loadSearchData();
            }
        });
    }

    // URL에 ?search=true 파라미터가 있으면 자동으로 검색 초기화
    if (window.location.search.indexOf('search=true') > -1) {
        loadSearchData();
    }
});

/**
 * 검색 데이터 로드 함수
 * 비동기적으로 JSON 파일을 로드하고 처리
 */
function loadSearchData() {
    // 이미 초기화 중이거나 완료된 경우 중복 실행 방지
    if (searchInitializing || searchInitialized) {
        return;
    }

    searchInitializing = true;

    if (SEARCH_DEBUG) {
        console.log('[검색 디버그] 검색 데이터 로드 시작');
    }

    // 로딩 상태 표시
    updateSearchLoadingState(true);

    // 오류 메시지 초기화
    var searchError = document.getElementById('search-error');
    if (searchError) {
        searchError.style.display = 'none';
    }

    // 시간 측정 시작
    var startTime = performance.now();

    // 캐시 버스팅
    var timestamp = new Date().getTime();
    var url = '/assets/js/lunr/search-data.json?v=' + timestamp;

    // 검색 데이터 요청 시간제한 설정 (10초)
    var timeoutPromise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error('검색 데이터 로드 시간 초과 (10초)'));
        }, 10000);
    });

    // fetch API로 데이터 요청
    Promise.race([
        fetch(url),
        timeoutPromise
    ])
        .then(function (response) {
            if (!response.ok) {
                throw new Error('검색 데이터를 가져오는데 실패했습니다. 상태 코드: ' + response.status);
            }
            if (SEARCH_DEBUG) {
                console.log('[검색 디버그] 응답 수신 성공:', response.status);
            }
            return response.json();
        })
        .then(function (data) {
            // JSON 파싱 성공
            if (SEARCH_DEBUG) {
                console.log('[검색 디버그] JSON 파싱 성공');
            }

            try {
                // 데이터 검증
                if (!data || !data.items || !Array.isArray(data.items)) {
                    throw new Error('검색 데이터 형식이 올바르지 않습니다');
                }

                // 데이터 저장
                store = data.items;

                // 로드 시간 측정
                var endTime = performance.now();
                var loadTime = (endTime - startTime).toFixed(2);

                if (SEARCH_DEBUG) {
                    console.log('[검색 디버그] 데이터 로드 완료 (' + loadTime + 'ms), 항목 수: ' + store.length);
                }

                // 초기화 완료 상태 업데이트
                searchInitialized = true;
                searchInitializing = false;

                // 로딩 상태 업데이트
                updateSearchLoadingState(false);

                // 검색 데이터 로드 완료 이벤트 발생
                var event = new CustomEvent('searchDataLoaded', {
                    detail: {
                        storeSize: store.length,
                        loadTime: loadTime
                    }
                });
                document.dispatchEvent(event);
            } catch (error) {
                handleSearchError('데이터 처리 중 오류 발생: ' + error.message);
            }
        })
        .catch(function (error) {
            handleSearchError('데이터 로드 중 오류 발생: ' + error.message);
        });
}

/**
 * 검색 오류 처리
 */
function handleSearchError(errorMsg) {
    // 초기화 실패 상태 업데이트
    searchInitializing = false;
    searchInitError = errorMsg;

    // 오류 로그 출력
    if (SEARCH_DEBUG) {
        console.error('[검색 디버그] ' + errorMsg);
    }

    // 로딩 상태 업데이트
    updateSearchLoadingState(false);

    // 오류 메시지 표시
    var searchError = document.getElementById('search-error');
    if (searchError) {
        searchError.style.display = 'block';

        // 오류 메시지 텍스트 업데이트
        var errorText = searchError.querySelector('.search-error-text');
        if (errorText) {
            errorText.textContent = '검색 데이터를 로드할 수 없습니다. ' + errorMsg;
        }
    }
}

/**
 * 검색 로딩 상태 업데이트
 */
function updateSearchLoadingState(isLoading) {
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = isLoading ? 'block' : 'none';
    }
}

/**
 * 검색 데이터 다시 로드
 */
function reloadSearchData() {
    if (SEARCH_DEBUG) {
        console.log('[검색 디버그] 검색 데이터 다시 로드 요청');
    }

    // 기존 데이터 초기화
    store = [];
    searchInitialized = false;
    searchInitializing = false;
    searchInitError = null;

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

/**
 * 검색 캐시 정리
 */
function clearSearchCache() {
    // localStorage에서 검색 캐시 관련 데이터 제거
    localStorage.removeItem('searchLastUpdated');
    localStorage.removeItem('searchDataVersion');

    // 기존 검색 데이터 초기화
    reloadSearchData();

    if (SEARCH_DEBUG) {
        console.log('[검색 디버그] 검색 캐시 정리 완료');
    }
}

// 검색 초기화 오류 시 window 객체에 디버깅 함수 노출
window.debugSearch = function () {
    console.log('=== 검색 디버깅 정보 ===');
    console.log('초기화 완료:', searchInitialized);
    console.log('초기화 중:', searchInitializing);
    console.log('오류 정보:', searchInitError);
    console.log('데이터 항목 수:', store.length);
    console.log('========================');
    return {
        initialized: searchInitialized,
        initializing: searchInitializing,
        error: searchInitError,
        storeLength: store.length
    };
};

window.fixSearch = function () {
    console.log('검색 수동 초기화 시도...');
    reloadSearchData();
}; 