import { createServer } from 'http'
import { router } from './Routes/router'

const port = process.env.PORT || 4000

const server = createServer(async (req, res) => {
    await router(req, res)
});

server.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});
