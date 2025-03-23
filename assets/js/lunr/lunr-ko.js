/**
 * 한국어 검색 지원을 위한 Lunr.js 설정
 * 페이지 응답성 최우선으로 단순화된 버전
 */

// 검색 초기화 여부
var initComplete = false;
var lunrIndex, pagesIndex;

// 디바운스 함수 - 검색 입력 최적화
function debounce(fn, delay) {
    var timer;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

// 검색 결과 레이아웃 생성
function displaySearchResults(results, store) {
    var searchResults = document.getElementById('results');
    if (!searchResults) return;

    // 결과가 없는 경우 메시지 표시
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="results__found">검색 결과가 없습니다.</p>';
        return;
    }

    // 결과 수 표시
    var resultsCount = document.createElement('div');
    resultsCount.className = 'results__found';
    resultsCount.textContent = results.length + '개의 결과를 찾았습니다.';

    var resultsList = document.createElement('ul');
    resultsList.className = 'archive__item-list';

    // 각 결과 항목 생성
    for (var i = 0; i < Math.min(results.length, 10); i++) {
        var result = results[i];
        var ref = result.ref;
        var item = store[ref];

        if (!item) continue;

        var listItem = document.createElement('li');
        listItem.className = 'list__item';

        var article = document.createElement('article');
        article.className = 'archive__item';

        // 제목 링크
        var titleElement = document.createElement('h2');
        titleElement.className = 'archive__item-title';
        var titleLink = document.createElement('a');
        titleLink.href = item.url;
        titleLink.textContent = item.title;
        titleElement.appendChild(titleLink);
        article.appendChild(titleElement);

        // 발췌문
        if (item.excerpt) {
            var excerpt = document.createElement('div');
            excerpt.className = 'archive__item-excerpt';
            excerpt.textContent = item.excerpt.replace(/<[^>]*>/g, '');
            article.appendChild(excerpt);
        }

        listItem.appendChild(article);
        resultsList.appendChild(listItem);
    }

    // 검색 결과에 추가
    searchResults.innerHTML = '';
    searchResults.appendChild(resultsCount);
    searchResults.appendChild(resultsList);
}

// 세이프 모드 검색 함수 (타임아웃 보호)
function initLunr() {
    if (initComplete) return; // 이미 초기화되었으면 건너뜀

    // 초기화 시작
    console.log('한국어 검색 엔진 초기화');

    // 전역 store 변수가 없거나 비어있으면 기본 데이터로 초기화
    if (!window.store || window.store.length === 0) {
        console.log('검색 데이터가 없음, 검색 초기화를 건너뜁니다');
        return;
    }

    // 로딩 제거
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'none';
    }

    try {
        // 인덱스 초기화 (최소 옵션으로 빠르게)
        lunrIndex = lunr(function () {
            this.field('title', { boost: 10 });
            this.field('excerpt');
            this.field('categories');
            this.field('tags');
            this.ref('id');

            // 인덱스에 문서 추가 (최대 50개로 제한하여 성능 보장)
            for (var i = 0; i < Math.min(window.store.length, 50); i++) {
                var doc = window.store[i];
                if (doc.title) {
                    this.add({
                        id: i,
                        title: doc.title,
                        excerpt: doc.excerpt,
                        categories: doc.categories,
                        tags: doc.tags
                    });
                }
            }
        });

        pagesIndex = window.store;
        initComplete = true;

        // 초기 검색어가 있으면 검색 실행
        var searchInput = document.getElementById('search');
        if (searchInput && searchInput.value.trim() !== '') {
            searchSite(searchInput.value.trim());
        }
    } catch (error) {
        console.error('검색 초기화 오류:', error);

        // 오류 메시지 표시
        var searchError = document.getElementById('search-error');
        if (searchError) {
            searchError.style.display = 'block';

            var errorText = searchError.querySelector('.search-error-text');
            if (errorText) {
                errorText.textContent = '검색 초기화 중 오류가 발생했습니다: ' + error.message;
            }
        }
    }
}

// 검색 실행 함수
function searchSite(query) {
    if (!initComplete) {
        console.log('검색 초기화가 완료되지 않았습니다.');
        return;
    }

    // 빈 쿼리인 경우 결과 표시하지 않음
    if (query.trim() === '') {
        displaySearchResults([], window.store);
        return;
    }

    try {
        // 검색 실행 (타임아웃 보호)
        var timeoutId = setTimeout(function () {
            console.log('검색 시간 초과');
            displaySearchResults([], window.store);
        }, 3000);

        var results = lunrIndex.search(query);
        clearTimeout(timeoutId);

        displaySearchResults(results, pagesIndex);
    } catch (error) {
        console.error('검색 오류:', error);
        displaySearchResults([], window.store);
    }
}

// 문서 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('search');
    if (!searchInput) return;

    // 검색어 입력 시 디바운스 적용하여 검색
    var debouncedSearch = debounce(function () {
        searchSite(this.value.trim());
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    // 검색 데이터가 로드된 후 초기화
    document.addEventListener('searchDataLoaded', function () {
        console.log('검색 데이터 로드됨, 검색 엔진 초기화');

        // 약간의 지연을 두고 초기화 (페이지 로딩에 영향 최소화)
        setTimeout(initLunr, 500);
    });

    // 이미 데이터가 있으면 바로 초기화
    if (window.store && window.store.length > 0) {
        setTimeout(initLunr, 500);
    }

    // 폼 제출 처리
    var form = document.querySelector('.search-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            if (!initComplete) {
                initLunr();
            }
        });
    }
}); 