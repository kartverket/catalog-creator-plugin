import type {
  CatalogInfoForm,
  RequiredYamlFields,
  Status,
} from '../model/types.ts';

import { updateYaml } from '../translator/translator';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { OAuthApi } from '@backstage/core-plugin-api';

export class GithubController {

  submitCatalogInfoToGithub = async (
    url: string,
    initialYaml: RequiredYamlFields[],
    catalogInfo: CatalogInfoForm[],
    githubAuthApi: OAuthApi,
  ): Promise<Status | undefined> => {
    const path = new URL(url).pathname.slice(1);

    const emptyRequiredYaml: RequiredYamlFields = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: '',
      metadata: {
        name: '',
      },
      spec: {
        type: '',
      },
    };

    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    const owner = match![1];
    const repo = match![2];

    const yamlStrings = catalogInfo.map((val, index) =>
      updateYaml(initialYaml[index] ?? emptyRequiredYaml, val),
    );

    const completeYaml = yamlStrings.join('\n---\n');

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });
    try {
      await octokit.createPullRequest({
        owner: owner,
        repo: repo,
        title: 'Create/update catalog-info.yaml',
        body: 'Creates or updates catalog-info.yaml',
        base: 'main',
        head: 'Update-or-create-catalog-info',
        changes: [
          {
            files: {
              [path]: completeYaml,
            },
            commit: 'New or updated catalog-info.yaml',
          },
        ],
      });
      return {
        message: 'created a pull request',
        severity: 'success',
      };
    } catch (error : unknown) {
      if (error instanceof Error) {
        error.message = "Could not create a pull request, it may already exist."
        throw error
      } else {
        throw new Error("Unkown error when trying to create a PR.")
      }
    }
  };
}
