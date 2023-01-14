import { HttpRequest } from '../@types/index.types'

export const bodyParser = (req: HttpRequest) => {
    let data = ''

    req.on('data', (chunk: Buffer) => {
        data += chunk
    })

    req.on('end', () => {
        if (data && data.indexOf('{') > -1 ) {
            req.body = JSON.parse(data);
        }
    });
}
