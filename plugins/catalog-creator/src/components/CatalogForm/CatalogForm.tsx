import {
    Button,
    Box,
    Flex,
    Select,
    TextField,
} from '@backstage/ui';

import type { CatalogInfoForm, RequiredYamlFields, Status } from '../../model/types';
import { AllowedLifecycleStages, AllowedEntityTypes, AllowedEntityKinds} from '../../model/types';
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { z } from "zod/v4"
import { formSchema } from '../../schemas/formSchema';
import { CircularProgress } from '@material-ui/core';
import Divider from '@mui/material/Divider';
import { CatalogSearch } from '../CatalogSearch';

// Props type
export type CatalogFormProps = {
    onSubmit: (data: CatalogInfoForm[]) => void;
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>> 
    status: Status,
    currentYaml : RequiredYamlFields[] | null
};


export const CatalogForm = ({onSubmit, isLoading, currentYaml}: CatalogFormProps) => {
    

    const getDefaultValues = () => {
        if (currentYaml) {
            return currentYaml.map((entry : RequiredYamlFields) => {
                return {
                    kind: entry.kind as AllowedEntityKinds,
                    name: entry.metadata.name,
                    owner: entry.spec.owner,
                    lifecycle: entry.spec.lifecycle as AllowedLifecycleStages | undefined,
                    entityType: entry.spec.type as AllowedEntityTypes,
                    system: entry.spec.system,
                }
            })
        } 
             return [{
                    kind: AllowedEntityKinds.Component,
                    name:"",
                    owner: ""
                }]
        

    }

    

    const { handleSubmit, formState: { errors }, control} = useForm<z.infer<typeof formSchema>>({
        defaultValues: { 
            entities: getDefaultValues()
            } ,
        resolver: zodResolver(formSchema),
        mode: "onBlur"
        });
    
    const { fields, append } = useFieldArray({
        name: "entities", // unique name for your Field Array
        control, // control props comes from useForm (optional: if you are using FormProvider)
    });
        
    const submitForm: SubmitHandler<z.infer<typeof formSchema>> = (data) => {        
        onSubmit(
            data.entities as CatalogInfoForm[]
        )

    }

  
    return (
        <>
        { isLoading ? 
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem",
            minHeight: "10rem",
        }}>
            <CircularProgress/>
        </div>
        :
        <form onSubmit={handleSubmit(submitForm)} >
            <Box px="2rem">
                <h2>Catalog-info.yaml Form</h2>
                {fields.map((field, index) => {
                    
                    return (
                    <Flex direction="column" justify="start" key={field.id}>
                        {index !== 0 && (
                            <div>
                           <Divider variant="middle" sx={{my: 4}}/>
                           <h3>Entity</h3>
                           </div>
                        )}
                    <div>
                        <Controller
                                name={`entities.${index}.kind`}
                                control={control}
                                render={({ 
                                    field:{ onChange, onBlur, value } 
                                }) => (
                                    <Select
                                        name="kind"
                                        label="Entity kind"
                                        onBlur={onBlur}
                                        onSelectionChange={onChange}
                                        selectedKey={value}
                                        options={
                                            Object.values(AllowedEntityKinds).map(value => ({
                                                value: value as string,
                                                label: value,
                                            }))
                                        }
                                        isRequired={index === 0}
                                        isDisabled={index === 0}
                                    />)}
                            />
                        {errors.entities?.[index]?.kind && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.entities?.[index]?.kind.message}</span>}
                    </div>
                    <div>
                        <Controller
                            name={`entities.${index}.name`}
                            control={control}
                            render={({ field }) => (
                            <TextField
                                    {...field}
                                    name="Name"
                                    label="Entity name"
                                    isRequired
                                />
                            )}
                        />
                        {errors.entities?.[index]?.name && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.entities?.[index]?.name.message}</span>}
                    </div>
                    <div>
                        
                        <Controller
                            name={`entities.${index}.owner`}
                            control={control}
                            render={({ 
                                    field:{ onChange, onBlur, value } 
                                }) => (
                            <>
                                <CatalogSearch
                                    value={value}
                                    onChange={onChange} 
                                    onBlur={onBlur}
                                    label="Owner"
                                    filter={['user', 'group']}
                                />
                            </>
                            )}
                        />
                        {errors.entities?.[index]?.owner && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.entities?.[index]?.owner.message}</span>}
                    </div>
                        
                        <Flex>
                            <div>
                            <Controller
                                name={`entities.${index}.lifecycle`}
                                control={control}
                                render={({ 
                                    field:{ onChange, onBlur, value } 
                                }) => {
                                    console.log(value)
                                    return(<Select
                                        name="lifecycle"
                                        label="Entity lifecycle"
                                        onBlur={onBlur}
                                        onSelectionChange={onChange} 
                                        selectedKey={value}                                   
                                        options={
                                            Object.values(AllowedLifecycleStages).map(value => ({
                                                value: value as string,
                                                label: value,
                                            }))
                                        }
                                        isRequired
                                    />)}}
                            />
                            {errors.entities?.[index]?.lifecycle && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.entities?.[index]?.lifecycle.message}</span>}
                            </div>

                            <div>
                            <Controller
                                name={`entities.${index}.entityType`}
                                control={control}
                                render={({ 
                                    field:{ onChange, onBlur, value } 
                                }) => (
                                    <Select
                                        name="type"
                                        label="Entity type"
                                        onBlur={onBlur}
                                        onSelectionChange={onChange}
                                        defaultSelectedKey={value}
                                        options={
                                            Object.values(AllowedEntityTypes).map(value => ({
                                                value: value as string,
                                                label: value,
                                            }))
                                        }
                                        isRequired
                                    />)}
                            />
                            {errors.entities?.[index]?.entityType && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.entities?.[index]?.entityType.message}</span>}
                            </div>

                        </Flex>
                        <div>
                        <Controller
                            name={`entities.${index}.system`}
                            control={control}
                            render={({ field }) => (
                            <TextField
                                    {...field}
                                    name="System"
                                    label="Entity System"
                                />
                            )}
                        />
                        {errors.entities?.[index]?.system && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.entities?.[index]?.system.message}</span>}
                        </div>

                    </Flex>
                    )})}
                        <Flex direction="row" align="center" style={{paddingTop: "1rem"}}>
                            <Button
                            type="button"
                            onClick={() =>
                                append({
                                    kind: "Component",
                                    name: "",
                                    owner: "",
                                    lifecycle: "production",
                                    entityType: "library",
                                    system: ""
                                })
                            }
                            >
                            Add Entity
                        </Button>
                            <Button
                                variant="primary"
                                type='submit'
                            >
                                Create pull request
                            </Button>
                        </Flex>
                    
            </Box>
        </form>
        }
        </>
    );
}