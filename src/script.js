let weather = {
  apiKey: "67b92f0af5416edbfe58458f502b0a31",

  // Fetch weather data for a given city
  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found for the specified city.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  },

  // Display weather info on the page
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    // Display weather data on the main card
    document.querySelector(".city").innerText = `Weather in ${name}`;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = `${temp}°C`;
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;

    // Save search data and update recent searches
    this.saveRecentSearch(name, temp, description, humidity, speed, icon);
    this.renderRecentSearches();
  },

  // Save a city's weather data to localStorage (for recent searches)
  saveRecentSearch: function (city, temp, description, humidity, windSpeed, icon) {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentSearches.push({ city, temp, description, humidity, windSpeed, icon });

    // Limit the number of recent searches to 7
    if (recentSearches.length > 7) {
      recentSearches.shift(); // Remove the oldest search
    }

    // Save updated recent searches list to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  },

  // Render the recent searches as cards on the page
  renderRecentSearches: function () {
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const recentSearchesContainer = document.querySelector(".recent-searches");

    // Clear existing recent search cards
    recentSearchesContainer.innerHTML = '';

    // Generate a card for each recent search
    recentSearches.forEach((search) => {
      if (!search.city || !search.temp || !search.description || !search.humidity || !search.windSpeed) {
        return;
      }

      const card = document.createElement("div");
      card.classList.add("card", "recent-card");
      card.innerHTML = `
        <h2 class="recent-city">Weather in ${search.city}</h2>
        <h3 class="temp">${search.temp}°C</h3>
        <img src="https://openweathermap.org/img/wn/${search.icon}.png" alt="${search.description}" class="icon">
        <p class="description">${search.description}</p>
        <p class="humidity">Humidity: ${search.humidity}%</p>
        <p class="wind">Wind speed: ${search.windSpeed} km/h</p>
      `;
      recentSearchesContainer.appendChild(card);
    });
  },

  // Clear all recent searches from localStorage and remove cards from the page
  clearRecentSearches: function () {
    localStorage.removeItem("recentSearches");
    this.renderRecentSearches(); // Re-render (empty the recent searches)
  },

  // Trigger weather search from the input field
  search: function () {
    const searchBarValue = document.querySelector(".search-bar").value.trim();
    if (searchBarValue) {
      this.fetchWeather(searchBarValue);
    } else {
      alert("Please enter a city name.");
    }
  },
};

// Event listeners for search functionality
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

// Event listener for the "Delete All" button
document.querySelector(".delete-all-btn").addEventListener("click", function () {
  weather.clearRecentSearches();
});

// Fetch initial weather data for "Delhi" and save it to recent searches
weather.fetchWeather("Delhi");
