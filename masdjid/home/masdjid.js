// تعريف كائن الصلوات باللغة العربية
const prayers = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
};

// تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };
    document.getElementById("current-datetime").textContent = new Intl.DateTimeFormat("ar-DZ", options).format(now);
}

// الحصول على إحداثيات الموقع الجغرافي
function getLocationAndFetchPrayerTimes() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchPrayerTimes(latitude, longitude);
        }, error => {
            console.error("خطأ في تحديد الموقع:", error);
            document.getElementById("countdown").textContent = "خطأ في تحديد الموقع.";
        });
    } else {
        console.error("المتصفح لا يدعم تحديد الموقع الجغرافي.");
        document.getElementById("countdown").textContent = "المتصفح لا يدعم تحديد الموقع.";
    }
}

// جلب مواقيت الصلاة باستخدام الإحداثيات
async function fetchPrayerTimes(latitude, longitude) {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3`);
        const data = await response.json();

        if (!data || !data.data || !data.data.timings) {
            throw new Error("لا توجد بيانات مواقيت صلاة.");
        }

        const timings = data.data.timings;

        // تحديث شبكة مواقيت الصلاة
        updatePrayerGrid(timings);

        // البدء بحساب العد التنازلي للصلاة التالية
        startCountdown(timings);
    } catch (error) {
        console.error("خطأ في جلب مواقيت الصلاة:", error);
        document.getElementById("countdown").textContent = "خطأ في جلب مواقيت الصلاة.";
    }
}

// تحديث شبكة مواقيت الصلاة
function updatePrayerGrid(timings) {
    const prayerGrid = document.getElementById("prayer-grid");
    prayerGrid.innerHTML = "";

    Object.entries(prayers).forEach(([key, name]) => {
        const time = timings[key];
        const box = document.createElement("div");
        box.className = "prayer-box";
        box.innerHTML = `
            <h3>${name}</h3>
            <p>${time}</p>
        `;
        prayerGrid.appendChild(box);
    });
}

// بدء العد التنازلي للصلاة التالية
function startCountdown(timings) {
    function getNextPrayer() {
        const now = new Date();
        const prayerTimes = Object.entries(prayers).map(([key, arabicName]) => {
            const [hours, minutes] = timings[key].split(":").map(Number);
            const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            return { key, arabicName, time: prayerTime };
        });

        return prayerTimes.find(prayer => prayer.time > now) || 
               { ...prayerTimes[0], time: new Date(prayerTimes[0].time.getTime() + 24 * 60 * 60 * 1000) };
    }

    function updateDisplay() {
        const nextPrayer = getNextPrayer();
        updateCountdown(nextPrayer.time, nextPrayer.arabicName);
    }

    // تحديث كل ثانية
    setInterval(updateDisplay, 1000);
    updateDisplay(); // التحديث الأولي
}

// تحديث العداد للوقت المتبقي
function updateCountdown(prayerTime, prayerName) {
    const now = new Date();
    const timeDifference = prayerTime - now;

    if (timeDifference > 0) {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById("countdown").textContent =
            `الوقت المتبقي حتى صلاة ${prayerName}: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
        document.getElementById("countdown").textContent = "حان وقت الصلاة!";
    }
}

// تهيئة الصفحة
document.addEventListener("DOMContentLoaded", () => {
    setInterval(updateDateTime, 1000); // تحديث الوقت كل ثانية
    updateDateTime(); // التحديث الأولي للوقت
    getLocationAndFetchPrayerTimes(); // جلب مواقيت الصلاة بناءً على الموقع
    setInterval(getLocationAndFetchPrayerTimes, 24 * 60 * 60 * 1000); // تحديث مواقيت الصلاة يومياً
});


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