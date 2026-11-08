# Magazine Studio — Editorial V3

Gerador de revistas digitais HTML offline. Importa PDF, renderiza as páginas no navegador e exporta **um arquivo HTML independente**, com as imagens e o motor Three.js incorporados.

## Rodar

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:5173`.

## Funcionalidades

- PDF.js no navegador (o arquivo não é enviado a um servidor).
- Seções configuráveis no menu superior, vinculadas às páginas do PDF.
- Editor rich text simples para o **Sobre**, exportado em drawer preta com fonte Helvetica.
- Motor Three.js com câmera ortográfica fixa, páginas duplas, folhas deformadas em malha durante a virada e texturas persistentes durante a animação.
- Prévia real em iframe, usando o **mesmo bundle** do HTML exportado.
- Navegação por teclado, toque e setas, além de tela cheia.
- Exportação HTML único, sem CDN, servidor ou acesso à internet.

## Vercel

Framework: Vite. Build: `npm run build`. Output: `dist`.

## Observações

- O build exige instalar dependências npm. Execute `npm install` antes de `npm run dev` ou `npm run build`.
- PDFs longos e de alta resolução podem gerar HTMLs muito grandes e exigir muita memória no navegador.
- A animação usa deformação procedural de malha em Three.js; não é uma simulação física de papel.
- O editor rich text usa `contentEditable` e comandos nativos do navegador; o HTML exportado passa por sanitização de tags e URLs.
- Teste o HTML exportado nos navegadores dos destinatários, especialmente em dispositivos sem WebGL ou com pouca memória.
