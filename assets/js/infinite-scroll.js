/**
 * 인피니티 스크롤 구현
 * Jekyll 블로그를 위한 인피니티 스크롤 기능
 */

/**
 * NewsLens 인피니티 스크롤 기능
 */

// 인피니티 스크롤 컨트롤러
class InfiniteScroll {
    constructor(options = {}) {
        // 기본 설정
        this.defaults = {
            container: '.post-grid',
            item: '.post-card',
            pagination: false,
            loadingIndicator: '.loader',
            nextPageSelector: '#next-page',
            path: '/page/:num/',
            scrollThreshold: 100,
            debug: false,
            language: 'en',
            loadMoreText: {
                en: 'Loading more posts...',
                ko: '더 많은 글 불러오는 중...'
            }
        };

        // 사용자 설정과 기본 설정 병합
        this.options = { ...this.defaults, ...options };

        // DOM 요소
        this.container = document.querySelector(this.options.container);
        this.loadingIndicator = document.querySelector(this.options.loadingIndicator);

        // 상태 변수
        this.page = 1;
        this.loading = false;
        this.allPostsLoaded = false;

        // 초기화 확인
        if (!this.container) {
            this.log('포스트 컨테이너를 찾을 수 없습니다.');
            return;
        }

        // 이벤트 리스너 설정
        this.setupEventListeners();
        this.log('인피니티 스크롤 초기화 완료');
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        window.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.onScroll.bind(this));
    }

    // 스크롤 이벤트 핸들러
    onScroll() {
        if (this.allPostsLoaded || this.loading) return;

        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight - this.options.scrollThreshold;

        if (scrollPosition >= pageHeight) {
            this.loadNextPage();
        }
    }

    // 다음 페이지 불러오기
    loadNextPage() {
        if (this.loading || this.allPostsLoaded) return;

        this.loading = true;
        this.page++;

        this.showLoadingIndicator();

        // 다음 페이지 URL 생성
        const nextPageUrl = this.getNextPageUrl();

        // 다음 페이지 콘텐츠 가져오기
        fetch(nextPageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('페이지를 불러올 수 없습니다.');
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 새 포스트 추출
                const newPosts = Array.from(doc.querySelectorAll(this.options.item));

                // 다음 페이지 링크 확인
                const nextPageLink = doc.querySelector(this.options.nextPageSelector);

                if (newPosts.length === 0 || !nextPageLink) {
                    this.allPostsLoaded = true;
                    this.log('모든 포스트를 불러왔습니다.');
                }

                // 새 포스트 추가
                setTimeout(() => {
                    this.appendPosts(newPosts);
                    this.hideLoadingIndicator();
                    this.loading = false;
                }, 500);
            })
            .catch(error => {
                this.log('오류 발생:', error);
                this.hideLoadingIndicator();
                this.loading = false;
                this.allPostsLoaded = true;
            });
    }

    // 새 포스트 추가
    appendPosts(posts) {
        posts.forEach(post => {
            this.container.appendChild(post.cloneNode(true));
        });
        this.log(`${posts.length}개의 새 포스트를 추가했습니다.`);
    }

    // 다음 페이지 URL 생성
    getNextPageUrl() {
        const path = this.options.path.replace(':num', this.page);

        // 언어 매개변수 추가
        const language = this.options.language;
        const langParam = language !== 'en' ? `.${language}` : '';

        return path.replace(/\.html$|$/, `${langParam}.html`);
    }

    // 로딩 표시기 보이기
    showLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('visible');
        }
    }

    // 로딩 표시기 숨기기
    hideLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('visible');
        }
    }

    // 디버그 로그
    log(...args) {
        if (this.options.debug) {
            console.log('[InfiniteScroll]', ...args);
        }
    }
}

// 문서 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function () {
    // 현재 언어 확인
    const currentLang = document.documentElement.lang || 'en';

    // 인피니티 스크롤 인스턴스 생성
    const infiniteScroll = new InfiniteScroll({
        debug: true,
        language: currentLang,
        path: '/page/:num/',
    });

    // 인피니티 스크롤 관련 변수 초기화
    let currentPage = 1;
    let isLoading = false;
    const loaderElement = document.querySelector('.loader');
    const postGrid = document.querySelector('.post-grid');

    // 메인 페이지에서만 인피니티 스크롤 활성화
    if (!postGrid || !loaderElement) {
        return;
    }

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function () {
        // 스크롤이 페이지 하단에 도달했는지 확인
        if (isScrollNearBottom() && !isLoading) {
            loadMorePosts();
        }
    });

    /**
     * 스크롤이 페이지 하단에 도달했는지 확인하는 함수
     * @returns {boolean} 스크롤이 하단에 도달했는지 여부
     */
    function isScrollNearBottom() {
        return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500);
    }

    /**
     * 추가 포스트를 로드하는 함수
     */
    function loadMorePosts() {
        isLoading = true;
        loaderElement.classList.add('visible');

        // 다음 페이지 URL 생성
        const nextPageUrl = `/page/${currentPage + 1}/` + (currentLang === 'ko' ? 'index.ko.html' : '');

        // AJAX 요청으로 다음 페이지 콘텐츠 가져오기
        fetch(nextPageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No more posts');
                }
                return response.text();
            })
            .then(html => {
                // HTML 응답 파싱
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newPosts = doc.querySelectorAll('.post-card');

                // 새 포스트가 없으면 중단
                if (newPosts.length === 0) {
                    throw new Error('No more posts');
                }

                // 새 포스트를 그리드에 추가
                newPosts.forEach(post => {
                    postGrid.appendChild(post.cloneNode(true));
                });

                // 다음 페이지로 업데이트
                currentPage = currentPage + 1;

                // 로딩 상태 업데이트
                isLoading = false;
                loaderElement.classList.remove('visible');
            })
            .catch(error => {
                console.log('Error loading more posts:', error);
                loaderElement.classList.remove('visible');
                isLoading = false;
            });
    }
});