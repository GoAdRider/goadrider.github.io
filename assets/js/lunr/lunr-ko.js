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

/* 페이지 로드 후 비동기적으로 인덱스를 생성하여 성능 개선 */
$(document).ready(function () {
    // DOM 요소 캐싱
    resultdiv = $('#results');
    searchInput = $('.search-input');

    // 검색창 표시/숨김 전환 처리
    $('.search__toggle').on('click', function () {
        $('.search-content').toggleClass('is--visible');
        $('.initial-content').toggleClass('is--hidden');

        // 인덱스가 아직 생성되지 않았으면 생성
        if (!idx) {
            initSearchIndex();
        }

        // 검색창에 포커스
        setTimeout(function () {
            $('.search-input').focus();
        }, 400);
    });

    // 검색어 입력 이벤트 연결
    searchInput.on('keyup', performSearch);
});

/* 비동기적으로 검색 인덱스 초기화 */
function initSearchIndex() {
    // UI 표시
    resultdiv.empty();
    resultdiv.prepend('<p class="results__found">검색 인덱스를 초기화하는 중...</p>');

    // 비동기 처리로 인덱스 생성 (브라우저 응답성 유지)
    setTimeout(function () {
        try {
            idx = lunr(function () {
                // LUNR 기본 설정
                this.field('title')
                this.field('excerpt')
                this.field('categories')
                this.field('tags')
                this.ref('id')

                // 한글 검색을 위한 설정
                this.pipeline.remove(lunr.trimmer)
                this.pipeline.remove(lunr.stemmer)
                this.pipeline.remove(lunr.stopWordFilter)

                // 색인 데이터 추가
                for (var item in store) {
                    this.add({
                        title: store[item].title,
                        excerpt: store[item].excerpt,
                        categories: store[item].categories,
                        tags: store[item].tags,
                        id: item
                    })
                }
            });

            // 인덱스 생성 완료 메시지
            resultdiv.empty();
            resultdiv.prepend('<p class="results__found">검색할 준비가 되었습니다</p>');

            // 이미 검색어가 입력되어 있다면 검색 실행
            if (searchInput.val().length > 0) {
                performSearch();
            }
        } catch (e) {
            console.error("검색 인덱스 초기화 오류:", e);
            resultdiv.empty();
            resultdiv.prepend('<p class="results__found">검색 기능을 초기화하는 중 오류가 발생했습니다</p>');
        }
    }, 100);
}

/* 검색 실행 함수 */
function performSearch() {
    // 인덱스가 아직 초기화되지 않았으면 초기화
    if (!idx) {
        initSearchIndex();
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
                q.term(term, { boost: 100 })
                // 부분 일치 검색 지원
                if (query.lastIndexOf(" ") != query.length - 1) {
                    q.term(term, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 })
                }
                // 유사 검색 지원 (오타 허용)
                if (term != "") {
                    q.term(term, { usePipeline: false, editDistance: 1, boost: 1 })
                }
            })
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