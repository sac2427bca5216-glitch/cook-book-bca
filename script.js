document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the navigation links for smooth scrolling
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).scrollIntoView({
                behavior: 'smooth'
            });

            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to clicked link
            this.classList.add('active');
        });
    });


    
    // Function to toggle recipe details on button click
    function toggleRecipeDetails(mealItem) {
        const mealDetailsContent = mealItem.querySelector('.meal-details-content');
        const isOpen = mealDetailsContent.style.display === 'block';

        // Toggle display of recipe details
        mealDetailsContent.style.display = isOpen ? 'none' : 'block';
        mealItem.style.backgroundColor = isOpen ? '#444' : '#ff9800'; // Change background color accordingly

        // Fetch recipe details if not fetched already
        if (!isOpen) {
            const mealId = mealItem.getAttribute('data-id');
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
                .then(response => response.json())
                .then(data => {
                    const meal = data.meals[0];
                    const recipeContent = mealItem.querySelector('.recipe-content');
                    recipeContent.innerHTML = `
                        <h2 class="recipe-title">${meal.strMeal}</h2>
                        <p class="recipe-category">${meal.strCategory}</p>
                        <div class="recipe-instruct">
                            <h3>Instructions:</h3>
                            <p>${meal.strInstructions}</p>
                        </div>
                        <div class="recipe-meal-img">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="recipe-link">
                            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
                        </div>
                    `;
                })
                .catch(error => console.error('Error fetching recipe details:', error));
        }
    }

    // Event delegation for "Get Recipe" button
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('recipe-btn')) {
            const mealItem = e.target.closest('.meal-item');
            toggleRecipeDetails(mealItem);
        }
    });

    // Function to get meal list based on search input
    function getMealList() {
        let searchInputTxt = document.getElementById('search-input').value.trim();
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
            .then(response => response.json())
            .then(data => {
                let html = "";
                const mealList = document.getElementById('meal');
                if (data.meals) {
                    data.meals.forEach(meal => {
                        html += `
                            <div class="meal-item" data-id="${meal.idMeal}">
                                <div class="meal-img">
                                    <img src="${meal.strMealThumb}" alt="food">
                                </div>
                                <div class="meal-name">
                                    <h3>${meal.strMeal}</h3>
                                    <button class="recipe-btn">Get Recipe</button>
                                </div>
                                <div class="meal-details-content" style="display: none;">
                                    <div class="recipe-content"></div>
                                </div>
                            </div>
                        `;
                    });
                    mealList.classList.remove('notFound');
                } else {
                    html = "Sorry, we didn't find any meal!";
                    mealList.classList.add('notFound');
                }

                mealList.innerHTML = html;
            })
            .catch(error => console.error('Error fetching meal list:', error));
    }

    // Function to close recipe modal
    const recipeCloseBtn = document.getElementById('recipe-close-btn');
    recipeCloseBtn.addEventListener('click', () => {
        document.querySelectorAll('.meal-details-content').forEach(content => {
            content.style.display = 'none';
            content.closest('.meal-item').style.backgroundColor = '#444'; // Revert background color to default
        });
    });

    // Function to change input text color to black
    function changeInputTextColor() {
        const searchInput = document.getElementById('search-input');
        searchInput.style.color = '#000'; // Change font color to black
    }

    // Add event listener to input for changing text color
    document.getElementById('search-input').addEventListener('input', changeInputTextColor);

    // Add event listener to the search button
    document.getElementById('search-btn').addEventListener('click', getMealList);
});
