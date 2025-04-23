import { Router } from "express";
import { CommunityPostController } from "../controllers/communityPost.controller";

const router = Router();

router.post("/", CommunityPostController.create);
router.get("/", CommunityPostController.getAll);
router.get("/:id", CommunityPostController.getById);
router.put("/:id", CommunityPostController.update);
router.delete("/:id", CommunityPostController.delete);

export default router;
