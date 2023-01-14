import { v4 as uuid } from 'uuid'
import dataStore from '../dataStore/index'
import { IUserEntity } from '../dataStore/UserEntity'
import { StatusCodes, ErrorMessages } from '../constants'
import { HttpRequest, HttpResponse } from '../@types/index.types'
import { userSchema } from '../schemas/user.schema'
import { validateRequestBody } from '../utils'

class UserController {
    async getUsers(req: HttpRequest, res: HttpResponse) {
        let users
        let payload

        try {
            users = await dataStore.findAll()
            payload = { status: StatusCodes.Ok, data: users }
        } catch (e) {
            payload = {
                status: StatusCodes.ServerError,
                error: {
                    name: ErrorMessages.SERVER_ERROR,
                    message: JSON.stringify(e)
                }
            }
        }

        res.writeHead(200, {'Content-Type': 'json/application'});
        res.end(JSON.stringify(payload))
    }

    async getUser(req: HttpRequest, res: HttpResponse, params: { id: number }) {

    }

    async postUser(req: HttpRequest, res: HttpResponse): Promise<void> {
        const { isValid, errors } = validateRequestBody(req.body, userSchema)

        if (!isValid) {
            res.writeHead(200, {'Content-Type': 'json/application'});
            res.end(JSON.stringify({
                status: StatusCodes.BadRequest,
                error: {
                    name: ErrorMessages.BAD_REQUEST,
                    message: errors
                },
            }))
            return
        }

        const body = {...req.body, id: uuid() } as IUserEntity

        let data
        let payload

        try {
            data = await dataStore.create(body)
            payload = { status: StatusCodes.Created, data }
        } catch (e) {
            payload = {
                status: StatusCodes.ServerError,
                error: {
                    name: ErrorMessages.SERVER_ERROR,
                    message: JSON.stringify(e)
                }
            }
        }

        res.writeHead(200, {'Content-Type': 'json/application'});
        res.end(JSON.stringify(payload))
    }

    async updateUser() {

    }

    async deleteUser() {

    }
}

export default new UserController()
