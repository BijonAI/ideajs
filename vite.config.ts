import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './test',
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ideajs',
            fileName: 'ideajs'
        },
        rollupOptions: {
            external: ['gsap'],
            output: {
                globals: {
                    gsap: 'gsap'
                }
            }
        }
    },
    server: {
        open: true
    }
});