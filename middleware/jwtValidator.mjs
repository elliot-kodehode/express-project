import jwt from "jsonwebtoken";

const jwtValidator = (req, res, next) => {
    const authHeader = req.headers.authorization
    
    // "Authorization: Bearer tokenCode"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Failed to receive token."})
    }
    const token = authHeader.slice(7)
    jwt.verify(token, process.env.JWT_SECRET, (err,  decoded) => {
        if (err) {
            return res.status(401).json({message: "Invalid token"})
        } else {
            req.user = decoded
            next()
        }
    })
}

export default jwtValidator