// Demonstrates a middleware that does NOT call next().
// Useful for things like: maintenance mode, feature flags, IP blocking, etc.
// If this middleware sends a response, Express stops here completely -
// it never reaches any route handler or middleware registered after it.

const MAINTENANCE_MODE = false; // flip this to true to test the block

const maintenanceMode = (req, res, next) => {
  if (MAINTENANCE_MODE) {
    // No next() call here - the chain stops dead.
    return res.status(503).json({ message: 'Snack Shop is under maintenance, try again later' });
  }

  next(); // only reached if maintenance mode is off
};

export default maintenanceMode;