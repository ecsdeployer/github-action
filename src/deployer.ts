import * as path from 'path'
import * as util from 'util'
import * as context from './context'
import * as github from './github'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { DEPLOYER_ASSET_PREFIX, DEPLOYER_BIN, DEPLOYER_REPO } from './constants'
import { isPresent } from './util'

export async function install(version: string): Promise<string> {
  const release = await github.getRelease(version)
  if (!release) {
    throw new Error(`Cannot find ECS Deployer ${version} release`)
  }

  const downloadUrl = getDownloadUrl(release.tag_name)

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

export function deployerCommandArgs(inputs : context.Inputs) : string[] {

  const cliArgs = [
    "deploy",
    "--config", inputs.configPath,
  ]

  if(isPresent(inputs.appVersion)) {
    cliArgs.push("--app-version", inputs.appVersion)
  }

  if(isPresent(inputs.imageUri)) {
    cliArgs.push("--image", inputs.imageUri)
  }

  if(isPresent(inputs.imageTag)) {
    cliArgs.push("--tag", inputs.imageTag)
  }

  if(isPresent(inputs.timeout)) {
    cliArgs.push("--timeout", inputs.timeout)
  }

  if(isPresent(inputs.args)) {
    cliArgs.push(inputs.args)
  }

  return cliArgs
}

export function getDownloadUrl(releaseTag : string) {
  const filename = getFilename()
  return util.format(
    "https://github.com/%s/releases/download/%s/%s",
    DEPLOYER_REPO,
    releaseTag,
    filename
  )
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
  const ext = context.osPlat == 'win32' ? 'zip' : 'tar.gz'

  return util.format('%s_%s_%s.%s', DEPLOYER_ASSET_PREFIX, platform, arch, ext)
}