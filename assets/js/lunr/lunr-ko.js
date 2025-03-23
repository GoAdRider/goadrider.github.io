---
    layout: null
---

/*
  한국어 Lunr.js 검색 설정
  한글 형태소 분석을 사용하여 보다 정확한 한국어 검색 지원
*/

/* 검색 관련 전역 변수 */
var idx = null;
var resultdiv = null;
var searchInput = null;
var dataLoaded = false; // 데이터 로드 상태

/* 페이지 로드 후 비동기적으로 인덱스를 생성하여 성능 개선 */
$(document).ready(function () {
    console.log('한국어 검색 엔진 초기화 중...');

    // DOM 요소 캐싱
    resultdiv = $('#results');
    searchInput = $('.search-input');
    var searchLoading = $('#search-loading');
    var searchError = $('#search-error');

    if (!resultdiv || !searchInput) {
        console.warn('검색 요소를 찾을 수 없습니다. 검색 기능이 비활성화됩니다.');
        return;
    }

    // 검색창 표시/숨김 전환 처리
    $('.search__toggle').on('click', function () {
        $('.search-content').toggleClass('is--visible');
        $('.initial-content').toggleClass('is--hidden');

        // 검색 데이터가 로드되었지만 인덱스가 아직 생성되지 않았으면 인덱스 생성
        if (dataLoaded && !idx) {
            buildSearchIndex();
        }

        // 검색창에 포커스
        setTimeout(function () {
            $('.search-input').focus();
        }, 400);
    });

    // 검색 데이터 로드 완료 이벤트 리스너
    $(document).on('searchDataLoaded', function (e) {
        console.log('검색 데이터 로드 완료, 항목 수:', e.detail.storeSize);
        dataLoaded = true;

        // 검색창이 활성화된 상태라면 인덱스 즉시 구축
        if ($('.search-content').hasClass('is--visible')) {
            buildSearchIndex();
        }
    });

    // 검색어 입력 이벤트 연결
    searchInput.on('keyup', performSearch);
});

/* 비동기적으로 검색 인덱스 초기화 */
function buildSearchIndex() {
    // 인덱스가 이미 생성되었으면 중복 생성 방지
    if (idx) return;

    var searchLoading = $('#search-loading');
    if (searchLoading) {
        searchLoading.css('display', 'block');
    }

    console.log('한국어 검색 인덱스 구축 중...');

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

                // 한글 검색을 위한 설정
                this.pipeline.remove(lunr.trimmer);
                this.pipeline.remove(lunr.stemmer);
                this.pipeline.remove(lunr.stopWordFilter);

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

            console.log('한국어 검색 인덱스 구축 완료');

            // 로딩 상태 업데이트
            if (searchLoading) {
                searchLoading.css('display', 'none');
            }

            // 이미 검색어가 입력되어 있다면 검색 실행
            if (searchInput.val().length > 0) {
                performSearch();
            }
        } catch (e) {
            console.error('검색 인덱스 초기화 오류:', e);

            // 로딩 상태 업데이트
            if (searchLoading) {
                searchLoading.css('display', 'none');
            }

            // 오류 메시지 표시
            var searchError = $('#search-error');
            if (searchError) {
                searchError.css('display', 'block');
            }
        }
    }, 100);
}

/* 검색 실행 함수 */
function performSearch() {
    // 인덱스가 준비되지 않았으면 무시
    if (!idx) {
        if (dataLoaded) {
            buildSearchIndex(); // 데이터는 로드되었지만 인덱스가 없으면 인덱스 구축
        }
        return;
    }

    var query = searchInput.val();

    // 검색어가 없으면 결과 초기화
    if (query.length === 0) {
        resultdiv.empty();
        return;
    }

    try {
        var result = idx.query(function (q) {
            // 한글 자모 단위로 검색어 분리하여 검색
            query.split(/\s+/).forEach(function (term) {
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

        resultdiv.empty();

        // 언어에 따른 결과 메시지
        var lang = document.documentElement.getAttribute('lang') || 'ko';
        var resultText = lang === 'ko' ?
            (result.length + ' 개의 결과') :
            (result.length + ' ' + (result.length == 1 ? "result" : "results") + ' found');

        resultdiv.prepend('<p class="results__found">' + resultText + '</p>');

        // 결과 표시 최적화 (한번에 최대 50개만 표시)
        var maxResults = Math.min(result.length, 50);
        for (var i = 0; i < maxResults; i++) {
            var ref = result[i].ref;
            var searchitem = createSearchResultItem(ref);
            resultdiv.append(searchitem);
        }

        // 표시된 결과가 실제 결과보다 적을 경우 안내 메시지
        if (result.length > maxResults) {
            var moreText = lang === 'ko' ?
                ((result.length - maxResults) + ' 개의 추가 결과는 표시되지 않았습니다') :
                ((result.length - maxResults) + ' more results not shown');
            resultdiv.append('<p class="results__more">' + moreText + '</p>');
        }
    } catch (e) {
        console.error("검색 실행 오류:", e);
        resultdiv.empty();
        resultdiv.prepend('<p class="results__found">검색 중 오류가 발생했습니다</p>');
    }
}

/* 검색 결과 항목 HTML 생성 */
function createSearchResultItem(ref) {
    // 검색 결과 항목 HTML 생성
    var searchitem = '<div class="list__item">' +
        '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">' +
        '<h2 class="archive__item-title" itemprop="headline">' +
        '<a href="' + store[ref].url + '" rel="permalink">' + store[ref].title + '</a>' +
        '</h2>';

    // 썸네일 이미지가 있는 경우 추가
    if (store[ref].teaser) {
        searchitem += '<div class="archive__item-teaser">' +
            '<img src="' + store[ref].teaser + '" alt="">' +
            '</div>';
    }

    // 내용 요약 추가
    searchitem += '<p class="archive__item-excerpt" itemprop="description">' +
        store[ref].excerpt.split(" ").splice(0, 20).join(" ") + '...</p>' +
        '</article>' +
        '</div>';

    return searchitem;
} 