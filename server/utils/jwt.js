import jwt from "jsonwebtoken";
import {Router} from "express"; 

export const validateJWT = Router();

validateJWT.use((req, res, next) => {
    console.log("🧾 HEADERS EN BACKEND (GET):", req.headers);

    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    if(token.startsWith("Bearer ")){
        token =token.split(" ")[1];
    }
    console.log("🧪 TOKEN crudo recibido:", req.headers.authorization);
    jwt.verify(token, process.env.JWT_SECRET, (e, decoded) => {
        if (e) {
             console.log("❌ Token inválido:", e.message);
            res.status(401).json({ message: "Invalid token" + e.message });
        }
        else {
            req.user = decoded;
            next();
        }
    });
})