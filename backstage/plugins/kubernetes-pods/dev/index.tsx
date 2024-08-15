import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { kubernetesPodsPlugin } from '../src/plugin';
import PodsPage from '../../../packages/app/src/components/pods/PodsPage';

createDevApp()
  .registerPlugin(kubernetesPodsPlugin)
  .addPage({
    element: <PodsPage />,
    title: 'Root Page',
    path: '/kubernetes-pods',
  })
  .render();
