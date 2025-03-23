/**
 * 영어 Lunr.js 검색 설정
 * Jekyll에 의해 처리됨
 */

/**
 * 영어 검색 엔진 초기화
 * 검색 데이터가 로드된 후 인덱스 구축
 */

/* 검색 관련 전역 변수 */
var idx = null;
var resultdiv = null;
var searchInput = null;
var dataLoaded = false; // 데이터 로드 상태
var searchTimeout = null;
var indexBuilding = false;

/* 디버깅 모드 */
var DEBUG_MODE = true;

/* 페이지 로드 시 검색 초기화 */
document.addEventListener('DOMContentLoaded', function () {
    if (DEBUG_MODE) console.log('영어 검색 엔진 초기화');

    // DOM 요소 캐싱
    resultdiv = document.getElementById('results');
    searchInput = document.getElementById('search');
    var searchLoading = document.getElementById('search-loading');
    var searchError = document.getElementById('search-error');

    if (!resultdiv || !searchInput) {
        console.warn('검색 요소를 찾을 수 없습니다. 검색 기능이 비활성화됩니다.');
        return;
    }

    // 검색창 표시/숨김 전환 처리
    var searchToggle = document.querySelector('.search__toggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', function () {
            var searchContent = document.querySelector('.search-content');
            if (searchContent && searchContent.classList.contains('is--visible')) {
                // 데이터가 로드된 상태에서 인덱스가 없으면 인덱스 생성
                if (typeof store !== 'undefined' && store.length > 0 && !idx && !indexBuilding) {
                    buildSearchIndex();
                }

                // 검색창에 포커스
                setTimeout(function () {
                    searchInput.focus();
                }, 300);
            }
        });
    }

    // 검색 데이터 로드 완료 이벤트 리스너
    document.addEventListener('searchDataLoaded', function (e) {
        if (DEBUG_MODE) console.log('검색 데이터 로드 완료:', e.detail);

        // 검색창이 이미 표시된 상태면 인덱스 구축
        var searchContent = document.querySelector('.search-content');
        if (searchContent && searchContent.classList.contains('is--visible')) {
            buildSearchIndex();
        }
    });

    // 검색어 입력 이벤트 연결
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            // 디바운싱 처리
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function () {
                performSearch();
            }, 250);
        });
    }
});

/**
 * 검색 인덱스 구축
 * 비동기적으로 처리하여 브라우저 응답성 유지
 */
function buildSearchIndex() {
    // 이미 인덱스가 있거나 구축 중이면 무시
    if (idx || indexBuilding || typeof store === 'undefined' || !store.length) {
        return;
    }

    // 인덱스 구축 상태로 변경
    indexBuilding = true;

    // 로딩 상태 표시
    updateLoadingState(true);

    if (DEBUG_MODE) console.log('영어 검색 인덱스 구축 시작');

    // 메인 스레드 블로킹 방지를 위한 비동기 처리
    setTimeout(function () {
        try {
            // 검색 인덱스 생성 시작 시간
            var startTime = performance.now();

            // WebWorker 지원 여부에 따라 다른 방식으로 처리
            if (typeof (Worker) !== 'undefined' && false) { // WebWorker 비활성화 (추후 구현)
                // TODO: WebWorker 구현
                createSearchIndex();
            } else {
                createSearchIndex();
            }

            // 구축 시간 측정
            var endTime = performance.now();
            if (DEBUG_MODE) console.log('영어 검색 인덱스 구축 완료 (' + (endTime - startTime).toFixed(0) + 'ms)');

            // 로딩 상태 해제
            updateLoadingState(false);

            // 인덱스 구축 완료 상태로 변경
            indexBuilding = false;

            // 검색창에 이미 값이 있으면 검색 실행
            if (searchInput && searchInput.value.trim().length > 0) {
                performSearch();
            }
        } catch (e) {
            // 오류 발생 시 처리
            console.error('검색 인덱스 구축 실패:', e);
            indexBuilding = false;
            updateLoadingState(false);
            showSearchError('검색 준비 중 오류가 발생했습니다: ' + e.message);
        }
    }, 100);
}

/**
 * 로딩 상태 업데이트
 */
function updateLoadingState(isLoading) {
    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = isLoading ? 'block' : 'none';
    }

    // 결과 영역도 함께 조정
    if (resultdiv) {
        resultdiv.style.display = isLoading ? 'none' : 'block';
    }
}

/**
 * 검색 오류 표시
 */
function showSearchError(message) {
    var searchError = document.getElementById('search-error');
    if (searchError) {
        var errorTextElem = searchError.querySelector('.search-error-text');
        if (errorTextElem) {
            errorTextElem.textContent = message;
        }
        searchError.style.display = 'block';
    }
}

/**
 * 검색 인덱스 생성 (메인 스레드)
 */
function createSearchIndex() {
    // Lunr.js를 사용한 인덱스 생성
    idx = lunr(function () {
        // 검색 필드 설정
        this.field('title', { boost: 10 });
        this.field('excerpt', { boost: 5 });
        this.field('categories', { boost: 3 });
        this.field('tags', { boost: 3 });
        this.ref('id');

        // 데이터 추가 (100개씩 나누어 처리)
        var batchSize = 100;
        for (var i = 0; i < store.length; i += batchSize) {
            var end = Math.min(i + batchSize, store.length);
            for (var j = i; j < end; j++) {
                this.add({
                    id: j,
                    title: store[j].title || '',
                    excerpt: store[j].excerpt || '',
                    categories: store[j].categories ? store[j].categories.join(' ') : '',
                    tags: store[j].tags ? store[j].tags.join(' ') : ''
                });
            }
        }
    });
}

/**
 * 검색 실행 함수
 */
function performSearch() {
    // 인덱스가 없으면 구축
    if (!idx) {
        if (typeof store !== 'undefined' && store.length > 0 && !indexBuilding) {
            buildSearchIndex();
        }
        return;
    }

    // 검색어 가져오기
    var query = searchInput.value.trim();

    // 결과 초기화
    if (resultdiv) {
        resultdiv.innerHTML = '';
    }

    // 검색어가 없으면 종료
    if (query.length === 0) return;

    if (DEBUG_MODE) console.log('검색 실행:', query);

    try {
        // 검색 수행
        var results = idx.search(query);

        if (DEBUG_MODE) console.log('검색 결과 수:', results.length);

        // 결과 메시지 표시
        var resultText = document.createElement('p');
        resultText.className = 'results__found';

        // 언어에 맞는 메시지
        if (document.documentElement.lang === 'ko') {
            resultText.textContent = results.length > 0 ?
                results.length + '개의 결과를 찾았습니다.' :
                '검색 결과가 없습니다.';
        } else {
            resultText.textContent = results.length + ' ' +
                (results.length === 1 ? 'result' : 'results') + ' found';
        }

        resultdiv.appendChild(resultText);

        // 검색 결과 없으면 종료
        if (results.length === 0) return;

        // 최대 결과 제한
        var maxResults = Math.min(results.length, 30);

        // 결과 표시
        for (var i = 0; i < maxResults; i++) {
            var ref = results[i].ref;
            var item = createResultItem(store[ref]);
            resultdiv.appendChild(item);
        }

        // 추가 결과가 있으면 메시지 표시
        if (results.length > maxResults) {
            var moreText = document.createElement('p');
            moreText.className = 'results__more';

            if (document.documentElement.lang === 'ko') {
                moreText.textContent = '더 많은 결과 ' + (results.length - maxResults) + '개가 표시되지 않았습니다.';
            } else {
                moreText.textContent = (results.length - maxResults) + ' more results not shown';
            }

            resultdiv.appendChild(moreText);
        }
    } catch (e) {
        console.error('검색 실행 중 오류:', e);

        // 오류 메시지 표시
        resultdiv.innerHTML = '<p class="results__found">검색 중 오류가 발생했습니다: ' + e.message + '</p>';
    }
}

/**
 * 검색 결과 항목 생성
 */
function createResultItem(item) {
    if (!item) return document.createDocumentFragment();

    var listItem = document.createElement('div');
    listItem.className = 'list__item';

    var article = document.createElement('article');
    article.className = 'archive__item';
    article.setAttribute('itemscope', '');
    article.setAttribute('itemtype', 'https://schema.org/CreativeWork');

    // 제목
    var titleElement = document.createElement('h2');
    titleElement.className = 'archive__item-title';
    titleElement.setAttribute('itemprop', 'headline');

    var titleLink = document.createElement('a');
    titleLink.href = item.url;
    titleLink.setAttribute('rel', 'permalink');
    titleLink.textContent = item.title;

    titleElement.appendChild(titleLink);
    article.appendChild(titleElement);

    // 썸네일 (있는 경우)
    if (item.teaser) {
        var imageDiv = document.createElement('div');
        imageDiv.className = 'archive__item-teaser';

        var image = document.createElement('img');
        image.src = item.teaser;
        image.alt = '';

        imageDiv.appendChild(image);
        article.appendChild(imageDiv);
    }

    // 요약
    var excerptElement = document.createElement('p');
    excerptElement.className = 'archive__item-excerpt';
    excerptElement.setAttribute('itemprop', 'description');

    // 요약 최대 20단어로 제한
    var excerptText = item.excerpt.split(' ').slice(0, 20).join(' ') + '...';
    excerptElement.textContent = excerptText;

    article.appendChild(excerptElement);
    listItem.appendChild(article);

    return listItem;
} 