import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';

export const kubernetesPodsPlugin = createPlugin({
  id: 'kubernetes-pods',
  routes: {
    root: createRouteRef({ id: 'kubernetes-pods' }),
  },
});
