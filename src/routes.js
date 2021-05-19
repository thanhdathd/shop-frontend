import React from 'react';
 
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const NguyenLieu = React.lazy(() => import('./views/shop/nguyenlieu/NguyenLieu'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));


const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/shop', name: 'Shop', component: NguyenLieu, exact: true },
    { path: '/shop/nguyenlieu', name: 'NguyenLieu', component: NguyenLieu },
    { path: '/theme', name: 'Theme', component: Colors, exact: true },
    { path: '/theme/colors', name: 'Colors', component: Colors },
];

export default routes;