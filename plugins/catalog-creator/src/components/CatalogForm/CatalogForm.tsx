import {
    Button,
    Box,
    Flex,
    Select,
    TextField,
} from '@backstage/ui';

import type { CatalogInfoForm } from '../../model/types';
import { AllowedLifecycleStages, AllowedEntityTypes, AllowedEntityKinds } from '../../model/types';
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { DownloadButton } from '../DownloadButton';
import { formSchema } from '../../schemas/formSchema';

// Props type
export type CatalogFormProps = {
    onSubmit: (data: CatalogInfoForm) => void;
    yamlContent: string;
    setYamlContent: (data: string) => void;
};

export const CatalogForm = ({onSubmit, yamlContent}: CatalogFormProps) => {

     const { register, handleSubmit, formState: { errors }, control} = useForm<z.infer<typeof formSchema>>({
        defaultValues: { name: "", owner: "", system: "" } ,
        resolver: zodResolver(formSchema),
        mode: "onBlur"
        });
        
    const submitForm: SubmitHandler<z.infer<typeof formSchema>> = (data) => onSubmit({
        kind: AllowedEntityKinds.Component,
        name: data.name,
        owner: data.owner,
        lifecycle: (data.lifecycle as AllowedLifecycleStages),
        type: (data.type as AllowedEntityTypes)
    })

  
    return (
        <form onSubmit={handleSubmit(submitForm)} >
            <Box px={'2rem'}>
                <h2>Catalog-info.yaml Form</h2>
                <Flex direction={'column'} justify={"start"}>
                <div>
                    <Controller
                        name="name"
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
                    {errors.name && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.name.message}</span>}
                </div>
                <div>
                    <Controller
                        name="owner"
                        control={control}
                        render={({ field }) => (
                        <TextField
                                {...field}
                                name="Owner"
                                label="Entity owner"
                                isRequired
                            />
                        )}
                    />
                    {errors.owner && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.owner.message}</span>}
                </div>

                    <Flex>
                        <div>
                        <Select
                            {...register('lifecycle')}
                            name="Lifecycle"
                            label="Entity lifecycle"
                            options={
                                Object.values(AllowedLifecycleStages).map(value => ({
                                    value: value as AllowedLifecycleStages,
                                    label: value,
                                }))
                            }
                            placeholder="Select lifecycle"
                            isRequired 
                        />
                         {errors.lifecycle && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.lifecycle.message}</span>}
                        </div>

                        <div>
                            <Select
                                {...register('type')}
                                name="Type"
                                label="Entity type"
                                options={
                                    Object.values(AllowedEntityTypes).map(value => ({
                                        value: value as AllowedEntityTypes,
                                        label: value,
                                    }))
                                }
                                placeholder="Select type"
                                isRequired
                            />
                            {errors.lifecycle && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.lifecycle.message}</span>}
                        </div>
                    </Flex>

                    <Controller
                        name="system"
                        control={control}
                        render={({ field }) => (
                        <TextField
                                {...field}
                                name="System"
                                label="Entity System"
                            />
                        )}
                    />
                    {errors.system && <span >{errors.system.message}</span>}

                    <Flex direction={'row'} align={'center'}>
                        <Button
                            variant="primary"
                            type='submit'
                        >
                            Generate YAML
                        </Button>
                        <DownloadButton yamlContent={yamlContent} />
                    </Flex>

                </Flex>
            </Box>
        </form>
    );
}