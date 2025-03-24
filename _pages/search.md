---
title_ko: "검색"
title_en: "Search"
title: " "
permalink: /search/
layout: single
author_profile: true
toc: false
---

<div class="search-content-ko">
  <h1>검색</h1>
  
  <p>NewsLens에 게시된 모든 글을 검색할 수 있습니다. 키워드, 카테고리, 태그 등을 입력하여 관심 있는 주제를 찾아보세요.</p>
  
  <div class="search-container">
    <form id="search-form" class="search-form">
      <div class="search-input-container">
        <input type="text" id="search-input" placeholder="검색어를 입력하세요" class="search-input">
        <button type="submit" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
      
      <div class="search-filters">
        <div class="filter-group">
          <label for="category-filter">카테고리</label>
          <select id="category-filter">
            <option value="">전체</option>
            <option value="philosophy">철학</option>
            <option value="science">과학</option>
            <option value="society">사회/정치</option>
            <option value="technology">기술</option>
            <option value="culture">문화/예술</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="date-filter">기간</label>
          <select id="date-filter">
            <option value="">전체 기간</option>
            <option value="week">1주일 이내</option>
            <option value="month">1개월 이내</option>
            <option value="year">1년 이내</option>
          </select>
        </div>
      </div>
    </form>
    
    <div class="search-tips">
      <h3>검색 팁</h3>
      <ul>
        <li><strong>정확한 구문 검색:</strong> 큰따옴표로 묶어 검색하세요. 예: "인공지능 윤리"</li>
        <li><strong>제외 검색:</strong> 특정 단어 앞에 마이너스(-)를 붙여 제외할 수 있습니다. 예: 인공지능 -윤리</li>
        <li><strong>태그 검색:</strong> #태그명 형식으로 특정 태그를 검색할 수 있습니다.</li>
        <li><strong>저자 검색:</strong> @저자명 형식으로 특정 저자의 글을 검색할 수 있습니다.</li>
      </ul>
    </div>
    
    <div id="search-results" class="search-results">
      <div class="search-summary">
        <p><span class="result-count">0</span>개의 검색 결과가 있습니다.</p>
        <div class="search-sort">
          <label for="sort-by">정렬:</label>
          <select id="sort-by">
            <option value="relevance">관련성</option>
            <option value="date">최신순</option>
            <option value="views">조회수</option>
          </select>
        </div>
      </div>
      
      <div class="search-results-container">
        <!-- 검색 결과가 여기에 표시됩니다 -->
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>검색어를 입력하면 결과가 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="search-content-en" style="display: none;">
  <h1>Search</h1>
  
  <p>Search all posts published on NewsLens. Enter keywords, categories, tags, etc. to find topics of interest.</p>
  
  <div class="search-container">
    <form id="search-form-en" class="search-form">
      <div class="search-input-container">
        <input type="text" id="search-input-en" placeholder="Enter search terms" class="search-input">
        <button type="submit" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
      
      <div class="search-filters">
        <div class="filter-group">
          <label for="category-filter-en">Category</label>
          <select id="category-filter-en">
            <option value="">All</option>
            <option value="philosophy">Philosophy</option>
            <option value="science">Science</option>
            <option value="society">Society/Politics</option>
            <option value="technology">Technology</option>
            <option value="culture">Culture/Arts</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="date-filter-en">Period</label>
          <select id="date-filter-en">
            <option value="">All Time</option>
            <option value="week">Within 1 Week</option>
            <option value="month">Within 1 Month</option>
            <option value="year">Within 1 Year</option>
          </select>
        </div>
      </div>
    </form>
    
    <div class="search-tips">
      <h3>Search Tips</h3>
      <ul>
        <li><strong>Exact Phrase Search:</strong> Enclose in double quotes. Example: "AI ethics"</li>
        <li><strong>Exclude Terms:</strong> Add a minus sign before a term to exclude it. Example: artificial intelligence -ethics</li>
        <li><strong>Tag Search:</strong> Use #tagname format to search for specific tags.</li>
        <li><strong>Author Search:</strong> Use @authorname format to search for posts by a specific author.</li>
      </ul>
    </div>
    
    <div id="search-results-en" class="search-results">
      <div class="search-summary">
        <p>There are <span class="result-count">0</span> search results.</p>
        <div class="search-sort">
          <label for="sort-by-en">Sort by:</label>
          <select id="sort-by-en">
            <option value="relevance">Relevance</option>
            <option value="date">Newest</option>
            <option value="views">Views</option>
          </select>
        </div>
      </div>
      
      <div class="search-results-container">
        <!-- Search results will be displayed here -->
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>Results will be displayed here when you enter search terms.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .search-container {
    margin: 2rem 0;
  }
  
  .search-form {
    margin-bottom: 2rem;
  }
  
  .search-input-container {
    display: flex;
    margin-bottom: 1rem;
  }
  
  .search-input {
    flex: 1;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px 0 0 6px;
    transition: border-color 0.3s;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #2563eb;
  }
  
  .search-button {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 0 1.5rem;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .search-button:hover {
    background-color: #1d4ed8;
  }
  
  .search-filters {
    display: flex;
    gap: 1rem;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  
  .filter-group label {
    font-weight: 600;
    color: #4b5563;
    font-size: 0.9rem;
  }
  
  .filter-group select {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .search-tips {
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: #f3f4f6;
    border-radius: 6px;
  }
  
  .search-tips h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1f2937;
    font-size: 1.1rem;
  }
  
  .search-tips ul {
    padding-left: 1.5rem;
    margin: 0;
  }
  
  .search-tips li {
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #4b5563;
  }
  
  .search-results {
    margin-top: 2rem;
  }
  
  .search-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.95rem;
    color: #4b5563;
  }
  
  .search-sort {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .search-sort select {
    padding: 0.3rem 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .no-results {
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
  
  .no-results i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }
  
  .no-results p {
    font-size: 1.1rem;
  }
  
  /* 검색 결과 항목 스타일 (실제 결과가 있을 때 표시될 스타일) */
  .search-result-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .search-result-item:last-child {
    border-bottom: none;
  }
  
  .result-image {
    flex: 0 0 150px;
    height: 100px;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .result-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .result-content {
    flex: 1;
  }
  
  .result-category {
    display: inline-block;
    font-size: 0.8rem;
    color: #4338ca;
    margin-bottom: 0.5rem;
  }
  
  .result-title {
    margin: 0 0 0.7rem 0;
    font-size: 1.2rem;
    line-height: 1.4;
  }
  
  .result-title a {
    color: #1f2937;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .result-title a:hover {
    color: #2563eb;
  }
  
  .result-excerpt {
    font-size: 0.95rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 0.8rem;
  }
  
  .result-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .result-meta span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  @media (max-width: 768px) {
    .search-filters {
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .search-result-item {
      flex-direction: column;
      gap: 1rem;
    }
    
    .result-image {
      flex: auto;
      width: 100%;
    }
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // URL에서 언어 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    
    if (lang === 'en') {
      document.querySelector('.search-content-ko').style.display = 'none';
      document.querySelector('.search-content-en').style.display = 'block';
    } else {
      document.querySelector('.search-content-ko').style.display = 'block';
      document.querySelector('.search-content-en').style.display = 'none';
    }
    
    // 검색 폼 처리
    const koForm = document.getElementById('search-form');
    const enForm = document.getElementById('search-form-en');
    
    function handleSearch(event, formId) {
      event.preventDefault();
      
      // 실제 구현에서는 이 부분에 검색 기능을 구현할 것입니다.
      // 여기서는 예시 목적으로 검색 입력값을 콘솔에 출력합니다.
      const searchInput = document.getElementById(formId === 'search-form' ? 'search-input' : 'search-input-en');
      console.log(`검색어: ${searchInput.value}`);
      
      // 검색 결과가 없는 상태를 가정하고 '검색 결과 없음' 메시지를 표시합니다.
      // 실제 구현에서는 이 부분을 서버에서 받아온 검색 결과로 대체합니다.
      const resultsContainer = document.querySelector(formId === 'search-form' ? 
        '.search-content-ko .search-results-container' : 
        '.search-content-en .search-results-container');
      
      // 예시 메시지 - 실제로는 이 부분을 검색 결과 HTML로 대체합니다.
      resultsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-info-circle"></i>
          <p>${formId === 'search-form' ? 
            '검색어와 일치하는 결과가 없습니다. 다른 검색어를 시도해 보세요.' : 
            'No results found matching your search terms. Please try different search terms.'}</p>
        </div>
      `;
      
      // 결과 카운트를 0으로 설정합니다.
      const resultCount = document.querySelector(formId === 'search-form' ? 
        '.search-content-ko .result-count' : 
        '.search-content-en .result-count');
      
      resultCount.textContent = '0';
    }
    
    if (koForm) {
      koForm.addEventListener('submit', function(e) {
        handleSearch(e, 'search-form');
      });
    }
    
    if (enForm) {
      enForm.addEventListener('submit', function(e) {
        handleSearch(e, 'search-form-en');
      });
    }
  });
</script> 