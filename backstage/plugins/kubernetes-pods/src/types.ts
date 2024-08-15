import { JsonObject } from '@backstage/types';
import { Entity } from '@backstage/catalog-model';

interface PodSpec extends JsonObject {
  containers: Array<{
    name: string;
    image: string;
  }>;
  [key: string]: any; 
}

export interface PodEntity extends Entity {
  spec?: PodSpec;
}


export interface Pod {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    description?: string;
    [key: string]: any;
  };
  spec: {
    containers?: Array<{
      name: string;
      image: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
}

