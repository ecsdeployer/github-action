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

  // it('require config', async () => {
  //   await expect(getInputs()).rejects.toThrow(/must provide.+config/)
  // });

  describe('configPath', () => {
    it('when missing', async () => {
      expect((await getInputs()).configPath).toEqual(".ecsdeployer.yml")
    });

    it('when provided', async () => {
      process.env.INPUT_CONFIG = "somefilepath.yml"
      expect((await getInputs()).configPath).toEqual("somefilepath.yml")
    });
  });

  describe('imageUri', () => {
    it('when missing', async () => {
      expect((await getInputs()).imageUri).toEqual("")
    });

    it('when provided', async () => {
      process.env['INPUT_IMAGE'] = "xxximg"
      expect((await getInputs()).imageUri).toEqual("xxximg")
    });
  });

  describe('imageTag', () => {
    it('when missing', async () => {
      expect((await getInputs()).imageTag).toEqual("")
    });

    it('when provided', async () => {
      process.env.INPUT_TAG = "xxxtag"
      expect((await getInputs()).imageTag).toEqual("xxxtag")
    });
  });

  describe('appVersion', () => {
    it('when missing', async () => {
      expect((await getInputs()).appVersion).toEqual("")
    });

    it('when provided', async () => {
      process.env['INPUT_APP-VERSION'] = "xxxversion"
      expect((await getInputs()).appVersion).toEqual("xxxversion")
    });
  });

  describe('args', () => {
    it('when missing', async () => {
      expect((await getInputs()).args).toEqual("")
    });

    it('when provided', async () => {
      process.env['INPUT_EXTRA-ARGS'] = "--test --thing"
      expect((await getInputs()).args).toEqual("--test --thing")
    });
  });
})
