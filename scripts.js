// Smooth scroll function
function smoothScroll(targetId, event) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        event.preventDefault();
        window.scrollTo({
            top: targetElement.offsetTop - 100, // Adjust the offset as needed
            behavior: 'smooth'
        });
    }
}

$(document).ready(function () {
    $('.navbar-nav .nav-link').on('click', function () {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-toggler').click();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('typewriter-text');
    const words = ['Sivanithi P Y', 'a Web Developer', 'a Student', 'a Software Developer']; // Added 'a Software Developer'
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        if (charIndex < currentWord.length && !isDeleting) {
            textElement.textContent += currentWord[charIndex];
            charIndex++;
            setTimeout(type, 80);
        } else {
            isDeleting = true;
            setTimeout(erase, 1500);
        }
    }

    function erase() {
        const currentWord = words[wordIndex];
        if (charIndex > 0 && isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 60);
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 300);
        }
    }
    type();
});
