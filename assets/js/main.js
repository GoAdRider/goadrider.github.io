/**
 * NewsLens 메인 JavaScript 파일
 */

// DOM 요소
const languageBtn = document.getElementById('language-btn');
const languageDropdown = document.getElementById('language-dropdown');
const postGrid = document.querySelector('.post-grid');
const loader = document.querySelector('.loader');

// 언어 전환 기능
if (languageBtn && languageDropdown) {
    // 언어 선택 버튼 클릭 이벤트
    languageBtn.addEventListener('click', function (e) {
        e.preventDefault();
        languageDropdown.classList.toggle('show');
        e.stopPropagation();
    });

    // 언어 선택 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function () {
        languageDropdown.classList.remove('show');
    });

    // 언어 드롭다운 내부 클릭 이벤트 전파 방지
    languageDropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

// 인피니티 스크롤 구현
let page = 1;
let loading = false;
let allPostsLoaded = false;

// 인피니티 스크롤 구현을 위한 스크롤 이벤트 리스너
window.addEventListener('scroll', function () {
    if (allPostsLoaded || loading || !postGrid) return;

    // 브라우저 창의 하단에서 100px 이상 스크롤 되었을 때 추가 포스트 로드
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight - 100;

    if (scrollPosition >= pageHeight) {
        loadMorePosts();
    }
});

// 포스트 추가 로드 함수
function loadMorePosts() {
    if (loading || allPostsLoaded) return;

    loading = true;
    page++;

    if (loader) {
        loader.classList.add('visible');
    }

    // 현재 언어 확인
    const currentLang = document.documentElement.lang || 'en';

    // 서버에서 추가 포스트 가져오기 (AJAX 요청)
    fetch(`/api/posts?page=${page}&lang=${currentLang}`)
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                if (data.posts && data.posts.length > 0) {
                    // 포스트 추가
                    data.posts.forEach(post => {
                        postGrid.appendChild(createPostCard(post));
                    });

                    // 마지막 페이지 체크
                    if (data.is_last_page) {
                        allPostsLoaded = true;
                    }
                } else {
                    allPostsLoaded = true;
                }

                loading = false;
                if (loader) {
                    loader.classList.remove('visible');
                }
            }, 800); // 로딩 효과를 위한 지연 시간
        })
        .catch(error => {
            console.error('포스트 로드 중 오류 발생:', error);
            loading = false;
            if (loader) {
                loader.classList.remove('visible');
            }
        });
}

// 포스트 카드 생성 함수
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';

    const imgSrc = post.image || '/assets/images/default-post.jpg';

    card.innerHTML = `
    <div class="post-card-header">
      <img src="${imgSrc}" alt="${post.title}">
    </div>
    <div class="post-card-body">
      <h3 class="post-card-title">
        <a href="${post.url}">${post.title}</a>
      </h3>
      <div class="post-card-meta">${post.date}</div>
      <div class="post-card-excerpt">${post.excerpt}</div>
      <a href="${post.url}" class="post-card-link">${post.read_more_text}</a>
    </div>
  `;

    return card;
}

// 문서 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function () {
    // 페이지 초기화 코드
    const currentLang = document.documentElement.lang || 'en';

    // 현재 언어에 맞는 언어 선택 버튼 텍스트 업데이트
    if (languageBtn) {
        if (currentLang === 'ko') {
            languageBtn.textContent = 'KO';
        } else {
            languageBtn.textContent = 'EN';
        }
    }

    // 현재 언어 드롭다운 항목 활성화
    const langLinks = document.querySelectorAll('.language-dropdown a');
    if (langLinks) {
        langLinks.forEach(link => {
            if (link.getAttribute('hreflang') === currentLang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 배경 이미지 설정
    setupBackgroundImage();

    // 언어 변경 버튼 설정
    setupLanguageSwitcher();

    // 스크롤 애니메이션 설정
    setupScrollAnimations();

    // 카드 효과 설정
    setupCardEffects();
});

/**
 * 배경 이미지 설정 함수
 */
function setupBackgroundImage() {
    // bg-image 요소가 없으면 동적으로 추가
    if (!document.querySelector('.bg-image')) {
        const bgImage = document.createElement('div');
        bgImage.className = 'bg-image';
        document.body.insertBefore(bgImage, document.body.firstChild);
    }
}

/**
 * 언어 전환 버튼 설정 함수
 */
function setupLanguageSwitcher() {
    const langBtn = document.getElementById('language-btn');
    const langDropdown = document.querySelector('.language-dropdown');

    if (!langBtn || !langDropdown) return;

    // 언어 드롭다운 토글
    langBtn.addEventListener('click', function (e) {
        e.preventDefault();
        langDropdown.classList.toggle('show');
    });

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function (e) {
        if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('show');
        }
    });

    // 현재 언어 표시
    if (langBtn.querySelector('span')) {
        langBtn.querySelector('span').textContent = document.documentElement.lang.toUpperCase();
    } else {
        langBtn.textContent = document.documentElement.lang.toUpperCase();
    }

    // 활성 언어 표시
    const langLinks = langDropdown.querySelectorAll('a');
    langLinks.forEach(link => {
        const linkLang = link.getAttribute('data-lang') || link.getAttribute('hreflang');
        if (linkLang === document.documentElement.lang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 스크롤 애니메이션 설정 함수
 */
function setupScrollAnimations() {
    const header = document.querySelector('.site-header');
    const heroSection = document.querySelector('.hero-section');
    const postCards = document.querySelectorAll('.post-card');

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function () {
        const scrollPos = window.scrollY;

        // 헤더 스크롤 효과
        if (header) {
            if (scrollPos > 50) {
                header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.1)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.05)';
                header.style.backdropFilter = 'blur(15px)';
            }
        }

        // 히어로 섹션 패럴랙스 효과
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrollPos * 0.1}px)`;
            heroSection.style.opacity = 1 - (scrollPos * 0.003);
        }

        // 포스트 카드 애니메이션
        animateOnScroll(postCards);
    });

    // 초기 애니메이션
    setTimeout(() => {
        animateOnScroll(postCards);
    }, 100);
}

/**
 * 스크롤 시 요소 애니메이션 적용
 */
function animateOnScroll(elements) {
    elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight - 100) {
            // 순차적으로 애니메이션 적용
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}

/**
 * 카드 호버 효과 설정
 */
function setupCardEffects() {
    const cards = document.querySelectorAll('.post-card');

    cards.forEach(card => {
        // 초기 상태 설정
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        // 카드 호버 효과
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
} 