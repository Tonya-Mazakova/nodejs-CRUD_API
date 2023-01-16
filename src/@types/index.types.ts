import { IncomingMessage, ServerResponse } from 'http'
import { StatusCodes } from '../constants'

export type HttpRequest = IncomingMessage & {
    body?: object
}

export type HttpResponse = ServerResponse & {
    send?: (payload: {
        status: StatusCodes
        data?: object
        error?: Error
    }) => void
}
