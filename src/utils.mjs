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

  export function loadHeaderFooter() {
    const root = document.getElementById('root');
    
    const headerHTML = `
    <header id="main-header">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="/images/spaceplace.jpg" alt="The Space Place Logo" width="50" height="50">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Asteroids</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Space Weather</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Exoplanets</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Newsletter</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    `;
  
    root.insertAdjacentHTML('afterbegin', headerHTML);
  }
  