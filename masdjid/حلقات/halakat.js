// Schedule Data
const scheduleData = {
    'الأحد': {
        'الفجر': 'تحفيظ القرآن',
        'الضحى': '-',
        'العصر': 'تحفيظ القرآن',
        'المغرب': '-',
        'العشاء': '-'
    },
    'الاثنين': {
        'الفجر': 'تحفيظ القرآن',
        'الضحى': 'حلقة النساء',
        'العصر': 'تحفيظ القرآن',
        'المغرب': 'السنة النبوية',
        'العشاء': '-'
    },
    'الثلاثاء': {
        'الفجر': 'تحفيظ القرآن',
        'الضحى': 'حلقة النساء',
        'العصر': 'تحفيظ القرآن',
        'المغرب': '-',
        'العشاء': '-'
    },
    'الأربعاء': {
        'الفجر': 'تحفيظ القرآن',
        'الضحى': 'حلقة النساء',
        'العصر': 'تحفيظ القرآن',
        'المغرب': '-',
        'العشاء': 'العلوم الشرعية'
    },
    'الخميس': {
        'الفجر': 'تحفيظ القرآن',
        'الضحى': 'حلقة النساء',
        'العصر': 'تحفيظ القرآن',
        'المغرب': 'السنة النبوية',
        'العشاء': '-'
    },
    'الجمعة': {
        'الفجر': '-',
        'الضحى': '-',
        'العصر': '-',
        'المغرب': '-',
        'العشاء': '-'
    },
    'السبت': {
        'الفجر': 'تحفيظ القرآن',
        'الضحى': 'حلقة النساء',
        'العصر': 'تحفيظ القرآن',
        'المغرب': '-',
        'العشاء': 'العلوم الشرعية'
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuManager = new MobileMenuManager();
    initializeMobileMenu();
    populateScheduleTable();
    initializeRegistrationForm();
    initializeFormAutoSave();
    initializeScheduleFilter();
    initializePrintSchedule();
    initializeSmoothScroll();
});

// Add smooth scroll functionality
function initializeSmoothScroll() {
    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.querySelector('#register');
        form.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

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

        // Update active links on page load
        this.updateActiveLinks();
    }

    updateActiveLinks() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-link');
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentPath.split('/').pop())) {
                link.classList.add('active');
            }
        });
    }
}

// Mobile Menu
function initializeMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.menu-icon')) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// Populate Schedule Table
function populateScheduleTable() {
    const scheduleBody = document.getElementById('schedule-body');
    if (!scheduleBody) return;

    for (const [day, prayers] of Object.entries(scheduleData)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day}</td>
            <td>${prayers.الفجر}</td>
            <td>${prayers.الضحى}</td>
            <td>${prayers.العصر}</td>
            <td>${prayers.المغرب}</td>
            <td>${prayers.العشاء}</td>
        `;
        scheduleBody.appendChild(row);
    }
}

// Registration Form
function initializeRegistrationForm() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    form.addEventListener('submit', handleRegistration);
}

function handleRegistration(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        circleType: document.getElementById('circle-type').value,
        level: document.getElementById('level').value,
        notes: document.getElementById('notes').value
    };

    // Use enhanced validation instead of basic validation
    if (!enhancedValidation(formData)) {
        return;
    }

    // Show success message
    showSuccessMessage();
    
    // Clear localStorage
    clearFormStorage();
    
    // Reset form
    e.target.reset();
}

// Add function to clear storage after successful submission
function clearFormStorage() {
    const form = document.getElementById('registration-form');
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        localStorage.removeItem(`halakat_${input.id}`);
    });
}

function validateForm(data) {
    // Basic validation
    if (!data.name || !data.age || !data.phone || !data.email || !data.circleType || !data.level) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return false;
    }

    // Age validation
    if (data.age < 5 || data.age > 100) {
        alert('الرجاء إدخال عمر صحيح');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح');
        return false;
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]{8,}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('الرجاء إدخال رقم هاتف صحيح');
        return false;
    }

    return true;
}

function showSuccessMessage() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        text-align: center;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    successMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>تم التسجيل بنجاح! سنتواصل معك قريباً</span>
        </div>
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translate(-50%, -100%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add message to document
    document.body.appendChild(successMessage);

    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 300);
    }, 3000);

    // Optional: Log form submission (in real app, this would send data to server)
    console.log('Form submitted successfully');
}

// Form auto-save to localStorage
function initializeFormAutoSave() {
    const form = document.getElementById('registration-form');
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    // Load saved data
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`halakat_${input.id}`);
        if (savedValue) input.value = savedValue;
        
        // Save on input change
        input.addEventListener('input', () => {
            localStorage.setItem(`halakat_${input.id}`, input.value);
        });
    });
}

// Add schedule filtering functionality
function initializeScheduleFilter() {
    const scheduleTable = document.querySelector('.schedule-table');
    const tableHeader = document.createElement('div');
    tableHeader.className = 'schedule-filter';
    tableHeader.innerHTML = `
        <select id="scheduleFilter">
            <option value="all">كل الحلقات</option>
            <option value="تحفيظ القرآن">تحفيظ القرآن</option>
            <option value="السنة النبوية">السنة النبوية</option>
            <option value="العلوم الشرعية">العلوم الشرعية</option>
            <option value="حلقة النساء">حلقات النساء</option>
        </select>
    `;
    
    scheduleTable.parentNode.insertBefore(tableHeader, scheduleTable);
    
    document.getElementById('scheduleFilter').addEventListener('change', (e) => {
        const rows = document.querySelectorAll('#schedule-body tr');
        const filter = e.target.value;
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
                return;
            }
            
            const hasClass = Array.from(row.cells).some(cell => 
                cell.textContent.includes(filter));
            row.style.display = hasClass ? '' : 'none';
        });
    });
}

// Add print schedule button and functionality
function initializePrintSchedule() {
    const scheduleSection = document.querySelector('.schedule-section');
    const printButton = document.createElement('button');
    printButton.className = 'print-schedule-btn';
    printButton.innerHTML = '<i class="fas fa-print"></i> طباعة الجدول';
    
    printButton.addEventListener('click', () => {
        const printContent = document.querySelector('.schedule-table').outerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        
        printWindow.document.write(`
            <html dir="rtl">
                <head>
                    <title>جدول الحلقات</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                        @media print {
                            @page { size: landscape; }
                        }
                    </style>
                </head>
                <body>
                    <h1>جدول الحلقات الأسبوعي</h1>
                    ${printContent}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    });
    
    scheduleSection.insertBefore(printButton, scheduleSection.firstChild);
}

// Enhanced form validation with specific error messages
function enhancedValidation(data) {
    const errors = [];
    
    // Name validation
    if (data.name.length < 3) {
        errors.push('الاسم يجب أن يكون أكثر من حرفين');
    }
    
    // Age validation with specific ranges
    if (data.age < 5) {
        errors.push('العمر يجب أن يكون 5 سنوات على الأقل');
    } else if (data.age > 100) {
        errors.push('الرجاء التحقق من العمر المدخل');
    }
    
    // Phone number format for Algerian numbers
    if (!/^(0[5-7])[0-9]{8}$/.test(data.phone)) {
        errors.push('رقم الهاتف غير صحيح - يجب أن يبدأ ب 05 أو 06 أو 07 ويتكون من 10 أرقام');
    }
    
    if (errors.length > 0) {
        showValidationErrors(errors);
        return false;
    }
    
    return true;
}

function showValidationErrors(errors) {
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ef4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        text-align: center;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        direction: rtl;
    `;
    
    errorMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-circle"></i>
            <span>${errors[0]}</span>
        </div>
    `;

    // Add message to document
    document.body.appendChild(errorMessage);

    // Remove message after 3 seconds
    setTimeout(() => {
        errorMessage.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(errorMessage);
        }, 300);
    }, 3000);
}