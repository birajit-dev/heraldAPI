/**
 * SEO Enhancements for Northeast Herald
 * Advanced SEO features, analytics, and optimization tools
 */

class SEOEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.initStructuredData();
        this.initLocalSEO();
        this.initSocialSignals();
        this.initCoreWebVitals();
        this.initSearchOptimization();
        this.trackUserEngagement();
    }

    // Enhanced Structured Data
    initStructuredData() {
        // Add FAQ Schema for articles
        this.addFAQSchema();
        
        // Add HowTo Schema for guides
        this.addHowToSchema();
        
        // Add Event Schema for news events
        this.addEventSchema();
        
        // Add Local Business Schema
        this.addLocalBusinessSchema();
    }

    addFAQSchema() {
        const faqElements = document.querySelectorAll('.faq-item');
        if (faqElements.length === 0) return;

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        };

        faqElements.forEach(item => {
            const question = item.querySelector('.faq-question')?.textContent;
            const answer = item.querySelector('.faq-answer')?.textContent;
            
            if (question && answer) {
                faqSchema.mainEntity.push({
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer
                    }
                });
            }
        });

        if (faqSchema.mainEntity.length > 0) {
            this.injectSchema(faqSchema);
        }
    }

    addLocalBusinessSchema() {
        const localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "Northeast Herald",
            "alternateName": "NE Herald",
            "description": "Tripura's leading news portal covering local, national and international news",
            "url": "https://neherald.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://neherald.com/images/logo.png",
                "width": 200,
                "height": 60
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Press Club Road",
                "addressLocality": "Agartala",
                "addressRegion": "Tripura",
                "postalCode": "799001",
                "addressCountry": "IN"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "23.8315",
                "longitude": "91.2868"
            },
            "telephone": "+91-381-XXXXXXX",
            "email": "editor@neherald.com",
            "sameAs": [
                "https://www.facebook.com/neherald/",
                "https://twitter.com/neheraldnews",
                "https://www.instagram.com/neheraldnews/",
                "https://www.youtube.com/c/neheraldnews"
            ],
            "areaServed": {
                "@type": "State",
                "name": "Tripura"
            },
            "knowsAbout": [
                "Tripura News",
                "Northeast India News",
                "Agartala News",
                "Local Politics",
                "Regional Development",
                "Cultural Events",
                "Sports News",
                "Business News"
            ],
            "memberOf": {
                "@type": "Organization",
                "name": "Press Club of Tripura"
            },
            "award": [
                "Best Digital News Platform Tripura 2024",
                "Excellence in Journalism Award 2023"
            ],
            "foundingDate": "2020",
            "founder": {
                "@type": "Person",
                "name": "Subrata Ghosh"
            }
        };

        this.injectSchema(localBusinessSchema);
    }

    // Local SEO Enhancements
    initLocalSEO() {
        // Add location-based meta tags
        this.addLocationMeta();
        
        // Track local search queries
        this.trackLocalSearches();
        
        // Enhance local content
        this.enhanceLocalContent();
    }

    addLocationMeta() {
        const head = document.head;
        
        // Add ICBM coordinates
        const icbmMeta = document.createElement('meta');
        icbmMeta.setAttribute('name', 'ICBM');
        icbmMeta.setAttribute('content', '23.8315, 91.2868');
        head.appendChild(icbmMeta);
        
        // Add geo.position
        const geoPositionMeta = document.createElement('meta');
        geoPositionMeta.setAttribute('name', 'geo.position');
        geoPositionMeta.setAttribute('content', '23.8315;91.2868');
        head.appendChild(geoPositionMeta);
        
        // Add geo.placename
        const geoPlacenameMeta = document.createElement('meta');
        geoPlacenameMeta.setAttribute('name', 'geo.placename');
        geoPlacenameMeta.setAttribute('content', 'Agartala, Tripura, India');
        head.appendChild(geoPlacenameMeta);
        
        // Add geo.region
        const geoRegionMeta = document.createElement('meta');
        geoRegionMeta.setAttribute('name', 'geo.region');
        geoRegionMeta.setAttribute('content', 'IN-TR');
        head.appendChild(geoRegionMeta);
    }

    // Social Signals Enhancement
    initSocialSignals() {
        // Track social shares
        this.trackSocialShares();
        
        // Add social proof
        this.addSocialProof();
        
        // Implement social login
        this.initSocialLogin();
    }

    trackSocialShares() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                const platform = e.target.closest('.share-btn').dataset.platform;
                const url = window.location.href;
                
                // Send to analytics
                if (window.gtag) {
                    gtag('event', 'social_share', {
                        event_category: 'Social',
                        event_label: platform,
                        value: 1
                    });
                }
                
                // Track in database
                this.recordSocialShare(url, platform);
            }
        });
    }

    recordSocialShare(url, platform) {
        fetch('/api/v1/social-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                platform: platform,
                timestamp: new Date().toISOString()
            })
        }).catch(error => console.log('Share tracking error:', error));
    }

    // Core Web Vitals Optimization
    initCoreWebVitals() {
        // Measure and improve CLS
        this.measureCLS();
        
        // Optimize LCP
        this.optimizeLCP();
        
        // Improve FID
        this.improveFID();
    }

    measureCLS() {
        let clsValue = 0;
        let clsEntries = [];

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsEntries.push(entry);
                    clsValue += entry.value;
                }
            }
            
            // Send to analytics if CLS is high
            if (clsValue > 0.1) {
                if (window.gtag) {
                    gtag('event', 'cls_issue', {
                        event_category: 'Performance',
                        value: Math.round(clsValue * 1000)
                    });
                }
            }
        });

        observer.observe({entryTypes: ['layout-shift']});
    }

    optimizeLCP() {
        // Preload critical resources
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src || img.dataset.src;
            document.head.appendChild(link);
        });
        
        // Lazy load non-critical images
        const nonCriticalImages = document.querySelectorAll('img:not([data-critical])');
        nonCriticalImages.forEach(img => {
            img.loading = 'lazy';
        });
    }

    // Search Optimization
    initSearchOptimization() {
        // Enhance internal search
        this.enhanceInternalSearch();
        
        // Add search suggestions
        this.addSearchSuggestions();
        
        // Track search queries
        this.trackSearchQueries();
    }

    enhanceInternalSearch() {
        const searchInputs = document.querySelectorAll('input[name="q"]');
        
        searchInputs.forEach(input => {
            // Add autocomplete
            input.setAttribute('autocomplete', 'on');
            
            // Add search suggestions
            this.addSearchDropdown(input);
            
            // Track search behavior
            input.addEventListener('input', (e) => {
                this.trackSearchInput(e.target.value);
            });
        });
    }

    addSearchDropdown(input) {
        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(dropdown);
        
        input.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                dropdown.style.display = 'none';
                return;
            }
            
            try {
                const response = await fetch(`/api/v1/search-suggestions?q=${encodeURIComponent(query)}`);
                const suggestions = await response.json();
                
                dropdown.innerHTML = '';
                suggestions.forEach(suggestion => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.style.cssText = 'padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;';
                    item.textContent = suggestion.title;
                    
                    item.addEventListener('click', () => {
                        window.location.href = `/${suggestion.category}/${suggestion.url}`;
                    });
                    
                    dropdown.appendChild(item);
                });
                
                dropdown.style.display = suggestions.length ? 'block' : 'none';
            } catch (error) {
                console.log('Search suggestions error:', error);
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.parentElement.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // User Engagement Tracking
    trackUserEngagement() {
        // Track time on page
        this.trackTimeOnPage();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track click patterns
        this.trackClickPatterns();
        
        // Track reading progress
        this.trackReadingProgress();
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScroll = Math.max(maxScroll, scrollPercent);
        });
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            if (window.gtag) {
                gtag('event', 'time_on_page', {
                    event_category: 'Engagement',
                    value: timeOnPage
                });
                
                gtag('event', 'scroll_depth', {
                    event_category: 'Engagement',
                    value: maxScroll
                });
            }
        });
    }

    trackScrollDepth() {
        const milestones = [25, 50, 75, 90, 100];
        const tracked = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    
                    if (window.gtag) {
                        gtag('event', 'scroll_milestone', {
                            event_category: 'Engagement',
                            event_label: `${milestone}%`,
                            value: milestone
                        });
                    }
                }
            });
        });
    }

    // Utility Functions
    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    trackSearchInput(query) {
        // Debounce search tracking
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 3) {
                if (window.gtag) {
                    gtag('event', 'search_input', {
                        event_category: 'Search',
                        event_label: query.substring(0, 50) // Limit length for privacy
                    });
                }
            }
        }, 1000);
    }

    // Performance Monitoring
    monitorPerformance() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const metrics = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                connection: navigation.connectEnd - navigation.connectStart,
                request: navigation.responseStart - navigation.requestStart,
                response: navigation.responseEnd - navigation.responseStart,
                dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
                load: navigation.loadEventEnd - navigation.domContentLoadedEventEnd
            };
            
            // Send performance data
            if (window.gtag) {
                Object.entries(metrics).forEach(([key, value]) => {
                    gtag('event', 'performance_timing', {
                        event_category: 'Performance',
                        event_label: key,
                        value: Math.round(value)
                    });
                });
            }
        });
    }

    // SEO Health Check
    performSEOHealthCheck() {
        const issues = [];
        
        // Check meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription || metaDescription.content.length < 120) {
            issues.push('Meta description too short or missing');
        }
        
        // Check title length
        if (document.title.length < 30 || document.title.length > 60) {
            issues.push('Title tag length not optimal');
        }
        
        // Check H1 tags
        const h1Tags = document.querySelectorAll('h1');
        if (h1Tags.length !== 1) {
            issues.push('Should have exactly one H1 tag');
        }
        
        // Check alt tags
        const images = document.querySelectorAll('img');
        const missingAlt = Array.from(images).filter(img => !img.alt);
        if (missingAlt.length > 0) {
            issues.push(`${missingAlt.length} images missing alt text`);
        }
        
        // Log issues to console in development
        if (issues.length > 0 && window.location.hostname === 'localhost') {
            console.warn('SEO Issues Found:', issues);
        }
        
        return issues;
    }
}

// Initialize SEO Enhancements
document.addEventListener('DOMContentLoaded', () => {
    new SEOEnhancements();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOEnhancements;
}
