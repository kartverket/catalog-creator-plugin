import {
    Button,
    Box,
    Flex,
    Select,
    TextField
} from '@backstage/ui';

import type { CatalogInfoForm } from '../../model/types';
import { AllowedEntityKinds, AllowedLifecycleStages, AllowedEntityTypes } from '../../model/types';

import { DownloadButton } from '../DownloadButton';

// Props type
export type CatalogFormProps = {
    onSubmit: (data: any) => void;
    catalogInfoForm: CatalogInfoForm;
    setCatalogInfoForm: (data: CatalogInfoForm) => void;
    yamlContent: string;
    setYamlContent: (data: string) => void;
};

export const CatalogForm = (props: CatalogFormProps) => {

    return (
        <form onSubmit={props.onSubmit}>
            <Box px={'2rem'}>
                <Flex direction={'column'} align={'center'}>
                <TextField
                    name="Name"
                    label="Entity name *"
                    value={props.catalogInfoForm.name}
                    onChange={(e: any) => {
                        console.log('Entity name changed:', e);
                        props.setCatalogInfoForm({ ...props.catalogInfoForm, name: e });
                    }}
                />

                    <TextField
                        name="Owner"
                        label="Entity owner *"
                        value={props.catalogInfoForm.owner}
                        onChange={(e: any) => {
                            console.log('Entity owner changed:', e);
                            props.setCatalogInfoForm({ ...props.catalogInfoForm, owner: e });
                        }}
                    />

                    <Flex>
                        <Select
                            name="Lifecycle"
                            label="Entity lifecycle *"
                            options={
                                Object.values(AllowedLifecycleStages).map(value => ({
                                    value: value as AllowedLifecycleStages,
                                    label: value,
                                }))
                            }
                            onSelectionChange={value => {
                                console.log('Selected lifecycle:', value);
                                props.setCatalogInfoForm({ ...props.catalogInfoForm, lifecycle: value as AllowedLifecycleStages });
                            }}
                            placeholder="Select lifecycle"
                        />

                        <Select
                            name="Type"
                            label="Entity type *"
                            options={
                                Object.values(AllowedEntityTypes).map(value => ({
                                    value: value as AllowedEntityTypes,
                                    label: value,
                                }))
                            }
                            onSelectionChange={value => {
                                console.log('Selected type:', value);
                                props.setCatalogInfoForm({ ...props.catalogInfoForm, type: value as AllowedEntityTypes });
                            }}
                            placeholder="Select type"
                        />
                    </Flex>

                    <TextField
                        name="System"
                        label="Entity system"
                        value={props.catalogInfoForm.system}
                        onChange={(e: any) => {
                            console.log('Entity system changed:', e);
                            props.setCatalogInfoForm({ ...props.catalogInfoForm, system: e });
                        }}
                    />

                    <Flex direction={'row'} align={'center'}>
                        <Button
                            variant="primary"
                            type='submit'
                        >
                            Generate YAML
                        </Button>
                        <DownloadButton yamlContent={props.yamlContent} />
                    </Flex>

                </Flex>
            </Box>
        </form>
    );
}