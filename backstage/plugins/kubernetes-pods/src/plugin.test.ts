import { kubernetesPodsPlugin } from './plugin';

describe('kubernetes-pods', () => {
  it('should export plugin', () => {
    expect(kubernetesPodsPlugin).toBeDefined();
  });
});
