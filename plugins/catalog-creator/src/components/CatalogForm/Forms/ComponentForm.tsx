import { Flex, Select, TextField } from '@backstage/ui';
import { Controller } from 'react-hook-form';
import CatalogSearch from '../../CatalogSearch';
import { AllowedLifecycleStages, FormProps } from '../../../model/types';

export const ComponentForm = ({ index, control, errors }: FormProps) => {
  return (
    <Flex direction="column" justify="start">
      <div>
        <Controller
          name={`entities.${index}.name`}
          control={control}
          render={({ field }) => (
            <TextField {...field} name="Name" label="Entity name" isRequired />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors.entities?.[index]?.name ? 'visible' : 'hidden',
          }}
        >
          {errors.entities?.[index]?.name?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <Controller
          name={`entities.${index}.owner`}
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              label="Entity owner"
              filter="group"
              isRequired
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors.entities?.[index]?.owner ? 'visible' : 'hidden',
          }}
        >
          {errors.entities?.[index]?.owner?.message || '\u00A0'}
        </span>
      </div>

      <Flex>
        <div>
          <Controller
            name={`entities.${index}.lifecycle`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                name="lifecycle"
                label="Entity lifecycle"
                onBlur={onBlur}
                onSelectionChange={onChange}
                selectedKey={value}
                options={Object.values(AllowedLifecycleStages).map(
                  lifecycleStage => ({
                    value: lifecycleStage as string,
                    label: lifecycleStage,
                  }),
                )}
                isRequired
              />
            )}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors.entities?.[index]?.lifecycle
                ? 'visible'
                : 'hidden',
            }}
          >
            {errors.entities?.[index]?.lifecycle?.message || '\u00A0'}
          </span>
        </div>

        <div style={{ flexGrow: 1 }}>
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="Entity type"
                label="Entity type"
                isRequired
              />
            )}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors.entities?.[index]?.entityType
                ? 'visible'
                : 'hidden',
            }}
          >
            {errors.entities?.[index]?.entityType?.message || '\u00A0'}
          </span>
        </div>
      </Flex>
      <div>
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              label="Entity system"
              filter="system"
              isRequired={false}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors.entities?.[index]?.system ? 'visible' : 'hidden',
          }}
        >
          {errors.entities?.[index]?.system?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};
