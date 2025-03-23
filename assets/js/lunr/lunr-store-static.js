/**
 * Lunr.js 검색 기능을 위한 데이터 로더
 * 데이터 로드 방식 개선 - JSON 정적 파일 사용
 */

// 전역 변수
var store = [];
var searchDataLoaded = false;
var searchLoadAttempts = 0;
var DEBUG = true;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    if (DEBUG) console.log('[검색] 페이지 로드됨');

    // 검색 토글 버튼 이벤트 처리
    var searchToggle = document.querySelector('.search__toggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', function () {
            if (!searchDataLoaded) {
                loadSearchData();
            }
        });
    }

    // URL에 검색 파라미터 확인
    if (window.location.search.indexOf('search=') > -1) {
        loadSearchData();
    }
});

/**
 * 검색 데이터 로드 함수
 * JSON 파일을 비동기적으로 로드
 */
function loadSearchData() {
    if (searchDataLoaded) return;

    // 로딩 상태 표시
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'block';
    }

    // 검색 오류 요소 초기화
    var searchError = document.getElementById('search-error');
    if (searchError) {
        searchError.style.display = 'none';
    }

    if (DEBUG) console.log('[검색] 데이터 로드 시작');

    // 캐시 방지를 위한 타임스탬프 추가
    var timestamp = new Date().getTime();

    // lunr-store.js 파일을 직접 로드하여 store 배열 초기화
    fetch('/assets/js/lunr/lunr-store.js?v=' + timestamp)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('데이터 로드 실패: ' + response.status);
            }
            return response.text();
        })
        .then(function (data) {
            try {
                // JavaScript 파일을 eval하기 전 정리
                // 프론트매터 제거 (--- layout: null --- 부분)
                data = data.replace(/^---[\s\S]*?---/, '');

                // 실행 전 안전장치
                if (!data.includes('var store = [') && !data.includes('store = [')) {
                    throw new Error('유효한 검색 데이터 형식이 아닙니다');
                }

                // 스크립트 실행 (var store = [...] 부분만 실행)
                // 주의: eval 사용은 보안상 권장되지 않지만 이 경우 직접 제어 가능한 파일이므로 허용
                eval(data);

                if (!store || !Array.isArray(store)) {
                    throw new Error('데이터 형식 오류: store가 배열이 아닙니다');
                }

                if (DEBUG) console.log('[검색] 데이터 로드 완료, 항목 수: ' + store.length);

                // 로딩 상태 업데이트
                if (searchLoading) {
                    searchLoading.style.display = 'none';
                }

                // 성공 이벤트 발생
                searchDataLoaded = true;
                document.dispatchEvent(new CustomEvent('searchDataLoaded', {
                    detail: { storeSize: store.length }
                }));
            } catch (error) {
                handleSearchError('데이터 파싱 오류: ' + error.message);
            }
        })
        .catch(function (error) {
            handleSearchError('데이터 로드 오류: ' + error.message);

            // 대체 로드 방법 시도 (3회까지)
            if (searchLoadAttempts < 3) {
                searchLoadAttempts++;
                if (DEBUG) console.log('[검색] 재시도 #' + searchLoadAttempts);

                setTimeout(function () {
                    loadSearchDataAlternative();
                }, 1000);
            }
        });
}

/**
 * 대체 데이터 로드 방법
 * 직접 데이터를 가져오는 데 문제가 있을 경우 사용
 */
function loadSearchDataAlternative() {
    // search-data.json 파일 로드 시도
    var timestamp = new Date().getTime();

    fetch('/assets/js/lunr/search-data.json?v=' + timestamp)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('대체 데이터 로드 실패: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            try {
                if (data && data.items && Array.isArray(data.items)) {
                    store = data.items;

                    if (DEBUG) console.log('[검색] 대체 데이터 로드 완료, 항목 수: ' + store.length);

                    // 로딩 상태 업데이트
                    var searchLoading = document.getElementById('search-loading');
                    if (searchLoading) {
                        searchLoading.style.display = 'none';
                    }

                    // 성공 이벤트 발생
                    searchDataLoaded = true;
                    document.dispatchEvent(new CustomEvent('searchDataLoaded', {
                        detail: { storeSize: store.length }
                    }));
                } else {
                    throw new Error('데이터 형식 오류');
                }
            } catch (error) {
                handleSearchError('대체 데이터 파싱 오류: ' + error.message);
            }
        })
        .catch(function (error) {
            handleSearchError('대체 데이터 로드 오류: ' + error.message);

            // 최후의 수단: 기본 데이터 생성
            if (searchLoadAttempts >= 3) {
                createEmptyStore();
            }
        });
}

/**
 * 검색 오류 처리
 */
function handleSearchError(message) {
    if (DEBUG) console.error('[검색] ' + message);

    // 로딩 상태 업데이트
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'none';
    }

    // 오류 메시지 표시
    var searchError = document.getElementById('search-error');
    if (searchError) {
        searchError.style.display = 'block';

        var errorText = searchError.querySelector('.search-error-text');
        if (errorText) {
            errorText.textContent = '검색 데이터를 로드할 수 없습니다. ' + message;
        }
    }
}

/**
 * 빈 검색 데이터 생성 (최후의 수단)
 */
function createEmptyStore() {
    if (DEBUG) console.log('[검색] 빈 검색 저장소 사용');

    store = [];
    searchDataLoaded = true;

    // 로딩 상태 업데이트
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'none';
    }

    document.dispatchEvent(new CustomEvent('searchDataLoaded', {
        detail: { storeSize: 0 }
    }));

    // 오류 메시지 업데이트
    var searchError = document.getElementById('search-error');
    if (searchError) {
        searchError.style.display = 'block';

        var errorText = searchError.querySelector('.search-error-text');
        if (errorText) {
            errorText.textContent = '검색 데이터를 로드할 수 없습니다. 검색이 제한적으로 작동합니다.';
        }
    }
}

// 디버깅 함수 - 콘솔에서 호출 가능
window.debugSearch = function () {
    return {
        dataLoaded: searchDataLoaded,
        attempts: searchLoadAttempts,
        storeLength: store.length,
        reload: function () {
            searchDataLoaded = false;
            searchLoadAttempts = 0;
            loadSearchData();
            return '검색 데이터 다시 로드 중...';
        }
    };
}; 