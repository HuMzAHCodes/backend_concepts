import express from 'express';
import snackRoutes from './snackRoutes.js';
import logger from './middleware/logger.js';
import snackTimer from './middleware/snackTimer.js';
import maintenanceMode from './middleware/maintenanceMode.js';

const app = express();
const PORT = 3000;

// ───────────────────────────────────────────────
// ORDER MATTERS - top to bottom, exactly as registered.
// ───────────────────────────────────────────────

// 1. Global - runs on literally every request, no matter what.
app.use(logger);

// 2. Global - blocks EVERYTHING if maintenance mode is on.
//    Placed early so it can stop requests before any real work happens.
app.use(maintenanceMode);

// 3. Body parser - must come before any route reading req.body.
app.use(express.json());

// 4. PATH-SPECIFIC middleware - only runs for requests starting with '/snacks'.
//    This is "method: any, path: /snacks" - the middle ground between
//    app.use(fn) (every path) and app.get('/snacks', fn) (one exact route).
app.use('/snacks', snackTimer);

// 5. Routes - by the time we get here, req already has requestStartTime
//    attached (from snackTimer), and we know maintenance mode didn't block us.
app.use('/snacks', snackRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Snack Shop API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});












// ════════════════════════════════════════════════════════════
// MIDDLEWARE vs ROUTES - what's actually different?
// ════════════════════════════════════════════════════════════
//
// Syntactically, they look nearly identical - both are functions
// that take (req, res, next) or (req, res). The difference is
// about ROLE and WHETHER THEY END THE REQUEST.
//
// ── ROUTES (the destination) ──────────────────────────────────
// A route is a function tied to ONE specific method + path combo.
// Its job is to actually FINISH the request - it calls res.send(),
// res.json(), etc., and the request-response cycle ends there.
//
// Example from our code: app.get('/', (req, res) => { ... })
//   - Matches ONLY: method = GET, path = '/'
//   - res.send(...) sends the response and the journey is OVER.
//   - It does NOT call next() because there's nothing left to do -
//     it IS the final destination.
//
// Same idea in snackRoutes.js: router.post('/', (req, res) => {...})
//   - Matches ONLY: method = POST, path = '/snacks' (after mounting)
//   - Sends a response, ends the cycle. This is a route, not middleware.
//
// ── MIDDLEWARE (the checkpoints along the way) ─────────────────
// Middleware sits BETWEEN the incoming request and the final route.
// Its job is to inspect, modify, log, validate, or block - and then
// either pass control forward with next(), or stop everything by
// sending a response itself.
//
// Example from our code: logger (middleware/logger.js)
//   - Matches: EVERY method, EVERY path (app.use(logger))
//   - Does NOT send a response. Just logs, then calls next()
//     to hand off control to whatever comes next in line.
//
// Example: snackTimer (middleware/snackTimer.js)
//   - Matches: EVERY method, but ONLY paths starting with '/snacks'
//   - Attaches data to req (req.requestStartTime) and calls next()
//     - it's enriching the request, not finishing it.
//
// Example: maintenanceMode (middleware/maintenanceMode.js)
//   - This one is interesting: it's middleware, but it CAN act like
//     a route ending - if MAINTENANCE_MODE is true, it calls
//     res.status(503).json(...) and does NOT call next(). The chain
//     dies right there, just like a route would end it.
//
// ── THE CORE DISTINCTION ─────────────────────────────────────
// It's NOT really about the function signature (both can take
// req, res, next). It's about INTENT and POSITION:
//
//   - A route is the "final stop" - registered with app.get/post/etc,
//     tied to one exact method+path, and normally ends the cycle.
//
//   - Middleware is a "checkpoint" - usually registered with app.use,
//     can apply broadly (all paths) or narrowly (one path prefix),
//     and is expected to call next() UNLESS it deliberately wants
//     to short-circuit (like maintenanceMode does).
//
// Proof this is really one mechanism, not two: technically you could
// write app.get('/snacks', snackTimer, (req, res) => {...}) - stacking
// snackTimer as "middleware" directly inside a route definition. Express
// doesn't care about the label "middleware" vs "route" internally -
// it just runs functions in a chain until one of them sends a response.