import archiver from 'archiver'
import * as dotenv from 'dotenv'
import esbuild from 'esbuild'
import fs from 'fs-extra'
import process from 'node:process'

dotenv.config()

const outdir = 'build'

async function deleteOldDir() {
  await fs.remove(outdir)
}

async function runEsbuild() {
  await esbuild.build({
    entryPoints: ['src/content-script/index.ts', 'src/background/index.ts'],
    bundle: true,
    outdir: outdir,
    treeShaking: true,
    minify: true,
    legalComments: 'none',
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.AXIOM_TOKEN': JSON.stringify(process.env.AXIOM_TOKEN || 'UNDEFINED'),
    },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsx: 'automatic',
    loader: {
      '.png': 'dataurl',
    },
  })
}

async function zipFolder(dir) {
  const output = fs.createWriteStream(`${dir}.zip`)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  archive.pipe(output)
  archive.directory(dir, false)
  await archive.finalize()
}

async function copyFiles(entryPoints, targetDir) {
  await fs.ensureDir(targetDir)
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      await fs.copy(entryPoint.src, `${targetDir}/${entryPoint.dst}`)
    }),
  )
}

async function build() {
  await deleteOldDir()
  await runEsbuild()

  const commonFiles = [
    { src: 'build/content-script/index.js', dst: 'content-script.js' },
    { src: 'build/background/index.js', dst: 'background.js' },
    { src: 'src/logo.png', dst: 'logo.png' },
    { src: 'src/_locales', dst: '_locales' },
  ]

  // chromium
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.json', dst: 'manifest.json' }],
    `./${outdir}/chromium`,
  )

  await zipFolder(`./${outdir}/chromium`)

  console.log('Build success.')
}

build()
