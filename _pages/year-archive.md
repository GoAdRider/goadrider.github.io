---
title_ko: "아카이브"
title_en: "Archive"
title: " "
permalink: /year-archive/
layout: posts
author_profile: true
---

<div class="archive-content-ko">
  <h1>아카이브</h1>
  <p>연도별로 정리된 모든 글을 확인하세요.</p>
</div>

<div class="archive-content-en" style="display: none;">
  <h1>Archive</h1>
  <p>View all posts organized by year.</p>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 페이지 제목 업데이트 함수
  function updatePageTitle() {
    const lang = document.documentElement.getAttribute('lang') || 'ko';
    const title = lang === 'ko' ? "아카이브" : "Archive";
    document.title = title + " | {{ site.title }}";
    
    // H1 제목도 업데이트
    const pageHeader = document.querySelector('.page__title');
    if (pageHeader) {
      pageHeader.textContent = title;
    }
  }

  // 언어 변경 감지 함수
  function updateLanguage() {
    const lang = document.documentElement.getAttribute('lang') || 'ko';
    const koContent = document.querySelector('.archive-content-ko');
    const enContent = document.querySelector('.archive-content-en');
    
    // 콘텐츠 표시/숨김 전환
    if (lang === 'ko') {
      if(koContent) koContent.style.display = 'block';
      if(enContent) enContent.style.display = 'none';
    } else {
      if(koContent) koContent.style.display = 'none';
      if(enContent) enContent.style.display = 'block';
    }
    
    // 페이지 제목 업데이트
    updatePageTitle();
  }
  
  // 초기 설정 및 이벤트 리스너
  updateLanguage();
  document.addEventListener('languageChanged', updateLanguage);
  
  // HTML lang 속성 변경 감지
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'lang') {
        updateLanguage();
      }
    });
  });
  
  observer.observe(document.documentElement, { attributes: true });
});
</script> 