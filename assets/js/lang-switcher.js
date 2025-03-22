/**
 * 언어 전환 관리자
 * 다국어 블로그를 위한 언어 전환 기능
 */

// 언어 전환 클래스
class LanguageSwitcher {
    constructor(options = {}) {
        // 기본 설정
        this.defaults = {
            dropdownSelector: '.language-dropdown',
            buttonSelector: '#language-btn',
            linkSelector: '.language-dropdown a',
            storage: 'sessionStorage',
            storageKey: 'preferred_language',
            languages: ['en', 'ko'],
            defaultLang: 'en',
            debug: false
        };

        // 설정 병합
        this.options = { ...this.defaults, ...options };

        // DOM 요소
        this.dropdown = document.querySelector(this.options.dropdownSelector);
        this.button = document.querySelector(this.options.buttonSelector);
        this.links = document.querySelectorAll(this.options.linkSelector);

        // 현재 언어
        this.currentLang = document.documentElement.lang || this.options.defaultLang;

        // 기본 언어 설정 확인
        const storedLang = this.getStoredLanguage();
        if (storedLang && storedLang !== this.currentLang) {
            this.redirectToLanguage(storedLang);
            return;
        }

        // 이벤트 리스너 설정
        this.setupEventListeners();
        this.log('언어 전환 초기화 완료');
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 드롭다운 토글
        if (this.button && this.dropdown) {
            this.button.addEventListener('click', this.toggleDropdown.bind(this));

            // 외부 클릭 시 드롭다운 닫기
            document.addEventListener('click', (e) => {
                if (!this.dropdown.contains(e.target) && !this.button.contains(e.target)) {
                    this.dropdown.classList.remove('show');
                }
            });
        }

        // 언어 링크 클릭
        if (this.links) {
            this.links.forEach(link => {
                link.addEventListener('click', this.handleLanguageSelect.bind(this));
            });
        }
    }

    // 드롭다운 토글
    toggleDropdown(e) {
        e.preventDefault();
        this.dropdown.classList.toggle('show');
    }

    // 언어 선택 처리
    handleLanguageSelect(e) {
        e.preventDefault();
        const selectedLang = e.currentTarget.getAttribute('data-lang');

        if (selectedLang && selectedLang !== this.currentLang) {
            this.storeLanguage(selectedLang);
            this.redirectToLanguage(selectedLang);
        }
    }

    // 선택한 언어 저장
    storeLanguage(lang) {
        if (this.options.storage === 'localStorage') {
            localStorage.setItem(this.options.storageKey, lang);
        } else {
            sessionStorage.setItem(this.options.storageKey, lang);
        }
        this.log(`언어 설정 저장: ${lang}`);
    }

    // 저장된 언어 가져오기
    getStoredLanguage() {
        if (this.options.storage === 'localStorage') {
            return localStorage.getItem(this.options.storageKey);
        } else {
            return sessionStorage.getItem(this.options.storageKey);
        }
    }

    // 언어 페이지로 리다이렉트
    redirectToLanguage(lang) {
        this.log(`언어 전환: ${this.currentLang} -> ${lang}`);

        // 현재 URL 파싱
        const currentUrl = window.location.pathname;
        const currentPage = this.extractPageInfo(currentUrl);

        // lang-ref가 있는 경우 (포스트 등)
        const langRef = document.querySelector('meta[name="lang-ref"]');
        if (langRef) {
            const ref = langRef.getAttribute('content');
            // 관련 언어 링크 찾기
            const alternateLink = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
            if (alternateLink) {
                window.location.href = alternateLink.getAttribute('href');
                return;
            }
        }

        // 기본 경로 처리 (홈페이지 등)
        if (currentPage.isIndex) {
            if (lang === this.options.defaultLang) {
                window.location.href = '/';
            } else {
                window.location.href = `/index.${lang}.html`;
            }
            return;
        }

        // 일반 페이지 처리
        let newUrl;
        if (currentPage.hasLang) {
            // 언어 코드 변경
            if (lang === this.options.defaultLang) {
                newUrl = currentUrl.replace(/\.[a-z]{2}\.html$/, '.html');
            } else {
                newUrl = currentUrl.replace(/\.[a-z]{2}\.html$/, `.${lang}.html`);
            }
        } else {
            // 언어 코드 추가
            if (lang !== this.options.defaultLang) {
                newUrl = currentUrl.replace(/\.html$/, `.${lang}.html`);
            } else {
                newUrl = currentUrl;
            }
        }

        window.location.href = newUrl;
    }

    // URL에서 페이지 정보 추출
    extractPageInfo(url) {
        const isIndex = url === '/' || url.endsWith('/index.html') || /\/index\.[a-z]{2}\.html$/.test(url);
        const hasLang = /\.[a-z]{2}\.html$/.test(url);

        return {
            isIndex,
            hasLang
        };
    }

    // 디버그 로그
    log(...args) {
        if (this.options.debug) {
            console.log('[LanguageSwitcher]', ...args);
        }
    }
}

// 문서 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function () {
    const langSwitcher = new LanguageSwitcher({
        debug: true
    });
});