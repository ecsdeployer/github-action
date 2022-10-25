import * as path from 'path'
import * as context from './context'
import * as git from './git'
import * as deployer from './deployer'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import { InputNames } from './types'
// import yargs from 'yargs'

async function run() {
  try {

    // check workdir before doing anything at all
    const workDir = core.getInput(InputNames.WorkDir) || '.'
    if (workDir && workDir !== '.') {
      core.info(`Using ${workDir} as working directory`)
      process.chdir(workDir)
    }

    const inputs = await context.getInputs()

    if (core.isDebug()) {
      core.startGroup("Debug: inputs dump")
      console.log(inputs)
      core.endGroup()
    }

    core.startGroup("Installing ECS Deployer")
    const bin = await deployer.install(inputs.deployerVersion)
    core.info(`ECSDeployer ${inputs.deployerVersion} installed successfully`)
    core.endGroup()

    if (inputs.installOnly) {
      const deployerDir = path.dirname(bin)
      core.addPath(deployerDir)
      core.debug(`Added ${deployerDir} to PATH`)
      return
    }

    // ensure config file exists
    if(!fs.existsSync(inputs.configPath)) {
      throw new Error(`Configuration file '${inputs.configPath}' does not exist`)
    }

    core.startGroup("Running Deployment")
    await exec.exec(bin, deployer.deployerCommandArgs(inputs), {
      env: Object.assign({}, process.env, {
        // extras in the future
      }) as {[key : string]: string}
    })
    core.endGroup()

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()