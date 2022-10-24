import {describe, it, expect, beforeEach, afterEach, jest} from '@jest/globals';
import {getInputs, osArch, osPlat} from "../src/context"

describe('getInputs', () => {

  const env = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })
  afterEach(() => {
    process.env = env
  })

  it('require config', async () => {
    await expect(getInputs()).rejects.toThrow(/must provide.+config/)
  });

  describe('imageTag', () => {
    it('when missing', async () => {
      process.env.INPUT_CONFIG = "something"
      process.env.INPUT_STAGE = "something"
      expect((await getInputs()).imageTag).toEqual("")
    });

    it('when provided', async () => {
      process.env.INPUT_CONFIG = "something"
      process.env.INPUT_STAGE = "something"
      process.env['INPUT_IMAGE-TAG'] = "xxxtag"
      expect((await getInputs()).imageTag).toEqual("xxxtag")
    });
  });

  describe('appVersion', () => {
    it('when missing', async () => {
      process.env.INPUT_CONFIG = "something"
      process.env.INPUT_STAGE = "something"
      expect((await getInputs()).appVersion).toEqual("")
    });

    it('when provided', async () => {
      process.env.INPUT_CONFIG = "something"
      process.env.INPUT_STAGE = "something"
      process.env['INPUT_APP-VERSION'] = "xxxversion"
      expect((await getInputs()).appVersion).toEqual("xxxversion")
    });
  });

  describe('args', () => {
    it('when missing', async () => {
      process.env.INPUT_CONFIG = "something"
      process.env.INPUT_STAGE = "something"
      expect((await getInputs()).args).toEqual("")
    });

    it('when provided', async () => {
      process.env.INPUT_CONFIG = "something"
      process.env.INPUT_STAGE = "something"
      process.env['INPUT_EXTRA-ARGS'] = "--test --thing"
      expect((await getInputs()).args).toEqual("--test --thing")
    });
  });

  // it('gets the stage correctly from filename', async () => {
  //   const inputs = await getInputs()
  //   console.log("STUFF", osPlat, osArch, inputs)
  // });

  // it('installs', async () => {
  //   const inputs = await getInputs()
  //   const str = await install(inputs.deployerVersion)
  //   console.log("INSTALL", str)
  // });
})
