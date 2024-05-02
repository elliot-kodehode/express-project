import eventLogger from "./eventLogger.mjs";

class ReqError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}
function errorHandler(err, req, res, next) {
    eventLogger(req,  res, next, err)
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
}
export { errorHandler, ReqError }