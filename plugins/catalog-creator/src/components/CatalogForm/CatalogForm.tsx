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
import { z } from "zod/v4"
import { formSchema } from '../../schemas/formSchema';
import { CircularProgress } from '@material-ui/core';

// Props type
export type CatalogFormProps = {
    onSubmit: (data: CatalogInfoForm) => void;
    isLoading: boolean
};

export const CatalogForm = ({onSubmit, isLoading}: CatalogFormProps) => {

     const { handleSubmit, formState: { errors }, control} = useForm<z.infer<typeof formSchema>>({
        defaultValues: { name: "", owner: "", system: "" } ,
        resolver: zodResolver(formSchema),
        mode: "onBlur"
        });
        
    const submitForm: SubmitHandler<z.infer<typeof formSchema>> = (data) => onSubmit({
        kind: AllowedEntityKinds.Component,
        name: data.name,
        owner: data.owner,
        lifecycle: (data.lifecycle as AllowedLifecycleStages),
        type: (data.type as AllowedEntityTypes),
        system: data.system,
    })

  
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
                        <Controller
                            name="lifecycle"
                            control={control}
                            render={({ 
                                field:{ onChange, onBlur } 
                            }) => (
                                <Select
                                    name="lifecycle"
                                    label="Entity lifecycle"
                                    onBlur={onBlur}
                                    onSelectionChange={onChange}
                                    options={
                                        Object.values(AllowedLifecycleStages).map(value => ({
                                            value: value as string,
                                            label: value,
                                        }))
                                    }
                                    isRequired
                                />)}
                        />
                         {errors.lifecycle && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.lifecycle.message}</span>}
                        </div>

                        <div>
                        <Controller
                            name="type"
                            control={control}
                            render={({ 
                                field:{ onChange, onBlur } 
                            }) => (
                                <Select
                                    name="type"
                                    label="Entity type"
                                    onBlur={onBlur}
                                    onSelectionChange={onChange}
                                    options={
                                        Object.values(AllowedEntityTypes).map(value => ({
                                            value: value as string,
                                            label: value,
                                        }))
                                    }
                                    isRequired
                                />)}
                        />
                         {errors.type && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.type.message}</span>}
                        </div>

                    </Flex>
                    <div>
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
                     {errors.system && <span style={{ color: 'red', fontSize: '0.75rem'}}>{errors.system.message}</span>}
                     </div>

                    <Flex direction={'row'} align={'center'}>
                        <Button
                            variant="primary"
                            type='submit'
                        >
                            Create pull request
                        </Button>
                    </Flex>

                </Flex>
            </Box>
        </form>
        }
        </>
    );
}