import jwt from "jsonwebtoken";
import {Router} from "express"; 

export const validateJWT = Router();

validateJWT.use((req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    if(token.startsWith("Bearer ")){
        token =token.split(" ")[1];
    }
    jwt.verify(token, process.env.JWT_SECRET, (e, decoded) => {
        if (e) {
            res.status(401).json({ message: "Invalid token" + e.message });
        }
        else {
            req.user = decoded;
            next();
        }
    });
})