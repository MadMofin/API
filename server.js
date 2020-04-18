const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

//Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

//Connection to DB
connectDB();


//RouteFiles
const hospitals = require("./routes/hospitals");
const specialties = require("./routes/specialties");
const doctors = require("./routes/doctors");
const users = require("./routes/users");
const auth = require("./routes/auth");
const consults = require("./routes/consults");

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS Attacks
app.use(xss());

// Rate Limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Prevent HTTP params pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//Sanitize Data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS Attacks
app.use(xss());

app.use(limiter);

//Prevent HTTP params pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount Routes
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/specialties", specialties);
app.use("/api/v1/doctors", doctors);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/consults", consults);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan
  );
});

// Handle unhandled promises rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.yellow);
  //Close server and exit process
  server.close(() => process.exit(1));
});