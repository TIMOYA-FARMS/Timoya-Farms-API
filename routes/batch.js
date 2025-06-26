import { Router } from "express";
import { addBatch, listBatches, getBatch, updateBatch, deleteBatch } from "../controllers/batch.js";

const batchRouter = Router();

// POST /api/batch - Log a new production/parboiling batch
batchRouter.post("/batch/add", addBatch);

// GET /api/batch - List batches, with optional filtering
batchRouter.get("/batch/view", listBatches);

// GET /api/batch/:id - Get a single batch by ID
batchRouter.get("/batch/view/:id", getBatch);

// PATCH /api/batch/:id - Update a batch
batchRouter.patch("/batch/update/:id", updateBatch);

// DELETE /api/batch/:id - Delete a batch
batchRouter.delete("/batch/delete/:id", deleteBatch);

export default batchRouter;
