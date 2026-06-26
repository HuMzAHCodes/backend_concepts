// This middleware will be mounted ONLY on '/snacks' routes (see server.js).
// It demonstrates ATTACHING DATA to req, which downstream route handlers
// can then read. This is exactly how real auth middleware works:
// e.g. auth middleware decodes a token and attaches req.user = {...}.

const snackTimer = (req, res, next) => {
  // Attach a custom property to the request object.
  // Any handler AFTER this middleware can now access req.requestStartTime.
  req.requestStartTime = Date.now();

  console.log('Snack route accessed - timer started');
  next(); // must still call next() - we're not stopping the chain, just enriching it
};

export default snackTimer;