import {createBrowserRouter, Navigate} from 'react-router'
import {AppLayout} from './layout/AppLayout'
import {NotFoundPage} from './layout/NotFoundPage'

export const routes = {
    cars: '/cars',
    dealers: '/dealers',
    manufacturers: '/manufacturers',
} as const

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            {index: true, element: <Navigate to={routes.cars} replace/>},
            {
                path: routes.cars,
                lazy: () => import('@/features/cars/pages/CarsPage').then((m) => ({Component: m.CarsPage})),
            },
            {
                path: routes.dealers,
                lazy: () => import('@/features/dealers/pages/DealersPage').then((m) => ({Component: m.DealersPage})),
            },
            {
                path: routes.manufacturers,
                lazy: () =>
                    import('@/features/manufacturers/pages/ManufacturersPage').then((m) => ({Component: m.ManufacturersPage})),
            },
            {path: '*', element: <NotFoundPage/>},
        ],
    },
])
