import { v4 as uuid } from 'uuid'
import EventEmitter from 'events';
import dataStore from '../dataStore/index'
import { IUserEntity } from '../dataStore/UserEntity'
import { StatusCodes, ErrorMessages } from '../constants'
import { HttpRequest, HttpResponse } from '../@types/index.types'
import { userSchema } from '../schemas/user.schema'
import { validateRequestBody, validateUserID } from '../utils'
import {isClusterMode} from "../index";

export class UserController extends EventEmitter {
    payload = { } as any
    res: any
    methods = {
        'getUsers': this.getUsers
    }

    private sendToMaster = async (
        data: any
    ): Promise<any> => {
        return new Promise(
            (resolve) =>
                process.send &&
                process.send(data, () => {
                    this.once(data.method, (data: any) =>
                    {
                        console.log(data, '1')
                        resolve({
                            handler: data.handler,
                            status: data.statusCode,
                            body: data.body
                        })
                    }
                    );
                })
        );
    };

    async getUsers(req?: HttpRequest, res?: HttpResponse) {
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

        if (isClusterMode) {
            return this.payload
        }

        res?.send?.(this.payload)
    }

    async getUsersClusterMode(req: HttpRequest, res: HttpResponse) {
        this.res = res

        return await this.sendToMaster({
            method: 'GET'
        })
    }

    async getUser(req: HttpRequest | undefined, res: HttpResponse | undefined, params: { id: string }) {
        const { isValid, error } = validateUserID(params?.id)

        if (!isValid) {
            res?.writeHead(StatusCodes.BadRequest, {'Content-Type': 'json/application'});
            res?.end(JSON.stringify({
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

        if (isClusterMode) {
            return this.payload
        }

        res?.send?.(this.payload)
    }

    async getUserClusterMode(req: HttpRequest, res: HttpResponse, params: { id: string }) {
        this.res = res

        return await this.sendToMaster({
            method: 'GET',
            id: params.id
        })
    }

    async postUser(req: HttpRequest | any, res: HttpResponse | undefined): Promise<void> {
        const { isValid, errors } = validateRequestBody(req.body, userSchema)

        if (!isValid) {
            res?.writeHead(StatusCodes.BadRequest, {'Content-Type': 'json/application'});
            res?.end(JSON.stringify({
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

        if (isClusterMode) {
            return this.payload
        }

        res?.send?.(this.payload)
    }

    async postUserClusterMode(req: HttpRequest, res: HttpResponse) {
        this.res = res

        return await this.sendToMaster({
            method: 'POST',
            body: req.body
        })
    }

    async emitData(method: any, data: any) {
        this.payload = { status: StatusCodes.Created, data }
        this.res.send?.(this.payload)
    }

    returnErrorPayload(
        status: StatusCodes,
        errorMSG: ErrorMessages,
        error: any
    ) {
        return {
            status,
            error: {
                name: errorMSG,
                message: JSON.stringify(error)
            },
        }
    }

    async updateUser(req: HttpRequest | any, res: HttpResponse | any, params: { id: string }): Promise<void> {
        const userIdCheckResult = validateUserID(params?.id)
        const reqBodyCheckResult = validateRequestBody(req.body, userSchema)
        let isUserExist
        const isValid = userIdCheckResult.isValid && reqBodyCheckResult.isValid

        try {
            isUserExist = await dataStore.findByID(params?.id)

            if (!isUserExist) {
                this.payload =
                    this.returnErrorPayload(
                        StatusCodes.NotFound,
                        ErrorMessages.NOT_FOUND,
                        'user is not found'
                    )
            }
        } catch (e) {
            this.payload = this.returnErrorPayload(
                StatusCodes.ServerError,
                ErrorMessages.SERVER_ERROR,
                e
            )
        }

        if (!userIdCheckResult.isValid) {
            this.payload = this.returnErrorPayload(
                StatusCodes.BadRequest,
                ErrorMessages.BAD_REQUEST,
                userIdCheckResult.error
            )
        }

        if (!reqBodyCheckResult.isValid) {
            this.payload = this.returnErrorPayload(
                StatusCodes.BadRequest,
                ErrorMessages.BAD_REQUEST,
                reqBodyCheckResult.errors
            )
        }

        let data

        if (isUserExist && isValid) {
            try {
                data = await dataStore.updateByID(params.id, req.body as IUserEntity)
                this.payload = { status: StatusCodes.Ok, data }
            } catch (e) {
                this.payload = {
                    status: StatusCodes.ServerError,
                    error: {
                        name: ErrorMessages.SERVER_ERROR,
                        message: JSON.stringify(e)
                    }
                }
            }
        }

        if (isClusterMode) {
            return this.payload
        }

        res.send?.(this.payload)
    }

    async updateUserClusterMode(req: HttpRequest, res: HttpResponse, params: { id: string }) {
        this.res = res

        return await this.sendToMaster({
            method: 'PUT',
            body: req.body,
            id: params.id
        })
    }

    async deleteUser(req: HttpRequest | any, res: HttpResponse | any, params: { id: string }): Promise<void> {
        const userIdCheckResult = validateUserID(params?.id)
        let isUserExist

        try {
            isUserExist = await dataStore.findByID(params?.id)

            if (!isUserExist) {
                this.payload =
                    this.returnErrorPayload(
                        StatusCodes.NotFound,
                        ErrorMessages.NOT_FOUND,
                        'user is not found'
                    )
            }
        } catch (e) {
            this.payload = this.returnErrorPayload(
                StatusCodes.ServerError,
                ErrorMessages.SERVER_ERROR,
                e
            )
        }

        if (!userIdCheckResult.isValid) {
            this.payload = this.returnErrorPayload(
                StatusCodes.BadRequest,
                ErrorMessages.BAD_REQUEST,
                userIdCheckResult.error
            )
        }

        if (userIdCheckResult.isValid && isUserExist) {
            try {
                const data = await dataStore.deleteByID(params.id)
                this.payload = { status: StatusCodes.Deleted, data }
            } catch (e) {
                this.payload = {
                    status: StatusCodes.ServerError,
                    error: {
                        name: ErrorMessages.SERVER_ERROR,
                        message: JSON.stringify(e)
                    }
                }
            }
        }

        res.send?.(this.payload)
    }

    async deleteUserClusterMode(req: HttpRequest, res: HttpResponse, params: { id: string }) {
        this.res = res

        return await this.sendToMaster({
            method: 'DELETE',
            id: params.id
        })
    }
}

export default new UserController()
