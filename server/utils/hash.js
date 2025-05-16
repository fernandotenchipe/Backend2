//hashPassword getSalt

import crypto from "crypto";

export const getSalt = () => {
    return crypto.randomBytes(16).toString("hex");
}

export const hashPassword = (salt, password) => {
    const hash = crypto.createHmac("sha256", salt);
    hash.update(password);
    return hash.digest("hex");
}
