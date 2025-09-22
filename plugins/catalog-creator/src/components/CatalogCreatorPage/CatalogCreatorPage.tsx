import {
  TextField,
  Button,
  Box,
  Card,
  Icon,
  Flex,
  Link,
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
  const [status, setStatus] = useState<Status | undefined>();
  const [submittedPR, setSubmittedPR] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true)
      try{
        await githubController.submitCatalogInfoToGithub(url, emptyRequiredYamlFields, catalogInfoForm);
        setSubmittedPR(true)
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
      setIsLoading(false)
  };

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton />
        </ContentHeader>

        <Box maxWidth={'500px'}>
          { submittedPR ? (
            <Card>
              <Box px={'2rem'}>
                <Flex direction={"column"} align={{ xs: 'start', md: 'center' }} py={'2rem'}>
                  <Alert sx = {{ fontWeight:'bold'}}severity='success'>Successfully created a pull request </Alert>
                  <Link onClick={() => setSubmittedPR(false)}>Register a new component?</Link>
                </Flex>
              </Box>
            </Card>
          )
          :
          (          
          <Card>
            <form onSubmit={submitFetchCatalogInfo}>
              <Box px={'2rem'}>
                <Flex direction={'row'} align={'end'}>
                  <TextField
                    style={{flexGrow: 1}}
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
                isLoading={isLoading}
              />
            )}
          </Card>
          )}
        </Box>
      </Content>
    </Page >
  );
};
