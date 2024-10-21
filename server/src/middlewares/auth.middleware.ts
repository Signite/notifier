import { RequestHandler } from "express";
import UserService from "../services/user.service";

const authMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        if (username && password) {
            const loginResult = await UserService.Login(username, password);
            if (loginResult.successfully) {
                return next();
            }
        }
        res.set('WWW-Authenticate', 'Basic');
        res.status(401).send("Authentication required.");

    } catch (err) {
        next(err);
    }
    // const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    // const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    // const config = { server: { username: "admin", password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918" } };
    // if (login && password && login === config.server.username && sha256(password) == config.server.password) {
    //     return next();
    // }

}

export default authMiddleware;