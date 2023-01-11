import { createServer } from 'http'
import { routes } from './Routes/UserRoute'
import { router } from './Routes/router'

const port = process.env.PORT || 4000

const server = createServer(async (req, res) => {
    await router(req, res, routes)
});

server.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});
