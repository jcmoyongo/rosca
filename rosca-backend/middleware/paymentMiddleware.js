// middlewares/paymentsMiddleware.js
module.exports = function paymentMiddleware(req, res, next) {
  try {
    const { userId, groupId, amount, method } = req.body;

    // Basic validation
    if (!userId || !groupId || !amount || !method) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // TODO: later add checks:
    // - Does the group exist?
    // - Is the user part of this group?
    // - Is amount correct (pot total / members)?
    // - Has this user already contributed for this interval?

    // Right now just log the payment attempt
    console.log(`Payment request: user ${userId}, group ${groupId}, amount ${amount}, via ${method}`);

    // Attach payment info to request for controller
    req.paymentInfo = { userId, groupId, amount, method };

    // Continue to controller
    next();
  } catch (err) {
    console.error("Payment middleware error:", err);
    res.status(500).json({ message: "Payment processing error" });
  }
};
