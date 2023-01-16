import { createServer, Server } from 'http'
import cluster from 'cluster'
import { HttpRequest, HttpResponse } from './@types/index.types'
import { router } from './routes/router'
import { isClusterMode } from './index'

export default class CrudApiApp {
    private middlewares: any = []

    use(middleware: any): void {
        this.middlewares.push(middleware)
    }

    listen(port: any): Server {
        const server = createServer((req: HttpRequest, res: HttpResponse) => {
            this.middlewares.forEach((middleware: any) => middleware(req, res))

            if (!isClusterMode || (isClusterMode && cluster.isWorker)) {
                req.on('end', async () => {
                    await router(req, res)
                })
            }
        })

        return server.listen(port)
    }
}
