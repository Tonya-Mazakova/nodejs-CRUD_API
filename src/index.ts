import 'dotenv/config'
import os from 'os'
import cluster from 'cluster'
import CrudApiApp from './app'
import { bodyParser, jsonParser, requestHandler } from './middlewares'
import userController from './controllers/User.controller'

export const port = Number(process.env.PORT) || 4000
const app = new CrudApiApp()

export const numCPUs = os.cpus().length
export const isClusterMode = process.argv[2] === 'cluster'
export const workerPorts: any = []

app.use(jsonParser)
app.use(bodyParser)

const runServer = (): void => {
    const server = app.listen(port)

    server.on('listening', () => {
        console.log(`Server is running on Port ${port}`)
    })
}

if (isClusterMode) {
    if (cluster.isPrimary) {

        app.use(requestHandler)
        const server = app.listen(port)
        let worker, workerPort

        server.on('listening', () => {
            console.log(`Primary server is running on Port ${port}`)
        })

        for (let i = 0; i < numCPUs; i++) {
            workerPort = port + i + 1
            worker = cluster.fork({ PORT: workerPort })
            workerPorts.push({ port: workerPort, pid: worker.process.pid })
        }

        cluster.on('exit', (worker) => {
            console.log('worker ' + worker.process.pid + ' died');
        });

        cluster.on('message', async (worker, data: {
            method: string,
            body?: object,
            id?: string
        }) => {
            const result = await runCommand(
                data?.method,
                data,
                data?.id
            )

            const dataToChildProcess: any = {
                method: data?.method,
                data: { status: result.status, body: result.data },
            };

            worker.send(dataToChildProcess);
        });
    } else {
        const server = app.listen(process.env.PORT || 4000)

        server.on('listening', () => {
            console.log(`Worker server with pid=${process.pid} started on port:${process.env.PORT}`)
        })

        process.on('message', (message: any) => {
            userController.emitData(message.method, message.data)
        });
    }
}

if (!isClusterMode) {
    runServer()
}

const runCommand = async (
    method: string,
    body: object | undefined,
    id: any
) => {
    switch (method) {
        case 'GET':
            if (!id) {
                return await userController.getUsers()
            }

            return await userController.getUser(undefined, undefined, { id })
        case 'POST':
            return await userController.postUser(body, undefined)
        case 'PUT':
            return await userController.updateUser(body, undefined, { id })
        case 'DELETE':
            return await userController.deleteUser(body, undefined, id)
        default: {
            //throw new Error()
        }
    }
}
