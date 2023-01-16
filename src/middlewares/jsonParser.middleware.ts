import { HttpRequest, HttpResponse } from '../@types/index.types'
import { StatusCodes } from '../constants'

export const jsonParser = (req: HttpRequest, res: HttpResponse): void => {
    res.send = (payload: {
        status: StatusCodes
        data?: object
        error?: Error
    }): void => {

        res.writeHead(payload.status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(payload.data || payload.error))
    }
}
