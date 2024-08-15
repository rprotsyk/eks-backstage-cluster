import React, { useState } from 'react';
import { Grid, Button, CircularProgress, Typography } from '@material-ui/core';
import {
  EntityListProvider,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import KubernetesPodsIcon from '@material-ui/icons/Apps';
import { AddPodModal } from 'plugin-kubernetes-pods/src/components/AddPodModal';
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';

interface PodSpec extends JsonObject {
  containers: Array<{
    name: string;
    image: string;
  }>;
  [key: string]: any;
}

interface PodEntity extends Entity {
  spec?: PodSpec;
}

const PodListComponent: React.FC = () => {
  const { entities, loading, error } = useEntityList();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">Error loading pods: {error.message}</Typography>
    );
  }

  const pods = entities.filter(entity => entity.kind === 'Pod') as PodEntity[];

  return (
    <div>
      <Typography variant="h4">Kubernetes Pods</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<KubernetesPodsIcon />}
        onClick={handleOpenModal}
      >
        Add new pod
      </Button>
      <Grid container spacing={3}>
        {pods.map(entity => (
          <Grid item xs={12} sm={6} md={4} key={entity.metadata.name}>
            <div>
              <Typography variant="h6">{entity.metadata.name}</Typography>
              <Typography variant="body2">
                {entity.spec?.containers?.[0]?.image || 'No image available'}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
      <AddPodModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

const PodsPage = () => {
  return (
    <EntityListProvider>
      <PodListComponent />
    </EntityListProvider>
  );
};

export default PodsPage;
