import fs, { promises as fsPromises } from "fs"
import { join } from "path"
import { v4 as uuid } from "uuid"
import { format } from "date-fns"

const { dirname } = import.meta

const eventLogger = async (req, res, next, error=false) => {
    const fileName = error ? "errorLog.txt" : "reqLog.txt"
    const logData = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}\t${uuid()}\t${
    req.method
    }\t${req.url}${
        error 
            ? `\t${error.status}\t${error.message}` 
            : ""
    }\n`

    if (!fs.existsSync(join(dirname, "..", "logs"))) {
        await fsPromises.mkdir(join(dirname, "..", "logs"))
    }
    await fsPromises.appendFile(join(dirname, "..", "logs", fileName), logData)
    if (req.url !== '/images/dog-icon.png') {
    console.log(`Log updated: ${req.method}\t${req.url}`);}
    next();
}
export default eventLogger;