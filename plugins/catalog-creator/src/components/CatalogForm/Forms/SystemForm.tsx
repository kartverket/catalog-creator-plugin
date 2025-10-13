import { Flex, TextField } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import CatalogSearch from '../../CatalogSearch';
import { EntityErrors } from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  owners: Entity[];
};

export const SystemForm = ({
  index,
  control,
  errors,
  owners,
}: SystemFormProps) => {
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
            visibility: errors?.name ? 'visible' : 'hidden',
          }}
        >
          {errors?.name?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <Controller
          name={`entities.${index}.owner`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              label="Entity owner"
              value={value}
              entityList={owners}
              isRequired
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
        <div style={{ flexGrow: 1 }}>
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field }) => (
              <TextField {...field} name="Entity type" label="Entity type" />
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
    </Flex>
  );
};
