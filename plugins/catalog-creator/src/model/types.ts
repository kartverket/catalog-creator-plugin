export enum AllowedEntityKinds {
  Component = 'Component',
  API = 'API',
  Template = 'Template',
  System = 'System',
  Domain = 'Domain',
  Resource = 'Resource',
}

export enum AllowedLifecycleStages {
  development = 'development',
  production = 'production',
  deprecated = 'deprecated',
}

export type CatalogInfoForm = {
  id: number;
  kind: AllowedEntityKinds;
  name: string;
  owner: string;
  lifecycle: AllowedLifecycleStages;
  entityType: string | null;
  system?: string;
  domain?: string;
  providesApis?: string[];
  consumesApis?: string[];
  dependsOn?: string[];
  definition?: string[];
};

export type Status = {
  message: string;
  severity: 'error' | 'success' | 'warning' | 'info';
  url?: string;
};

export type RequiredYamlFields = {
  apiVersion: 'backstage.io/v1alpha1';
  kind: string;
  metadata: {
    name: string;
    title?: string;
    description?: string;
    namespace?: string;
    tags?: string[];
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
    links?: [
      {
        url: string;
        title: string;
        type?: string;
      },
    ];
  };
  spec: {
    owner?: string;
    lifecycle?: string;
    type?: string;
    system?: string;
    domain?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    implementsApis?: string[];
    definition?: string[];
    target?: string;
    [key: string]: any; // Allow additional spec fields
  };
};
