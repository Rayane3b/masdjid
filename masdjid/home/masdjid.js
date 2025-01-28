// Constants and Configuration
const CONFIG = {
    PRAYER_UPDATE_INTERVAL: 1000 * 60, // 1 minute
    ANNOUNCEMENT_INTERVAL: 5000, // 5 seconds
    API_ENDPOINT: 'https://api.aladhan.com/v1/timings',
    PRAYER_NAMES: {
        Fajr: "الفجر",
        Dhuhr: "الظهر",
        Asr: "العصر",
        Maghrib: "المغرب",
        Isha: "العشاء"
    }
};

// Utility Functions
const formatTime = (date) => {
    return new Intl.DateTimeFormat('ar-DZ', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat('ar-DZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

// Prayer Times Management
class PrayerTimesManager {
    constructor() {
        this.prayerTimes = null;
        this.nextPrayer = null;
    }

    async initialize() {
        try {
            await this.getCurrentLocation();
            await this.fetchPrayerTimes();
            this.startPeriodicUpdate();
            this.updateUI();
        } catch (error) {
            console.error('Error initializing prayer times:', error);
            this.handleError(error);
        }
    }

    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }),
                error => reject(error)
            );
        });
    }

    async fetchPrayerTimes() {
        try {
            const location = await this.getCurrentLocation();
            const response = await fetch(
                `${CONFIG.API_ENDPOINT}?latitude=${location.latitude}&longitude=${location.longitude}&method=3`
            );
            const data = await response.json();

            if (!data.data || !data.data.timings) {
                throw new Error('Invalid prayer times data');
            }

            this.prayerTimes = data.data.timings;
            this.updateNextPrayer();
        } catch (error) {
            throw new Error('Failed to fetch prayer times: ' + error.message);
        }
    }

    updateNextPrayer() {
        const now = new Date();
        const todayPrayers = Object.entries(CONFIG.PRAYER_NAMES).map(([key, name]) => {
            const [hours, minutes] = this.prayerTimes[key].split(':');
            const prayerTime = new Date(now);
            prayerTime.setHours(hours, minutes, 0);
            return { key, name, time: prayerTime };
        });

        this.nextPrayer = todayPrayers.find(prayer => prayer.time > now) ||
            { ...todayPrayers[0], time: new Date(todayPrayers[0].time.getTime() + 24 * 60 * 60 * 1000) };
    }

    updateUI() {
        this.updatePrayerGrid();
        this.updateCountdown();
        this.updatePrayerAlert();
    }

    updatePrayerGrid() {
        const prayerGrid = document.getElementById('prayer-grid');
        if (!prayerGrid || !this.prayerTimes) return;

        prayerGrid.innerHTML = '';
        Object.entries(CONFIG.PRAYER_NAMES).forEach(([key, name]) => {
            const time = this.prayerTimes[key];
            const isNext = this.nextPrayer && this.nextPrayer.key === key;

            const box = document.createElement('div');
            box.className = `prayer-box ${isNext ? 'next' : ''} fade-in`;
            box.innerHTML = `
                <h3>${name}</h3>
                <p>${time}</p>
                ${isNext ? '<div class="next-indicator">الصلاة القادمة</div>' : ''}
            `;
            prayerGrid.appendChild(box);
        });
    }

    updateCountdown() {
        if (!this.nextPrayer) return;

        const now = new Date();
        const timeDiff = this.nextPrayer.time - now;

        if (timeDiff <= 0) {
            this.updateNextPrayer();
            return;
        }

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        const countdownElement = document.getElementById('countdown');
        const nextPrayerElement = document.getElementById('next-prayer');

        if (countdownElement && nextPrayerElement) {
            nextPrayerElement.textContent = `الوقت المتبقي حتى صلاة ${this.nextPrayer.name}`;
            countdownElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    updatePrayerAlert() {
        const alertElement = document.getElementById('prayer-notification');
        if (!alertElement || !this.nextPrayer) return;

        alertElement.textContent = `الصلاة القادمة: ${this.nextPrayer.name} - ${formatTime(this.nextPrayer.time)}`;
    }

    startPeriodicUpdate() {
        setInterval(() => this.updateCountdown(), 1000);
        setInterval(() => this.fetchPrayerTimes(), CONFIG.PRAYER_UPDATE_INTERVAL);
    }

    handleError(error) {
        const alertElement = document.getElementById('prayer-notification');
        if (alertElement) {
            alertElement.textContent = `عذراً، حدث خطأ: ${error.message}`;
        }
    }
}

// Announcements Management
class AnnouncementManager {
    constructor() {
        this.announcements = [
            { title: 'درس أسبوعي', content: 'درس في التفسير كل يوم خميس بعد صلاة المغرب' },
            { title: 'حلقات تحفيظ جديدة', content: 'بدء التسجيل في حلقات تحفيظ القرآن الكريم للأطفال' },
            { title: 'صيانة المسجد', content: 'أعمال صيانة وتنظيف المسجد يوم السبت القادم' }
        ];
        this.currentIndex = 0;
    }

    initialize() {
        this.updateSlider();
        setInterval(() => this.nextAnnouncement(), CONFIG.ANNOUNCEMENT_INTERVAL);
    }

    updateSlider() {
        const slider = document.getElementById('announcement-slider');
        if (!slider) return;

        const announcement = this.announcements[this.currentIndex];
        const slide = document.createElement('div');
        slide.className = 'announcement-slide';
        slide.innerHTML = `
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
        `;

        slider.innerHTML = '';
        slider.appendChild(slide);
        setTimeout(() => slide.classList.add('active'), 100);
    }

    nextAnnouncement() {
        this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
        this.updateSlider();
    }
}

// Mobile Menu Management
class MobileMenuManager {
    constructor() {
        this.menuIcon = document.querySelector('.menu-icon');
        this.navLinks = document.querySelector('.nav-links');
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.menuIcon || !this.navLinks) return;

        this.menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.navLinks.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.menu-icon')) {
                this.navLinks.classList.remove('active');
            }
        });
    }
    updateActiveLinks() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-link');
        
        links.forEach(link => {
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class if the href matches current path
            if (link.getAttribute('href').includes(currentPath.split('/').pop())) {
                link.classList.add('active');
            }
        });
    }

    setupEventListeners() {
        if (!this.menuIcon || !this.navLinks) return;

        this.menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.navLinks.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.menu-icon')) {
                this.navLinks.classList.remove('active');
            }
        });

        // Update active links on page load
        this.updateActiveLinks();
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Update current date/time
    const updateDateTime = () => {
        const dateTimeElement = document.getElementById('current-datetime');
        if (dateTimeElement) {
            const now = new Date();
            dateTimeElement.textContent = `${formatDate(now)} - ${formatTime(now)}`;
        }
    };
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Initialize all managers
    const prayerManager = new PrayerTimesManager();
    const announcementManager = new AnnouncementManager();
    const mobileMenuManager = new MobileMenuManager();

    prayerManager.initialize();
    announcementManager.initialize();
});