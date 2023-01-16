import { createServer, Server } from 'http'
import { HttpRequest, HttpResponse } from './@types/index.types'
import { router } from './routes/router'

export default class CrudApiApp {
    private middlewares: any = []

    use(middleware: any): void {
        this.middlewares.push(middleware)
    }

    listen(port: number): Server {
        const server = createServer((req: HttpRequest, res: HttpResponse) => {
            this.middlewares.forEach((middleware: any) => middleware(req, res))

            req.on('end', async () => {
                await router(req, res)
                res.end()
            })
        })

        return server.listen(port)
    }
}
