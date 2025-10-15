import { Flex, Select, TextField } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import CatalogSearch from '../../CatalogSearch';
import { AllowedLifecycleStages, EntityErrors } from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  owners: Entity[];
  systems: Entity[];
};

export const ApiForm = ({
  index,
  control,
  errors,
  systems,
  owners,
}: ApiFormProps) => {
  return (
    <Flex direction="column" justify="start">
      <div>
        <FieldHeader
          fieldName="Name"
          required
          tooltipText="The name of the API entity. This name is both meant for human eyes to recognize the entity, and for machines and other components to reference the entity. Must be unique"
        />
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
        <FieldHeader
          fieldName="Owner"
          tooltipText="A reference to the owner (commonly a team), that bears ultimate responsibility for the API, and has the authority and capability to develop and maintain it"
          required
        />
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
          <FieldHeader
            fieldName="Lifecycle"
            tooltipText="The lifecycle state of the API"
            required
          />
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
          <FieldHeader
            fieldName="Type"
            tooltipText="The type of the API."
            required
          />
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
        <FieldHeader
          fieldName="System"
          tooltipText="Reference to the system which the component belongs to"
        />
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              entityList={systems}
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
        <FieldHeader
          fieldName="API Definition (path or URL)"
          tooltipText="Relative path to the API definition file (OpenAPI, AsyncAPI, GraphQL, or gRPC). Required for new APIs. If editing an existing API this field may already be populated, check the existing catalog-info.yaml"
        />
        <Controller
          name={`entities.${index}.definition`}
          control={control}
          render={({ field }) => <TextField {...field} name="Definition" />}
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
