import { Flex, Select, TextField } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import CatalogSearch from '../../CatalogSearch';
import { AllowedLifecycleStages, EntityErrors } from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';

export type ComponentFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Component'>;
  owners: Entity[];
  systems: Entity[];
};

export const ComponentForm = ({
  index,
  control,
  errors,
  owners,
  systems,
}: ComponentFormProps) => {
  const catalogApi = useApi(catalogApiRef);

  const fetchAPIs = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'API',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

  const fetchComponentsAndResources = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: [{ kind: 'Component' }, { kind: 'Resources' }],
    });
    return results.items as Entity[];
  }, [catalogApi]);

  return (
    <Flex direction="column" justify="start">
      <div>
        <p style={{ fontSize: '0.75rem' }}>
          Entity name
          <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
        </p>
        <Controller
          name={`entities.${index}.name`}
          control={control}
          render={({ field }) => <TextField {...field} name="Name" />}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.name ? 'visible' : 'hidden',
          }}
        >
          {errors?.name?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem' }}>
          Entity owner
          <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
        </p>
        <Controller
          name={`entities.${index}.owner`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              entityList={owners}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.owner ? 'visible' : 'hidden',
          }}
        >
          {errors?.owner?.message || '\u00A0'}
        </span>
      </div>

      <Flex>
        <div>
          <p style={{ fontSize: '0.75rem' }}>
            Entity lifecycle
            <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
          </p>
          <Controller
            name={`entities.${index}.lifecycle`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                name="lifecycle"
                onBlur={onBlur}
                onSelectionChange={onChange}
                selectedKey={value}
                options={Object.values(AllowedLifecycleStages).map(
                  lifecycleStage => ({
                    value: lifecycleStage as string,
                    label: lifecycleStage,
                  }),
                )}
              />
            )}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors?.lifecycle ? 'visible' : 'hidden',
            }}
          >
            {errors?.lifecycle?.message || '\u00A0'}
          </span>
        </div>

        <div style={{ flexGrow: 1 }}>
          <p style={{ fontSize: '0.75rem' }}>
            Entity type
            <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
          </p>
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field }) => <TextField {...field} name="Entity type" />}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors?.entityType ? 'visible' : 'hidden',
            }}
          >
            {errors?.entityType?.message || '\u00A0'}
          </span>
        </div>
      </Flex>
      <div>
        <p style={{ fontSize: '0.75rem' }}>Entity system</p>
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              entityList={systems}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.system ? 'visible' : 'hidden',
          }}
        >
          {errors?.system?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem' }}>Provides APIs</p>
        <Controller
          name={`entities.${index}.providesApis`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item =>
                  typeof item === 'string' ? item : item.metadata.name,
                );
                onChange(names);
              }}
              options={fetchAPIs.value || []}
              getOptionLabel={option => {
                if (typeof option === 'string') return option;
                return option.metadata.title ?? option.metadata.name;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                const optionName =
                  typeof option === 'string' ? option : option.metadata.name;
                const valueName =
                  typeof selectedValue === 'string'
                    ? selectedValue
                    : selectedValue.metadata?.name;
                return optionName === valueName;
              }}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder="Select or create API..."
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: '0.85rem',
                      font: 'system-ui',
                    },
                  }}
                />
              )}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.providesApis ? 'visible' : 'hidden',
          }}
        >
          {errors?.providesApis?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem' }}>Consumes APIs</p>
        <Controller
          name={`entities.${index}.consumesApis`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item =>
                  typeof item === 'string' ? item : item.metadata.name,
                );
                onChange(names);
              }}
              options={fetchAPIs.value || []}
              getOptionLabel={option => {
                if (typeof option === 'string') return option;
                return option.metadata.title ?? option.metadata.name;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                const optionName =
                  typeof option === 'string' ? option : option.metadata.name;
                const valueName =
                  typeof selectedValue === 'string'
                    ? selectedValue
                    : selectedValue.metadata?.name;
                return optionName === valueName;
              }}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder="Select or create API..."
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: '0.85rem',
                      font: 'system-ui',
                    },
                  }}
                />
              )}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.consumesApis ? 'visible' : 'hidden',
          }}
        >
          {errors?.consumesApis?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem' }}>Depends on</p>
        <Controller
          name={`entities.${index}.dependsOn`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item =>
                  typeof item === 'string' ? item : item.metadata.name,
                );
                onChange(names);
              }}
              options={fetchComponentsAndResources.value || []}
              getOptionLabel={option => {
                if (typeof option === 'string') return option;
                return option.metadata.title ?? option.metadata.name;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                const optionName =
                  typeof option === 'string' ? option : option.metadata.name;
                const valueName =
                  typeof selectedValue === 'string'
                    ? selectedValue
                    : selectedValue.metadata?.name;
                return optionName === valueName;
              }}
              size="small"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: 10,
                  height: 1,
                  padding: 1,
                },
              }}
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder="Select or create resource or component..."
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: '0.85rem',
                      font: 'system-ui',
                    },
                  }}
                />
              )}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.dependsOn ? 'visible' : 'hidden',
          }}
        >
          {errors?.dependsOn?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};
