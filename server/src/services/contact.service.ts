import JsonDb from "../utils/json.db";

export interface iContact {
    name: string,
    email: string,
    telegramId: string
}

class ContactService {


    static async GetContact(): Promise<iContact[]> {
        const contacts = await JsonDb.GetContact();
        return contacts;
    }

    static async AddContact(contact: iContact): Promise<iContact | null> {
        const result = await JsonDb.AddContact(contact);
        if (result) {
            return contact;
        }
        return null;
    }

    static async UpdateContact(contact: iContact): Promise<iContact | null> {
        console.log('contact for update', contact);
        
        const result = await JsonDb.UpdateContact(contact);
        if (result) {
            return contact;
        }
        return null;
    }

    static async RemoveContact(contact: iContact):  Promise<boolean> {
        const result = await JsonDb.RemoveContact(contact);
        if (result) {
            return true;
        }
        return false;
    }
}

export default ContactService;