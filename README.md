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
# build app backend:
pnpm build:app
# build ui:
pnpm build:ui
# start app:
pnpm app
```

### CUDA

##### Dependencies
 
 * [Build Tools for Visual Studio 2022](https://aka.ms/vs/17/release/vs_BuildTools.exe)
   * Select "Desktop development with C++"
   * Install the MSVC v143 and the Windows 11 SDK
 * [CUDA Toolkit 12.3](https://developer.nvidia.com/cuda-downloads)

> Copy all files from:
>
> `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.3\extras\visual_studio_integration\MSBuildExtensions`
>
> into:
>
> `C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Microsoft\VC\v170\BuildCustomizations`
>
> (The paths may vary depending on your installation/version)

```bash
# recompile node-llama-cpp with CUDA support:
pnpm cuda
```
