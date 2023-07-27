import express from "express";
import { Router } from "express";



const router = Router();

router.get("/", async (req, res, next) => {
  res.json({ message: "easter egg" });
});



export default router;
