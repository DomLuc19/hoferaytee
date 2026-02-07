// Minimaler Dropdown-Handler
document.addEventListener('click', function (e) {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('dropdown-menu');
    if (!toggle || !menu) return;

    // Klick auf den Button: Menü toggeln
    if (toggle === e.target || toggle.contains(e.target)) {
        e.preventDefault();
        menu.classList.toggle('active');
        return;
    }

    // Klick außerhalb: Menü schließen
    if (!e.target.closest('.menu-container')) {
        menu.classList.remove('active');
    }
});