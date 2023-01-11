import { routes } from './UserRoute'

export const router = async (req: any, res: any) => {
    const route = getActiveRoute(req.method, req.url, routes)
    route.activeRoute.handler(req, res, route.params)
};

const getActiveRoute = (method: string, url: string, routes: any) => {
    const routeParams: any = {};
    const urlSegments = url.split('/').slice(1);

    const activeRoute = routes.find((route: any) => {
        const routePathSegments = route.path.split('/').slice(1);

        if (routePathSegments.length !== urlSegments.length) {
            return false;
        }

        const match = routePathSegments.every((routePathSegment: string, i: number) => {
            return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
        });

        if (match) {
            routePathSegments.forEach((segment: string, i: number) => {
                if (segment[0] === ':') {
                    const propName = segment.slice(1);
                    routeParams[propName] = decodeURIComponent(urlSegments[i]);
                }
            });
        }

        return match
    })

    return { activeRoute, params: routeParams }
}
