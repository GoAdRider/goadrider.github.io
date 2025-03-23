---
    layout: null
---

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