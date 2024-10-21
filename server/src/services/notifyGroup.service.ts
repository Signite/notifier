import JsonDb from "../utils/json.db";

export interface iNotifyGorup {
    name: string
    email: string[]
    telegram: string[]
}

export default class NotifyGroupService {

    static async GetGroup(): Promise<iNotifyGorup[]> {
        const contacts = await JsonDb.GetNotifyGroup();
        return contacts;
    }

    static async CreateGroup(group: string) {
        const result = await JsonDb.CreateNotifyGroup(group);
        if (result) {
            return true;
        }
        return false;
    }

    static async DeleteGroup(group: string) {
        const result = await JsonDb.DeleteNofityGroup(group);
        if (result) {
            return true;
        }
        return false;
    }

    static async AddNotifyGroupMember(group: string, type: "email" | "telegram", member: string) {
        const result = await JsonDb.AddNotifyGroupMember(group, type, member);
        if (result) {
            return true;
        }
        return false;
    }

    static async RemoveNotifyGroupMember(group: string, type: "email" | "telegram", member: string) {
        const result = await JsonDb.RemoveNotifyGroupMember(group, type, member);
        if (result) {
            return true;
        }
        return false;
    }
}