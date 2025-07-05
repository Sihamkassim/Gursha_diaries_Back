require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/model/usersModel");
const bcrypt = require("bcrypt");

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // Admin details
        const adminEmail = "admin@example.com";
        const adminPassword = "admin123";
        const adminUsername = "admin";
        const adminFullName = "Admin User";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        const admin = new User({
            email: adminEmail,
            password: hashedPassword,
            username: adminUsername,
            fullName: adminFullName,
            isAdmin: true
        });

        await admin.save();
        console.log("Admin user created successfully!");
        console.log("Admin credentials:");
        console.log("Email: ", adminEmail);
        console.log("Password: ", adminPassword);
        console.log("Username: ", adminUsername);

    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        mongoose.disconnect();
    }
}

// Run the script
createAdmin();
