"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const trainee_routes_1 = __importDefault(require("./routes/trainee.routes"));
const memebership_routes_1 = __importDefault(require("./routes/memebership.routes"));
const trainer_routes_1 = __importDefault(require("./routes/trainer.routes"));
const traineemembership_routes_1 = __importDefault(require("./routes/traineemembership.routes"));
const communityPost_route_1 = __importDefault(require("./routes/communityPost.route"));
const gym_routes_1 = __importDefault(require("./routes/gym.routes"));
const gymBranch_routes_1 = __importDefault(require("./routes/gymBranch.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const passwordReset_routes_1 = __importDefault(require("./routes/passwordReset.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
// Example
app.use("/api/trainers", trainer_routes_1.default);
// Mount customer routes
app.use('/api/customers', customer_route_1.default);
app.use('/api/trainees', trainee_routes_1.default);
app.use("/api/memberships", memebership_routes_1.default);
app.use("/api/trainee-memberships", traineemembership_routes_1.default);
app.use("/api/community-post", communityPost_route_1.default);
app.use("/api/gym", gym_routes_1.default);
app.use("/api/gym-branch", gymBranch_routes_1.default);
app.use("/api/auth", user_routes_1.default);
app.use("/api/password", passwordReset_routes_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
