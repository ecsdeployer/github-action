import {describe, it, expect, beforeEach, afterEach, jest} from '@jest/globals';
import { Inputs } from '../src/context';
import {deployerCommandArgs} from "../src/deployer"

describe('deployerCommandArgs', () => {

  const env = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })
  afterEach(() => {
    process.env = env
  })

  it('includes everything', async () => {

    const testInputs : Partial<Inputs> = {
      configPath: ".ecsdeployer/fake.yml",
      appVersion: "xAPPxxVERSIONxxx",
      imageTag: "xIMGxxTAGxxx",
      timeout: "xxtimeXoutxx",
      args: "--extra --args --and --things",
    }

    const cliArgs = deployerCommandArgs(testInputs as any)

    expect(cliArgs[0]).toEqual("deploy")
        
    expect(cliArgs).toContain("--config")
    expect(cliArgs).toContain(testInputs.configPath)
    
    expect(cliArgs).toContain("--app-version")
    expect(cliArgs).toContain(testInputs.appVersion)
    
    expect(cliArgs).toContain("--image-tag")
    expect(cliArgs).toContain(testInputs.imageTag)
    
    expect(cliArgs).toContain("--timeout")
    expect(cliArgs).toContain(testInputs.timeout)

  });
})