const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.static("views"));
app.set("view engine", "ejs"); // Set EJS as the view engine

const apiKey = "24d64906-30b8-4cf8-bb29-aa672b6bfbd5";
let lat = 43.25;
let lon = 76.92;

// Define a route to get weather information
app.get("/weather", async (req, res) => {
  let lat, lon;

  switch (req.query.city) {
    case "Astana":
      lat = 51.18;
      lon = 71.44;
      break;
    case "London":
      lat = 51.51;
      lon = -0.13;
      break;
    case "New York":
      lat = 40.71;
      lon = -74.01;
      break;
    case "Tokyo":
      lat = 35.68;
      lon = 139.76;
      break;
    case "Sydney":
      lat = -33.87;
      lon = 151.21;
      break;
    default:
      lat = 43.25;
      lon = 76.92;
      break;
  }

  const url = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Yandex-API-Key": apiKey,
      },
    });
    const fullCity = response.data.info.tzinfo.name;
    const temp = response.data.fact.temp;
    const condition = response.data.fact.condition;

    // Extract the city part after the slash
    const city = fullCity.split("/")[1] || fullCity;
    console.log(city); // Use the second part, or the fullCity if there is no slash

    const price = calculatePrice(city);
    console.log(price);

    const stars = parseInt(req.query.hotelRatingSelector);
    let total = 0;

    switch (total) {
      case "5":
        total += 10000;
        break;
      case "4":
        total += 8500;
        break;
      case "3":
        total += 6000;
        break;
      case "2":
        total += 3000;
        break;
      case "1":
        total += 1000;
        break;
      default:
        total += 100;
    }

    const adults = parseInt(req.query.adults) || 0;
    const kids = parseInt(req.query.kids) || 0;

    switch (condition) {
      case "showers":
        total -= 100;
        break;
      case "thunderstorm":
        total = 0;
        break;
      default:
        break;
    }

    const dateArrival = new Date(req.query.dateArrival);
    const dateDeparture = new Date(req.query.dateDeparture);
    const stayTime = (dateDeparture - dateArrival) / (1000 * 60 * 60 * 24); // Calculate stay time in days
    total += adults * price + (kids * price) / 2;
    total += parseInt(stayTime);

    const AllData = {
      city,
      temp,
      condition,
      price,
      adults,
      kids,
      total,
    };

    res.render("travel_agency.ejs", AllData); // Use res.render to render EJS templates
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function calculatePrice(city) {
  // Add your logic to determine prices for each city
  switch (city) {
    case "Astana":
      return 1000; // Example price for Astana
    case "London":
      return 1500; // Example price for London
    // Add cases for other cities...
    case "Sydney":
      return 3500; // Example price for London
    case "Tokyo":
      return 5000; // Example price for London
    default:
      return 1200; // Default price for unknown cities
  }
}

// Define a route for the homepage
app.get("/", (req, res) => {
  res.render("home");
});

// Define a route for the contacts page
app.get("/contacts", (req, res) => {
  res.render("contacts");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
