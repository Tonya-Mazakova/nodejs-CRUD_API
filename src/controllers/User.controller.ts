import dataStore from '../dataStore/index'

class UserController {
    async getUsers() {
        const users = dataStore.findAll()
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
