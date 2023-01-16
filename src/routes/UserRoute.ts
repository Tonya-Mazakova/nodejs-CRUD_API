import { API_PREFIX } from '../constants'
import userController from '../controllers/User.controller'

export const routes = [
    {
        method: 'GET',
        path: `/${API_PREFIX}/users`,
        handler: userController.getUsers.bind(userController)
    },
    {
        method: 'GET',
        path: `/${API_PREFIX}/users/:id`,
        handler: userController.getUser.bind(userController)
    },
    {
        method: 'POST',
        path: `/${API_PREFIX}/users`,
        handler: userController.postUser.bind(userController)
    },
    {
        method: 'PUT',
        path: `/${API_PREFIX}/users/:id`,
        handler: userController.updateUser.bind(userController)
    },
    {
        method: 'DELETE',
        path: `/${API_PREFIX}/users/:id`,
        handler: userController.deleteUser.bind(userController)
    }
]
