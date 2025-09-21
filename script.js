// Wait for the DOM to fully load before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("Delicious Recipes website loaded successfully!");
    
    // ===== MOBILE MENU TOGGLE =====
    const menuButton = document.querySelector('.menu');
    const navList = document.querySelector('.nav-list');
    
    menuButton.addEventListener('click', function() {
        if (navList.style.display === 'flex') {
            navList.style.display = 'none';
            menuButton.innerHTML = '&#9776;'; // Hamburger icon
        } else {
            navList.style.display = 'flex';
            navList.style.flexDirection = 'column';
            navList.style.position = 'absolute';
            navList.style.top = '60px';
            navList.style.right = '0';
            navList.style.backgroundColor = '#277797';
            navList.style.padding = '20px';
            navList.style.width = '200px';
            navList.style.borderRadius = '0 0 0 10px';
            navList.style.zIndex = '1000';
            menuButton.innerHTML = '✕'; // Close icon
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && !e.target.closest('.menu') && window.innerWidth < 768) {
            navList.style.display = 'none';
            menuButton.innerHTML = '&#9776;';
        }
    });

// login button
    // Get elements with correct IDs
    const loginBtn = document.getElementById("loginBtn");
    const loginForm = document.getElementById("loginForm");
    const closeBtn = document.getElementById("closeBtn");
    const submitBtn = document.getElementById("submitBtn");

    // Open login form
    loginBtn.addEventListener("click", function() {
        loginForm.style.display = "block";
    });

    // Close login form
    closeBtn.addEventListener("click", function() {
        loginForm.style.display = "none";
    });

    // Handle form submission
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent form submission
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        // Basic validation
        if (username && password) {
            alert("Login successful!");
            loginForm.style.display = "none";
        } else {
            alert("Please enter both username and password");
        }
    });

    // Close form when clicking outside
    document.addEventListener("click", function(e) {
        if (e.target !== loginBtn && 
            e.target !== loginForm && 
            !loginForm.contains(e.target)) {
            loginForm.style.display = "none";
        }
    });


    // ===== SEARCH FUNCTIONALITY =====
    const searchForm = document.querySelector('.searchbox');
    const searchInput = searchForm.querySelector('input');
    let isSearchActive = false;

    // Create search results indicator
    const searchIndicator = document.createElement('div');
    searchIndicator.id = 'search-results-indicator';
    searchIndicator.style.display = 'none';
    document.querySelector('.recipes').insertBefore(searchIndicator, document.querySelector('.recipesection'));

    // Clear placeholder text when user focuses on search
    searchInput.addEventListener('focus', function() {
        if (this.value === 'Search Recipe') {
            this.value = '';
        }
    });

    // Restore placeholder if empty when user leaves search
    searchInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = 'Search Recipe';
            showAllRecipes();
            searchIndicator.style.display = 'none';
            isSearchActive = false;
        }
    });

    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from actually submitting
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // If search is empty, show all recipes
        if (searchTerm === '' || searchTerm === 'search recipe') {
            showAllRecipes();
            searchIndicator.style.display = 'none';
            isSearchActive = false;
            return;
        }
        
        performSearch(searchTerm);
    });

    // Function to perform search
    function performSearch(searchTerm) {
        const recipeCards = document.querySelectorAll('.recipe-card');
        let foundResults = false;
        let resultCount = 0;
        
        recipeCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                foundResults = true;
                resultCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        isSearchActive = true;
        
        // Update search indicator
        if (foundResults) {
            searchIndicator.textContent = `Showing ${resultCount} results for "${searchTerm}"`;
            searchIndicator.style.display = 'block';
        } else {
            searchIndicator.textContent = `No recipes found for "${searchTerm}". Showing all recipes.`;
            searchIndicator.style.display = 'block';
            showAllRecipes();
            isSearchActive = false;
            
            // Hide the indicator after 3 seconds
            setTimeout(() => {
                searchIndicator.style.display = 'none';
            }, 3000);
        }
    }

    // Function to show all recipes
    function showAllRecipes() {
        const recipeCards = document.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            card.style.display = 'block';
        });
    }

    // Add a clear search button
    function addClearSearchButton() {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.id = 'clear-search-btn';
        
        clearButton.addEventListener('click', function() {
            searchInput.value = 'Search Recipe';
            showAllRecipes();
            searchIndicator.style.display = 'none';
            isSearchActive = false;
        });
        
        searchForm.appendChild(clearButton);
    }
    
    addClearSearchButton();

    // ===== RECIPE CARD INTERACTIONS =====
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        // Add click event to view recipe links
        const viewRecipeLink = card.querySelector('a');
        viewRecipeLink.addEventListener('click', function(e) {
            e.preventDefault();
            const recipeTitle = card.querySelector('h2').textContent;
            alert(`Recipe details for "${recipeTitle}" would open here! In a real website, this would show the full recipe.`);
        });
    });

    // ===== FAVORITES FUNCTIONALITY =====
    let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
    
    // Add heart icon to each recipe card
    recipeCards.forEach(card => {
        const heart = document.createElement('div');
        heart.classList.add('favorite-heart');
        heart.innerHTML = '🤍';
        
        // Position the card relatively so the heart is positioned correctly
        card.style.position = 'relative';
        card.appendChild(heart);
        
        // Check if this recipe is already favorited
        const recipeTitle = card.querySelector('h2').textContent;
        if (favorites.includes(recipeTitle)) {
            heart.innerHTML = '❤️';
            heart.classList.add('favorited');
        }
        
        // Toggle favorite on click
        heart.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering card click event
            
            const index = favorites.indexOf(recipeTitle);
            
            if (index === -1) {
                // Add to favorites
                favorites.push(recipeTitle);
                this.innerHTML = '❤️';
                this.classList.add('favorited');
                showNotification('Added to favorites!');
            } else {
                // Remove from favorites
                favorites.splice(index, 1);
                this.innerHTML = '🤍';
                this.classList.remove('favorited');
                showNotification('Removed from favorites!');
            }
            
            // Save to localStorage
            localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
        });
    });
    
/*---------done--------*/

    // Notification function
    function showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // ===== SMOOTH SCROLLING FOR NAVIGATION =====
    const navItems = document.querySelectorAll('.nav-list li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.textContent.toLowerCase();
            
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (sectionId === 'recipes') {
                document.querySelector('.recipes').scrollIntoView({ behavior: 'smooth' });
            } else if (sectionId === 'about') {
                // For demonstration - would scroll to about section if it existed
                showNotification('About section is coming soon!');
            } else if (sectionId === 'contact') {
                // For demonstration - would scroll to contact section if it existed
                showNotification('Contact section is coming soon!');
            }
            
            // Close mobile menu after clicking
            if (window.innerWidth < 768) {
                navList.style.display = 'none';
                menuButton.innerHTML = '&#9776;';
            }
        });
    });

    // ===== DYNAMIC FOOTER =====
    const footer = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `&copy; ${currentYear} Delicious Recipes. All rights reserved.`;

    // ===== LAZY LOADING FOR IMAGES =====
    const lazyImages = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});