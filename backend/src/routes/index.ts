import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
  res.json({ message: "hello" });
});

router.get("/error", async (req, res, next) => {
  throw new Error(":(");
});

export default router;
