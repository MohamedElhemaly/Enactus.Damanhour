// script.js

// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Team Filtering
const teamTabs = document.querySelectorAll(".team-tab");
const teamMembers = document.querySelectorAll(".team-member");

teamTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Remove active class from all tabs
        teamTabs.forEach(t => t.classList.remove("active"));
        
        // Add active class to clicked tab
        tab.classList.add("active");
        
        const category = tab.getAttribute("data-category");
        
        // Show/hide team members based on category
        teamMembers.forEach(member => {
            if (category === "all" || member.getAttribute("data-category") === category) {
                member.style.display = "block";
            } else {
                member.style.display = "none";
            }
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Simple Animation on Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.about-item, .project-card, .event-card, .team-member').forEach(el => {
    observer.observe(el);
});