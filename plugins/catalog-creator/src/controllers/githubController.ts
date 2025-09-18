import { CatalogImportApi } from '@backstage/plugin-catalog-import';
import type { CatalogInfoForm, RequiredYamlFields, Status } from '../model/types.ts';

import { updateYaml } from '../translator/translator';

export class GithubController {
    constructor(
        private catalogImportApi: CatalogImportApi,
    ) { }

    submitCatalogInfoToGithub = async (url: string, initialYaml: RequiredYamlFields, catalogInfo: CatalogInfoForm) => {
        if (url === '') {
            console.log('No GitHub repository URL specified');
            return;
        }

        try {
            

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
            throw error
        }
    };

    fetchCatalogInfoStatus = async (url: string) : Promise<Status | undefined> => {
  
        try {
            const analysisResult = await this.catalogImportApi.analyzeUrl(url)
            if (analysisResult.type == "locations") {
                return {
                    message: "Catalog-info.yaml already exists",
                    severity: "info"
                }
            } else if (analysisResult.type == "repository") {
                return {
                    message: "Found repository",
                    severity: "success"
                }
            }
        } catch(error : unknown) {
            if (error instanceof Error) {
             return {
                    message: error.message,
                    severity: "error"
                }
            } else{
                throw new Error("Unexpected error")
            }
        }
        return undefined
    }
}