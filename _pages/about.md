---
title: "About"
permalink: /about/
layout: single
author_profile: true
toc: false
---

<div class="about-content-ko">
  <h1>소개</h1>
  
  <h2>ThoughtfulAI 블로그에 오신 것을 환영합니다</h2>
  
  <p>ThoughtfulAI는 철학적, 과학적 사고를 통해 현대 사회의 다양한 주제를 깊이 있게 탐구하는 블로그입니다. 우리는 빠르게 변화하는 세상 속에서 의미 있는 통찰을 발견하고, 복잡한 문제들을 다양한 관점에서 바라보고자 합니다.</p>
  
  <h3>블로그의 주요 주제</h3>
  
  <ul>
    <li><strong>철학적 분석</strong>: 현대 사회 현상과 기술 발전에 대한 철학적 고찰</li>
    <li><strong>과학적 분석</strong>: 최신 과학 연구와 발견에 대한 심층 분석</li>
    <li><strong>통합적 사고</strong>: 철학과 과학의 접점에서 바라본 현대 사회의 문제들</li>
    <li><strong>미래 전망</strong>: 기술 발전과 사회 변화를 바탕으로 한 미래 예측</li>
  </ul>
  
  <h3>우리의 접근 방식</h3>
  
  <p>각 주제에 대해 철저한 조사와 분석을 통해 균형 잡힌 시각을 제공하고자 합니다. 복잡한 개념과 이론을 이해하기 쉽게 설명하면서도 그 깊이를 유지하는 것이 우리의 목표입니다. 또한 다양한 의견과 관점을 존중하며, 열린 대화와 토론을 환영합니다.</p>
  
  <h3>함께해 주세요</h3>
  
  <p>ThoughtfulAI 블로그는 지속적으로 성장하고 발전하고 있습니다. 여러분의 의견과 피드백은 저희에게 큰 도움이 됩니다. 댓글을 통해 생각을 공유하거나, 소셜 미디어에서 저희를 팔로우하여 최신 포스트 소식을 받아보세요.</p>
  
  <p>감사합니다!</p>
</div>

<div class="about-content-en" style="display: none;">
  <h1>About</h1>
  
  <h2>Welcome to ThoughtfulAI Blog</h2>
  
  <p>ThoughtfulAI is a blog dedicated to exploring various topics in modern society through philosophical and scientific thinking. We aim to discover meaningful insights in a rapidly changing world and to view complex problems from diverse perspectives.</p>
  
  <h3>Main Topics</h3>
  
  <ul>
    <li><strong>Philosophical Analysis</strong>: Philosophical reflections on modern social phenomena and technological developments</li>
    <li><strong>Scientific Analysis</strong>: In-depth analysis of the latest scientific research and discoveries</li>
    <li><strong>Integrated Thinking</strong>: Modern social issues viewed from the intersection of philosophy and science</li>
    <li><strong>Future Outlook</strong>: Predictions based on technological advancements and social changes</li>
  </ul>
  
  <h3>Our Approach</h3>
  
  <p>We strive to provide a balanced perspective through thorough research and analysis on each topic. Our goal is to explain complex concepts and theories in an accessible way while maintaining their depth. We also respect diverse opinions and perspectives and welcome open dialogue and discussion.</p>
  
  <h3>Join Us</h3>
  
  <p>The ThoughtfulAI blog is continuously growing and evolving. Your opinions and feedback are invaluable to us. Share your thoughts through comments or follow us on social media to receive updates about our latest posts.</p>
  
  <p>Thank you!</p>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 언어 변경 감지 함수
  function updateLanguage() {
    const lang = document.documentElement.getAttribute('lang') || 'ko';
    const koContent = document.querySelector('.about-content-ko');
    const enContent = document.querySelector('.about-content-en');
    
    // 콘텐츠 표시/숨김 전환
    if (lang === 'ko') {
      if(koContent) koContent.style.display = 'block';
      if(enContent) enContent.style.display = 'none';
    } else {
      if(koContent) koContent.style.display = 'none';
      if(enContent) enContent.style.display = 'block';
    }
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