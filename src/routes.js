import React from 'react';
 
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const NguyenLieu = React.lazy(() => import('./views/shop/nguyenlieu/NguyenLieu'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const SanPham = React.lazy(() => import('./views/shop/product/SanPham'));
const ProductDetail = React.lazy(() => import('./views/shop/product/ProductDetail'));

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/shop', name: 'Shop', component: NguyenLieu, exact: true },
    { path: '/shop/nguyenlieu', name: 'NguyenLieu', component: NguyenLieu },
    { path: '/shop/product', exact: true, name: 'SanPham', component: SanPham },
    { path: '/shop/product/:id', exact: true, name: 'Chi tiết sản phẩm', component: ProductDetail },
    { path: '/theme', name: 'Theme', component: Colors, exact: true },
    { path: '/theme/colors', name: 'Colors', component: Colors },
];

export default routes;