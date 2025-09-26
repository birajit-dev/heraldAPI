/**
 * Advanced Features for Northeast Herald
 * Including: Infinite Scroll, Social Sharing, PWA, Performance Monitoring
 */

class AdvancedFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.initInfiniteScroll();
        this.initSocialSharing();
        this.initPWA();
        this.initPerformanceMonitoring();
        this.initLazyLoading();
        this.initReadingProgress();
        this.initBackToTop();
    }

    // Infinite Scroll Implementation
    initInfiniteScroll() {
        let page = 1;
        let loading = false;
        const container = document.querySelector('.infinite-scroll-container');
        
        if (!container) return;

        const loadMoreContent = async () => {
            if (loading) return;
            loading = true;

            try {
                const response = await fetch(`/api/v1/load-more?page=${page}&category=${window.currentCategory || 'all'}`);
                const data = await response.json();
                
                if (data.articles && data.articles.length > 0) {
                    data.articles.forEach(article => {
                        const articleElement = this.createArticleElement(article);
                        container.appendChild(articleElement);
                    });
                    page++;
                } else {
                    // No more content
                    const endMessage = document.createElement('div');
                    endMessage.className = 'end-of-content';
                    endMessage.innerHTML = `
                        <div class="text-center py-4">
                            <i class="fas fa-check-circle text-success fa-2x mb-2"></i>
                            <p class="text-muted">You've reached the end of our latest news!</p>
                            <a href="#top" class="btn btn-primary">Back to Top</a>
                        </div>
                    `;
                    container.appendChild(endMessage);
                    window.removeEventListener('scroll', this.scrollHandler);
                }
            } catch (error) {
                console.error('Error loading more content:', error);
            } finally {
                loading = false;
            }
        };

        this.scrollHandler = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                loadMoreContent();
            }
        };

        window.addEventListener('scroll', this.scrollHandler);
    }

    createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'blog-post post-style-04 fade-in';
        articleDiv.innerHTML = `
            <div class="blog-image">
                <img class="img-fluid lazy" data-src="${article.post_image}" alt="${article.post_name}">
            </div>
            <div class="blog-post-details">
                <h6 class="blog-title">
                    <a href="/${article.post_category}/${article.post_url}">${article.post_name}</a>
                </h6>
                <div class="blog-post-meta">
                    <div class="blog-post-time">
                        <a href="/${article.post_category}/${article.post_url}">
                            <i class="fa-solid fa-calendar-days"></i> ${this.formatDate(article.update_date)}
                        </a>
                    </div>
                </div>
            </div>
        `;
        return articleDiv;
    }

    // Social Sharing
    initSocialSharing() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                const description = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

                let shareUrl = '';

                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${title} ${url}`;
                        break;
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
                        break;
                    case 'copy':
                        this.copyToClipboard(window.location.href);
                        this.showNotification('Link copied to clipboard!');
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, 'share', 'width=600,height=400');
                }
            });
        });

        // Native Web Share API
        if (navigator.share) {
            const nativeShareBtn = document.querySelector('.native-share-btn');
            if (nativeShareBtn) {
                nativeShareBtn.addEventListener('click', async () => {
                    try {
                        await navigator.share({
                            title: document.title,
                            text: document.querySelector('meta[name="description"]')?.content || '',
                            url: window.location.href
                        });
                    } catch (error) {
                        console.log('Error sharing:', error);
                    }
                });
            }
        }
    }

    // PWA Features
    initPWA() {
        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }

        // Install Prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.querySelector('.install-app-btn');
            if (installBtn) {
                installBtn.style.display = 'block';
                installBtn.addEventListener('click', () => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                        }
                        deferredPrompt = null;
                        installBtn.style.display = 'none';
                    });
                });
            }
        });

        // Update Available Notification
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                this.showUpdateNotification();
            });
        }
    }

    // Performance Monitoring
    initPerformanceMonitoring() {
        // Page Load Performance
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            
            // Send to analytics
            if (window.gtag) {
                gtag('event', 'page_load_time', {
                    event_category: 'Performance',
                    event_label: window.location.pathname,
                    value: Math.round(loadTime)
                });
            }
        });

        // Core Web Vitals
        this.measureWebVitals();
    }

    measureWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (window.gtag) {
                gtag('event', 'LCP', {
                    event_category: 'Web Vitals',
                    value: Math.round(lastEntry.startTime)
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (window.gtag) {
                    gtag('event', 'FID', {
                        event_category: 'Web Vitals',
                        value: Math.round(entry.processingStart - entry.startTime)
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });
    }

    // Enhanced Lazy Loading
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            });
        }
    }

    // Reading Progress Bar
    initReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const article = document.querySelector('.singlenews');
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;

            const progress = Math.min(
                Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
                1
            ) * 100;

            progressBar.style.width = `${progress}%`;
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>A new version is available!</span>
                <button onclick="location.reload()" class="btn btn-sm btn-primary">Update</button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-sm btn-secondary">Later</button>
            </div>
        `;
        
        document.body.appendChild(notification);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedFeatures();
});

// CSS for Advanced Features
const advancedStyles = `
<style>
.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #1e3c72, #2a5298);
    z-index: 9999;
    transition: width 0.1s;
}

.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #1e3c72;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s;
    z-index: 1000;
}

.back-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    background: #2a5298;
    transform: translateY(-5px);
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(400px);
    transition: transform 0.3s;
    z-index: 10000;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left: 4px solid #28a745;
    color: #28a745;
}

.notification-error {
    border-left: 4px solid #dc3545;
    color: #dc3545;
}

.update-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1e3c72;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 10000;
}

.update-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.update-content button {
    margin-left: 10px;
}

.install-app-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #1e3c72;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s;
}

.install-app-btn:hover {
    background: #2a5298;
    transform: translateY(-2px);
}

.end-of-content {
    margin: 40px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    text-align: center;
}

/* Social Share Buttons */
.social-share {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.share-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
}

.share-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.share-btn[data-platform="facebook"] { background: #3b5998; }
.share-btn[data-platform="twitter"] { background: #1da1f2; }
.share-btn[data-platform="linkedin"] { background: #0077b5; }
.share-btn[data-platform="whatsapp"] { background: #25d366; }
.share-btn[data-platform="telegram"] { background: #0088cc; }
.share-btn[data-platform="copy"] { background: #6c757d; }

/* Loading States */
.loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Mobile Optimizations */
@media (max-width: 768px) {
    .back-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
    }
    
    .notification {
        right: 10px;
        left: 10px;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
    
    .social-share {
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', advancedStyles);
