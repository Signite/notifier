import { iContact, iNotifyGorup } from "../interfaces";

let _api_url = ""
if (import.meta.env.DEV) _api_url = "http://localhost:3000"
// else _api_url = "/notifier";
export const API_URL = _api_url;

export async function GetContactsRequest(): Promise<iContact[]> {
    try {
        const response = await fetch(`${API_URL}/api/contact`);
        if (response.status == 200) {
            const body = await response.json();
            return body;
        }
        return [];
    } catch (err) {
        console.log(err);
        return [];
    }
}

export async function AddContactRequest(contact: iContact): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/contact`,
            {
                method: "POST",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify(contact)
            });
        if (response.status == 201) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }

}

export async function SaveContactRequest(contact: iContact): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/contact`,
            {
                method: "PUT",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify(contact)
            });
        if (response.status == 201) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function DeleteContactRequest(contact: iContact): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/contact`,
            {
                method: "DELETE",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify(contact)
            });
        console.log(response);

        if (response.status == 200) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}



export async function GetNotifyGroupsRequest(): Promise<iNotifyGorup[]> {
    try {
        const response = await fetch(`${API_URL}/api/notifyGroup`)
        if (response.status == 200) {
            const body = await response.json();
            return body;
        }
        return [];
    } catch (err) {
        console.log(err);
        return [];
    }
}

export async function AddNotifyGroupsRequest(name: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/notifyGroup`,
            {
                method: "POST",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify({ name })
            });
        if (response.status == 201) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function DeleteNotifyGroupsRequest(name: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/notifyGroup`,
            {
                method: "DELETE",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify({ name })
            });
        if (response.status == 200) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function AddNotifyGroupMemberRequest(group: string, type: string, member: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/notifyGroup/member`,
            {
                method: "POST",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify({ group, type, member })
            });
        if (response.status == 201) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function RemoveNotifyGroupMemberRequest(group: string, type: string, member: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/notifyGroup/member`,
            {
                method: "DELETE",
                headers: [
                    ["content-type", "application/json; charset=utf-8"]
                ],
                body: JSON.stringify({ group, type, member })
            });
        if (response.status == 200) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}


