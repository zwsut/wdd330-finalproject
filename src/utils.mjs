// function for easily creating Elements, provided by instructor
export function createElement(type, props = {}, children = []) {
    const element = document.createElement(type);
  
    // props: {textContent: "Hello world!", id: "header1", "data-productId": 123, ...}
    Object.entries(props).forEach(([key, value]) => {
      if(~key.indexOf('-')) {
        element.setAttribute(key, value); // data attributes
      } else {
        element[key] = value;
      }
    });
  
    children.forEach((child) => {
      element.appendChild(child);
    });
  
    return element;
  }

// js for loading in header and footer
import logo from './images/spaceplace.jpg';

// loads header and footer - included in this is handling for selecting navbar icons, updated pageID and refreshes
export function loadHeaderFooter() {
  const root = document.getElementById('root');

  const headerHTML = `
    <header id="main-header">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="${logo}" alt="The Space Place Logo" width="100" height="100">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active fw-bold" aria-current="page" href="#" data-page-id="home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-normal" href="#" data-page-id="asteroids">Asteroids</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-normal" href="#" data-page-id="weather">Space Weather</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-light" href="#" data-page-id="newsletter">Newsletter</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;

  const footerHTML = `
    <footer id="main-footer" class="bg-dark text-light py-4">
      <div class="container text-center">
        <p>&copy; 2024 Zachariah Sutherland. All Rights Reserved.</p>
        <p>All data courtesy of NASA.</p>        
        <ul class="list-inline">
          <li class="list-inline-item"><a href="#" data-page-id="newsletter">Newsletter</a></li>
          <li class="list-inline-item"><a href="https://www.linkedin.com/in/zach-sutherland/" target="_blank">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  `;

  root.insertAdjacentHTML('afterbegin', headerHTML);
  root.insertAdjacentHTML('beforeend', footerHTML);

  document.querySelectorAll('[data-page-id]').forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault();
          const pageId = event.target.getAttribute('data-page-id');
          localStorage.setItem('pageId', pageId);
          location.reload();
      });
  });
}

// gets value from local storage
export function getFromLocalStorage(key, defaultValue = '') {
  const value = localStorage.getItem(key);
  try {
      return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
      return value || defaultValue;
  }
}

// sets value in local storage
export function setInLocalStorage(key, value) {
  const data = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, data);
}

// basic error message 
export function handleError(error) {
  console.error('Error:', error);
}

// clears all content from an element
export function clearContent(element) {
  element.innerHTML = '';
}

// inserts content into an element
export function insertContent(element, htmlContent) {
  element.innerHTML = htmlContent;
}

// templates
export function renderTemplate(templateString) {
  const template = document.createElement('template');
  template.innerHTML = templateString.trim();
  return template.content.firstChild;
}

// to get page id from local storage, or sets to home if none set
export function initializePageId() {
  let pageId = getFromLocalStorage('pageId', 'home');

  if (!pageId) {
      pageId = 'home';
      setInLocalStorage('pageId', pageId);
  }
  return pageId;
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
  });
}
