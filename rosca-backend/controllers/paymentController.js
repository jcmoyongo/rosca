// controllers/paymentController.js
exports.submitContribution = async (req, res) => {
  try {
    const { userId, groupId, amount, method } = req.paymentInfo;

    // For now: pretend payment succeeded
    // Later: call Stripe/PayPal/Zelle API etc.
    console.log(`✅ Payment processed for user ${userId} to group ${groupId}, amount: ${amount}, via ${method}`);

    // TODO: update DB with contribution record
    return res.json({
      message: "Contribution received (mock)",
      data: { userId, groupId, amount, method },
    });
  } catch (err) {
    console.error("Payment error:", err);
    return res.status(500).json({ message: "Payment failed" });
  }
};
