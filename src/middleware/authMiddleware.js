import jwt from "jsonwebtoken";

export const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];

   const decode = await jwt.verify(token, process.env.JWT_SECRET);
   if(!decode){
    return res.status(401).json({ message: 'Invalid or expired token' });
   }
    req.user = decode;
    next();
}

export const authMiddlewareForSocket = (socket, next) => {
    console.log("socket.io : Authenticating socket...");

    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authorization token missing"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = decoded;  // attach user payload to socket for next middleware
        console.log("socket.io : Socket Auth Passed:", decoded.id);

        next();
    } catch (err) {
        console.log("Auth error:", err.message);
        return next(new Error("Invalid or expired token"));
    }
};


//ws socket
export const wsAuthMiddleware = (ws, req) => {
    const token = req.headers['sec-websocket-protocol'];
    if (!token) {
        return false;
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return false;
        }
        ws.user = decode;
        return true;
    } catch (err) {
        return false
    }
}