// import typescript from 'rollup-plugin-typescript2';
// import dts from 'rollup-plugin-dts';
import {join} from 'path';

import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import libCss from 'vite-plugin-libcss';

import pkg from './package.json';

export default defineConfig({
    plugins: [
        libCss(),
        dts(),
        /* dts({
            tsconfig: './tsconfig.build.json',
        }),*/
    ],
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            fileName: 'index.js',
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react-route',
                'react-router-dom',
                '@shopify/polaris',
                '@shopify/react-i18n',
                '@aftership/automizely-product-auth',
                'i18next',
                'react-i18next',
                '@aftership/meerkat-sdk',
            ],
        },
    },
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
        },
    },
    define: {},
});
