import { githubAuthApiRef, useApi } from "@backstage/core-plugin-api"
import { Octokit } from "@octokit/rest";


export async function getCatalogInfo(url: string) {
    
    const githubAuthApi = useApi(githubAuthApiRef)



    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
    if (!match) {
        throw new Error("Invalid GitHub repository URL")
    }

    const owner = match[1];
    const repo = match[2];


    const fetchData = async () => {

        try {
            const octokit = new Octokit({
                auth:  await githubAuthApi.getAccessToken()
            });

            const response = await octokit.rest.repos.getContent({
                owner : owner,
                repo : repo,
                path : "catalog-info.yaml"
                });

            const fileContent = Buffer.from((response.data as { content: string }).content, 'base64').toString('utf8');
            return fileContent

        } catch (error: unknown) {
            if (error instanceof Error) {
                return "No content"
            } else {
                throw error;
            }
        }
    };
    fetchData();
 }