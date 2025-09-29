import {
  TextField,
  Button,
  Box,
  Card,
  Icon,
  Flex,
  Link
} from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';


import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';

import { catalogImportApiRef } from '@backstage/plugin-catalog-import';

import { useState } from 'react';

import type { CatalogInfoForm, RequiredYamlFields, Status } from '../../model/types';
import { CatalogForm } from '../CatalogForm';

import { GithubController } from '../../controllers/githubController';
import { Alert } from '@mui/material';
import { getCatalogInfo } from '../../utils/getCatalogInfo';

export const CatalogCreatorPage = () => {

  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status | undefined>();
  const [submittedPR, setSubmittedPR] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<RequiredYamlFields[] | null>(null)
  

  const catalogImportApi = useApi(catalogImportApiRef);
  const githubAuthApi : OAuthApi = useApi(githubAuthApiRef);
  const githubController = new GithubController(catalogImportApi);

  const emptyRequiredYamlFields: RequiredYamlFields[] = [{
    apiVersion: 'backstage.io/v1alpha1',
      kind: "",
      metadata: {
        name: ''
      },
      spec: {
        type: "",
    },  
  }];


  const submitFetchCatalogInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    try {
       const catalogStatus =  await githubController.fetchCatalogInfoStatus(url);
       if (catalogStatus?.url) {
          setUrl(catalogStatus.url)
          const catalogInfoResponse = await getCatalogInfo(url, githubAuthApi)
          setResponse(catalogInfoResponse)
       }
       setStatus(catalogStatus)
    }
    catch(error : unknown) {
      console.error("Could not get catalogInfoStatus", error)
    } finally {
       setIsLoading(false)
    }
  };

  const submitGithubRepo = async (catalogInfoFormList: CatalogInfoForm[]) => {
    setIsLoading(true)
      try{
          // old code that works for no catalog-info basic case
           const prStatus: Status | undefined = await githubController.submitCatalogInfoToGithub(url, response ? response : emptyRequiredYamlFields, catalogInfoFormList, githubAuthApi, emptyRequiredYamlFields[0]);
           if (prStatus?.severity == "success") {
            setSubmittedPR(true)

           }
           setStatus(prStatus)
        }
     catch(error: unknown){
      if (error instanceof Error) {
        setStatus({
          message: error.message,
          severity: "error",
        })
      }
      else {
        throw error
      }
     }
      setIsLoading(false)
  };

  const resetForm = () => {
    setResponse(null)
    setStatus(undefined)
    setUrl('')
    setSubmittedPR(false)
  }


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
                  <Link onClick={() => {resetForm() }}>Register a new component?</Link>
                </Flex>
              </Box>
            </Card>
          )
          :
          (          
          <Card>
            <form onSubmit={submitFetchCatalogInfo}>
              <Box px={'2rem'}>
                  <Flex align="end">
                    <div style={{flexGrow: 1}}>
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
                    </div>
                    <Button type='submit'>Fetch!</Button>
               </Flex>
              </Box>
            </form>

            {
              (status?.severity !== "success" && status) && (
               <Alert sx={{ mx: 2 }} severity={status.severity}>{status.message}</Alert>
              )
            }

            {(status?.severity == "success" || status?.severity == "info") && (
              <CatalogForm
                onSubmit={submitGithubRepo}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                status={status}
                currentYaml={ response }
              />
            )}
          </Card>
          )}
        </Box>
      </Content>
    </Page >
  );
};
