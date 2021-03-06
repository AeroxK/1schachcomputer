export interface RouteDescriptor {
    path: string,
    exact?: boolean,
    pageTitle: string,
    render: Function
}
