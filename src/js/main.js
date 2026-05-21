// signed: serozr
/*
    File: main.js
    Purpose: handles boot screen, observers and UI interactions
    Signed by: serozr
*/
// Boot Screen Animation
document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');
    
    // Hide boot screen after animation completes
    setTimeout(() => {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 500);
    }, 6000); // 6 seconds total boot time
    
    // Allow skipping with any key press or click, respect reduced-motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const skipBoot = () => {
        if (prefersReduced) {
            bootScreen.style.display = 'none';
            return;
        }
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 500);
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') skipBoot();
    }, { once: true });
    bootScreen.addEventListener('click', skipBoot, { once: true });

    // Lightweight skeleton helpers (can be used where async loading occurs)
    window.showSkeleton = (container, rows = 3) => {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < rows; i++) {
            const el = document.createElement('div');
            el.className = 'skeleton';
            el.style.height = '14px';
            el.style.marginBottom = '10px';
            container.appendChild(el);
        }
    };

    window.hideSkeleton = (container) => {
        if (!container) return;
        container.innerHTML = '';
    };
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
}

// Close mobile nav with Escape key for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        }
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (nav && !nav.contains(e.target) && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalCommands = {
        help: [
            'Available commands:',
            'help - show this message',
            'about - summary of who I am',
            'certification - list certifications',
            'contact - show contact links',
            'clear - clear terminal output'
        ],
        about: [
            'Surjeet Singh Gill',
            'Computer Science and Engineering student at Lovely Professional University',
            'Focused on programming systems, cloud infrastructure, backend APIs, and AI-driven problem solving.'
        ],
        certification: [
            'CompTIA Network+ (N10-009) | CompTIA - Jan 2025',
            'Oracle Cloud Infrastructure 2024 Generative AI Certified Professional | Oracle - Jul 2024'
        ],
        contact: [
            'LinkedIn: www.linkedin.com/in/surjeetgill/',
            'GitHub: github.com/SurjeetSinghGill',
            'Email: sunnysgs.04@gmail.com',
            'Mobile: +91-8888088257'
        ]
    };

    let appendTerminalEntry = (command, lines) => {
        if (!terminalOutput) {
            return;
        }

        const entry = document.createElement('div');
        entry.className = 'terminal-entry';
        entry.innerHTML = `
            <p class="terminal-line"><span class="prompt">$</span> <span class="command">${command}</span></p>
            ${lines.map((line) => `<p class="terminal-line">${line}</p>`).join('')}
        `;
        terminalOutput.appendChild(entry);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const runTerminalCommand = (rawCommand) => {
        const command = rawCommand.trim().toLowerCase();

        if (!command) {
            return;
        }

        if (command === 'clear') {
            terminalOutput.innerHTML = '';
            return;
        }

        const lines = terminalCommands[command];
        if (lines) {
            appendTerminalEntry(command, lines.map((line, index) => {
                if (command === 'about' && index === 0) {
                    return `<strong>${line}</strong>`;
                }
                return line;
            }));
            return;
        }

        appendTerminalEntry(command, [
            `Command not found: ${command}`,
            'Try help to see available commands.'
        ]);
    };

    if (terminalInput && terminalOutput) {
        terminalInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                runTerminalCommand(terminalInput.value);
                terminalInput.value = '';
            }
        });

        runTerminalCommand('help');
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const nav = document.querySelector('nav');
                    const offset = nav ? nav.offsetHeight + 12 : 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReduced ? 'auto' : 'smooth'
                    });
                }
            }
        });
    });

    const contactForm = document.getElementById('contactForm');
    const contactFormStatus = document.getElementById('contactFormStatus');

    if (window.emailjs) {
        emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
    }

    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn ? submitBtn.textContent.trim() : 'Send Message';

        const setButtonState = (state) => {
            if (!submitBtn) return;
            if (state === 'loading') {
                submitBtn.classList.remove('success');
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-busy', 'true');
                submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span class="btn-text">Sending...</span>';
            } else if (state === 'success') {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                submitBtn.disabled = true;
                submitBtn.removeAttribute('aria-busy');
                submitBtn.innerHTML = '<span class="btn-text">Sent ✓</span>';
            } else {
                submitBtn.classList.remove('loading', 'success');
                submitBtn.disabled = false;
                submitBtn.removeAttribute('aria-busy');
                submitBtn.innerHTML = `<span class="btn-text">${originalBtnText}</span>`;
            }
        };

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!window.emailjs) {
                contactFormStatus.textContent = 'Email service is unavailable. Please try again later.';
                return;
            }

            setButtonState('loading');
            contactFormStatus.textContent = '';

            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
                .then(() => {
                    contactFormStatus.textContent = 'Message sent successfully! Thank you.';
                    contactForm.reset();
                    setButtonState('success');
                    setTimeout(() => setButtonState('default'), 3000);
                })
                .catch((error) => {
                    console.error('EmailJS send error:', error);
                    contactFormStatus.textContent = 'Unable to send message. Please try again later.';
                    setButtonState('default');
                });
        });
    }

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('lazy-section');
        lazyObserver.observe(section);
    });

    // GSAP animations: hero entrance, terminal entries, and scroll-triggered reveals
    if (window.gsap) {
        try {
            const gs = window.gsap;
            const ScrollTrigger = window.ScrollTrigger;
            if (ScrollTrigger) gs.registerPlugin(ScrollTrigger);

            // Hero entrance sequence
            gs.from([".hero-content .tag", ".hero-content h1", ".hero-content .subtitle", ".hero-content .terminal-window", ".cta-buttons"], {
                y: 30,
                opacity: 0,
                stagger: 0.12,
                duration: 0.9,
                ease: "power3.out"
            });

            // Wrap appendTerminalEntry to animate new entries
            const originalAppend = appendTerminalEntry;
            appendTerminalEntry = (command, lines) => {
                originalAppend(command, lines);
                const entries = terminalOutput.querySelectorAll('.terminal-entry');
                const last = entries[entries.length - 1];
                if (last) {
                    gs.from(last, { y: 8, opacity: 0, duration: 0.45, ease: 'power2.out' });
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
            };

            // Animate lazy sections with ScrollTrigger where available
            gs.utils.toArray('.lazy-section').forEach(section => {
                gs.from(section, {
                    y: 28,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        once: true
                    }
                });
            });

            // Skill bars animate to target widths using GSAP + ScrollTrigger
            gs.utils.toArray('.skill-progress').forEach(bar => {
                const targetWidth = bar.getAttribute('data-width') || '100%';
                gs.to(bar, {
                    width: targetWidth,
                    duration: 1.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar.closest('.skill-category'),
                        start: 'top 80%',
                        once: true
                    }
                });
            });
        } catch (e) {
            console.warn('GSAP animations failed to initialize', e);
        }
    }
});

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        document.body.style.overflowY = 'auto';
    }, 150);
}, { passive: true });

// End of file - signed: serozr
