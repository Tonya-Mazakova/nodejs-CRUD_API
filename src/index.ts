import 'dotenv/config'
import CrudApiApp from './app'
import { bodyParser, jsonParser } from './middlewares'

const port = Number(process.env.PORT) || 4000
const app = new CrudApiApp()

app.use(jsonParser)
app.use(bodyParser)

const runServer = (): void => {
    const server = app.listen(port)

    server.on('listening', () => {
        console.log(`Server is running on Port ${port}`)
    })
}

runServer()
