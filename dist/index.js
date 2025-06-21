import express from "express";
const app = express();
const PORT = 8080;
// Middleware to log non-OK responses
const middlewareLogResponses = (req, res, next) => {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
};
// Apply the middleware at the application level
app.use(middlewareLogResponses);
// Add readiness endpoint
const handlerReadiness = (req, res) => {
    // Set the Content-Type header
    res.set('Content-Type', 'text/plain; charset=utf-8');
    // Send the body text. Express automatically set status 200
    res.send("OK");
};
// Register the handler for the /healthz path
app.get("/healthz", handlerReadiness);
// Update the Static Files Path
app.use("/app", express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
