document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = [
        // --- Nature ---
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
            title: 'Whispering Woods',
            category: 'nature',
            description: 'A serene pathway carved through ancient trees as morning sunbeams pierce the dense forest canopy.'
        },
        {
            id: 2,
            src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
            title: 'Misty Giants',
            category: 'nature',
            description: 'Towering snow-capped mountain peaks rising high above a sea of soft morning alpine mist.'
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?auto=format&fit=crop&w=800&q=80',
            title: 'Golden Solitude',
            category: 'nature',
            description: 'Windswept desert ripples casting long, elegant shadows across golden sand dunes at sunset.'
        },
        {
            id: 4,
            src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            title: 'Azure Paradise',
            category: 'nature',
            description: 'Crystalline turquoise waters gently lapping against a pristine white sand beach at sunset.'
        },
        {
            id: 5,
            src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            title: 'Yosemite Falls',
            category: 'nature',
            description: 'Majestic granite monoliths and sweeping waterfalls in Yosemite Valley under a soft twilight sky.'
        },
        {
            id: 6,
            src: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=80',
            title: 'Emerald Skyways',
            category: 'nature',
            description: 'The glowing green ribbons of the Aurora Borealis dancing across a starry winter night sky.'
        },
        // --- Animals ---
        {
            id: 7,
            src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
            title: 'Savanna Royalty',
            category: 'animals',
            description: 'An intense, close-up study of a majestic male lion observing his golden territory in the Serengeti.'
        },
        {
            id: 8,
            src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80',
            title: 'Crimson Explorer',
            category: 'animals',
            description: 'A curious red fox pausing in tall wild grass, alert to the subtle sounds of the wilderness.'
        },
        {
            id: 9,
            src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
            title: 'Oceanic Wanderer',
            category: 'animals',
            description: 'A graceful green sea turtle gliding effortlessly through deep blue tropical Pacific waters.'
        },
        {
            id: 10,
            src: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80',
            title: 'Prismatic Flight',
            category: 'animals',
            description: 'A stunning close-up of a colorful macaw, showcasing brilliant red, blue, and yellow plumage.'
        },
        {
            id: 11,
            src: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
            title: 'Gentle Giant',
            category: 'animals',
            description: 'A massive African elephant wandering through dusty golden plains under a warm Serengeti sunset.'
        },
        {
            id: 12,
            src: 'https://images.unsplash.com/photo-1590420485404-f86d22b8ab18?auto=format&fit=crop&w=800&q=80',
            title: 'Silent Predator',
            category: 'animals',
            description: 'A lone timber wolf stepping silently through deep, fresh snow in a chilly northern boreal forest.'
        },
        // --- Technology ---
        {
            id: 13,
            src: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80',
            title: 'Cyberpunk Terminal',
            category: 'technology',
            description: 'A futuristic workstation bathed in deep neon purple and blue backlights, optimized for creative development.'
        },
        {
            id: 14,
            src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            title: 'Neural Engine',
            category: 'technology',
            description: 'Macro shot of a high-performance silicon processor glowing under neon circuit line reflections.'
        },
        {
            id: 15,
            src: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
            title: 'Virtual Odyssey',
            category: 'technology',
            description: 'Stepping beyond physical boundaries into simulated worlds using advanced VR optical hardware.'
        },
        {
            id: 16,
            src: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
            title: 'Quantum Chronograph',
            category: 'technology',
            description: 'The intricate internal mechanical design and digital interface overlay of a modern smartwatch.'
        },
        {
            id: 17,
            src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            title: 'Synaptic Circuits',
            category: 'technology',
            description: 'Rows of glowing, colorful code scrolling down a high-definition developer workstation in a dark room.'
        },
        {
            id: 18,
            src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
            title: 'Pixel Heritage',
            category: 'technology',
            description: 'Retro game console controllers and classic systems stacked neatly in nostalgic neon arcade light.'
        },
        // --- Travel ---
        {
            id: 19,
            src: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
            title: 'Santorini Calm',
            category: 'travel',
            description: 'Iconic white-washed buildings and blue-domed roofs overlooking the calm volcanic caldera of Greece.'
        },
        {
            id: 20,
            src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            title: 'Kyoto Whispers',
            category: 'travel',
            description: 'Ethereal shafts of light filtering through the famous towering bamboo grove of Arashiyama in Kyoto, Japan.'
        },
        {
            id: 21,
            src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
            title: 'Parisian Romance',
            category: 'travel',
            description: 'The stunning silhouette of the Eiffel Tower rising above a warm, hazy sunset over the Seine river.'
        },
        {
            id: 22,
            src: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
            title: 'Anatolian Dreamscape',
            category: 'travel',
            description: 'Dozens of vibrant hot air balloons lifting off into the pastel pink dawn above Cappadocia, Turkey.'
        },
        {
            id: 23,
            src: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=800&q=80',
            title: 'Venetian Waters',
            category: 'travel',
            description: 'A classic gondola floating on the quiet, emerald waters of a historic Venice canal at sunrise.'
        },
        {
            id: 24,
            src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
            title: 'Marble Majesty',
            category: 'travel',
            description: 'The spectacular white marble Taj Mahal reflecting perfectly in the peaceful reflection pool during dawn.'
        },
        // --- Cars ---
        {
            id: 25,
            src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
            title: 'Heritage Speedster',
            category: 'cars',
            description: 'A classic high-performance sports car carving gracefully along a winding, tree-lined alpine pass.'
        },
        {
            id: 26,
            src: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
            title: 'Vintage Sunshine',
            category: 'cars',
            description: 'A meticulously restored vintage yellow coupe parked in front of a warm retro sunset background.'
        },
        {
            id: 27,
            src: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
            title: 'Electrified Horizon',
            category: 'cars',
            description: 'A futuristic electric luxury sedan charging quietly under neon charging station illumination.'
        },
        {
            id: 28,
            src: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
            title: 'Dust & Glory',
            category: 'cars',
            description: 'An aggressive offroad SUV drifting through dry desert sands, kicking up a dramatic cloud of dust.'
        },
        {
            id: 29,
            src: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800&q=80',
            title: 'Scarlet Velocity',
            category: 'cars',
            description: 'A striking crimson modern supercar showcasing aerodynamic carbon fiber body lines.'
        },
        {
            id: 30,
            src: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
            title: 'Midnight Charger',
            category: 'cars',
            description: 'A classic American muscle car idling aggressively under warehouse garage spot lights.'
        }
    ];

    // ==========================================================================
    // 2. DOM Selection
    // ==========================================================================
    const galleryGrid = document.getElementById('gallery-grid');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Lightbox DOM Elements
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxImgWrapper = lightboxImg.parentElement;
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxCounter = document.getElementById('lightbox-counter');

    // ==========================================================================
    // 3. Application State Variables
    // ==========================================================================
    let currentCategory = 'all';
    let searchQuery = '';
    let filteredImages = [...galleryImages];
    let activeLightboxIndex = 0;

    // ==========================================================================
    // 4. Render Gallery & Image Loading
    // ==========================================================================
    function renderGallery() {
        // Clear current grid
        galleryGrid.innerHTML = '';

        // Filter the database array by current conditions
        filteredImages = galleryImages.filter(img => {
            const matchesCategory = currentCategory === 'all' || img.category === currentCategory;
            const matchesSearch = img.title.toLowerCase().includes(searchQuery) ||
                                  img.description.toLowerCase().includes(searchQuery) ||
                                  img.category.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        // Toggle visibility of the no results panel
        if (filteredImages.length === 0) {
            noResults.classList.remove('hidden');
            galleryGrid.classList.add('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
            galleryGrid.classList.remove('hidden');
        }

        // Generate cards and inject into grid
        filteredImages.forEach((image, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.setAttribute('data-index', index);
            // Delay rendering animation slightly per card to create staggered visual flow
            card.style.animationDelay = `${index * 0.04}s`;

            card.innerHTML = `
                <div class="card-img-container">
                    <div class="image-skeleton-loader shimmer"></div>
                    <img src="${image.src}" alt="${image.title}" loading="lazy">
                </div>
                <div class="card-overlay">
                    <div class="card-meta">
                        <span class="category-badge">${image.category}</span>
                    </div>
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                </div>
            `;

            // Wait for image loading to transition out of the skeleton state
            const imgElement = card.querySelector('img');
            imgElement.addEventListener('load', () => {
                card.classList.add('loaded');
            });
            
            // Fallback in case of quick caching
            if (imgElement.complete) {
                card.classList.add('loaded');
            }

            // Click listener to launch lightbox
            card.addEventListener('click', () => {
                openLightbox(index);
            });

            galleryGrid.appendChild(card);
        });
    }

    // ==========================================================================
    // 5. Category Filtering
    // ==========================================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            // Update state and render
            currentCategory = button.getAttribute('data-category');
            renderGallery();
        });
    });

    // ==========================================================================
    // 6. Search Functionality
    // ==========================================================================
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();

        // Control Visibility of clear button
        if (searchQuery.length > 0) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }

        renderGallery();
    });

    // Clear search button behavior
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.remove('visible');
        searchInput.focus();
        renderGallery();
    });

    // Reset Filters button (inside no results state)
    resetFiltersBtn.addEventListener('click', () => {
        // Reset Search
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.remove('visible');

        // Reset Category buttons active status
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        currentCategory = 'all';

        renderGallery();
    });

    // ==========================================================================
    // 7. Lightbox Modal Controller
    // ==========================================================================
    function openLightbox(index) {
        activeLightboxIndex = index;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
        updateLightboxContent();
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        // Clean source to prevent flash next time it opens
        lightboxImg.src = '';
        lightboxImg.classList.add('hidden');
        lightboxImgWrapper.classList.remove('loaded');
    }

    function updateLightboxContent() {
        const activeImage = filteredImages[activeLightboxIndex];
        if (!activeImage) return;

        // Reset loader visual state
        lightboxImgWrapper.classList.remove('loaded');
        lightboxImg.classList.add('hidden');

        // Set image source and trigger load event
        lightboxImg.src = activeImage.src;
        lightboxImg.alt = activeImage.title;

        // Meta info text
        lightboxTitle.textContent = activeImage.title;
        lightboxDesc.textContent = activeImage.description;
        lightboxCategory.textContent = activeImage.category;
        lightboxCounter.textContent = `${activeLightboxIndex + 1} of ${filteredImages.length}`;

        // Handle loader display
        lightboxImg.onload = () => {
            lightboxImgWrapper.classList.add('loaded');
            lightboxImg.classList.remove('hidden');
        };

        if (lightboxImg.complete) {
            lightboxImgWrapper.classList.add('loaded');
            lightboxImg.classList.remove('hidden');
        }
    }

    function navigateLightbox(direction) {
        if (direction === 'next') {
            activeLightboxIndex = (activeLightboxIndex + 1) % filteredImages.length;
        } else if (direction === 'prev') {
            activeLightboxIndex = (activeLightboxIndex - 1 + filteredImages.length) % filteredImages.length;
        }
        updateLightboxContent();
    }

    // Lightbox Event Listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));

    // Click outside lightbox content to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation controls
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        }
    });

    // ==========================================================================
    // 8. Dark & Light Theme Toggle
    // ==========================================================================
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem('photos-gallery-theme');
        if (savedTheme) return savedTheme;
        
        // Fallback to system OS theme preference
        const userPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        return userPrefersLight ? 'light' : 'dark';
    };

    // Initialize Theme
    const currentTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        // Apply theme attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        // Save to cache
        localStorage.setItem('photos-gallery-theme', newTheme);
    });

    // ==========================================================================
    // 9. App Entry point
    // ==========================================================================
    renderGallery();
});
