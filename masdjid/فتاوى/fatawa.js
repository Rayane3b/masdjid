document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuIcon.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Form Submission
    const fatwaForm = document.getElementById('fatwa-form');
    if (fatwaForm) {
        fatwaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const category = document.getElementById('category').value;
            const question = document.getElementById('question').value;

            // Here you would typically send this data to your backend
            console.log('Form submitted:', { name, email, category, question });

            // Show success message
            alert('تم إرسال سؤالك بنجاح. سيتم الرد عليك قريباً إن شاء الله.');
            
            // Reset form
            fatwaForm.reset();
        });
    }

    // Sample recent fatawa data
    const recentFatawa = [
        {
            question: 'ما حكم الصلاة في السفر؟',
            category: 'العبادات',
            date: '2024-01-25',
            excerpt: 'يجوز للمسافر قصر الصلاة الرباعية...'
        },
        {
            question: 'ما حكم التعامل بالعملات الرقمية؟',
            category: 'القضايا المعاصرة',
            date: '2024-01-24',
            excerpt: 'يجب النظر في طبيعة العملة الرقمية...'
        },
        // Add more fatawa as needed
    ];

    // Populate recent fatawa
    const fatawaPRentElement = document.getElementById('recent-fatawa-list');
    if (fatawaPRentElement) {
        recentFatawa.forEach(fatwa => {
            const fatwaCard = document.createElement('div');
            fatwaCard.className = 'fatwa-card';
            fatwaCard.innerHTML = `
                <h3>${fatwa.question}</h3>
                <div class="fatwa-meta">
                    <span class="category">${fatwa.category}</span>
                    <span class="date">${new Date(fatwa.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <p>${fatwa.excerpt}</p>
                <button class="read-more">اقرأ المزيد</button>
            `;
            fatawaPRentElement.appendChild(fatwaCard);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('fatwa-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const fatwaCards = document.querySelectorAll('.fatwa-card');

            fatwaCards.forEach(card => {
                const question = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('p').textContent.toLowerCase();
                const isVisible = question.includes(searchTerm) || excerpt.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // Category card interactions
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h3').textContent;
            // Filter fatawa by category
            filterFatawaByCategory(category);
        });

        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    function filterFatawaByCategory(category) {
        const fatwaCards = document.querySelectorAll('.fatwa-card');
        fatwaCards.forEach(card => {
            const cardCategory = card.querySelector('.category').textContent;
            const isVisible = category === 'الكل' || cardCategory === category;
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    // Form validation
    const formInputs = document.querySelectorAll('.fatwa-form input, .fatwa-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        
        if (!value) {
            showError(input, 'هذا الحقل مطلوب');
            return false;
        }

        if (input.type === 'email' && !isValidEmail(value)) {
            showError(input, 'البريد الإلكتروني غير صحيح');
            return false;
        }

        removeError(input);
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }

        input.style.borderColor = 'red';
    }

    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        
        if (errorDiv) {
            errorDiv.remove();
        }

        input.style.borderColor = '';
    }

    // Add loading states
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const form = submitBtn.closest('form');
            const isValid = Array.from(form.elements).every(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    return validateInput(element);
                }
                return true;
            });

            if (isValid) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
                
                // Simulate form submission delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'إرسال السؤال';
                }, 2000);
            }
        });
    }

    // Add scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-top-btn';
    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    // Add CSS for scroll button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: var(--primary-color);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: none;
            box-shadow: var(--shadow-md);
            transition: transform 0.3s ease;
        }

        .scroll-top-btn:hover {
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);
});