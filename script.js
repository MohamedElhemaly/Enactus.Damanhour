// script.js - Complete Fixed Version with Contact Button Fix

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeAllFeatures();
});

function initializeAllFeatures() {
  initializeNavigation();
  initializeProjects();
  initializeTeam();
  initializePartners();
  initializeSmoothScrolling();
}

// Mobile Navigation - COMPLETELY FIXED
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbar = document.querySelector(".navbar");
  const body = document.body;

  // Mobile Menu Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      body.classList.toggle("menu-open");

      // Update aria-expanded attribute
      const isExpanded = hamburger.classList.contains("active");
      hamburger.setAttribute("aria-expanded", isExpanded);
    });

    // Close menu when clicking on links - FIXED FOR CONTACT BUTTON
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Only prevent default for anchor links that scroll
        if (link.getAttribute("href").startsWith("#")) {
          e.preventDefault();

          const targetId = link.getAttribute("href");
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            const targetPosition = targetSection.offsetTop - 70;
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });

            // Update URL
            history.pushState(null, null, targetId);
          }
        }

        // Close mobile menu
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");

        // Update active nav link
        updateActiveNavLink();
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Navbar Scroll Effect - FIXED
  function handleScroll() {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update active nav link based on scroll position - FIXED
    updateActiveNavLink();
  }

  // Update active navigation link - COMPLETELY FIXED VERSION
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    // Remove active class from all links first
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Special handling for contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const contactTop = contactSection.offsetTop;
      const contactHeight = contactSection.offsetHeight;

      if (
        scrollPos >= contactTop - 100 &&
        scrollPos < contactTop + contactHeight - 100
      ) {
        const contactLink = document.querySelector(".nav-link.donate-btn");
        if (contactLink) {
          contactLink.classList.add("active");
          return;
        }
      }
    }

    // Regular section detection
    let currentActive = null;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPos >= sectionTop - 100 &&
        scrollPos < sectionTop + sectionHeight - 100
      ) {
        currentActive = sectionId;
      }
    });

    // Add active class to current section link
    if (currentActive) {
      const activeLink = document.querySelector(
        `.nav-link[href="#${currentActive}"]`
      );
      if (activeLink && !activeLink.classList.contains("donate-btn")) {
        activeLink.classList.add("active");
      }
    }
  }

  // Initialize scroll events
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("load", handleScroll);

  // Resize handler - close menu on desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 968) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  // Initial call to set correct active state
  updateActiveNavLink();
}

// Rest of your existing JavaScript functions remain the same...
// Projects Show More/Less - FIXED
function initializeProjects() {
  const viewAllBtn = document.getElementById("viewAllBtn");
  const projectsGrid = document.querySelector(".projects-grid");
  const hiddenProjects = document.querySelectorAll(".hidden-project");

  if (viewAllBtn && projectsGrid && hiddenProjects.length > 0) {
    let showingAll = false;

    viewAllBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!showingAll) {
        // Show all projects
        hiddenProjects.forEach((project) => {
          project.style.display = "block";
        });
        projectsGrid.classList.add("show-all");
        viewAllBtn.textContent = "Show Less";
        showingAll = true;
      } else {
        // Show only first 3 projects
        hiddenProjects.forEach((project) => {
          project.style.display = "none";
        });
        projectsGrid.classList.remove("show-all");
        viewAllBtn.textContent = "View All Enactus Projects";
        showingAll = false;

        // Scroll to projects section
        const projectsSection = document.querySelector("#projects");
        if (projectsSection) {
          const targetPosition = projectsSection.offsetTop - 70;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });

    // Initialize - hide extra projects
    hiddenProjects.forEach((project) => {
      project.style.display = "none";
    });
  }
}

// Team Management - FIXED
// Team Management - COMPLETELY FIXED
function initializeTeam() {
  const viewAllTeamBtn = document.getElementById("viewAllTeamBtn");
  const teamGrid = document.querySelector(".team-grid");
  const teamTabs = document.querySelectorAll(".team-tab");
  const teamMembers = document.querySelectorAll(".team-member");

  let showingAllTeam = false;
  let currentCategory = "leaders";

  // Function to filter and display team members - COMPLETELY FIXED
  function filterTeamMembers(category, showAll = false) {
    console.log(`🎯 Filtering: ${category}, Show All: ${showAll}`);

    const maxInitial = 3;
    let visibleCount = 0;

    // Get all members in the current category
    const categoryMembers = Array.from(teamMembers).filter((member) => {
      const memberCategory = member.getAttribute("data-category");

      if (category === "all-members") {
        return true; // Show all members
      } else {
        return memberCategory === category; // Show only specific category
      }
    });

    console.log(`📊 Total in ${category}: ${categoryMembers.length} members`);

    // Show/hide members based on category and showAll state
    teamMembers.forEach((member) => {
      const memberCategory = member.getAttribute("data-category");
      const isInCurrentCategory =
        category === "all-members" || memberCategory === category;

      if (isInCurrentCategory) {
        if (showAll) {
          // Show ALL members in this category
          member.style.display = "block";
          member.style.opacity = "1";
          visibleCount++;
          console.log(
            `✅ Showing ALL: ${member.querySelector("h3").textContent}`
          );
        } else {
          // Show only first 3 members in this category
          const memberIndex = categoryMembers.indexOf(member);
          if (memberIndex < maxInitial) {
            member.style.display = "block";
            member.style.opacity = "1";
            visibleCount++;
            console.log(
              `✅ Showing (first ${maxInitial}): ${
                member.querySelector("h3").textContent
              }`
            );
          } else {
            member.style.display = "none";
            member.style.opacity = "0";
            console.log(
              `⏳ Hiding (beyond first ${maxInitial}): ${
                member.querySelector("h3").textContent
              }`
            );
          }
        }
      } else {
        // Hide members not in current category
        member.style.display = "none";
        member.style.opacity = "0";
        console.log(
          `🚫 Hiding (wrong category): ${
            member.querySelector("h3").textContent
          }`
        );
      }
    });

    console.log(`👀 Total visible: ${visibleCount}`);
    return visibleCount;
  }

  // Initialize team display - FIXED
  function initializeTeamDisplay() {
    console.log(
      `🔄 Initializing display - Category: ${currentCategory}, Show All: ${showingAllTeam}`
    );

    const visibleCount = filterTeamMembers(currentCategory, showingAllTeam);

    // Update button visibility and text - COMPLETELY FIXED
    if (viewAllTeamBtn) {
      if (currentCategory === "advisors") {
        // Hide button for advisors if there are 3 or less
        const advisorCount = Array.from(teamMembers).filter(
          (m) => m.getAttribute("data-category") === "advisors"
        ).length;

        if (advisorCount <= 3) {
          viewAllTeamBtn.style.display = "none";
        } else {
          viewAllTeamBtn.style.display = "block";
          viewAllTeamBtn.textContent = showingAllTeam
            ? "Show Less"
            : "View All Advisors";
        }
      } else {
        viewAllTeamBtn.style.display = "block";

        if (currentCategory === "all-members") {
          viewAllTeamBtn.textContent = showingAllTeam
            ? "Show Less"
            : "View All Enactus Team";
        } else if (currentCategory === "leaders") {
          viewAllTeamBtn.textContent = showingAllTeam
            ? "Show Less"
            : "View All Enactus Team Leaders";
        }
      }
    }

    // Update grid layout for better spacing
    if (teamGrid) {
      if (showingAllTeam) {
        teamGrid.style.gap = "30px";
        teamGrid.classList.remove("compact");
      } else {
        teamGrid.style.gap = "15px";
        teamGrid.classList.add("compact");
      }
    }
  }

  // View All Team Button - FIXED
  if (viewAllTeamBtn) {
    viewAllTeamBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("🔄 View All button clicked");

      showingAllTeam = !showingAllTeam;
      initializeTeamDisplay();

      // Smooth scroll to maintain position when showing more
      if (showingAllTeam) {
        setTimeout(() => {
          const teamSection = document.querySelector("#team");
          if (teamSection) {
            teamSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      }
    });
  }

  // Team Tabs - FIXED
  if (teamTabs.length > 0) {
    teamTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        console.log(`📁 Tab clicked: ${tab.getAttribute("data-category")}`);

        // Update active tab
        teamTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Update current category
        currentCategory = tab.getAttribute("data-category");
        showingAllTeam = false; // Reset show all when changing categories

        // Reinitialize display
        initializeTeamDisplay();
      });
    });
  }

  // Initial setup
  initializeTeamDisplay();

  // Debug info
  console.log("✅ Team initialization complete");
  console.log(`📋 Total team members: ${teamMembers.length}`);
  console.log(`📂 Current category: ${currentCategory}`);

  // Count members by category
  const leadersCount = Array.from(teamMembers).filter(
    (m) => m.getAttribute("data-category") === "leaders"
  ).length;
  const advisorsCount = Array.from(teamMembers).filter(
    (m) => m.getAttribute("data-category") === "advisors"
  ).length;

  console.log(`👥 Leaders: ${leadersCount}, Advisors: ${advisorsCount}`);
}

// Partners Show More/Less - FIXED
function initializePartners() {
  const viewAllPartnersBtn = document.getElementById("viewAllPartnersBtn");
  const partnersGrid = document.querySelector(".partners-grid");
  const partnerLogos = document.querySelectorAll(".partner-logo");
  const hiddenPartners = document.querySelectorAll(".hidden-partner");

  if (viewAllPartnersBtn && partnersGrid && partnerLogos.length > 0) {
    let showingAllPartners = false;
    const maxInitial = 5;

    // Function to show specific number of partners - FIXED
    function showPartners(count) {
      partnerLogos.forEach((logo, index) => {
        if (index < count) {
          logo.style.display = "flex";
        } else {
          logo.style.display = "none";
        }
      });
    }

    // Initialize - show first 5 partners
    showPartners(maxInitial);

    viewAllPartnersBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!showingAllPartners) {
        // Show all partners
        showPartners(partnerLogos.length);
        partnersGrid.classList.add("show-all-partners");
        viewAllPartnersBtn.textContent = "Show Less";
        showingAllPartners = true;
      } else {
        // Show only first 5 partners
        showPartners(maxInitial);
        partnersGrid.classList.remove("show-all-partners");
        viewAllPartnersBtn.textContent = "View All Enactus Partners";
        showingAllPartners = false;

        // Scroll to partners section
        const partnersSection = document.querySelector("#partners");
        if (partnersSection) {
          const targetPosition = partnersSection.offsetTop - 70;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  }
}

// Smooth Scrolling for all anchor links - FIXED
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's not a valid section link
      if (targetId === "#" || targetId === "#!") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const targetPosition = targetElement.offsetTop - 70;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL
        history.pushState(null, null, targetId);
      }
    });
  });
}

// Error handling with better debugging
window.addEventListener("error", function (e) {
  console.error("Script error:", e.error);
  console.error("Error in file:", e.filename);
  console.error("Line number:", e.lineno);
});

// Enhanced Lazy Loading with Error Handling
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  // Fallback for browsers without IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    lazyImages.forEach((img) => {
      loadImage(img);
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    }
  );

  lazyImages.forEach((img) => {
    // Load images that are already in viewport immediately
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      loadImage(img);
    } else {
      imageObserver.observe(img);
    }
  });

  // Function to handle image loading with error fallback
  function loadImage(img) {
    // Check if image is already loaded or loading
    if (img.complete || img.dataset.loading === "true") return;

    img.dataset.loading = "true";

    const originalSrc = img.src;

    // Create a new image to test loading
    const testImage = new Image();

    testImage.onload = function () {
      img.src = originalSrc;
      img.classList.add("loaded");
      img.dataset.loading = "false";
    };

    testImage.onerror = function () {
      // If image fails to load, show placeholder and log error
      console.warn("Image failed to load:", originalSrc);
      img.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
      img.alt = "Image not available: " + img.alt;
      img.dataset.loading = "false";
    };

    testImage.src = originalSrc;
  }

  // Force load all images after 3 seconds as fallback
  setTimeout(() => {
    lazyImages.forEach((img) => {
      if (!img.complete && img.dataset.loading !== "true") {
        loadImage(img);
      }
    });
  }, 3000);
}
// Enhanced Breaking News with Animated Background
function initializeBreakingNews() {
  // Create dynamic particles
  createAnimatedBackground();
  
  // Update date and time
  function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    if (dateElement) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    if (timeElement) {
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    }
  }
  
  updateDateTime();
  setInterval(updateDateTime, 60000);
  
  // Initialize news functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const newsItems = document.querySelectorAll('.news-item');
  const prevBtn = document.querySelector('.ticker-btn.prev');
  const nextBtn = document.querySelector('.ticker-btn.next');
  const indicators = document.querySelectorAll('.ticker-indicator');
  
  let currentNewsId = 1;
  let autoSlideInterval;
  
  function showNewsItem(newsId) {
    // Remove active classes
    galleryItems.forEach(item => item.classList.remove('active'));
    newsItems.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active classes
    const selectedGalleryItem = document.querySelector(`.gallery-item[data-news-id="${newsId}"]`);
    const selectedNewsItem = document.querySelector(`.news-item[data-news-id="${newsId}"]`);
    const selectedIndicator = document.querySelector(`.ticker-indicator[data-news-id="${newsId}"]`);
    
    if (selectedGalleryItem) selectedGalleryItem.classList.add('active');
    if (selectedNewsItem) selectedNewsItem.classList.add('active');
    if (selectedIndicator) selectedIndicator.classList.add('active');
    
    currentNewsId = newsId;
  }
  
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      let newId = currentNewsId + 1;
      if (newId > 3) newId = 1;
      showNewsItem(newId);
    }, 8000);
  }
  
  // Event listeners
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const newsId = this.getAttribute('data-news-id');
      showNewsItem(parseInt(newsId));
      startAutoSlide();
    });
  });
  
  indicators.forEach(indicator => {
    indicator.addEventListener('click', function() {
      const newsId = this.getAttribute('data-news-id');
      showNewsItem(parseInt(newsId));
      startAutoSlide();
    });
  });
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      let newId = currentNewsId - 1;
      if (newId < 1) newId = 3;
      showNewsItem(newId);
      startAutoSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      let newId = currentNewsId + 1;
      if (newId > 3) newId = 1;
      showNewsItem(newId);
      startAutoSlide();
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      let newId = currentNewsId - 1;
      if (newId < 1) newId = 3;
      showNewsItem(newId);
      startAutoSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      let newId = currentNewsId + 1;
      if (newId > 3) newId = 1;
      showNewsItem(newId);
      startAutoSlide();
    }
  });
  
  // Initialize
  showNewsItem(1);
  startAutoSlide();
}

function createAnimatedBackground() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  
  // Create 50 floating particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(255, 204, 0, ${Math.random() * 0.1 + 0.05});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
      z-index: 1;
    `;
    container.appendChild(particle);
  }
  
  // Add CSS for particle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: ${Math.random() * 0.5 + 0.3};
      }
      25% {
        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
        opacity: ${Math.random() * 0.3 + 0.1};
      }
      50% {
        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
        opacity: ${Math.random() * 0.5 + 0.3};
      }
      75% {
        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
        opacity: ${Math.random() * 0.3 + 0.1};
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
        opacity: ${Math.random() * 0.5 + 0.3};
      }
    }
    
    .particle {
      will-change: transform, opacity;
      transform: translateZ(0);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .particle {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// Update initializeAllFeatures to include background animation
function initializeAllFeatures() {
  initializeNavigation();
  initializeBreakingNews();
  initializeProjects();
  initializeTeam();
  initializePartners();
  initializeSmoothScrolling();
}
// Add console log for debugging
console.log("Enactus Damanhour - JavaScript loaded successfully!");
