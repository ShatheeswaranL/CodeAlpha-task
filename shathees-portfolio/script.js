document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Light/Dark Theme Switching
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme or system theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else if (savedTheme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    } else {
        // Fallback to system preference
        if (systemPrefersDark) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    }

    // Toggle Theme Click Handler
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ==========================================================================
       2. Sticky Navbar & Active Section Link Highlighter
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header Effect
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Active Section Detection
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Trigger slightly before the section reaches the top of the viewport
            if (window.scrollY >= (sectionTop - 200)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       3. Mobile Navigation Menu Toggle
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navMenuLinks = document.querySelectorAll('.nav-menu .nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on any navigation link
    navMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       4. Animated Typewriter Effect in Hero Section
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    const words = ["Software Engineer", "AI Engineer", "Machine Learning enthusiast", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Delete characters
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deleting speed
        } else {
            // Add characters
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle word transitions
        if (!isDeleting && charIndex === currentWord.length) {
            // Hold full word for a brief moment
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Short pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    // Initialize Typing Effect
    if (typingSpan) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       5. Scroll Reveal Animations & Skills Bar Triggers
       ========================================================================== */
    const revealElements = document.querySelectorAll('[data-reveal]');
    const skillBars = document.querySelectorAll('.skill-bar-progress');

    // Trigger skills bar animations when skills section is revealed
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If the target is within the skills section, animate skill bars
                if (entry.target.closest('#skills')) {
                    animateSkillBars();
                }
                
                // Stop observing once revealed to maintain state
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       5b. Certifications Verification Link Mock Interaction
       ========================================================================== */
    const certVerifyBtns = document.querySelectorAll('.cert-verify-btn');
    certVerifyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const certName = btn.closest('.cert-card').querySelector('.cert-name').textContent;
            alert(`Credential Verification:\n\nVerifying "${certName}"...\nThis would securely redirect to the credential verification portal (e.g. Credly or Coursera) in a production environment.`);
        });
    });

    /* ==========================================================================
       6. Back to Top Button Interaction
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       7. Contact Form Client-Side Validation & Mock Submission
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            // Reset previous validation states
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('invalid'));

            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Email validation (Simple regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Subject validation
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Message validation
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                // Submit Form Simulation
                const submitBtn = document.getElementById('btn-submit-form');
                const btnText = submitBtn.querySelector('span');
                const btnIcon = submitBtn.querySelector('i');
                
                // Loading State
                submitBtn.disabled = true;
                btnText.textContent = "Sending...";
                btnIcon.className = "fas fa-spinner fa-spin";

                setTimeout(() => {
                    // Success State
                    submitBtn.disabled = false;
                    btnText.textContent = "Send Message";
                    btnIcon.className = "fas fa-paper-plane";
                    
                    // Show success banner
                    formStatus.classList.add('visible');
                    
                    // Reset form fields
                    contactForm.reset();
                    
                    // Hide success status after 4 seconds
                    setTimeout(() => {
                        formStatus.classList.remove('visible');
                    }, 4000);
                    
                }, 1500);
            }
        });

        // Remove error class on input event when typing
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }
});
