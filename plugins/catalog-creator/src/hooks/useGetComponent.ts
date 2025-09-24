import { githubAuthApiRef, useApi } from "@backstage/core-plugin-api"
import { useEffect, useState } from "react"
import { ComponentEntityV1alpha1 } from "@backstage/catalog-model"
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import * as YAML from 'yaml';
import { Octokit } from "@octokit/rest";




 export const useGetCatalogInfo = (url: string) => {

    // const entities = YAML.parseAllDocuments()
    const octokit = new Octokit({
        auth: useApi(githubAuthApiRef).getAccessToken, // Your GitHub Personal Access Token
    });


    useEffect(() => {
        octokit.rest.repos.getContent({
            owner,
            repo,
            path,
        });
    })

 }