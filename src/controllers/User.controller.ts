import { v4 as uuid } from 'uuid'
import dataStore from '../dataStore/index'
import { IUserEntity } from '../dataStore/UserEntity'
import { StatusCodes, ErrorMessages } from '../constants'
import { HttpRequest, HttpResponse } from '../@types/index.types'
import { userSchema } from '../schemas/user.schema'
import { validateRequestBody, validateUserID } from '../utils'

class UserController {
    payload = { }

    async getUsers(req: HttpRequest, res: HttpResponse) {
        let users

        try {
            users = await dataStore.findAll()
            this.payload = { status: StatusCodes.Ok, data: users }
        } catch (e) {
            this.payload = {
                status: StatusCodes.ServerError,
                error: {
                    name: ErrorMessages.SERVER_ERROR,
                    message: JSON.stringify(e)
                }
            }
        }

        res.writeHead(StatusCodes.Ok, {'Content-Type': 'json/application'});
        res.end(JSON.stringify(this.payload))
    }

    async getUser(req: HttpRequest, res: HttpResponse, params: { id: number }) {
        const { isValid, error } = validateUserID(params?.id)

        if (!isValid) {
            res.writeHead(StatusCodes.BadRequest, {'Content-Type': 'json/application'});
            res.end(JSON.stringify({
                status: StatusCodes.BadRequest,
                error: {
                    name: ErrorMessages.BAD_REQUEST,
                    message: error
                },
            }))
            return
        }

        try {
            const user = await dataStore.findByID(params?.id)

            if (!user) {
                this.payload = {
                    status: StatusCodes.NotFound,
                    error: {
                        name: ErrorMessages.NOT_FOUND,
                        message: 'user with provided id not found'
                    }
                }
            } else {
                this.payload = { status: StatusCodes.Ok, data: user }
            }

        } catch (e) {
            this.payload = {
                status: StatusCodes.ServerError,
                error: {
                    name: ErrorMessages.SERVER_ERROR,
                    message: JSON.stringify(e)
                }
            }
        }

        res.writeHead(StatusCodes.Ok, {'Content-Type': 'json/application'});
        res.end(JSON.stringify(this.payload))
    }

    async postUser(req: HttpRequest, res: HttpResponse): Promise<void> {
        const { isValid, errors } = validateRequestBody(req.body, userSchema)

        if (!isValid) {
            res.writeHead(StatusCodes.BadRequest, {'Content-Type': 'json/application'});
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

        try {
            data = await dataStore.create(body)
            this.payload = { status: StatusCodes.Created, data }
        } catch (e) {
            this.payload = {
                status: StatusCodes.ServerError,
                error: {
                    name: ErrorMessages.SERVER_ERROR,
                    message: JSON.stringify(e)
                }
            }
        }

        res.writeHead(StatusCodes.Created, {'Content-Type': 'json/application'});
        res.end(JSON.stringify(this.payload))
    }

    async updateUser() {

    }

    async deleteUser() {

    }
}

export default new UserController()
