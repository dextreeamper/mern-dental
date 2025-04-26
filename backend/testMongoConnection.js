const mongoose = require("mongoose");

const uri =
  "mongodb+srv://dexter:rhB0LjA5bf9OEmQY@cluster0.2kjffui.mongodb.net/dental?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas successfully!");
    mongoose.disconnect(); // Close after testing
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB Atlas:", err.message);
  });
