---
title_ko: "태그"
title_en: "Tags"
title: " "
permalink: /tags/
layout: tags
author_profile: true
search: true
---

<div class="tags-content-ko">
  <h1>태그</h1>
  <p>관심 있는 태그를 선택하여 관련 글을 확인하세요.</p>
</div>

<div class="tags-content-en" style="display: none;">
  <h1>Tags</h1>
  <p>Select a tag of interest to see related posts.</p>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 페이지 제목 업데이트 함수
  function updatePageTitle() {
    const lang = document.documentElement.getAttribute('lang') || 'ko';
    const title = lang === 'ko' ? "태그" : "Tags";
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
    const koContent = document.querySelector('.tags-content-ko');
    const enContent = document.querySelector('.tags-content-en');
    
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