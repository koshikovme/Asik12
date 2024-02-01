// const express = require("express");
// const axios = require("axios");
// const app = express();
// const port = 3000;

// app.use(express.static("views"));

// const apiKey = "24d64906-30b8-4cf8-bb29-aa672b6bfbd5";
// let lat = 43.25;
// let lon = 76.92;

// // Define a route to get weather information
// app.get("/weather", async (req, res) => {
//   let lat, lon;

//   switch (req.query.city) {
//     case "Astana":
//       lat = 51.18;
//       lon = 71.44;
//       break;
//     case "London":
//       lat = 51.51;
//       lon = -0.13;
//       break;
//     case "New York":
//       lat = 40.71;
//       lon = -74.01;
//       break;
//     case "Tokyo":
//       lat = 35.68;
//       lon = 139.76;
//       break;
//     case "Sydney":
//       lat = -33.87;
//       lon = 151.21;
//       break;
//     default:
//       lat = 43.25;
//       lon = 76.92;
//       break;
//   }

//   const url = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "X-Yandex-API-Key": apiKey,
//       },
//     });

//     const weatherData = {
//       city: response.data.info.tzinfo.name,
//       temp: response.data.fact.temp,
//       condition: response.data.fact.condition,
//     };

//     res.sendFile("travel_agency.ejs", { root: "./views" });
//   } catch (error) {
//     console.error("Error fetching weather data:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Define a route for the homepage
// app.get("/", (req, res) => {
//   res.sendFile("home.ejs", { root: "./views" });
// });

// // Define a route for the contacts page
// app.get("/contacts", (req, res) => {
//   res.sendFile("contacts.ejs", { root: "./views" });
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const axios = require("axios");
app.use(express.static("public"));
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");

const apiKey = "24d64906-30b8-4cf8-bb29-aa672b6bfbd5";
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/travelagency", (req, res) => {
  const filePath = path.join(__dirname, "../public/html", "travelagency.html");
  res.sendFile(filePath);
});

router.post("/submitForm", (req, res) => {
  const adults = req.body.adults;
  const children = req.body.children;
  const phone = req.body.phone;
  const hotelRating = req.body.hotelRating;
  const dateArrival = req.body.dateArrival;
  const dateDeparture = req.body.dateDeparture;
  const cityName = req.body.cityName;
  var lat = 0;
  var lon = 0;
  switch (cityName) {
    case "Kyoto":
      lat = 35.01;
      lon = 135.76;
      price = 1000;
      break;
    case "Rome":
      lat = 41.89;
      lon = 12.48;
      price = 1500;
      break;
    case "Sydney":
      lat = -33.87;
      lon = 151.21;
      price = 1700;
      break;
    case "Rio de Janeiro":
      lat = -22.9;
      lon = -43.21;
      price = 800;
      break;
    case "Bangkok":
      lat = 13.75;
      lon = 100.5;
      price = 1100;
      break;
    case "Antalia":
      lat = 36.9;
      lon = 30.7;
      price = 700;
      break;
    default:
      lat = 55.75;
      lon = 37.62;
      price = 500;
      break;
  }
  switch (hotelRating) {
    case "5":
      price += 500;
      break;
    case "4":
      price += 400;
      break;
    case "3":
      price += 300;
      break;
    case "2":
      price += 200;
      break;
    case "1":
      price += 100;
      break;
    default:
      price += 100;
      break;
  }
  price *= adults;
  if (children > 0) {
    for (let i = 0; i < children; i++) {
      price += 200;
    }
  }
  if (temp < 10) {
    price += 200;
  }
  url = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}`;
  var temp;
  var condition;
  axios
    .get(url, {
      headers: {
        "X-Yandex-API-Key": apiKey,
      },
    })
    .then((response) => {
      temp = response.data.fact.temp;
      condition = response.data.fact.condition;
      switch (condition) {
        case "showers":
          price -= 100;
          break;
        case "thunderstorm":
          price = 0;
          break;
        default:
          break;
      }

      if (price == 0) {
        const filePath = path.join(
          __dirname,
          "../public/html",
          "flightCanceled.html"
        );
        res.sendFile(filePath);
      } else {
        res.render("result", {
          cityName,
          adults,
          children,
          phone,
          hotelRating,
          dateArrival,
          dateDeparture,
          price,
          temp,
          condition,
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
