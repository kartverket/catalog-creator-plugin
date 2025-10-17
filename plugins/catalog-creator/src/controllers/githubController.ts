import type { FormEntity, RequiredYamlFields, Status } from '../model/types.ts';

import { updateYaml } from '../translator/translator';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { OAuthApi } from '@backstage/core-plugin-api';

export class GithubController {
  submitCatalogInfoToGithub = async (
    url: string,
    initialYaml: RequiredYamlFields[],
    catalogInfo: FormEntity[],
    githubAuthApi: OAuthApi,
  ): Promise<Status | undefined> => {
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

    const yamlStrings = catalogInfo.map(val =>
      updateYaml(initialYaml[val.id] ?? emptyRequiredYaml, val),
    );

    const completeYaml = yamlStrings.join('\n---\n');

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });

    let owner;
    let repo;
    let relative_path;

    if (url.includes('blob')) {
      const match = url.match(
        /github\.com\/([^\/]+)\/([^\/]+)\/blob|tree\/[^\/]+\/(.+)/,
      );
      owner = match![1];
      repo = match![2];
      relative_path = match![3];
    } else {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(.*)/);
      owner = match![1];
      repo = match![2];
      relative_path = 'catalog-info.yaml';
    }

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
              [relative_path]: completeYaml,
            },
            commit: 'New or updated catalog-info.yaml',
          },
        ],
      });
      return {
        message: 'created a pull request',
        severity: 'success',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.message =
          'Could not create a pull request. Make sure the URL is a github repo and that a pull request does not already exist.';
        throw error;
      } else {
        throw new Error('Unkown error when trying to create a PR.');
      }
    }
  };
}
