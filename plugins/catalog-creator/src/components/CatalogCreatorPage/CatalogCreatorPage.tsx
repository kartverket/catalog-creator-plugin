import {
  TextField,
  Button,
  Box,
  Card,
  Icon,
  Flex,
} from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';


import { useApi } from '@backstage/core-plugin-api';

import { catalogImportApiRef } from '@backstage/plugin-catalog-import';

import { useState } from 'react';

import type { CatalogInfoForm, RequiredYamlFields, Status } from '../../model/types';
import { CatalogForm } from '../CatalogForm';

import { GithubController } from '../../controllers/githubController';
import { Alert } from '@mui/material';

export const CatalogCreatorPage = () => {

  const [url, setUrl] = useState('');


  const [yamlContent, setYamlContent] = useState<string>('');
  const [status, setStatus] = useState<Status | undefined>()

  const catalogImportApi = useApi(catalogImportApiRef);
  const githubController = new GithubController(catalogImportApi);

  const emptyRequiredYamlFields: RequiredYamlFields = {
    apiVersion: 'backstage.io/v1alpha1',
      kind: "Component",
      metadata: {
        name: ''
      },
      spec: {
        type: "",
    },  
  };


  const submitFetchCatalogInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
       const status =  await githubController.fetchCatalogInfoStatus(url);
        setStatus(status)
    }
    catch(error : unknown) {
      console.error("Could not get catalogInfoStatus", error)
    }
  };

  const submitGithubRepo = async (catalogInfoForm: CatalogInfoForm) => {
      try{
        await githubController.submitCatalogInfoToGithub(url, emptyRequiredYamlFields, catalogInfoForm);
      }
     catch(error: unknown){
      if (error instanceof Error) {
        setStatus({
          message: error.message,
          severity: "error"
        })
      }
      else {
        throw error
      }
     }
  };

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>

        <Box maxWidth={'500px'}>
          <Card>
            <form onSubmit={submitFetchCatalogInfo}>
              <Box px={'2rem'}>
                <Flex direction={'row'} align={'end'}>
                  <TextField
                    label="Repository URL"
                    size="small"
                    icon={<Icon name="sparkling" />}
                    placeholder="Enter a URL"
                    name="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e);
                    }}
                  />
                  <Button type='submit'>Fetch!</Button>
                </Flex>
              </Box>
            </form>

            {
              (status?.severity !== "success" && status) && (
               <Alert sx={{ mx: 2 }} severity={status.severity}>{status.message}</Alert>
              )
            }

            {(status?.severity == "success") && (
              <CatalogForm
                onSubmit={submitGithubRepo}
                yamlContent={yamlContent}
                setYamlContent={setYamlContent}
              />
            )}
          </Card>
        </Box>
      </Content>
    </Page >
  );
};
