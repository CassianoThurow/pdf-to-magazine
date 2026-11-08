import { build } from 'vite';
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
await build({configFile:false,root,publicDir:false,build:{outDir:resolve(root,'.viewer-build'),emptyOutDir:true,minify:'esbuild',target:'es2022',lib:{entry:resolve(root,'viewer','viewer.ts'),formats:['iife'],name:'MagazineViewer',fileName:()=> 'viewer.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
await mkdir(resolve(root,'src','generated'),{recursive:true});
await copyFile(resolve(root,'.viewer-build','viewer.js'),resolve(root,'src','generated','viewer-bundle.js'));
console.log('Viewer Three.js compilado para exportação offline.');
