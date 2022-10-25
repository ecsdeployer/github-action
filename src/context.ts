import * as os from 'os'
import * as core from '@actions/core'
import { InputNames } from './types'
import { isPresent } from './util'

export const osPlat: string = os.platform()
export const osArch: string = os.arch()

export interface Inputs {
  deployerVersion : string
  args : string
  configPath : string
  imageTag : string
  appVersion : string
  imageUri : string
  installOnly : boolean
  timeout : string
}

export async function getInputs(): Promise<Inputs> {
  const inputs : Inputs = {
    deployerVersion: getDeployerVersion(),
    configPath: core.getInput(InputNames.ConfigPath) || '.ecsdeployer.yml',
    imageTag: core.getInput(InputNames.ImageTag),
    imageUri: core.getInput(InputNames.Image),
    appVersion: core.getInput(InputNames.AppVersion),
    args: core.getInput(InputNames.Args),
    timeout: core.getInput(InputNames.Timeout),

    installOnly: lessBrokenGetBooleanInput(InputNames.InstallOnly, false)
  }

  // check either stage or config path
  if(!isPresent(inputs.configPath)) {
    throw new Error("You must provide a config file path")
  }

  return inputs
}

// v1.0.0
// 1.0.0
const VALID_TAG_REGEX = /^v?\d+\.\d+\.\d+$/

function getDeployerVersion() : string {

  const value = core.getInput(InputNames.DeployerVerison) || "latest"

  if(value === "latest") {
    return value
  }

  if(!VALID_TAG_REGEX.test(value)) {
    throw new Error(`'${value}' is not a valid version specification.`)
  }

  if(!value.startsWith("v")) {
    return `v${value}`
  }

  return value
}

// Github's getBooleanInput is really annoying when the value is not provided
function lessBrokenGetBooleanInput(name : string, defValue : boolean, options? : core.InputOptions) {
  const trueValue = ['true', 'True', 'TRUE']
  const falseValue = ['false', 'False', 'FALSE']
  const val = core.getInput(name, options)
  if (trueValue.includes(val)) {
    return true
  }

  if (falseValue.includes(val)) {
    return false
  }
    
  return defValue
}