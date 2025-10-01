import { TextField, Button, Box, Card, Icon, Flex, Link } from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';

import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';

import { catalogImportApiRef } from '@backstage/plugin-catalog-import';

import type { CatalogInfoForm } from '../../model/types';
import { CatalogForm } from '../CatalogForm';

import { GithubController } from '../../controllers/githubController';

import { getCatalogInfo } from '../../utils/getCatalogInfo';
import { useAsyncFn } from 'react-use';
import Alert from '@mui/material/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useState } from 'react';

export const CatalogCreatorPage = () => {
  const catalogImportApi = useApi(catalogImportApiRef);
  const githubAuthApi: OAuthApi = useApi(githubAuthApiRef);
  const githubController = new GithubController();

  const [url, setUrl] = useState('');

  const [catalogInfoState, doFetchCatalogInfo] = useAsyncFn(getCatalogInfo);

  const [analysisResult, doAnalyzeUrl] = useAsyncFn(async () => {
    const result = await catalogImportApi.analyzeUrl(url);
    if (result.type === 'locations')
      doFetchCatalogInfo(result.locations[0].target, githubAuthApi);
    return result;
  }, [url, githubAuthApi]);

  const [repoState, doSubmitToGithub] = useAsyncFn(
    (catalogInfoFormList: CatalogInfoForm[]) => {
      return githubController.submitCatalogInfoToGithub(
        url,
        catalogInfoState.value || [],
        catalogInfoFormList,
        githubAuthApi,
      );
    },
    [githubAuthApi, catalogInfoState.value, url],
  );

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton />
        </ContentHeader>

        <Box maxWidth="500px">
          {repoState.value?.severity === 'success' ? (
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
                      setUrl('');
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
                  doAnalyzeUrl();
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

              {analysisResult.value?.type === 'locations' &&
                !(catalogInfoState.error || repoState.error) && (
                  <Alert sx={{ mx: 2 }} severity="info">
                    Catalog-info.yaml already exists. Editing existing file.
                  </Alert>
                )}

              {repoState.error && (
                <Alert sx={{ mx: 2 }} severity="error">
                  {repoState.error?.message}
                </Alert>
              )}

              {catalogInfoState.error && (
                <Alert sx={{ mx: 2 }} severity="error">
                  {catalogInfoState.error?.message || repoState.error?.message}
                </Alert>
              )}

              {repoState.loading ||
              analysisResult.loading ||
              catalogInfoState.loading ? (
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
                  {catalogInfoState.value && (
                    <CatalogForm
                      onSubmit={doSubmitToGithub}
                      currentYaml={catalogInfoState.value}
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
