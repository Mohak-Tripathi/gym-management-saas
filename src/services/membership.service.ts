import { MembershipDatabase } from "../database/membership.database";

export class MembershipService {
  static async createMembership(data:any) {
    return MembershipDatabase.create(data);
  }

  static async getAllMemberships() {
    return MembershipDatabase.getAll();
  }

  static async getMembershipById(id: string) {
    return MembershipDatabase.getById(id);
  }

  static async updateMembership(id: string, data:unknown) {
    return MembershipDatabase.update(id, data);
  }

  static async deleteMembership(id: string) {
    return MembershipDatabase.delete(id);
  }
}
