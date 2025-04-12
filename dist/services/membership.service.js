"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
const membership_database_1 = require("../database/membership.database");
class MembershipService {
    static async createMembership(data) {
        return membership_database_1.MembershipDatabase.create(data);
    }
    static async getAllMemberships() {
        return membership_database_1.MembershipDatabase.getAll();
    }
    static async getMembershipById(id) {
        return membership_database_1.MembershipDatabase.getById(id);
    }
    static async updateMembership(id, data) {
        return membership_database_1.MembershipDatabase.update(id, data);
    }
    static async deleteMembership(id) {
        return membership_database_1.MembershipDatabase.delete(id);
    }
}
exports.MembershipService = MembershipService;
