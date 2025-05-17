import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import {join} from 'path';

const port = 3000;

export default defineConfig({
    base: './',

    plugins: [
        createHtmlPlugin({
            minify: true,
            entry: '/example/index.tsx',
            template: '/example/index.html',
        }),
    ],

    server: {
        port,
        open: `http://localhost:${port}/`,
    },

    build: {
        emptyOutDir: false,
        assetsDir: '',
        sourcemap: true,
        // outDir: '/example/dist',
        rollupOptions: {
            input: '/example/index.html',
        },
    },

    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
        },
    },

    define: {
        'process.env.APP_ENV': JSON.stringify('development'),
    },
});
