// script.js

// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    })
  );
}

// Projects Show More/Less
const viewAllBtn = document.getElementById("viewAllBtn");
const projectsGrid = document.querySelector(".projects-grid");
let showingAll = false;

if (viewAllBtn && projectsGrid) {
  viewAllBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!showingAll) {
      // Show all projects
      projectsGrid.classList.add("show-all");
      viewAllBtn.textContent = "Show Less";
      showingAll = true;
    } else {
      // Show only 3 projects
      projectsGrid.classList.remove("show-all");
      viewAllBtn.textContent = "View All Projects";
      showingAll = false;
    }
  });
}

// Team Show More/Less
const viewAllTeamBtn = document.getElementById("viewAllTeamBtn");
const teamGrid = document.querySelector(".team-grid");
const teamTabs = document.querySelectorAll(".team-tab");
const teamMembers = document.querySelectorAll(".team-member");
let showingAllTeam = false;

// Function to show only first 3 members
function showFirstThreeMembers(category) {
  let count = 0;
  teamMembers.forEach((member) => {
    if (
      (category === "all-members" ||
        member.getAttribute("data-category") === category) &&
      count < 3
    ) {
      member.style.display = "block";
      count++;
    } else {
      member.style.display = "none";
    }
  });
}

// Function to show all members
function showAllMembers(category) {
  teamMembers.forEach((member) => {
    if (
      category === "all-members" ||
      member.getAttribute("data-category") === category
    ) {
      member.style.display = "block";
    } else {
      member.style.display = "none";
    }
  });
}

if (viewAllTeamBtn && teamGrid) {
  viewAllTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const activeTab = document.querySelector(".team-tab.active");
    const category = activeTab.getAttribute("data-category");

    if (!showingAllTeam) {
      // Show all team members
      showAllMembers(category);
      teamGrid.classList.add("show-all-members");
      viewAllTeamBtn.textContent = "Show Less";
      showingAllTeam = true;
    } else {
      // Show only first 3 members
      showFirstThreeMembers(category);
      teamGrid.classList.remove("show-all-members");
      viewAllTeamBtn.textContent = "View All Team";
      showingAllTeam = false;
    }
  });
}

// Team Filtering
if (teamTabs.length > 0) {
  teamTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      teamTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      const category = tab.getAttribute("data-category");

      // Reset view all state when switching tabs
      if (teamGrid) {
        teamGrid.classList.remove("show-all-members");
      }
      if (viewAllTeamBtn) {
        showingAllTeam = false;

        // Update button text based on category
        if (category === "leaders") {
          viewAllTeamBtn.textContent = "View All Team Leaders";
          viewAllTeamBtn.style.display = "block";
        } else if (category === "all-members") {
          viewAllTeamBtn.textContent = "View All Team";
          viewAllTeamBtn.style.display = "block";
        } else if (category === "advisors") {
          viewAllTeamBtn.style.display = "none";
        }
      }

      // Add compact class when filtering
      if (teamGrid) {
        if (
          category === "leaders" ||
          category === "all-members" ||
          category === "advisors"
        ) {
          teamGrid.classList.add("compact");
        } else {
          teamGrid.classList.remove("compact");
        }
      }

      // Show only first 3 members when switching tabs
      showFirstThreeMembers(category);
    });
  });
}

// Partners Show More/Less
const viewAllPartnersBtn = document.getElementById("viewAllPartnersBtn");
const partnersGrid = document.querySelector(".partners-grid");
let showingAllPartners = false;

if (viewAllPartnersBtn && partnersGrid) {
  viewAllPartnersBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!showingAllPartners) {
      // Show all partners
      partnersGrid.classList.add("show-all-partners");
      viewAllPartnersBtn.textContent = "Show Less";
      showingAllPartners = true;
    } else {
      // Show only first 6 partners
      partnersGrid.classList.remove("show-all-partners");
      viewAllPartnersBtn.textContent = "View All Partners";
      showingAllPartners = false;
    }
  });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Simple Animation on Scroll
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".about-item, .project-card, .event-card, .team-member")
  .forEach((el) => {
    observer.observe(el);
  });

// Initialize - Show first 3 team leaders on page load
document.addEventListener("DOMContentLoaded", function () {
  showFirstThreeMembers("leaders");
});
