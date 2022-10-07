import * as path from 'path'
import * as context from './context'
import * as git from './git'
import * as deployer from './deployer'
import * as core from '@actions/core'
// import * as exec from '@actions/exec'
// import * as fs from 'fs'
// import yargs from 'yargs'

async function run() {
  try {
    const inputs = await context.getInputs()
    const bin = await deployer.install(inputs.deployerVersion)
    core.info(`Cloud87Deployer ${inputs.deployerVersion} installed successfully`)

    if (inputs.installOnly) {
      const deployerDir = path.dirname(bin)
      core.addPath(deployerDir)
      core.debug(`Added ${deployerDir} to PATH`)
      return
    } else if (!inputs.args) {
      core.setFailed('args input required')
      return
    }

    if (inputs.workdir && inputs.workdir !== '.') {
      core.info(`Using ${inputs.workdir} as working directory`)
      process.chdir(inputs.workdir)
    }

    const commit = await git.getShortCommit()
    const tag = await git.getTag()
    // const isTagDirty = await git.isTagDirty(tag)

    // let yamlfile: string | unknown;
    // const argv = yargs.parse(inputs.args)
    // if (argv.config) {
    //   yamlfile = argv.config;
    // } else {
    //   ['.goreleaser.yaml', '.goreleaser.yml', 'goreleaser.yaml', 'goreleaser.yml'].forEach(f => {
    //     if (fs.existsSync(f)) {
    //       yamlfile = f;
    //     }
    //   });
    // }

    // let snapshot = '';
    // if (inputs.args.split(' ').indexOf('release') > -1) {
    //   if (isTagDirty) {
    //     if (!inputs.args.includes('--snapshot') && !inputs.args.includes('--nightly')) {
    //       core.info(`No tag found for commit ${commit}. Snapshot forced`);
    //       snapshot = ' --snapshot';
    //     }
    //   } else {
    //     core.info(`${tag} tag found for commit ${commit}`);
    //   }
    // }

    // await exec.exec(`${bin} ${inputs.args}${snapshot}`, undefined, {
    //   env: Object.assign({}, process.env, {
    //     GORELEASER_CURRENT_TAG: process.env.GORELEASER_CURRENT_TAG || tag || ''
    //   }) as {
    //     [key: string]: string;
    //   }
    // })



  } catch (error) {
    core.setFailed(error.message)
  }
}

run()