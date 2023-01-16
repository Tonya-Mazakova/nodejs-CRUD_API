import { API_PREFIX } from '../constants'
import userController from '../controllers/User.controller'

export const routes = [
    {
        method: 'GET',
        path: `/${API_PREFIX}/users`,
        handler: userController.getUsers.bind(userController),
        handlerCluster: userController.getUsersClusterMode.bind(userController)
    },
    {
        method: 'GET',
        path: `/${API_PREFIX}/users/:id`,
        handler: userController.getUser.bind(userController),
        handlerCluster: userController.getUserClusterMode.bind(userController)
    },
    {
        method: 'POST',
        path: `/${API_PREFIX}/users`,
        handler: userController.postUser.bind(userController),
        handlerCluster: userController.postUserClusterMode.bind(userController)
    },
    {
        method: 'PUT',
        path: `/${API_PREFIX}/users/:id`,
        handler: userController.updateUser.bind(userController),
        handlerCluster: userController.updateUserClusterMode.bind(userController)
    },
    {
        method: 'DELETE',
        path: `/${API_PREFIX}/users/:id`,
        handler: userController.deleteUser.bind(userController),
        handlerCluster: userController.deleteUserClusterMode.bind(userController)
    }
]
