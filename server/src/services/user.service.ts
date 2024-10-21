import sha256 from "sha256";
import config from "../utils/config.utils";

class UserService {

    static async Login(username: string, password: string): Promise<any> {
        if (username === config.server.username && sha256(password) == config.server.password) {
            return { successfully: true };
        }
        return { successfully: false };
    }

    static async ChangePassword(username: string, password: string, newPassword: string): Promise<any> {
        if (username === config.server.username && sha256(password) == config.server.password) {
            config.server.changePassword(newPassword);
            return { successfully: true };
        }
        return { successfully: false };
    }

}

export default UserService;
