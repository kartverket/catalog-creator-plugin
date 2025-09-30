import { TextField, Button, Box, Card, Icon, Flex, Link } from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';

import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';

import { catalogImportApiRef } from '@backstage/plugin-catalog-import';

import { useState } from 'react';

import type {
  CatalogInfoForm,
  RequiredYamlFields,
  Status,
} from '../../model/types';
import { CatalogForm } from '../CatalogForm';

import { GithubController } from '../../controllers/githubController';

import { getCatalogInfo } from '../../utils/getCatalogInfo';
import { useAsyncFn } from 'react-use';
import Alert from '@mui/material/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

export const CatalogCreatorPage = () => {
  const [prError, setprError] = useState(false)
  const [url, setUrl] = useState('');
  const [submittedPR, setSubmittedPR] = useState<boolean>(false);

  const catalogImportApi = useApi(catalogImportApiRef);
  const githubAuthApi: OAuthApi = useApi(githubAuthApiRef);
  const githubController = new GithubController();
  const [catalogInfoState, doFetchCatalogInfo] = useAsyncFn(
    async catalogUrl => {

       const analysisResult = await catalogImportApi.analyzeUrl(catalogUrl);
      let response: RequiredYamlFields[] | null = null;
      if (analysisResult.type === 'locations') {
        response = await getCatalogInfo(analysisResult.locations[0].target, githubAuthApi);
      }

      return { analysisResult, response };
    },
    [url],
  );


  const [repoState, doSubmitToGithub] = useAsyncFn(
    async (catalogInfoFormList: CatalogInfoForm[]) => {
      setprError(true)
      const repoStatus: Status | undefined =
        await githubController.submitCatalogInfoToGithub(
          url,
          catalogInfoState.value?.response || [],
          catalogInfoFormList,
          githubAuthApi,
        );
      if (repoStatus?.severity === 'success') {
        setSubmittedPR(true);
      }
      
      return { repoStatus };
    },
    [catalogInfoState.value?.response],
  );

  const resetForm = () => {
    setUrl('');
    setSubmittedPR(false);
  };

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton />
        </ContentHeader>

        <Box maxWidth="500px">
          {submittedPR ? (
            <Card>
              <Box px="2rem">
                <Flex
                  direction="column"
                  align={{ xs: 'start', md: 'center' }}
                  py="2rem"
                >
                  <Alert sx={{ fontWeight: 'bold' }} severity="success">
                    Successfully created a pull request{' '}
                  </Alert>
                  <Link
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    Register a new component?
                  </Link>
                </Flex>
              </Box>
            </Card>
          ) : (
            <Card>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  doFetchCatalogInfo(url);
                  setprError(false)
                }}
              >
                <Box px="2rem">
                  <Flex align="end">
                    <div style={{ flexGrow: 1 }}>
                      <TextField
                        label="Repository URL"
                        size="small"
                        icon={<Icon name="sparkling" />}
                        placeholder="Enter a URL"
                        name="url"
                        value={url}
                        onChange={e => {
                          setUrl(e);
                        }}
                      />
                    </div>
                    <Button type="submit">Fetch!</Button>
                  </Flex>
                </Box>
              </form>

              {
                (catalogInfoState.value?.analysisResult.type === "locations") && !(catalogInfoState.error || prError)
                &&
                 <Alert sx={{ mx: 2 }} severity="info">
                  Catalog-info.yaml already exists. Editing existing file.
                </Alert>
              }

              {(catalogInfoState.error) && (
                <Alert sx={{ mx: 2 }} severity="error">
                  {catalogInfoState.error?.message||repoState.error?.message}
                </Alert>)
              }

              {(repoState.error && prError) && (
                <Alert sx={{ mx: 2 }} severity="error">
                  {repoState.error?.message}
                </Alert>)
              }
             

              {repoState.loading || catalogInfoState.loading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1.5rem',
                    minHeight: '10rem',
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  {(catalogInfoState.value?.analysisResult.type) && (
                      <CatalogForm
                        onSubmit={doSubmitToGithub}
                        currentYaml={catalogInfoState.value?.response}
                      />
                    )}
                </div>
              )}
            </Card>
          )}
        </Box>
      </Content>
    </Page>
  );
};
