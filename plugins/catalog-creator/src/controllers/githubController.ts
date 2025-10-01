import { CatalogImportApi } from '@backstage/plugin-catalog-import';
import type { CatalogInfoForm, RequiredYamlFields, Status } from '../model/types.ts';

import { updateYaml } from '../translator/translator';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { OAuthApi } from '@backstage/core-plugin-api';

export class GithubController {
    constructor(
        private catalogImportApi: CatalogImportApi,
    ) { }

    submitCatalogInfoToGithub = async (url: string, initialYaml: RequiredYamlFields[], catalogInfo: CatalogInfoForm[], githubAuthApi: OAuthApi, emptyRequiredYaml: RequiredYamlFields ) : Promise<Status | undefined> => {
    
        const path = new URL(url).pathname.slice(1)
        

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        const owner = match![1];
        const repo = match![2];

        const maxLength = Math.max(initialYaml.length, catalogInfo.length);
        const yamlStrings = [];

        for (let i = 0; i < maxLength; i++) {
            const initial = initialYaml[i] || emptyRequiredYaml;
            const catalog = catalogInfo[i] || initialYaml[i];
            const merged =  updateYaml(initial, catalog);

            yamlStrings.push(merged);
        }
        const completeYaml = yamlStrings.join("\n---\n")

        const OctokitPlugin = Octokit.plugin(createPullRequest);
        const token = await githubAuthApi.getAccessToken(); 
        const octokit = new OctokitPlugin({ auth: token });

            try{
                await octokit.createPullRequest({
                owner: owner,
                repo: repo,
                title: "Create/update catalog-info.yaml",
                body: "Creates or updates catalog-info.yaml",
                base: "main", 
                head: "Update-or-create-catalog-info",
                changes: [
                    {
                        files: {
                            [path] : completeYaml
                        },
                        commit: "New or updated catalog-info.yaml"
                    }
                ]

            })
            return {
                message: "created a pull request",
                severity: "success"
            }
        } catch(error : unknown) {
                if (error instanceof Error) {
                return {
                        message: "Failed to create pull request, it may already exist.",
                        severity: "error",
                    }
                } 
                    throw new Error("Unexpected error")
            
        }
            
            
    };

    fetchCatalogInfoStatus = async (url: string) : Promise<Status | undefined> => {
  
        try {
            const analysisResult = await this.catalogImportApi.analyzeUrl(url)
            if (analysisResult.type === "locations") {
                return {
                    message: "Catalog-info.yaml found, editing existing file",
                    severity: "info",
                    url: analysisResult.locations[0].target
                }
            } else if (analysisResult.type === "repository") {
                return {
                    message: "Found repository",
                    severity: "success",
                }
            }
        } catch(error : unknown) {
            if (error instanceof Error) {
             return {
                    message: error.message,
                    severity: "error",
                }
            } 
                throw new Error("Unexpected error")
            
        }
        return undefined
    }
}