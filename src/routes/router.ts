import cluster from 'cluster'
import { routes } from './UserRoute'
import { HttpRequest, HttpResponse } from '../@types/index.types'
import { isClusterMode } from '../index'

export const router = async (req: HttpRequest, res: HttpResponse) => {
    const route = getActiveRoute(req.method, req.url, routes)

    if (!route.activeRoute) return

    if (isClusterMode && cluster.isWorker) {
        route.activeRoute.handlerCluster(req, res, route.params)
    } else {
        route.activeRoute.handler(req, res, route.params)
    }
};

const getActiveRoute = (
    method: string | undefined,
    url: string | undefined,
    routes: any
) => {
    const routeParams: any = {};
    const urlSegments = url?.split('/').slice(1);

    const activeRoute = routes.find((route: any) => {
        const routePathSegments = route.path.split('/').slice(1);

        if (routePathSegments.length !== urlSegments?.length
            || route.method !== method) {
            return false;
        }

        const match = routePathSegments.every((routePathSegment: string, i: number) => {
            return routePathSegment === urlSegments?.[i] || routePathSegment[0] === ':';
        });

        if (match) {
            routePathSegments.forEach((segment: string, i: number) => {
                if (segment[0] === ':') {
                    const propName = segment.slice(1);
                    routeParams[propName] = decodeURIComponent(urlSegments?.[i] || '');
                }
            });
        }

        return match
    })

    return { activeRoute, params: routeParams }
}
