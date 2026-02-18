// routes/sse.routes.js
import express from "express";
import { sseHandler } from ".././utils/sse.js";

const sse_router = express.Router();

sse_router.get("/categories/stream", sseHandler);

export default sse_router;
