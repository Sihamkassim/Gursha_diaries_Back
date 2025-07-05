const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { identifier } = require("../middlewares/identification");

// Helper function to wrap async middleware
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

router.post("/signup", asyncMiddleware(authController.signup));
router.post("/signin", asyncMiddleware(authController.signin));
router.post("/signout", asyncMiddleware(authController.signout));

router.patch(
  "/send-verification-email",
  asyncMiddleware(authController.sendVerificationCode)
);
router.patch(
  "/verify-verification-email",
  asyncMiddleware(authController.verifyVerificationCode)
);
router.patch(
  "/change-password",
  identifier,
  asyncMiddleware(authController.changePassword)
);
router.get(
  "/send-forgot-password-code",
  asyncMiddleware(authController.sendForgotPasswordCode)
);
router.patch(
  "/verify-forgot-password-code",
  asyncMiddleware(authController.verifyForgotPasswordCode)
);

module.exports = router;
