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
                <a class="nav-link active fw-bolder" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-bold" href="#">Asteroids</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-semibold" href="#">Space Weather</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-normal" href="#">Exoplanets</a>
              </li>
              <li class="nav-item">
                <a class="nav-link fw-light" href="#">Newsletter</a>
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
      <ul class="list-inline">
        <li class="list-inline-item"><a href="#">Newsletter</a></li>
        <li class="list-inline-item"><a href="#">Contact Us</a></li>
      </ul>
    </div>
  </footer>
`;

root.insertAdjacentHTML('beforeend', footerHTML)
root.insertAdjacentHTML('afterbegin', headerHTML);
}



