const mongoose = require("mongoose");

async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is missing in .env");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, {
        dbName: "user-management"
    });

    console.log(`✅ Connected to MongoDB Database: "${mongoose.connection.name}"`);
}

module.exports = { connectDB };
