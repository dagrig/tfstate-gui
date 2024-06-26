export interface TerraformState {
    version: number;
    terraform_version: string;
    serial: number;
    lineage: string;
    outputs: { [key: string]: any };
    resources: TerraformResource[];
  }
  
  export interface TerraformResource {
    module: string;
    mode: string;
    type: string;
    name: string;
    provider: string;
    instances: TerraformResourceInstance[];
  }
  
  export interface TerraformResourceInstance {
    schema_version: number;
    attributes: { [key: string]: any };
    dependencies?: string[];
  }