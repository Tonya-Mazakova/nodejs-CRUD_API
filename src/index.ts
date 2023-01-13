import 'dotenv/config'
import CrudApiApp from './app'
import bodyParser from './middlewares/bodyParser.middleware'
const port = Number(process.env.PORT) || 4000
const app = new CrudApiApp()

app.use(bodyParser)

const runServer = (): void => {
    const server = app.listen(port)

    server.on('listening', () => {
        console.log(`Server is running on Port ${port}`)
    })
}

runServer()
