import fs from 'fs';
import { iContact } from '../services/contact.service';
import { iNotifyGorup } from '../services/notifyGroup.service';

console.log('JSON DB INIT');

const FILE_PATH = "../data/db.json";

if (!fs.existsSync(FILE_PATH)) {
    const emptyDb = {
        contacts: [],
        groups: []
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(emptyDb))
}

const db = JSON.parse(fs.readFileSync(FILE_PATH, { encoding: "utf-8" }));

class JsonDb {
    private static _db: { contacts: iContact[], groups: iNotifyGorup[] } = db;

    private static save() {
        fs.writeFileSync(FILE_PATH, JSON.stringify(db));
    }

    static async GetContact() {
        return this._db.contacts;
    }

    static async AddContact(contact: iContact): Promise<boolean> {
        if (this._db.contacts.find(item => item.name == contact.name)) {
            console.log(`Contact ${contact.name} already exist`);
            return false;
        }
        this._db.contacts.push(contact);
        this.save();
        return true;
    }

    static async UpdateContact(contact: iContact): Promise<boolean> {
        const exist = this._db.contacts.find(item => item.name == contact.name)        
        if (exist) {
            exist.email = contact.email;
            exist.telegramId = contact.telegramId;            
            this.save();
            return true;
        }
        console.log(`Contact ${contact.name} not found`);
        return false;
    }

    static async RemoveContact(contact: iContact): Promise<boolean> {
        this._db.contacts = this._db.contacts.filter(item => item.name != contact.name);
        this.save();
        return true;
    }

    static async GetNotifyGroup() {
        return this._db.groups;
    }

    static async CreateNotifyGroup(name: string): Promise<boolean> {
        const exist = this._db.groups.find(item => item.name == name);
        if (exist) {
            console.log(`Group ${name} already exist`);
            return false;
        }
        this._db.groups.push({ name, email: [], telegram: [] });
        this.save();
        return true;
    }

    static async DeleteNofityGroup(name: string): Promise<boolean> {
        this._db.groups = this._db.groups.filter(item => item.name != name);
        this.save();
        return true;
    }

    static async AddNotifyGroupMember(group: string, type: "email" | "telegram", member: string) {
        const exist = this._db.groups.find(item => item.name == group);
        if (exist && exist[type]) {
            exist[type].push(member);
            this.save();
            return true;
        }
        console.log(`Gorup ${group} not found`)
        return false;
    }

    static async RemoveNotifyGroupMember(group: string, type: "email" | "telegram", member: string) {
        const exist = this._db.groups.find(item => item.name == group);
        if (exist) {
            exist[type] = exist[type].filter(item => item != member);
            this.save();
            return true;
        }
        console.log(`Gorup ${group} not found`)
        return false;
    }
}

export default JsonDb;