import { OAuthApi } from '@backstage/core-plugin-api';
import type { CatalogImportApi } from '@backstage/plugin-catalog-import';

import type { CatalogInfoForm, RequiredYamlFields, Status } from '../model/types.ts';

import yaml from 'yaml';

import { updateYaml } from '../translator/translator';

export class GithubController {
    constructor(
        private catalogImportApi: CatalogImportApi,
        private githubAuthApi: OAuthApi
    ) { }

    submitCatalogInfoToGithub = async (url: string, initialYaml: RequiredYamlFields, catalogInfo: CatalogInfoForm) => {
        if (url === '') {
            console.log('No GitHub repository URL specified');
            return;
        }

        try {
            // Parse owner and repo from URL
            const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) {
                console.log('Invalid GitHub repository URL');
                return;
            }

            const yamlContent = updateYaml(initialYaml, catalogInfo);

            // Use api to get default commit message + title, handle possibly missing method
            const { title, body } = await (this.catalogImportApi.preparePullRequest?.() ?? Promise.resolve({
                title: 'Add catalog-info.yaml',
                body: 'This PR adds a Backstage catalog-info.yaml file for import.',
            }));

            // Submit the PR
            const result = await this.catalogImportApi.submitPullRequest({
                repositoryUrl: url,  // 👈 the repo URL the user typed in
                fileContent: yamlContent,
                title,
                body,
            });

            console.log('Pull request created:', result.link);
            console.log('Entity will be available at:', result.location);
        } catch (error) {
            console.error('Error processing GitHub repository:', error);
        }
    };

    fetchCatalogInfoStatus = async (url: string): Promise<Status> => {

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            throw new Error("Invalid Github URL");
        }

        const owner = match[1];
        const repo = match[2];

        
        try {
            const token = await this.githubAuthApi.getAccessToken();
            const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/catalog-info.yaml`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (response.ok) {
                return {
                    message: "Catalog-info.yaml already exists",
                    severity: "info"
                }

            } else if (response.status === 404) {
                return {
                    message: "Github repository found",
                    severity: "success"
                }
            } else {
            return {
                    message: `Error checking catalog-info.yaml: ${response.statusText}`,
                    severity: "error"
                }
            }
        } catch(error) {
            console.error("Could not retrieve github repo ", error)
        }
    

        // If no entityData, just check if catalog-info.yaml exists and fetch it
    }
}