import {describe, it, expect} from '@jest/globals';
import {getInputs} from "../src/context"
import {install} from "../src/deployer"
import * as yaml from "js-yaml"
import { readFileSync } from 'fs';
import { InputNames } from '../src/types';


describe('general tests', () => {

  // make sure all the possible inputs exist in our app
  it('all inputs accounted for', async () => {
    const actionSpec = yaml.load(readFileSync("./action.yml", 'utf8')) as any
    const inputKeys = Object.keys(actionSpec.inputs)
    const inputEnumValues = Object.values(InputNames)

    for(const inputKey of inputKeys) {
      expect(inputEnumValues).toContainEqual(inputKey)
    }
  });


  it('installs', async () => {
    const inputs = await getInputs()
    const str = await install(inputs.deployerVersion)
    console.log("INSTALL", str)
  });
})
