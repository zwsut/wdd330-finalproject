import { insertContent, clearContent, loadHeaderFooter } from './utils.mjs';

export default function loadNewsletter() {
    document.body.className = '';
    document.body.classList.add('newsletter-page');

    const root = document.getElementById('root');
    clearContent(root);

    const isSignedUp = localStorage.getItem('isSignedUp') === 'true';

    const mainContainerHTML = isSignedUp
        ? `<div class="container my-5 text-center"><h2>Thank you for signing up for our newsletter!</h2></div>`
        : `
            <div class="container my-5">
                <h2 class="text-center mb-4">Sign Up for Our Newsletter</h2>
                <form id="newsletter-form" class="mx-auto" style="max-width: 400px;">
                    <div class="mb-3">
                        <label for="fname" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="fname" required>
                    </div>
                    <div class="mb-3">
                        <label for="lname" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lname" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Submit</button>
                </form>
            </div>
        `;

    insertContent(root, mainContainerHTML);
    loadHeaderFooter();

    if (!isSignedUp) {
        document.getElementById('newsletter-form').addEventListener('submit', (event) => {
            event.preventDefault();

            localStorage.setItem('isSignedUp', 'true');

            loadNewsletter();
        });
    }
}
