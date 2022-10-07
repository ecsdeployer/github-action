import * as httpm from '@actions/http-client'
import { DEPLOYER_REPO } from './constants'

export interface GitHubRelease {
  id: number
  tag_name: string
}

export const getRelease = async (version: string): Promise<GitHubRelease | null> => {
  const url = `https://github.com/${DEPLOYER_REPO}/releases/${version}`
  const http = new httpm.HttpClient('deployer-action')
  return (await http.getJson<GitHubRelease>(url)).result
}
