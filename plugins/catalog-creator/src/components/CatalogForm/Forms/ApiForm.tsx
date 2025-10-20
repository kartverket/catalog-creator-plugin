import { Flex, Select, TextField } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import CatalogSearch from '../../CatalogSearch';
import { AllowedLifecycleStages, EntityErrors } from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  systems: Entity[];
};

export const ApiForm = ({ index, control, errors, systems }: ApiFormProps) => {
  return (
    <Flex direction="column" justify="start">
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
              visibility: errors?.lifecycle ? 'visible' : 'hidden',
            }}
          >
            {errors?.lifecycle?.message || '\u00A0'}
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
              visibility: errors?.entityType ? 'visible' : 'hidden',
            }}
          >
            {errors?.entityType?.message || '\u00A0'}
          </span>
        </div>
      </Flex>
      <div>
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              label="Entity system"
              entityList={systems}
              isRequired={false}
              value={value}
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
        <Controller
          name={`entities.${index}.definition`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="Definition"
              label="API Definition (path or URL)"
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.definition ? 'visible' : 'hidden',
          }}
        >
          {errors?.definition?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};
