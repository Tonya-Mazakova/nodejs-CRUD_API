import dataStore from '../dataStore/index'
import { StatusCodes, ErrorMessages } from '../constants'

class UserController {
    async getUsers(req: any, res: any) {
        let users
        let payload
// todo: check the error handling
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

        res.end(JSON.stringify(payload))
    }

    async getUser(req: any, res: any, params: { id: number }) {

    }

    async postUser() {

    }

    async updateUser() {

    }

    async deleteUser() {

    }
}

export default new UserController()
