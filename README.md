chato
==

### One-click installer

[![GitHub latest release version](https://img.shields.io/github/v/release/danielesteban/chato.svg?style=flat)](https://github.com/danielesteban/chato/releases/download/v0.0.1/chato-v0.0.1.exe)

> Models will be downloaded into: `My Documents/chato`

### Build

```bash
# clone repo:
git clone https://github.com/danielesteban/chato.git
cd chato
# install dependencies:
pnpm install
# compile CUDA support (optional):
pnpm cuda
# build app backend:
pnpm build:app
# build ui:
pnpm build:ui
# start app:
pnpm app
```
