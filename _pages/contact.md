---
title_ko: "문의하기"
title_en: "Contact"
title: " "
permalink: /contact/
layout: single
author_profile: true
toc: false
---

<div class="contact-content-ko">
  <h1>문의하기</h1>
  
  <p>NewsLens 블로그에 관심을 가져주셔서 감사합니다. 질문, 제안, 협업 제안 등 어떤 내용이든 아래 양식을 통해 연락해 주시면 빠른 시일 내에 답변 드리겠습니다.</p>
  
  <div class="contact-form-container">
    <form id="contact-form" class="contact-form">
      <div class="form-group">
        <label for="name">이름 *</label>
        <input type="text" id="name" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="email">이메일 *</label>
        <input type="email" id="email" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="subject">제목 *</label>
        <input type="text" id="subject" name="subject" required>
      </div>
      
      <div class="form-group">
        <label for="message">메시지 *</label>
        <textarea id="message" name="message" rows="6" required></textarea>
      </div>
      
      <div class="form-group">
        <label for="inquiry-type">문의 유형</label>
        <select id="inquiry-type" name="inquiry-type">
          <option value="general">일반 문의</option>
          <option value="feedback">피드백</option>
          <option value="collaboration">협업 제안</option>
          <option value="guest-post">기고 문의</option>
          <option value="other">기타</option>
        </select>
      </div>
      
      <div class="form-group checkbox-group">
        <input type="checkbox" id="privacy-consent" name="privacy-consent" required>
        <label for="privacy-consent">개인정보 수집 및 이용에 동의합니다. *</label>
      </div>
      
      <button type="submit" class="submit-button">보내기</button>
    </form>
    
    <div id="form-success" class="form-message success" style="display: none;">
      <i class="fas fa-check-circle"></i>
      <p>메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.</p>
    </div>
    
    <div id="form-error" class="form-message error" style="display: none;">
      <i class="fas fa-exclamation-circle"></i>
      <p>메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
    </div>
  </div>
  
  <div class="contact-info">
    <h2>기타 연락 방법</h2>
    <p>문의 양식 외에도 다음과 같은 방법으로 연락하실 수 있습니다:</p>
    
    <ul>
      <li>블로그 포스트 댓글</li>
      <li>NewsLens 뉴스레터 답장</li>
    </ul>
    
    <h3>자주 묻는 질문</h3>
    <p>문의하기 전에 <a href="#">자주 묻는 질문</a> 페이지를 확인해 보세요. 이미 원하는 답변이 있을 수 있습니다.</p>
  </div>
</div>

<div class="contact-content-en" style="display: none;">
  <h1>Contact</h1>
  
  <p>Thank you for your interest in NewsLens blog. Please use the form below to send us any questions, suggestions, or collaboration proposals, and we will get back to you as soon as possible.</p>
  
  <div class="contact-form-container">
    <form id="contact-form-en" class="contact-form">
      <div class="form-group">
        <label for="name-en">Name *</label>
        <input type="text" id="name-en" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="email-en">Email *</label>
        <input type="email" id="email-en" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="subject-en">Subject *</label>
        <input type="text" id="subject-en" name="subject" required>
      </div>
      
      <div class="form-group">
        <label for="message-en">Message *</label>
        <textarea id="message-en" name="message" rows="6" required></textarea>
      </div>
      
      <div class="form-group">
        <label for="inquiry-type-en">Inquiry Type</label>
        <select id="inquiry-type-en" name="inquiry-type">
          <option value="general">General Inquiry</option>
          <option value="feedback">Feedback</option>
          <option value="collaboration">Collaboration Proposal</option>
          <option value="guest-post">Guest Post Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group checkbox-group">
        <input type="checkbox" id="privacy-consent-en" name="privacy-consent" required>
        <label for="privacy-consent-en">I agree to the collection and use of personal information. *</label>
      </div>
      
      <button type="submit" class="submit-button">Send</button>
    </form>
    
    <div id="form-success-en" class="form-message success" style="display: none;">
      <i class="fas fa-check-circle"></i>
      <p>Your message has been sent successfully. We will get back to you as soon as possible.</p>
    </div>
    
    <div id="form-error-en" class="form-message error" style="display: none;">
      <i class="fas fa-exclamation-circle"></i>
      <p>An error occurred while sending your message. Please try again later.</p>
    </div>
  </div>
  
  <div class="contact-info">
    <h2>Other Contact Methods</h2>
    <p>In addition to the contact form, you can also reach us through:</p>
    
    <ul>
      <li>Blog post comments</li>
      <li>Reply to NewsLens newsletter</li>
    </ul>
    
    <h3>Frequently Asked Questions</h3>
    <p>Before contacting us, please check our <a href="#">FAQ page</a>. You may find the answer you're looking for there.</p>
  </div>
</div>

<style>
  .contact-form-container {
    margin: 2rem 0;
    background-color: #f8fafc;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .contact-form {
    display: grid;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-weight: 600;
    color: #4b5563;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  .checkbox-group {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
  
  .checkbox-group input {
    width: 18px;
    height: 18px;
  }
  
  .submit-button {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    justify-self: start;
  }
  
  .submit-button:hover {
    background-color: #1d4ed8;
  }
  
  .form-message {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .form-message i {
    font-size: 1.5rem;
  }
  
  .form-message p {
    margin: 0;
  }
  
  .success {
    background-color: #ecfdf5;
    color: #065f46;
  }
  
  .error {
    background-color: #fef2f2;
    color: #b91c1c;
  }
  
  .contact-info {
    margin-top: 3rem;
  }
  
  .contact-info h2 {
    color: #2563eb;
    margin-bottom: 1rem;
  }
  
  .contact-info ul {
    margin-left: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .contact-info a {
    color: #2563eb;
    text-decoration: none;
  }
  
  .contact-info a:hover {
    text-decoration: underline;
  }
</style>

<script>
  // 언어 전환 스크립트
  document.addEventListener('DOMContentLoaded', function() {
    // URL에서 언어 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    
    if (lang === 'en') {
      document.querySelector('.contact-content-ko').style.display = 'none';
      document.querySelector('.contact-content-en').style.display = 'block';
    } else {
      document.querySelector('.contact-content-ko').style.display = 'block';
      document.querySelector('.contact-content-en').style.display = 'none';
    }
    
    // 폼 제출 처리
    const koForm = document.getElementById('contact-form');
    const enForm = document.getElementById('contact-form-en');
    
    function handleSubmit(event, formId, successId, errorId) {
      event.preventDefault();
      
      // 실제 구현에서는 이 부분에 폼 데이터를 서버로 전송하는 코드가 들어갈 것입니다.
      // 여기서는 데모를 위해 성공 메시지만 표시합니다.
      document.getElementById(successId).style.display = 'flex';
      document.getElementById(errorId).style.display = 'none';
      document.getElementById(formId).reset();
    }
    
    if (koForm) {
      koForm.addEventListener('submit', function(e) {
        handleSubmit(e, 'contact-form', 'form-success', 'form-error');
      });
    }
    
    if (enForm) {
      enForm.addEventListener('submit', function(e) {
        handleSubmit(e, 'contact-form-en', 'form-success-en', 'form-error-en');
      });
    }
  });
</script> 