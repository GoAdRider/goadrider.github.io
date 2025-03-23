---
    layout: null
---

/*
  한국어 Lunr.js 검색 설정
  한글 형태소 분석을 사용하여 보다 정확한 한국어 검색 지원
*/

var idx = lunr(function () {
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

$(document).ready(function () {
    $('.search-input').on('keyup', function () {
        var resultdiv = $('#results');
        var query = $(this).val();
        var result =
            idx.query(function (q) {
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

        // 검색 결과 표시
        for (var item in result) {
            var ref = result[item].ref;

            // 검색 결과 항목 HTML 생성
            var searchitem =
                '<div class="list__item">' +
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

            resultdiv.append(searchitem);
        }
    });
}); 