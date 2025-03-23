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

/* 페이지 로드 시 검색 초기화 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('영어 검색 엔진 초기화 중...');

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
            document.querySelector('.search-content').classList.toggle('is--visible');
            document.querySelector('.initial-content').classList.toggle('is--hidden');

            // 검색 데이터가 로드되었지만 인덱스가 아직 생성되지 않았으면 인덱스 생성
            if (dataLoaded && !idx) {
                buildSearchIndex();
            }

            // 검색창에 포커스
            setTimeout(function () {
                searchInput.focus();
            }, 400);
        });
    }

    // 검색 데이터 로드 완료 이벤트 리스너
    document.addEventListener('searchDataLoaded', function (e) {
        console.log('검색 데이터 로드 완료, 항목 수:', e.detail.storeSize);
        dataLoaded = true;

        // 검색창이 활성화된 상태라면 인덱스 즉시 구축
        if (document.querySelector('.search-content').classList.contains('is--visible')) {
            buildSearchIndex();
        }
    });

    // 검색어 입력 이벤트 연결
    searchInput.addEventListener('keyup', performSearch);
});

/**
 * 검색 인덱스 구축
 * 비동기적으로 처리하여 브라우저 응답성 유지
 */
function buildSearchIndex() {
    // 인덱스가 이미 생성되었으면 중복 생성 방지
    if (idx) return;

    var searchLoading = document.getElementById('search-loading');
    if (searchLoading) {
        searchLoading.style.display = 'block';
    }

    console.log('영어 검색 인덱스 구축 중...');

    // 비동기 처리로 인덱스 생성 (브라우저 응답성 유지)
    setTimeout(function () {
        try {
            idx = lunr(function () {
                // LUNR 기본 설정
                this.field('title', { boost: 10 });
                this.field('excerpt');
                this.field('categories');
                this.field('tags');
                this.ref('id');

                // 색인 데이터 추가
                for (var i = 0; i < store.length; i++) {
                    this.add({
                        title: store[i].title,
                        excerpt: store[i].excerpt,
                        categories: store[i].categories,
                        tags: store[i].tags,
                        id: i
                    });
                }
            });

            console.log('영어 검색 인덱스 구축 완료');

            // 로딩 상태 업데이트
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }

            // 이미 검색어가 입력되어 있다면 검색 실행
            if (searchInput.value.length > 0) {
                performSearch();
            }
        } catch (e) {
            console.error('검색 인덱스 초기화 오류:', e);

            // 로딩 상태 업데이트
            if (searchLoading) {
                searchLoading.style.display = 'none';
            }

            // 오류 메시지 표시
            var searchError = document.getElementById('search-error');
            if (searchError) {
                searchError.style.display = 'block';
            }
        }
    }, 100);
}

/**
 * 검색 실행 함수
 */
function performSearch() {
    // 인덱스가 준비되지 않았으면 무시
    if (!idx) {
        if (dataLoaded) {
            buildSearchIndex(); // 데이터는 로드되었지만 인덱스가 없으면 인덱스 구축
        }
        return;
    }

    var query = searchInput.value.toLowerCase();

    // 검색어가 없으면 결과 초기화
    if (query.length === 0) {
        resultdiv.innerHTML = '';
        return;
    }

    // 검색 실행
    try {
        var result = idx.query(function (q) {
            // 검색어 토큰화 및 검색
            query.split(lunr.tokenizer.separator).forEach(function (term) {
                q.term(term, { boost: 100 });

                // 부분 일치 검색 지원
                if (query.lastIndexOf(" ") != query.length - 1) {
                    q.term(term, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 });
                }

                // 유사 검색 지원 (오타 허용)
                if (term != "") {
                    q.term(term, { usePipeline: false, editDistance: 1, boost: 1 });
                }
            });
        });

        // 결과 표시 초기화
        resultdiv.innerHTML = '';

        // 결과 수 표시
        var resultCount = document.createElement('p');
        resultCount.className = 'results__found';
        resultCount.textContent = result.length + ' ' + (result.length == 1 ? "result" : "results") + ' found';
        resultdiv.appendChild(resultCount);

        // 결과가 없으면 여기서 종료
        if (result.length === 0) return;

        // 결과 표시 최적화 (한번에 최대 50개만 표시)
        var maxResults = Math.min(result.length, 50);
        for (var i = 0; i < maxResults; i++) {
            var ref = result[i].ref;
            var item = store[ref];
            var searchItem = createSearchResultItem(item);
            resultdiv.innerHTML += searchItem;
        }

        // 표시된 결과가 실제 결과보다 적을 경우 안내 메시지
        if (result.length > maxResults) {
            var moreResults = document.createElement('p');
            moreResults.className = 'results__more';
            moreResults.textContent = (result.length - maxResults) + ' more results not shown';
            resultdiv.appendChild(moreResults);
        }
    } catch (e) {
        console.error('검색 실행 오류:', e);
        resultdiv.innerHTML = '<p class="results__found">An error occurred during search</p>';
    }
}

/**
 * 검색 결과 항목 HTML 생성
 */
function createSearchResultItem(item) {
    // 검색 결과 항목 HTML 생성
    var searchitem = '<div class="list__item">' +
        '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">' +
        '<h2 class="archive__item-title" itemprop="headline">' +
        '<a href="' + item.url + '" rel="permalink">' + item.title + '</a>' +
        '</h2>';

    // 썸네일 이미지가 있는 경우 추가
    if (item.teaser) {
        searchitem += '<div class="archive__item-teaser">' +
            '<img src="' + item.teaser + '" alt="">' +
            '</div>';
    }

    // 내용 요약 추가
    searchitem += '<p class="archive__item-excerpt" itemprop="description">' +
        item.excerpt.split(" ").splice(0, 20).join(" ") + '...</p>' +
        '</article>' +
        '</div>';

    return searchitem;
} 