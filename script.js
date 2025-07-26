// Global Variables
let sidebarOpen = false;
let helpModalOpen = false;
let activeCategory = 'ALL';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    addEventListeners();
    
    // Initialize skill cards
    initializeSkillCards();
    
    // Initialize category buttons
    initializeCategoryButtons();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Add hover effects
    addHoverEffects();
}

function addEventListeners() {
    // Practice Free button
    const practiceFreeBtn = document.querySelector('.practice-free-btn');
    if (practiceFreeBtn) {
        practiceFreeBtn.addEventListener('click', startFullPracticeTest);
    }
    
    // Sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', handleSidebarItemClick);
    });
    
    // Help button in sidebar
    const helpButton = document.querySelector('.help-button');
    if (helpButton) {
        helpButton.addEventListener('click', toggleHelp);
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.querySelector('.menu-btn');
        
        if (sidebarOpen && !sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
            toggleSidebar();
        }
    });
    
    // Close help modal when clicking outside
    document.addEventListener('click', function(event) {
        const helpModal = document.getElementById('helpModal');
        const helpContent = document.querySelector('.help-content');
        const helpBtn = document.querySelector('.help-btn');
        
        if (helpModalOpen && helpModal.contains(event.target) && !helpContent.contains(event.target) && !helpBtn.contains(event.target)) {
            toggleHelp();
        }
    });
}

function initializeSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            const skillName = this.querySelector('h3').textContent;
            startSkillPractice(skillName);
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
        
        // Add hover animation
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function initializeCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update active category
            activeCategory = this.textContent;
            
            // Filter skills based on category
            filterSkillsByCategory(activeCategory);
        });
    });
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // ESC to close modals
        if (event.key === 'Escape') {
            if (helpModalOpen) {
                toggleHelp();
            } else if (sidebarOpen) {
                toggleSidebar();
            }
        }
        
        // Ctrl/Cmd + / to open help
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            toggleHelp();
        }
        
        // Ctrl/Cmd + M to toggle sidebar
        if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
            event.preventDefault();
            toggleSidebar();
        }
    });
}

function addHoverEffects() {
    // Add subtle animations to interactive elements
    const interactiveElements = document.querySelectorAll('.icon-btn, .sidebar-item, .help-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
        });
    });
}

// Sidebar Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

function handleSidebarItemClick(event) {
    const itemText = event.currentTarget.querySelector('span:last-child').textContent;
    
    switch(itemText) {
        case 'MY TESTS':
            navigateToMyTests();
            break;
        case 'PRACTICE':
            navigateToPractice();
            break;
        case 'TEST INFO':
            navigateToTestInfo();
            break;
        case 'INSTITUTIONS':
            navigateToInstitutions();
            break;
        case 'SETTINGS':
            navigateToSettings();
            break;
        case 'SITE LANGUAGE':
            openLanguageSettings();
            break;
        case 'LOG OUT':
            handleLogout();
            break;
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

// Help Functions
function toggleHelp() {
    const helpModal = document.getElementById('helpModal');
    helpModalOpen = !helpModalOpen;
    
    if (helpModalOpen) {
        helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        helpModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Practice Functions
function startFullPracticeTest() {
    // Show loading state
    const btn = document.querySelector('.practice-free-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        alert('Starting full practice test! This would normally redirect to the test interface.');
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

function startSkillPractice(skillName) {
    // Show loading state
    showNotification(`Starting ${skillName} practice...`);
    
    // Simulate starting practice
    setTimeout(() => {
        alert(`${skillName} practice would start here! This would open the specific skill practice interface.`);
    }, 1000);
}

function filterSkillsByCategory(category) {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const skillName = card.querySelector('h3').textContent;
        let shouldShow = true;
        
        if (category !== 'ALL') {
            shouldShow = getSkillCategory(skillName) === category;
        }
        
        if (shouldShow) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
}

function getSkillCategory(skillName) {
    const categoryMap = {
        'Read and Select': 'READING',
        'Fill in the Blanks': 'READING',
        'Read and Complete': 'READING',
        'Interactive Reading': 'READING',
        'Listen and Type': 'LISTENING',
        'Interactive Listening': 'LISTENING',
        'Write About the Photo': 'WRITING',
        'Writing Sample': 'WRITING',
        'Speak About the Photo': 'SPEAKING',
        'Read, Then Speak': 'SPEAKING',
        'Speaking Sample': 'SPEAKING'
    };
    
    return categoryMap[skillName] || 'ALL';
}

// Navigation Functions
function navigateToMyTests() {
    showNotification('Navigating to My Tests...');
    // In a real app, this would change the route/page
}

function navigateToPractice() {
    showNotification('You are already on the Practice page!');
}

function navigateToTestInfo() {
    showNotification('Navigating to Test Information...');
}

function navigateToInstitutions() {
    showNotification('Navigating to Institutions...');
}

function navigateToSettings() {
    showNotification('Opening Settings...');
}

function openLanguageSettings() {
    showNotification('Opening Language Settings...');
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        showNotification('Logging out...');
        // In a real app, this would handle the logout process
        setTimeout(() => {
            alert('You have been logged out successfully!');
        }, 1500);
    }
}

// Utility Functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #58cc02;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function simulateProgress(skillCard) {
    const progressBar = skillCard.querySelector('.progress-fill');
    const progressText = skillCard.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const currentProgress = parseInt(progressText.textContent.split('/')[0]);
        const maxProgress = parseInt(progressText.textContent.split('/')[1]);
        
        if (currentProgress < maxProgress) {
            const newProgress = currentProgress + 1;
            const percentage = (newProgress / maxProgress) * 100;
            
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${newProgress}/${maxProgress}`;
            
            // Add completion animation if finished
            if (newProgress === maxProgress) {
                setTimeout(() => {
                    skillCard.style.background = 'linear-gradient(135deg, #e8f5e8, #c8e6c9)';
                    showNotification('Skill completed! 🎉');
                }, 500);
            }
        }
    }
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification {
            transition: all 0.3s ease;
        }
        
        .skill-card {
            transition: all 0.3s ease;
        }
        
        .progress-fill {
            transition: width 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Resize handler
const handleResize = debounce(() => {
    // Close sidebar on desktop
    if (window.innerWidth > 768 && sidebarOpen) {
        toggleSidebar();
    }
}, 250);

window.addEventListener('resize', handleResize);

// Initialize dynamic styles
document.addEventListener('DOMContentLoaded', addDynamicStyles);

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels
    const practiceBtn = document.querySelector('.practice-free-btn');
    if (practiceBtn) {
        practiceBtn.setAttribute('aria-label', 'Start free practice test');
    }
    
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
        menuBtn.setAttribute('aria-expanded', 'false');
    }
    
    const helpBtn = document.querySelector('.help-btn');
    if (helpBtn) {
        helpBtn.setAttribute('aria-label', 'Get help and support');
    }
    
    // Update ARIA states
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.setAttribute('aria-hidden', 'true');
    }
}

// Update ARIA states when sidebar toggles
function updateAriaStates() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (sidebar && menuBtn) {
        sidebar.setAttribute('aria-hidden', sidebarOpen ? 'false' : 'true');
        menuBtn.setAttribute('aria-expanded', sidebarOpen ? 'true' : 'false');
    }
}

// Call accessibility improvements on load
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Update ARIA states when sidebar state changes
document.addEventListener('DOMContentLoaded', function() {
    const originalToggleSidebar = toggleSidebar;
    toggleSidebar = function() {
        originalToggleSidebar();
        updateAriaStates();
    };
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // In a real app, this would send data to analytics service
    console.log(`Event: ${eventName}`, eventData);
}

// Track skill card clicks
document.addEventListener('DOMContentLoaded', function() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            const skillName = this.querySelector('h3').textContent;
            trackEvent('skill_card_click', { skill: skillName });
        });
    });
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showNotification('An error occurred. Please refresh the page.');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('A network error occurred. Please check your connection.');
});

console.log('Duolingo English Test Practice App initialized successfully!');