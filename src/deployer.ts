import * as path from 'path'
import * as util from 'util'
import * as context from './context'
import * as github from './github'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { DEPLOYER_ASSET_PREFIX, DEPLOYER_BIN, RELEASE_DOWNLOAD_URL } from './constants'

export async function install(version: string): Promise<string> {
  const release = await github.getRelease(version)
  if (!release) {
    throw new Error(`Cannot find ECS Deployer ${version} release`)
  }

  const filename = getFilename()
  const downloadUrl = util.format(
    RELEASE_DOWNLOAD_URL,
    release.tag_name,
    filename
  )

  core.info(`Downloading ${downloadUrl}`)
  const downloadPath = await tc.downloadTool(downloadUrl)
  core.debug(`Downloaded to ${downloadPath}`)

  core.info('Extracting ECS Deployer')
  let extPath: string;
  if (context.osPlat == 'win32') {
    extPath = await tc.extractZip(downloadPath)
  } else {
    extPath = await tc.extractTar(downloadPath)
  }
  core.debug(`Extracted to ${extPath}`)

  const cachePath = await tc.cacheDir(extPath, 'ecsdeployer-action', release.tag_name.replace(/^v/, ''))
  core.debug(`Cached to ${cachePath}`)

  const exePath = path.join(cachePath, context.osPlat == 'win32' ? `${DEPLOYER_BIN}.exe` : DEPLOYER_BIN)
  core.debug(`Exe path is ${exePath}`)

  return exePath
}

const getFilename = (): string => {
  let arch: string;
  switch (context.osArch) {
    case 'x64': {
      arch = 'x86_64'
      break
    }
    case 'x32': {
      arch = 'i386'
      break
    }
    case 'arm': {
      const arm_version = (process.config.variables as any).arm_version
      arch = arm_version ? 'armv' + arm_version : 'arm'
      break
    }
    default: {
      arch = context.osArch
      break
    }
  }
  if (context.osPlat == 'darwin') {
    arch = 'all'
  }
  const platform = context.osPlat == 'win32' ? 'windows' : context.osPlat == 'darwin' ? 'darwin' : 'linux'
  let ext = context.osPlat == 'win32' ? 'zip' : 'tar.gz'

  return util.format('%s_%s_%s.%s', DEPLOYER_ASSET_PREFIX, platform, arch, ext)
}