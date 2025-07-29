// Global Variables
let sidebarOpen = false;
let helpModalOpen = false;
let activeCategory = "ALL";

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();

  // Show practice page by default

  navigateToPractice();
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

  // Initialize new buttons for My Tests page
  initializeMyTestsButtons();

  // Initialize Test Info cards
  initializeTestInfoCards();

  // Initialize Institutions functionality
  initializeInstitutions();

  // Initialize Review Rules functionality
  initializeReviewRules();

  // Load saved progress
  loadSkillProgress();

  // Check for new progress from other pages
  checkForNewProgress();
}
function initializeInstitutions() {
  // Search functionality
  const searchInput = document.querySelector(".university-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterUniversities(this.value);
    });
  }

  // Filter dropdowns
  const programsFilter = document.querySelector(".programs-filter");
  const locationsFilter = document.querySelector(".locations-filter");

  if (programsFilter) {
    programsFilter.addEventListener("change", function () {
      filterUniversitiesByFilters();
    });
  }

  if (locationsFilter) {
    locationsFilter.addEventListener("change", function () {
      filterUniversitiesByFilters();
    });
  }

  // University items click handlers - Updated to handle new structure
  const universityItems = document.querySelectorAll(".university-item");
  universityItems.forEach((item) => {
    // Create a header wrapper for the clickable area
    const universityInfo = item.querySelector(".university-info");
    const universityExpand = item.querySelector(".university-expand");
    const universityDetails = item.querySelector(".university-details");

    // Create header wrapper
    const headerWrapper = document.createElement("div");
    headerWrapper.className = "university-header";

    // Move info and expand button to header
    item.insertBefore(headerWrapper, universityDetails);
    headerWrapper.appendChild(universityInfo);
    headerWrapper.appendChild(universityExpand);

    // Add click handler to header only
    headerWrapper.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleUniversityExpansion(item);
    });

    // Add keyboard support
    headerWrapper.setAttribute("tabindex", "0");
    headerWrapper.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleUniversityExpansion(item);
      }
    });

    // Prevent clicks on program links from bubbling up
    if (universityDetails) {
      universityDetails.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      // Add click tracking for program links
      const programLinks =
        universityDetails.querySelectorAll(".program-link a");
      programLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
          event.stopPropagation();
          trackEvent("program_link_click", {
            university: item.querySelector("h3").textContent,
            program: this.textContent,
          });
        });
      });
    }
  });
}

function filterUniversities(searchTerm) {
  const universityItems = document.querySelectorAll(".university-item");

  universityItems.forEach((item) => {
    const universityName = item.querySelector("h3").textContent.toLowerCase();
    const location = item
      .querySelector(".university-location")
      .textContent.toLowerCase();

    // Also search in program names
    const programLinks = item.querySelectorAll(".program-link a");
    let programMatch = false;
    programLinks.forEach((link) => {
      if (link.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
        programMatch = true;
      }
    });

    if (
      universityName.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase()) ||
      programMatch
    ) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function filterUniversitiesByFilters() {
  const programsFilter = document.querySelector(".programs-filter").value;
  const locationsFilter = document.querySelector(".locations-filter").value;
  const searchTerm = document.querySelector(".university-search").value;

  const universityItems = document.querySelectorAll(".university-item");

  universityItems.forEach((item) => {
    const universityName = item.querySelector("h3").textContent.toLowerCase();
    const location = item
      .querySelector(".university-location")
      .textContent.toLowerCase();

    let showItem = true;

    // Search term filter
    if (searchTerm) {
      const programLinks = item.querySelectorAll(".program-link a");
      let programMatch = false;
      programLinks.forEach((link) => {
        if (link.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
          programMatch = true;
        }
      });

      if (
        !universityName.includes(searchTerm.toLowerCase()) &&
        !location.includes(searchTerm.toLowerCase()) &&
        !programMatch
      ) {
        showItem = false;
      }
    }

    // Programs filter
    if (programsFilter && showItem) {
      const programTypes = item.querySelectorAll(".program-type");
      let hasMatchingProgram = false;

      programTypes.forEach((programType) => {
        if (
          programType.textContent.toLowerCase() === programsFilter.toLowerCase()
        ) {
          hasMatchingProgram = true;
        }
      });

      if (!hasMatchingProgram) {
        showItem = false;
      }
    }

    // Location filter
    if (locationsFilter && showItem) {
      const locationMatch = {
        us: "united states",
        uk: "united kingdom",
        canada: "canada",
        australia: "australia",
      };

      if (
        locationMatch[locationsFilter] &&
        !location.includes(locationMatch[locationsFilter])
      ) {
        showItem = false;
      }
    }

    item.style.display = showItem ? "flex" : "none";
  });
}

function toggleUniversityExpansion(item) {
  const universityDetails = item.querySelector(".university-details");
  const expandIcon = item.querySelector(".expand-icon");
  const isExpanded = item.classList.contains("expanded");

  if (isExpanded) {
    // Collapse
    item.classList.remove("expanded");
    universityDetails.style.display = "none";
    universityDetails.classList.remove("show");
  } else {
    // Expand
    item.classList.add("expanded");
    universityDetails.style.display = "block";
    // Small delay to ensure display change takes effect before animation
    setTimeout(() => {
      universityDetails.classList.add("show");
    }, 10);
  }
}
function initializeTestInfoCards() {
  const infoCards = document.querySelectorAll(".info-card");

  infoCards.forEach((card) => {
    card.addEventListener("click", function () {
      const cardTitle = this.querySelector("h3").textContent;
      handleInfoCardClick(cardTitle);
    });

    // Add keyboard support
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });

    // Add hover animation
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

function handleInfoCardClick(cardTitle) {
  switch (cardTitle) {
    case "Review rules":
      navigateToReviewRules();
      break;
    case "Prepare your space":
      navigateToPrepareSpace();
      break;
    case "Understand scoring":
      navigateToUnderstandScoring();
      break;
    case "Download official guide":
      // Direct redirection to the official guide URL
      window.open(
        "https://dy8n3onijof8f.cloudfront.net/media/resources/test-taker-guide/DET%20Guide%202024-10-28%20EN.pdf",
        "_blank"
      );
      break;
    default:
      showNotification(`Opening ${cardTitle}...`);
  }
}
function navigateToUnderstandScoring() {
  // Hide all content sections
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");
  const reviewRulesContent = document.getElementById("reviewRulesContent");
  const prepareSpaceContent = document.getElementById("prepareSpaceContent");
  const understandScoringContent = document.getElementById(
    "understandScoringContent"
  );

  if (practiceContent) practiceContent.style.display = "none";
  if (myTestsContent) myTestsContent.style.display = "none";
  if (testInfoContent) testInfoContent.style.display = "none";
  if (institutionsContent) institutionsContent.style.display = "none";
  if (reviewRulesContent) reviewRulesContent.style.display = "none";
  if (prepareSpaceContent) prepareSpaceContent.style.display = "none";
  if (understandScoringContent)
    understandScoringContent.style.display = "block";

  // Keep TEST INFO highlighted in sidebar since this is a sub-page
  updateSidebarActiveState("TEST INFO");
}
function navigateToPrepareSpace() {
  // Hide all content sections
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");
  const reviewRulesContent = document.getElementById("reviewRulesContent");
  const prepareSpaceContent = document.getElementById("prepareSpaceContent");

  if (practiceContent) practiceContent.style.display = "none";
  if (myTestsContent) myTestsContent.style.display = "none";
  if (testInfoContent) testInfoContent.style.display = "none";
  if (institutionsContent) institutionsContent.style.display = "none";
  if (reviewRulesContent) reviewRulesContent.style.display = "none";
  if (prepareSpaceContent) prepareSpaceContent.style.display = "block";

  // Keep TEST INFO highlighted in sidebar since this is a sub-page
  updateSidebarActiveState("TEST INFO");
}
function navigateToReviewRules() {
  // Hide all content sections
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");
  const reviewRulesContent = document.getElementById("reviewRulesContent");

  if (practiceContent) practiceContent.style.display = "none";
  if (myTestsContent) myTestsContent.style.display = "none";
  if (testInfoContent) testInfoContent.style.display = "none";
  if (institutionsContent) institutionsContent.style.display = "none";
  if (reviewRulesContent) reviewRulesContent.style.display = "block";

  // Keep TEST INFO highlighted in sidebar since this is a sub-page
  updateSidebarActiveState("TEST INFO");
}
function initializeMyTestsButtons() {
  // Purchase test button
  const purchaseTestBtn = document.querySelector(".purchase-test-btn");
  if (purchaseTestBtn) {
    purchaseTestBtn.addEventListener("click", function () {
      showNotification("Redirecting to test purchase...");
      // In a real app, this would redirect to payment page
    });
  }

  // Action cards
  const practiceCard = document.querySelector(".practice-card");
  const learnCard = document.querySelector(".learn-card");

  if (practiceCard) {
    practiceCard.addEventListener("click", function () {
      navigateToPractice(); // This will switch to Practice tab
    });
  }

  if (learnCard) {
    learnCard.addEventListener("click", function () {
      navigateToTestInfo();
    });
  }
}
function addEventListeners() {
  // Practice Free button
  const practiceFreeBtn = document.querySelector(".practice-free-btn");
  if (practiceFreeBtn) {
    practiceFreeBtn.addEventListener("click", startFullPracticeTest);
  }

  // Sidebar items
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  sidebarItems.forEach((item) => {
    item.addEventListener("click", handleSidebarItemClick);
  });

  // Help button in sidebar
  const helpButton = document.querySelector(".help-button");
  if (helpButton) {
    helpButton.addEventListener("click", toggleHelp);
  }

  // Close sidebar when clicking outside
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.querySelector(".menu-btn");

    if (
      sidebarOpen &&
      !sidebar.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      toggleSidebar();
    }
  });

  // Close help modal when clicking outside
  document.addEventListener("click", function (event) {
    const helpModal = document.getElementById("helpModal");
    const helpContent = document.querySelector(".help-content");
    const helpBtn = document.querySelector(".help-btn");

    if (
      helpModalOpen &&
      helpModal.contains(event.target) &&
      !helpContent.contains(event.target) &&
      !helpBtn.contains(event.target)
    ) {
      toggleHelp();
    }
  });
}

function initializeSkillCards() {
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    const skillName = card.querySelector("h3").textContent;

    // Special handling for Read and Select
    if (skillName === "Read and Select") {
      card.addEventListener("click", function () {
        // Add a brief loading state before redirect
        this.style.opacity = "0.7";
        this.style.transform = "translateY(-2px)";

        setTimeout(() => {
          window.location.href = "read and select.html";
        }, 200);
      });
    }
    // Special handling for Fill in the Blanks
    else if (skillName === "Fill in the Blanks") {
      card.addEventListener("click", function () {
        // Add a brief loading state before redirect
        this.style.opacity = "0.7";
        this.style.transform = "translateY(-2px)";

        setTimeout(() => {
          window.location.href = "fill in the blanks.html";
        }, 200);
      });
    }
    // Special handling for Listen and Type
    else if (skillName === "Listen and Type") {
      card.addEventListener("click", function () {
        this.style.opacity = "0.7";
        this.style.transform = "translateY(-2px)";

        setTimeout(() => {
          window.location.href = "listen and type.html";
        }, 200);
      });
    }
    // Special handling for Read and Complete - NEW
    else if (skillName === "Read and Complete") {
      card.addEventListener("click", function () {
        this.style.opacity = "0.7";
        this.style.transform = "translateY(-2px)";

        setTimeout(() => {
          window.location.href = "read and complete.html";
        }, 200);
      });
    }
    // Special handling for Write About the Photo - NEW
    else if (skillName === "Write About the Photo") {
      card.addEventListener("click", function () {
        this.style.opacity = "0.7";
        this.style.transform = "translateY(-2px)";

        setTimeout(() => {
          window.location.href = "write about the photo.html";
        }, 200);
      });
    } else {
      // Default behavior for other cards
      card.addEventListener("click", function () {
        startSkillPractice(skillName);
      });
    }

    // Add keyboard support for accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });

    // Add hover animations
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
      this.style.transition = "all 0.2s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });

    // Add focus styles for keyboard navigation
    card.addEventListener("focus", function () {
      this.style.outline = "2px solid #1cb0f6";
      this.style.outlineOffset = "2px";
    });

    card.addEventListener("blur", function () {
      this.style.outline = "none";
    });

    // Add click animation
    card.addEventListener("mousedown", function () {
      this.style.transform = "translateY(0) scale(0.98)";
    });

    card.addEventListener("mouseup", function () {
      this.style.transform = "translateY(-2px) scale(1)";
    });

    // Track analytics for skill card clicks
    card.addEventListener("click", function () {
      trackEvent("skill_card_click", {
        skill: skillName,
        timestamp: new Date().toISOString(),
      });
    });
  });
}

function initializeCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-btn");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      categoryButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Update active category
      activeCategory = this.textContent;

      // Filter skills based on category
      filterSkillsByCategory(activeCategory);
    });
  });
}

function addKeyboardShortcuts() {
  document.addEventListener("keydown", function (event) {
    // ESC to close modals
    if (event.key === "Escape") {
      if (helpModalOpen) {
        toggleHelp();
      } else if (sidebarOpen) {
        toggleSidebar();
      }
    }

    // Ctrl/Cmd + / to open help
    if ((event.ctrlKey || event.metaKey) && event.key === "/") {
      event.preventDefault();
      toggleHelp();
    }

    // Ctrl/Cmd + M to toggle sidebar
    if ((event.ctrlKey || event.metaKey) && event.key === "m") {
      event.preventDefault();
      toggleSidebar();
    }
  });
}

function addHoverEffects() {
  // Add subtle animations to interactive elements
  const interactiveElements = document.querySelectorAll(
    ".icon-btn, .sidebar-item, .help-button"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.2s ease";
    });
  });
}

// Sidebar Functions
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebarOpen = !sidebarOpen;

  if (sidebarOpen) {
    sidebar.classList.add("open");
    document.body.style.overflow = "hidden";
  } else {
    sidebar.classList.remove("open");
    document.body.style.overflow = "auto";
  }
}

function handleSidebarItemClick(event) {
  const itemText =
    event.currentTarget.querySelector("span:last-child").textContent;

  switch (itemText) {
    case "MY TESTS":
      navigateToMyTests();
      break;
    case "PRACTICE":
      navigateToPractice();
      break;
    case "TEST INFO":
      navigateToTestInfo();
      break;
    case "INSTITUTIONS":
      navigateToInstitutions();
      break;
    case "SETTINGS":
      navigateToSettings();
      break;
    case "SITE LANGUAGE":
      openLanguageSettings();
      break;
    case "LOG OUT":
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
  const helpModal = document.getElementById("helpModal");
  helpModalOpen = !helpModalOpen;

  if (helpModalOpen) {
    helpModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  } else {
    helpModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Practice Functions
function startFullPracticeTest() {
  // Show loading state
  const btn = document.querySelector(".practice-free-btn");
  const originalText = btn.textContent;
  btn.textContent = "Loading...";
  btn.disabled = true;

  // Simulate loading
  setTimeout(() => {
    alert(
      "Starting full practice test! This would normally redirect to the test interface."
    );
    btn.textContent = originalText;
    btn.disabled = false;
  }, 1500);
}

function startSkillPractice(skillName) {
  // Show loading state
  showNotification(`Starting ${skillName} practice...`);

  // Simulate starting practice
  setTimeout(() => {
    alert(
      `${skillName} practice would start here! This would open the specific skill practice interface.`
    );
  }, 1000);
}

function filterSkillsByCategory(category) {
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    const skillName = card.querySelector("h3").textContent;
    let shouldShow = true;

    if (category !== "ALL") {
      shouldShow = getSkillCategory(skillName) === category;
    }

    if (shouldShow) {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.3s ease-in-out";
    } else {
      card.style.display = "none";
    }
  });
}

function getSkillCategory(skillName) {
  const categoryMap = {
    "Read and Select": "READING",
    "Fill in the Blanks": "READING",
    "Read and Complete": "READING",
    "Interactive Reading": "READING",
    "Listen and Type": "LISTENING",
    "Interactive Listening": "LISTENING",
    "Write About the Photo": "WRITING",
    "Writing Sample": "WRITING",
    "Speak About the Photo": "SPEAKING",
    "Read, Then Speak": "SPEAKING",
    "Speaking Sample": "SPEAKING",
  };

  return categoryMap[skillName] || "ALL";
}

// Navigation Functions
function navigateToMyTests() {
  // Show my tests content, hide others
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");

  if (practiceContent) practiceContent.style.display = "none";
  if (myTestsContent) myTestsContent.style.display = "block";
  if (testInfoContent) testInfoContent.style.display = "none";
  if (institutionsContent) institutionsContent.style.display = "none";

  // Update sidebar active state
  updateSidebarActiveState("MY TESTS");

  // Removed: showNotification('Navigating to My Tests...');
}

function navigateToPractice() {
  // Show practice content, hide others
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");

  if (practiceContent) practiceContent.style.display = "block";
  if (myTestsContent) myTestsContent.style.display = "none";
  if (testInfoContent) testInfoContent.style.display = "none";
  if (institutionsContent) institutionsContent.style.display = "none";

  // Update sidebar active state
  updateSidebarActiveState("PRACTICE");

  // Removed: showNotification('Switched to Practice page!');
}

function navigateToTestInfo() {
  // Hide other content sections
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");
  const reviewRulesContent = document.getElementById("reviewRulesContent");
  const prepareSpaceContent = document.getElementById("prepareSpaceContent");
  const understandScoringContent = document.getElementById(
    "understandScoringContent"
  );

  if (practiceContent) practiceContent.style.display = "none";
  if (myTestsContent) myTestsContent.style.display = "none";
  if (testInfoContent) testInfoContent.style.display = "block";
  if (institutionsContent) institutionsContent.style.display = "none";
  if (reviewRulesContent) reviewRulesContent.style.display = "none";
  if (prepareSpaceContent) prepareSpaceContent.style.display = "none";
  if (understandScoringContent) understandScoringContent.style.display = "none";

  // Update sidebar active state
  updateSidebarActiveState("TEST INFO");
}
function initializeReviewRules() {
  const videoContainer = document.querySelector(".video-container");
  if (videoContainer) {
    videoContainer.addEventListener("click", function () {
      showNotification("Video would play here in the actual app");
      // In a real app, this would open a video player or modal
    });
  }
}
function navigateToInstitutions() {
  // Hide other content sections
  const practiceContent = document.getElementById("practiceContent");
  const myTestsContent = document.getElementById("myTestsContent");
  const testInfoContent = document.getElementById("testInfoContent");
  const institutionsContent = document.getElementById("institutionsContent");

  if (practiceContent) practiceContent.style.display = "none";
  if (myTestsContent) myTestsContent.style.display = "none";
  if (testInfoContent) testInfoContent.style.display = "none";
  if (institutionsContent) institutionsContent.style.display = "block";

  // Update sidebar active state
  updateSidebarActiveState("INSTITUTIONS");

  // Removed: showNotification('Navigating to Institutions...');
}
function updateSidebarActiveState(activeItem) {
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  sidebarItems.forEach((item) => {
    const itemText = item.querySelector("span:last-child").textContent;

    // Remove all active states first
    item.classList.remove(
      "active",
      "highlighted",
      "test-info-active",
      "institutions-active"
    );

    // Add appropriate class based on the active item
    if (itemText === activeItem) {
      if (activeItem === "MY TESTS") {
        item.classList.add("active");
      } else if (activeItem === "PRACTICE") {
        item.classList.add("highlighted");
      } else if (activeItem === "TEST INFO") {
        item.classList.add("test-info-active");
      } else if (activeItem === "INSTITUTIONS") {
        item.classList.add("institutions-active");
      }
    }
  });
}

function navigateToSettings() {
  showNotification("Opening Settings...");
}

function openLanguageSettings() {
  showNotification("Opening Language Settings...");
}

function handleLogout() {
  if (confirm("Are you sure you want to log out?")) {
    showNotification("Logging out...");
    // In a real app, this would handle the logout process
    setTimeout(() => {
      alert("You have been logged out successfully!");
    }, 1500);
  }
}

// Utility Functions
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
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
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function simulateProgress(skillCard) {
  const progressBar = skillCard.querySelector(".progress-fill");
  const progressText = skillCard.querySelector(".progress-text");

  if (progressBar && progressText) {
    const currentProgress = parseInt(progressText.textContent.split("/")[0]);
    const maxProgress = parseInt(progressText.textContent.split("/")[1]);

    if (currentProgress < maxProgress) {
      const newProgress = currentProgress + 1;
      const percentage = (newProgress / maxProgress) * 100;

      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `${newProgress}/${maxProgress}`;

      // Add completion animation if finished
      if (newProgress === maxProgress) {
        setTimeout(() => {
          skillCard.style.background =
            "linear-gradient(135deg, #e8f5e8, #c8e6c9)";
          showNotification("Skill completed! 🎉");
        }, 500);
      }
    }
  }
}

// Add CSS animations dynamically
function addDynamicStyles() {
  const style = document.createElement("style");
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

window.addEventListener("resize", handleResize);

// Initialize dynamic styles
document.addEventListener("DOMContentLoaded", addDynamicStyles);

// Accessibility improvements
function enhanceAccessibility() {
  // Add ARIA labels
  const practiceBtn = document.querySelector(".practice-free-btn");
  if (practiceBtn) {
    practiceBtn.setAttribute("aria-label", "Start free practice test");
  }

  const menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.setAttribute("aria-label", "Open navigation menu");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  const helpBtn = document.querySelector(".help-btn");
  if (helpBtn) {
    helpBtn.setAttribute("aria-label", "Get help and support");
  }

  // Update ARIA states
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.setAttribute("aria-hidden", "true");
  }
}

// Update ARIA states when sidebar toggles
function updateAriaStates() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.querySelector(".menu-btn");

  if (sidebar && menuBtn) {
    sidebar.setAttribute("aria-hidden", sidebarOpen ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", sidebarOpen ? "true" : "false");
  }
}

// Call accessibility improvements on load
document.addEventListener("DOMContentLoaded", enhanceAccessibility);

// Update ARIA states when sidebar state changes
document.addEventListener("DOMContentLoaded", function () {
  const originalToggleSidebar = toggleSidebar;
  toggleSidebar = function () {
    originalToggleSidebar();
    updateAriaStates();
  };
});

// Service Worker registration for offline support (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("ServiceWorker registration successful");
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed");
      });
  });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
  // In a real app, this would send data to analytics service
  console.log(`Event: ${eventName}`, eventData);
}

// Track skill card clicks
document.addEventListener("DOMContentLoaded", function () {
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card) => {
    card.addEventListener("click", function () {
      const skillName = this.querySelector("h3").textContent;
      trackEvent("skill_card_click", { skill: skillName });
    });
  });
});

// Error handling
window.addEventListener("error", function (event) {
  console.error("JavaScript error:", event.error);
  showNotification("An error occurred. Please refresh the page.");
});

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", function (event) {
  console.error("Unhandled promise rejection:", event.reason);
  showNotification("A network error occurred. Please check your connection.");
});

console.log("Duolingo English Test Practice App initialized successfully!");
// Function to update skill progress
// Function to update skill progress
function updateSkillProgress(skillName, completed, total) {
  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card) => {
    const cardSkillName = card.querySelector("h3").textContent;

    if (cardSkillName === skillName) {
      const progressBar = card.querySelector(".progress-fill");
      const progressText = card.querySelector(".progress-text");

      if (progressBar && progressText) {
        // Calculate percentage
        const percentage = (completed / total) * 100;

        // Update progress bar
        progressBar.style.width = `${percentage}%`;
        progressBar.style.background =
          "linear-gradient(90deg, #58cc02, #4caf50)";

        // Update text
        progressText.textContent = `${completed}/${total}`;

        // Add visual effect if completed
        if (completed === total) {
          setTimeout(() => {
            card.style.background = "linear-gradient(135deg, #e8f5e8, #c8e6c9)";
            card.style.border = "1px solid #4caf50";
            showNotification(`${skillName} completed! 🎉`);
          }, 500);
        }

        // Save progress to localStorage
        saveSkillProgress(skillName, completed, total);
      }
    }
  });
}

// Function to get current progress for a skill
function getSkillCurrentProgress(skillName) {
  const progressKey = "skillProgress";

  try {
    const stored = localStorage.getItem(progressKey);
    if (stored) {
      const allProgress = JSON.parse(stored);
      if (allProgress[skillName]) {
        return allProgress[skillName].completed || 0;
      }
    }
  } catch (error) {
    console.error("Error reading current progress:", error);
  }

  return 0; // Default to 0 if no progress found
}

// Function to save skill progress
function saveSkillProgress(skillName, completed, total) {
  const progressKey = "skillProgress";
  let allProgress = {};

  try {
    const stored = localStorage.getItem(progressKey);
    if (stored) {
      allProgress = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading progress:", error);
  }

  allProgress[skillName] = {
    completed: completed,
    total: total,
    percentage: (completed / total) * 100,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(progressKey, JSON.stringify(allProgress));
    console.log(`Saved progress: ${skillName} - ${completed}/${total}`);
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

// Function to load saved progress
function loadSkillProgress() {
  const progressKey = "skillProgress";

  try {
    const stored = localStorage.getItem(progressKey);
    if (stored) {
      const allProgress = JSON.parse(stored);

      // Apply progress to all skills
      Object.keys(allProgress).forEach((skillName) => {
        const progress = allProgress[skillName];
        updateSkillProgress(skillName, progress.completed, progress.total);
      });
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }
}

// Function to check for new progress from other pages
function checkForNewProgress() {
  // Check for Read and Select progress
  const readSelectProgress = localStorage.getItem("readAndSelectProgress");
  if (readSelectProgress) {
    try {
      const progressData = JSON.parse(readSelectProgress);
      updateSkillProgress(
        progressData.skill,
        progressData.completed,
        progressData.total
      );
      localStorage.removeItem("readAndSelectProgress");

      setTimeout(() => {
        showNotification(
          `${progressData.skill} progress: ${progressData.completed}/${progressData.total}! 📈`
        );
      }, 500);
    } catch (error) {
      console.error("Error processing new progress:", error);
    }
  }

  // Check for Fill in the Blanks progress
  const fillBlanksProgress = localStorage.getItem("fillBlanksProgress");
  if (fillBlanksProgress) {
    try {
      const progressData = JSON.parse(fillBlanksProgress);
      updateSkillProgress(
        progressData.skill,
        progressData.completed,
        progressData.total
      );
      localStorage.removeItem("fillBlanksProgress");

      setTimeout(() => {
        showNotification(
          `${progressData.skill} progress: ${progressData.completed}/${progressData.total}! 📈`
        );
      }, 500);
    } catch (error) {
      console.error("Error processing Fill in the Blanks progress:", error);
    }
  }

  // Check for Listen and Type progress
  const listenTypeProgress = localStorage.getItem("listenTypeProgress");
  if (listenTypeProgress) {
    try {
      const progressData = JSON.parse(listenTypeProgress);
      updateSkillProgress(
        progressData.skill,
        progressData.completed,
        progressData.total
      );
      localStorage.removeItem("listenTypeProgress");

      setTimeout(() => {
        showNotification(
          `${progressData.skill} progress: ${progressData.completed}/${progressData.total}! 🎧`
        );
      }, 500);
    } catch (error) {
      console.error("Error processing Listen and Type progress:", error);
    }
  }

  // Check for Read and Complete progress - NEW
  const readCompleteProgress = localStorage.getItem("readCompleteProgress");
  if (readCompleteProgress) {
    try {
      const progressData = JSON.parse(readCompleteProgress);
      updateSkillProgress(
        progressData.skill,
        progressData.completed,
        progressData.total
      );
      localStorage.removeItem("readCompleteProgress");

      setTimeout(() => {
        showNotification(
          `${progressData.skill} progress: ${progressData.completed}/${progressData.total}! 📚`
        );
      }, 500);
    } catch (error) {
      console.error("Error processing Read and Complete progress:", error);
    }
  }
  // Check for Write About the Photo progress - NEW
  const writePhotoProgress = localStorage.getItem("writePhotoProgress");
  if (writePhotoProgress) {
    try {
      const progressData = JSON.parse(writePhotoProgress);
      updateSkillProgress(
        progressData.skill,
        progressData.completed,
        progressData.total
      );
      localStorage.removeItem("writePhotoProgress");

      setTimeout(() => {
        showNotification(
          `${progressData.skill} progress: ${progressData.completed}/${progressData.total}! ✍️`
        );
      }, 500);
    } catch (error) {
      console.error("Error processing Write About the Photo progress:", error);
    }
  }
}
