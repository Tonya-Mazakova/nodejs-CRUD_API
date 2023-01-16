import http from 'http'
import cluster from 'cluster'
import { HttpRequest, HttpResponse } from '../@types/index.types'
import { StatusCodes } from '../constants'
import { workerPorts, isClusterMode, numCPUs } from '../index'

const getRequestBody = (req: http.IncomingMessage): Promise<string> => {
    let data = '';

    return new Promise((resolve, reject) => {
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', (err) => reject(err));
    });
};

let workerNum = 0
let currentWorkerPort = 0

export const requestHandler = async (
    req: HttpRequest,
    res: HttpResponse
) => {
    if (isClusterMode && cluster.isPrimary) {
        currentWorkerPort = workerPorts[workerNum].port

        if (workerNum === numCPUs) {
            workerNum = 0
        } else {
            workerNum++
        }

        const body = await getRequestBody(req)

        req.pause()

        const options = {
            hostname: 'localhost',
            port: currentWorkerPort,
            path: req.url,
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        }

        console.log(
            `load balancer ${req.headers.host} redirected request to URL ${options.path} METHOD ${options.method}, PORT ${options.port}`
        )

        let result = '';
        const request = http.request(options, (response) => {
            response.on('data', (chunk) => {
                result += chunk
            });

            response.on('end', () => {
                console.log(
                    `server localhost:${currentWorkerPort} responded on ${req.method} request`
                );

                const statusCode = response.statusCode || StatusCodes.ServerError

                res.writeHead(statusCode, { 'Content-Type': 'application/json' })
                res.end(result);
            });
        });

        if (body) {
            request.write(body)
        }
        request.end()
   }
}
