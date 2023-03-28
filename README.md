# pdf-analyzer

Uses GPT-3.5 and Pinecone to process large pdf.Gather information about the pdf-file by chatting with a chatbot

This repo is inspired by **[https://github.com/mayooear/gpt4-pdf-chatbot-langchain](https://github.com/sveltejs/kit)**

```bash
# ingest pdf into pinecone by converting it into vectors
just ingest
# start development server
just dev
# build project
just build
# check with tsconfig
just check
# format codebase
just format
# lint codebase
just lint
```

## Techstack

- full-stack framework: **[SvelteKit](https://github.com/sveltejs/kit)**
- css framework: **[Tailwind](https://github.com/tailwindlabs/tailwindcss)**
- packet manager: **[pnpm](https://github.com/pnpm/pnpm)**
- process automation: **[just](https://github.com/casey/just)**
