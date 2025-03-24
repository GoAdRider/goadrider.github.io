/*
 * layout: null
 * Front Matter 영역 - Jekyll에서 이 파일을 처리하기 위한 필수 영역입니다.
 */

// 전역 검색 데이터 스토어 - 빈 배열로 초기화
var store = [];

// 이 파일은 Jekyll이 빌드할 때 실제 데이터로 채워집니다
// ESLint 에러는 무시하세요 - Jekyll 처리 후에는 올바른 JavaScript가 됩니다

/*
Jekyll이 이 파일을 처리하여 아래 형식의 데이터가 생성됩니다:

var store = [
  {
    "title": "페이지 제목",
    "excerpt": "페이지 내용 발췌...",
    "categories": ["카테고리1", "카테고리2"],
    "tags": ["태그1", "태그2"],
    "url": "/페이지/경로/",
    "teaser": "/이미지/경로.jpg"
  },
  // 추가 항목들...
];

실제 파일의 Jekyll 템플릿 코드는 에디터에서 구문 오류로 표시될 수 있으나,
사이트 빌드 시에는 문제없이 처리됩니다.
*/

// 이 파일은 직접 편집하지 마세요. Jekyll 처리 시 덮어씌워집니다.

var store = [
    {% assign docs = site.collections %}
{% for c in docs %}
{% if forloop.last %}
{% assign l = true %}
{% endif %}
{% assign docs = c.docs | where_exp: 'doc', 'doc.search != false' %}
{% for doc in docs %}
{% if doc.header.teaser %}
{% capture teaser %} { { doc.header.teaser } } {% endcapture %}
{% else %}
{% assign teaser = site.teaser %}
{% endif %}
{
    "title": { { doc.title | jsonify } },
    "excerpt":
    {% if site.search_full_content == true %}
    {
        {
            doc.content | newline_to_br |
            replace: "<br />", " " |
                replace: "</p>", " " |
                    replace: "</h1>", " " |
                        replace: "</h2>", " " |
                            replace: "</h3>", " " |
                                replace: "</h4>", " " |
                                    replace: "</h5>", " " |
                                        replace: "</h6>", " " |
                                            strip_html | strip_newlines | jsonify
        }
    }
    {% else %}
    {
        {
            doc.content | newline_to_br |
            replace: "<br />", " " |
                replace: "</p>", " " |
                    replace: "</h1>", " " |
                        replace: "</h2>", " " |
                            replace: "</h3>", " " |
                                replace: "</h4>", " " |
                                    replace: "</h5>", " " |
                                        replace: "</h6>", " " |
                                            strip_html | strip_newlines | truncatewords: 50 | jsonify
        }
    }
    {% endif %},
    "categories": { { doc.categories | jsonify } },
    "tags": { { doc.tags | jsonify } },
    "url": { { doc.url | absolute_url | jsonify } },
    "teaser": { { teaser | absolute_url | jsonify } }
} {% unless forloop.last and l %}, {% endunless %}
{% endfor %}
{% endfor %}

{% assign posts = site.posts | where_exp: 'post', 'post.search != false' %}
{% for post in posts %}
{% if forloop.last %}
{% assign l = true %}
{% endif %}
{% if post.header.teaser %}
{% capture teaser %} { { post.header.teaser } } {% endcapture %}
{% else %}
{% assign teaser = site.teaser %}
{% endif %}
{
    "title": { { post.title | jsonify } },
    "excerpt":
    {% if site.search_full_content == true %}
    {
        {
            post.content | newline_to_br |
            replace: "<br />", " " |
                replace: "</p>", " " |
                    replace: "</h1>", " " |
                        replace: "</h2>", " " |
                            replace: "</h3>", " " |
                                replace: "</h4>", " " |
                                    replace: "</h5>", " " |
                                        replace: "</h6>", " " |
                                            strip_html | strip_newlines | jsonify
        }
    }
    {% else %}
    {
        {
            post.content | newline_to_br |
            replace: "<br />", " " |
                replace: "</p>", " " |
                    replace: "</h1>", " " |
                        replace: "</h2>", " " |
                            replace: "</h3>", " " |
                                replace: "</h4>", " " |
                                    replace: "</h5>", " " |
                                        replace: "</h6>", " " |
                                            strip_html | strip_newlines | truncatewords: 50 | jsonify
        }
    }
    {% endif %},
    "categories": { { post.categories | jsonify } },
    "tags": { { post.tags | jsonify } },
    "url": { { post.url | absolute_url | jsonify } },
    "teaser": { { teaser | absolute_url | jsonify } }
} {% unless forloop.last and l %}, {% endunless %}
{% endfor %}

{% assign pages = site.pages | where_exp: 'page', 'page.search != false' %}
{% for page in pages %}
{% if forloop.last %}
{% assign l = true %}
{% endif %}
{% if page.header.teaser %}
{% capture teaser %} { { page.header.teaser } } {% endcapture %}
{% else %}
{% assign teaser = site.teaser %}
{% endif %}
{
    "title": { { page.title | jsonify } },
    "excerpt":
    {% if site.search_full_content == true %}
    {
        {
            page.content | newline_to_br |
            replace: "<br />", " " |
                replace: "</p>", " " |
                    replace: "</h1>", " " |
                        replace: "</h2>", " " |
                            replace: "</h3>", " " |
                                replace: "</h4>", " " |
                                    replace: "</h5>", " " |
                                        replace: "</h6>", " " |
                                            strip_html | strip_newlines | jsonify
        }
    }
    {% else %}
    {
        {
            page.content | newline_to_br |
            replace: "<br />", " " |
                replace: "</p>", " " |
                    replace: "</h1>", " " |
                        replace: "</h2>", " " |
                            replace: "</h3>", " " |
                                replace: "</h4>", " " |
                                    replace: "</h5>", " " |
                                        replace: "</h6>", " " |
                                            strip_html | strip_newlines | truncatewords: 50 | jsonify
        }
    }
    {% endif %},
    "categories": { { page.categories | jsonify } },
    "tags": { { page.tags | jsonify } },
    "url": { { page.url | absolute_url | jsonify } },
    "teaser": { { teaser | absolute_url | jsonify } }
} {% unless forloop.last and l %}, {% endunless %}
{% endfor %}
] 