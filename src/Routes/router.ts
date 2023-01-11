export const router = async (req: any, res: any, routes: any) => {
    console.log(req.method, 'req', req.url)

    // const route = routes.find((route: any) => {
    //     const methodMatch = route.method === req.method;
    //
    //     return route.method === req.method && route.path === req.url
    //     // let pathMatch = false;
    //     //
    //     // if (typeof route.path === 'object') {
    //     //     // Path is a RegEx, we use RegEx matching
    //     //     pathMatch = req.url.match(route.path);
    //     // }
    //     // else {
    //     //     // Path is a string, we simply match with URL
    //     //     pathMatch = route.path === req.url;
    //     // }
    //     //
    //     // return pathMatch && methodMatch;
    // });

    const route = getActiveRoute(req.method, req.url, routes)
console.log(route, 'routeroute')
    // Extract the "id" parameter from route and pass it to controller
    let param = null;

    // if (route && typeof route.path === 'object') {
    //     param = req.url.match(route.path)[1];
    // }

    // Extract request body
    // if (route) {
    //     let body = null;
    //     if (req.method === 'POST' || req.method === 'PUT') {
    //        // body = await getPostData(req);
    //     }
    //
    //    // return route.handler(req, res, param, body);
    // }
    // else {
    //    // return helpers.error(res, 'Endpoint not found', 404);
    // }
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
