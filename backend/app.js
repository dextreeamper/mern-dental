const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const dentistsRoutes = require("./routes/dentists-routes");
const appointmentsRoutes = require("./routes/appointments-routes");
const HttpError = require("./models/http-error");
const cors = require("cors");

const app = express();

app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:9000",
//     credentials: true,
//   })
// );

app.use(bodyParser.json());
app.use("/api/users", usersRoutes);
app.use("/api/dentists", dentistsRoutes);
app.use("/api/appointments", appointmentsRoutes);

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2kjffui.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });
