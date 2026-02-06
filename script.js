console.log('Script geladen!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded Event ausgelöst');
    
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    console.log('menuToggle:', menuToggle);
    console.log('dropdownMenu:', dropdownMenu);

    if (!menuToggle || !dropdownMenu) {
        console.error('Elemente nicht gefunden!');
        return;
    }

    // Toggle menu on button click
    menuToggle.addEventListener('click', function(e) {
        console.log('Button geklickt!');
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
        console.log('Menu ist jetzt:', dropdownMenu.classList.contains('active') ? 'OFFEN' : 'GESCHLOSSEN');
    });

    // Close menu when a link is clicked
    const menuLinks = dropdownMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.menu-container')) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    console.log('Event Listener fertig eingebunden!');
});
