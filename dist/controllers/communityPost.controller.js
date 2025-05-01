"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPostController = void 0;
const communityPost_service_1 = require("../services/communityPost.service");
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class CommunityPostController {
}
exports.CommunityPostController = CommunityPostController;
_a = CommunityPostController;
CommunityPostController.create = async (req, res) => {
    try {
        const post = await communityPost_service_1.CommunityPostService.create(req.body);
        res.status(201).json(post);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
CommunityPostController.getAll = async (req, res) => {
    try {
        const posts = await communityPost_service_1.CommunityPostService.getAll();
        res.json(posts);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
CommunityPostController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await communityPost_service_1.CommunityPostService.getById(id);
        if (!post) {
            res.status(404).json({
                message: "Community post not found",
                code: "COMMUNITY_POST_NOT_FOUND"
            });
            return;
        }
        res.json(post);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
CommunityPostController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const post = await communityPost_service_1.CommunityPostService.update(id, data);
        res.json(post);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
CommunityPostController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await communityPost_service_1.CommunityPostService.delete(id);
        res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
