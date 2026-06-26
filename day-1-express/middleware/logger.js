// Generic middleware - no method or path restriction.
// Runs on EVERY request.
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.originalUrl} - ${timestamp}`);
  next();
};

export default logger;