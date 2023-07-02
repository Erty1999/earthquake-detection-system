import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/", async (req, res, next) => {
  res.json({ message: "hello" });
});

router.get("/error", async (req, res, next) => {
  throw new Error(":(");
});

router.post("/login", function (req, res, next) {});


router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

export default router;
