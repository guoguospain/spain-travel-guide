/* ============================================================
   Spain Travel Guide – Shared App Logic
   ============================================================ */

// ── Page entrance fade-in ──────────────────────────────────
(function() {
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 0.35s ease';
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            document.documentElement.style.opacity = '1';
        });
    });
})();

document.addEventListener('DOMContentLoaded', () => {

    // ── Reading progress bar ──────────────────────────────
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = document.documentElement.scrollTop;
            const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = docH > 0 ? Math.min((scrollTop / docH) * 100, 100) + '%' : '0%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    // ── Navigation scroll effect ──────────────────────────
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 100);
        }, { passive: true });
    }

    // ── Mobile drawer ─────────────────────────────────────
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileMenuClose');

    const openMenu = () => {
        mobileMenu?.classList.add('open');
        mobileOverlay?.classList.add('open');
        hamburger?.classList.add('open');
        hamburger?.setAttribute('aria-expanded', 'true');
        mobileMenu?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
        mobileMenu?.classList.remove('open');
        mobileOverlay?.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        mobileMenu?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', () => {
        mobileMenu?.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileClose?.addEventListener('click', closeMenu);
    mobileOverlay?.addEventListener('click', closeMenu);

    // Close drawer on link click
    mobileMenu?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    // ── Smooth scroll for anchor links ─────────────────────
    const getScrollOffset = () => {
        const navEl = document.getElementById('nav');
        const qNav = document.getElementById('cityQuickNav');
        return (navEl ? navEl.offsetHeight : 70) + (qNav && qNav.offsetStyle !== 'none' ? qNav.offsetHeight : 0) + 10;
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ── Back to top ────────────────────────────────────────
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── Toast utility ──────────────────────────────────────
    let toastTimer;
    window.showToast = (msg, ms = 2200) => {
        const el = document.getElementById('toastMsg');
        if (!el) return;
        clearTimeout(toastTimer);
        el.textContent = msg;
        el.classList.add('show');
        toastTimer = setTimeout(() => el.classList.remove('show'), ms);
    };

    // ── Copy buttons ───────────────────────────────────────
    const copyFn = t => {
        if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(t);
        return new Promise(resolve => {
            const ta = document.createElement('textarea');
            ta.value = t;
            ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            resolve();
        });
    };

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            copyFn(this.getAttribute('data-copy'))
                .then(() => showToast('✓ 已复制到剪贴板'));
        });
    });

    // ── Slider drag (tips + festival) ─────────────────────
    const makeDraggable = (el, hintEl) => {
        if (!el) return;
        let isDown = false, startX, scrollLeft;
        el.addEventListener('mousedown', e => {
            isDown = true;
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', () => isDown = false);
        el.addEventListener('mouseup', () => isDown = false);
        el.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX);
        });
        el.addEventListener('scroll', () => {
            hintEl?.classList.toggle('hidden', el.scrollLeft > 60);
        }, { passive: true });
    };

    makeDraggable(document.getElementById('tipsGrid'), document.getElementById('tipsHint'));
    makeDraggable(document.getElementById('festGrid'), document.getElementById('festHint'));

    // ── Scroll-reveal animation ────────────────────────────
    const applyReveal = () => {
        document.querySelectorAll('.attraction-card').forEach((el, i) => {
            el.classList.add('reveal');
            if (i % 2 === 1) el.classList.add('reveal-d1');
        });
        document.querySelectorAll('.transport-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.classList.add(`reveal-d${Math.min(i, 2)}`);
        });
        document.querySelectorAll('.section-title, .section-label, .city-card-preview').forEach(el => {
            el.classList.add('reveal');
        });

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
            document.querySelectorAll('.reveal').forEach(el => io.observe(el));
        } else {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        }
    };
    applyReveal();

    // ── City quick-nav active tracking ────────────────────
    const cityLinks = document.querySelectorAll('.city-quick-link');
    const citySections = Array.from(cityLinks)
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    if (cityLinks.length && citySections.length) {
        const updateActiveLink = () => {
            const offset = (document.getElementById('nav')?.offsetHeight || 70) +
                           (document.getElementById('cityQuickNav')?.offsetHeight || 0) + 24;
            let current = null;
            citySections.forEach(sec => {
                if (sec.getBoundingClientRect().top <= offset) current = sec;
            });
            cityLinks.forEach(l => {
                const sec = document.querySelector(l.getAttribute('href'));
                l.classList.toggle('active', sec === current);
            });
        };
        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    // ── Routes expand/collapse ─────────────────────────────
    const routesToggle = document.getElementById('routesToggle');
    const routesExtra = document.getElementById('routesExtra');
    const routesLabel = document.getElementById('routesToggleLabel');
    if (routesToggle && routesExtra) {
        routesToggle.addEventListener('click', () => {
            const isOpen = routesExtra.classList.toggle('expanded');
            routesToggle.classList.toggle('open', isOpen);
            routesToggle.setAttribute('aria-expanded', String(isOpen));
            if (routesLabel) routesLabel.textContent = isOpen ? '收起路线' : '查看剩余 5 条路线';
            if (!isOpen) routesExtra.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ── Tip card emojis ────────────────────────────────────
    const tipEmojiMap = {
        '最佳旅行季节': '☀️', '货币': '💶', '语言': '🗣️', '紧急电话': '🚨',
        '防盗': '🎒', '用餐时间': '🍽️', '午休': '😴', '着装': '👗',
        '省钱': '💰', '交通': '🚄', '小费': '💳', '防晒': '🌞',
        '门票': '🎫', '饮水': '💧', '购物': '🛍️', '网络': '📶',
        '插座': '🔌', '住宿': '🏨', '节假日': '📅', '退税': '🧾'
    };
    document.querySelectorAll('.tip-label').forEach(label => {
        const emoji = tipEmojiMap[label.textContent.trim()];
        if (emoji) {
            const span = document.createElement('span');
            span.className = 'tip-emoji';
            span.textContent = emoji;
            label.parentElement.insertBefore(span, label);
        }
    });

    // ── Active page in nav ─────────────────────────────────
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });
    document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });

});
