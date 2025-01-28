document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Category Toggle
    const categoryTitles = document.querySelectorAll('.category-title');
    
    categoryTitles.forEach(title => {
        title.addEventListener('click', () => {
            const category = title.dataset.category;
            const lessonList = document.getElementById(`${category}-lessons`);
            
            if (lessonList) {
                const isVisible = lessonList.style.display !== 'none';
                lessonList.style.display = isVisible ? 'none' : 'block';
                
                // Rotate chevron icon
                const chevron = title.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            }
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('lesson-search');
    const lessonItems = document.querySelectorAll('.lesson-item');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            lessonItems.forEach(item => {
                const title = item.querySelector('h4').textContent.toLowerCase();
                const isVisible = title.includes(searchTerm);
                item.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // Audio Player Enhancement
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        audio.addEventListener('play', () => {
            // Pause all other audio elements when one starts playing
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio && !otherAudio.paused) {
                    otherAudio.pause();
                }
            });
        });
    });
});