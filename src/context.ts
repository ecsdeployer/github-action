import * as os from 'os'
import * as core from '@actions/core'
import { issueCommand } from '@actions/core/lib/command'
import { InputNames } from './types'

export const osPlat: string = os.platform()
export const osArch: string = os.arch()

export interface Inputs {
  deployerVersion : string
  args : string
  configPath : string
  workdir : string
  installOnly : boolean
}

export async function getInputs(): Promise<Inputs> {
  return {
    deployerVersion: getDeployerVersion(),
    configPath: core.getInput(InputNames.ConfigPath),
    args: core.getInput(InputNames.Args),
    workdir: core.getInput(InputNames.WorkDir) || '.',
    installOnly: lessBrokenGetBooleanInput(InputNames.InstallOnly, false)
  }
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

// FIXME: Temp fix https://github.com/actions/toolkit/issues/777
export function setOutput(name: string, value: unknown): void {
  issueCommand('set-output', {name}, value)
}


function lessBrokenGetBooleanInput(name : string, defValue : boolean, options? : core.InputOptions) {
  const trueValue = ['true', 'True', 'TRUE'];
  const falseValue = ['false', 'False', 'FALSE'];
  const val = core.getInput(name, options);
  if (trueValue.includes(val))
      return true;
  if (falseValue.includes(val))
      return false;
    
  return defValue
}