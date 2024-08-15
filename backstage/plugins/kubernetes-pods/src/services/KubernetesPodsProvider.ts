import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

export class KubernetesPodsProvider implements EntityProvider {
  private coreV1Api: CoreV1Api;
  private connection?: EntityProviderConnection;

  constructor() {
    const kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();
    this.coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
  }

  getProviderName(): string {
    return 'kubernetes-pods';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return Promise.resolve();
  }

  async refreshEntities(): Promise<void> {
    if (!this.connection) {
      throw new Error('KubernetesPodsProvider is not connected to a catalog');
    }

    try {
      const response = await this.coreV1Api.listPodForAllNamespaces();
      const pods = response.body.items;
      const entities = pods.map(pod => ({
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Pod',
          metadata: {
            name: pod.metadata?.name || 'unknown-pod-name',
            description: `Pod ${pod.metadata?.name} in Kubernetes`,
            namespace: pod.metadata?.namespace, 
            labels: pod.metadata?.labels, 
            annotations: pod.metadata?.annotations, 
          },
          spec: {
            containers: pod.spec?.containers?.map(container => ({
              name: container.name,
              image: container.image,
            })),
          },
        },
      }));

      await this.connection.applyMutation({
        type: 'full',
        entities,
      });
    } catch (error) {
      console.error('Error fetching pods:', error);
    }
  }
}
