const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const companies = require("./routes/companies");
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });

connectDB();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// เพิ่มการตั้งค่า trust proxy
app.set("trust proxy", 1);

// แก้ไข limiter เพื่อ handle IP Address จาก proxy
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 นาที
  max: 1000, // จำกัดจำนวน requests ต่อ IP
  keyGenerator: (req) => {
    // ใช้ X-Forwarded-For หากมีค่า
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded ? forwarded.split(",")[0] : req.ip;
    console.log(`Rate Limit IP: ${ip}`); // Log IP เพื่อตรวจสอบ
    return ip;
  },
});

app.use(limiter);
app.use(hpp());
app.use(cookieParser());
app.use("/api/v1/companies", companies);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () =>
  console.log("Server running in", process.env.NODE_ENV, "on http://localhost:" + PORT)
);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "Job Interview Booking API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
