import {describe, expect, it} from '@jest/globals';
import {getInputs, osArch, osPlat} from "../src/context"
import {install} from "../src/deployer"


describe('stuff', () => {
  it('suffixes pro distribution', async () => {
    const inputs = await getInputs()
    console.log("STUFF", osPlat, osArch, inputs)
  });

  it('installs', async () => {
    const inputs = await getInputs()
    const str = await install(inputs.deployerVersion)
    console.log("INSTALL", str)
  });
})
