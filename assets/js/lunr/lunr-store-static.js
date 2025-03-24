/**
 * Lunr.js 검색 기능을 위한 데이터 로더
 * 데이터 로드 방식 개선 - JSON 정적 파일 사용
 */

/**
 * 안정화된 검색 데이터 로더
 * 페이지 응답성 유지를 최우선으로 한 구현
 */

// 전역 변수 - 빈 배열로 초기화하여 최소한의 기능 보장
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
            // 검색창 표시 시 데이터가 없으면 즉시 간단한 샘플 데이터 생성
            if (store.length === 0) {
                initializeBasicStore();
            }
        });
    }

    // URL에 검색 파라미터 확인
    if (window.location.search.indexOf('search=') > -1 ||
        window.location.search.indexOf('q=') > -1) {
        // 검색 페이지에서는 즉시 기본 데이터 초기화
        initializeBasicStore();
    }
});

/**
 * 기본 검색 데이터 초기화
 * 최소한의 샘플 데이터를 생성하여 검색 기능이 작동하게 함
 */
function initializeBasicStore() {
    // 이미 데이터가 있으면 무시
    if (store.length > 0) return;

    // 샘플 데이터 생성
    store = [
        {
            title: "메인 페이지",
            excerpt: "ThoughtfulAI 블로그의 메인 페이지입니다.",
            categories: ["일반"],
            tags: ["소개"],
            url: "/"
        },
        {
            title: "검색 페이지",
            excerpt: "검색 기능을 사용하여 블로그 내용을 찾아보세요.",
            categories: ["기능"],
            tags: ["검색"],
            url: "/search/"
        }
    ];

    // 로딩 표시 제거
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'none';
    }

    // 데이터 로드 이벤트 발생
    document.dispatchEvent(new CustomEvent('searchDataLoaded', {
        detail: { storeSize: store.length, source: 'basic' }
    }));

    console.log('[검색] 기본 데이터 초기화 완료');
}

/**
 * 안전한 방식으로 실제 데이터 로드 시도
 * 기본 데이터가 이미 있으므로 실패해도 페이지 응답성에 영향 없음
 */
function tryLoadSearchData() {
    // 로딩 시도 중임을 표시
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'block';
    }

    // 타임아웃 설정 (5초 후 포기)
    var timeout = setTimeout(function () {
        if (searchLoading) {
            searchLoading.style.display = 'none';
        }
    }, 5000);

    // 간단한 JSON 데이터 로드 시도
    fetch('/assets/js/lunr/search-data.json?v=' + new Date().getTime())
        .then(function (response) {
            if (!response.ok) throw new Error('데이터 로드 실패');
            return response.json();
        })
        .then(function (data) {
            // 새로운 구조 처리: docs, posts, pages 배열 합치기
            var newStore = [];

            // docs 배열 처리
            if (data && data.docs && Array.isArray(data.docs)) {
                newStore = newStore.concat(data.docs);
            }

            // posts 배열 처리
            if (data && data.posts && Array.isArray(data.posts)) {
                newStore = newStore.concat(data.posts);
            }

            // pages 배열 처리
            if (data && data.pages && Array.isArray(data.pages)) {
                newStore = newStore.concat(data.pages);
            }

            // 유효한 항목이 있으면 store 갱신
            if (newStore.length > 0) {
                store = newStore;

                // 이벤트 발생
                document.dispatchEvent(new CustomEvent('searchDataLoaded', {
                    detail: { storeSize: store.length, source: 'json' }
                }));

                console.log('[검색] 전체 데이터 로드 완료:', store.length);
            } else {
                console.log('[검색] 로드된 데이터가 없음, 기본 데이터 유지');
            }

            clearTimeout(timeout);
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }
        })
        .catch(function (error) {
            // 오류 발생해도 기본 데이터가 있으므로 무시
            console.log('[검색] 데이터 로드 실패, 기본 데이터 유지:', error);

            clearTimeout(timeout);
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }
        });
}

// 페이지가 완전히 로드된 후 실제 데이터 로드 시도
window.addEventListener('load', function () {
    // 약간의 지연을 두고 데이터 로드 시도 (페이지 로딩에 영향 최소화)
    setTimeout(function () {
        // 기본 데이터를 먼저 초기화
        initializeBasicStore();

        // 그 다음 실제 데이터 로드 시도
        setTimeout(tryLoadSearchData, 2000);
    }, 1000);
});

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

// 디버깅 함수 (최소한의 기능만 제공)
window.debugSearch = function () {
    return {
        storeSize: store.length,
        reload: initializeBasicStore
    };
}; 