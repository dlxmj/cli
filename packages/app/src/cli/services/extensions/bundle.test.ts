import {bundleExtension, bundleThemeExtensions} from './bundle.js'
import {testUIExtension, testApp, testThemeExtensions} from '../../models/app/app.test-data.js'
import {inTemporaryDirectory, mkdir, glob, touchFileSync} from '@shopify/cli-kit/node/fs'
import {joinPath, basename} from '@shopify/cli-kit/node/path'
import {context as esContext} from 'esbuild'
import {describe, expect, test, vi} from 'vitest'
import {AbortController} from '@shopify/cli-kit/node/abort'

vi.mock('esbuild', async () => {
  const esbuild: any = await vi.importActual('esbuild')
  return {
    ...esbuild,
    context: vi.fn(),
  }
})
vi.mock('@shopify/cli-kit/node/ruby')

describe('bundleExtension()', () => {
  test('invokes ESBuild with the right options and forwards the logs', async () => {
    // Given
    const extension = await testUIExtension()
    const stdout: any = {
      write: vi.fn(),
    }
    const stderr: any = {
      write: vi.fn(),
    }
    const app = testApp({
      directory: '/project',
      dotenv: {
        path: '/project/.env',
        variables: {
          FOO: 'BAR',
        },
      },
      extensions: {
        ui: [extension],
        theme: [],
        function: [],
      },
    })
    const esbuildWatch = vi.fn()
    const esbuildDispose = vi.fn()
    const esbuildRebuild = vi.fn(esbuildResultFixture)

    vi.mocked(esContext).mockResolvedValue({
      rebuild: esbuildRebuild,
      watch: esbuildWatch,
      dispose: esbuildDispose,
      cancel: vi.fn(),
      serve: vi.fn(),
    })

    // When
    await bundleExtension({
      env: app.dotenv?.variables ?? {},
      outputBundlePath: extension.outputBundlePath,
      minify: true,
      environment: 'production',
      stdin: {
        contents: 'console.log("mock stdin content")',
        resolveDir: 'mock/resolve/dir',
        loader: 'tsx',
      },
      stdout,
      stderr,
    })

    // Then
    const call = vi.mocked(esContext).mock.calls[0]!
    expect(call).not.toBeUndefined()
    const options = call[0]

    expect(esbuildWatch).not.toHaveBeenCalled()
    expect(esbuildDispose).toHaveBeenCalledOnce()
    expect(esbuildRebuild).toHaveBeenCalledOnce()

    expect(options.bundle).toBeTruthy()
    expect(options.stdin).toStrictEqual({
      contents: 'console.log("mock stdin content")',
      resolveDir: 'mock/resolve/dir',
      loader: 'tsx',
    })
    expect(options.outfile).toEqual(extension.outputBundlePath)
    expect(options.loader).toEqual({
      '.esnext': 'ts',
      '.js': 'jsx',
    })
    expect(options.legalComments).toEqual('none')
    expect(options.minify).toBeTruthy()
    expect(options.target).toEqual('es6')
    expect(options.jsx).toEqual('automatic')
    expect(options.resolveExtensions).toEqual(['.tsx', '.ts', '.js', '.json', '.esnext', '.mjs', '.ejs'])
    expect(options.define).toEqual({
      'process.env.FOO': JSON.stringify('BAR'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
    expect(vi.mocked(stdout.write).mock.calls[0][0]).toMatchInlineSnapshot(`
      "▲ [WARNING] warning text [plugin plugin]

      "
    `)
    expect(vi.mocked(stdout.write).mock.calls[0][0]).toMatchInlineSnapshot(`
      "▲ [WARNING] warning text [plugin plugin]

      "
    `)
    const plugins = options.plugins?.map(({name}) => name)
    expect(plugins).toContain('graphql-loader')
  })

  test('stops the ESBuild when the abort signal receives an event', async () => {
    // Given
    const extension = await testUIExtension()
    const app = testApp({
      directory: '/project',
      dotenv: {
        path: '/project/.env',
        variables: {
          FOO: 'BAR',
        },
      },
      extensions: {
        ui: [extension],
        theme: [],
        function: [],
      },
    })
    const stdout: any = {
      write: vi.fn(),
    }
    const stderr: any = {
      write: vi.fn(),
    }
    const esbuildDispose = vi.fn()
    const esbuildWatch = vi.fn()
    const esbuildRebuild = vi.fn()

    vi.mocked(esContext).mockResolvedValue({
      dispose: esbuildDispose,
      rebuild: esbuildRebuild,
      watch: esbuildWatch,
      serve: vi.fn(),
      cancel: vi.fn(),
    })
    const abortController = new AbortController()

    // When
    await bundleExtension({
      env: app.dotenv?.variables ?? {},
      outputBundlePath: extension.outputBundlePath,
      minify: true,
      environment: 'production',
      stdin: {
        contents: 'console.log("mock stdin content")',
        resolveDir: 'mock/resolve/dir',
        loader: 'tsx',
      },
      stdout,
      stderr,
      watch: async (_result) => {},
      watchSignal: abortController.signal,
    })
    abortController.abort()

    // Then
    const call = vi.mocked(esContext).mock.calls[0]!
    const options = call[0]
    const plugins = options.plugins?.map(({name}) => name)
    expect(esbuildDispose).toHaveBeenCalledOnce()
    expect(esbuildWatch).toHaveBeenCalled()
    expect(esbuildRebuild).not.toHaveBeenCalled()
    expect(plugins).toContain('rebuild-plugin')
  })

  async function esbuildResultFixture() {
    return {
      errors: [
        {
          id: 'error',
          pluginName: 'plugin',
          text: 'error text',
          location: null,
          notes: [],
          detail: {},
        },
      ],
      warnings: [
        {
          id: 'warning',
          pluginName: 'plugin',
          text: 'warning text',
          location: null,
          notes: [],
          detail: {},
        },
      ],
      outputFiles: [],
      metafile: {
        inputs: {},
        outputs: {},
      },
      mangleCache: {},
    }
  }
  describe('bundleThemeExtension()', () => {
    test('should skip all ignored file patterns', async () => {
      await inTemporaryDirectory(async (tmpDir) => {
        // Given
        const themeExtension = await testThemeExtensions()
        themeExtension.directory = tmpDir
        const outputPath = joinPath(tmpDir, 'dist')
        await mkdir(outputPath)
        themeExtension.outputBundlePath = outputPath

        const app = testApp({
          directory: '/project',
          dotenv: {
            path: '/project/.env',
            variables: {
              FOO: 'BAR',
            },
          },
        })

        const stdout: any = {
          write: vi.fn(),
        }
        const stderr: any = {
          write: vi.fn(),
        }

        const blocksPath = joinPath(tmpDir, 'blocks')
        await mkdir(blocksPath)

        const ignoredFiles = ['.gitkeep', '.DS_Store', '.shopify.theme.extension.toml']
        await Promise.all(
          ['test.liquid', ...ignoredFiles].map(async (filename) => {
            touchFileSync(joinPath(blocksPath, filename))
            touchFileSync(joinPath(tmpDir, filename))
          }),
        )

        // When
        await bundleThemeExtensions({extensions: [themeExtension], app, stdout, stderr})

        // Then
        const filePaths = await glob(joinPath(themeExtension.outputBundlePath, '/**/*'))
        const hasFiles = filePaths
          .map((filePath) => basename(filePath))
          .some((filename) => ignoredFiles.includes(filename))
        expect(hasFiles).toEqual(false)
      })
    })
  })
})
