// script.js - Complete Fixed Version

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

// Mobile Navigation - FIXED
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

    // Close menu when clicking on links
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
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

  // Update active navigation link - FIXED VERSION
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;
    let currentActive = null;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPos >= sectionTop - 50 &&
        scrollPos < sectionTop + sectionHeight - 50
      ) {
        currentActive = sectionId;
      }
    });

    // Remove active class from all links first
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to current section link
    if (currentActive) {
      const activeLink = document.querySelector(
        `.nav-link[href="#${currentActive}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  }

  // Smooth scrolling for navigation links - FIXED
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's not a section link
      if (targetId === "#" || !targetId.startsWith("#")) return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();

        // Close mobile menu if open
        if (navMenu.classList.contains("active")) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
          body.classList.remove("menu-open");
          hamburger.setAttribute("aria-expanded", "false");
        }

        const targetPosition = targetSection.offsetTop - 70;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });

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
}

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
function initializeTeam() {
  const viewAllTeamBtn = document.getElementById("viewAllTeamBtn");
  const teamGrid = document.querySelector(".team-grid");
  const teamTabs = document.querySelectorAll(".team-tab");
  const teamMembers = document.querySelectorAll(".team-member");
  const hiddenMembers = document.querySelectorAll(".hidden-member");

  let showingAllTeam = false;
  let currentCategory = "leaders";

  // Function to filter and display team members - FIXED
  function filterTeamMembers(category, showAll = false) {
    let visibleCount = 0;
    const maxInitial = 3;

    teamMembers.forEach((member) => {
      const memberCategory = member.getAttribute("data-category");
      const isHidden = member.classList.contains("hidden-member");
      const shouldShow =
        category === "all-members" || memberCategory === category;

      if (shouldShow) {
        if (showAll || visibleCount < maxInitial || !isHidden) {
          member.style.display = "block";
          visibleCount++;
        } else {
          member.style.display = "none";
        }
      } else {
        member.style.display = "none";
      }
    });

    return visibleCount;
  }

  // Initialize team display - FIXED
  function initializeTeamDisplay() {
    const visibleCount = filterTeamMembers(currentCategory, showingAllTeam);

    // Update button visibility and text
    if (viewAllTeamBtn) {
      if (currentCategory === "advisors") {
        viewAllTeamBtn.style.display = "none";
      } else {
        viewAllTeamBtn.style.display = "block";
        viewAllTeamBtn.textContent = showingAllTeam
          ? "Show Less"
          : currentCategory === "leaders"
          ? "View All Enactus Team Leaders"
          : "View All Enactus Team";
      }
    }

    // Update grid layout
    if (teamGrid) {
      teamGrid.classList.toggle("compact", currentCategory !== "all-members");
      teamGrid.classList.toggle("show-all-members", showingAllTeam);
    }
  }

  // View All Team Button - FIXED
  if (viewAllTeamBtn) {
    viewAllTeamBtn.addEventListener("click", (e) => {
      e.preventDefault();

      showingAllTeam = !showingAllTeam;
      initializeTeamDisplay();
    });
  }

  // Team Tabs - FIXED
  if (teamTabs.length > 0) {
    teamTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Update active tab
        teamTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Update current category
        currentCategory = tab.getAttribute("data-category");
        showingAllTeam = false;

        // Reinitialize display
        initializeTeamDisplay();
      });
    });
  }

  // Initial setup
  initializeTeamDisplay();
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

// Add console log for debugging
console.log("Enactus Damanhour - JavaScript loaded successfully!");
