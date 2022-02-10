const colors = require("colors");
const path = require("path");
const http = require("http");
const express = require("express");
const { notFound, errorHandler } = require("./middleware/error");
const connectDB = require("./db");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRouter = require("./routes/auth");

const { json, urlencoded } = express;

// socket connection
const { appSocket } = require("./socket");

connectDB();
const app = express();
const server = http.createServer(app);

// initialized socket
appSocket(server);

if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
}
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/auth", authRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname), "client", "build", "index.html")
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running");
    });
}

app.use(notFound);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = { app, server };