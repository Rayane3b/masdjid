document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const links = document.querySelector('.links');

    menuIcon.addEventListener('click', function(event) {
        links.classList.toggle('active');
        event.stopPropagation(); // منع انتشار الحدث
    });

    // إغلاق القائمة عند النقر في أي مكان آخر
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.links') && !event.target.closest('.menu-icon')) {
            links.classList.remove('active');
        }
    });
});