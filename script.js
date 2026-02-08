/**
 * Menu Toggle Handler
 * Handles opening/closing the dropdown menu and closing when clicking outside
 */
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('dropdown-menu');

    if (!toggle || !menu) return;

    // Toggle menu on button click
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function () {
            menu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.menu-container')) {
            menu.classList.remove('active');
        }
    });
});