import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class EksBackstageClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the VPC
    const vpc = new ec2.Vpc(this, 'BackstageVpc', {
      maxAzs: 3, // Maximum number of Availability Zones
      natGateways: 1, // Number of NAT Gateways
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC, // Public Subnet
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, // Updated Subnet Type
        },
      ],
    });

    // Define the IAM Role for cluster admin
    const clusterAdminRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(), // This role is assumed by the account root user
    });

    // Create an IAM Policy with the required permissions
    const cdkPermissionsPolicy = new iam.Policy(this, 'CdkPermissionsPolicy', {
      policyName: 'CdkBootstrapAndDeployPolicy',
      statements: [
        new iam.PolicyStatement({
          actions: [
            'cloudformation:DescribeStacks',
            'cloudformation:CreateStack',
            'cloudformation:UpdateStack',
            'cloudformation:DeleteStack',
            's3:*',
            'iam:*',
            'ec2:*',
            'eks:*'
          ],
          resources: ['*'],
        }),
      ],
    });

    // Attach the policy to the Admin Role
    clusterAdminRole.attachInlinePolicy(cdkPermissionsPolicy);

    // Alternatively, attach the policy to an existing IAM user
    const existingUser = iam.User.fromUserName(this, 'ExistingUser', 'roman.protsyk');
    existingUser.attachInlinePolicy(cdkPermissionsPolicy);

    // Create the EKS Cluster
    const cluster = new eks.Cluster(this, 'BackstageEksCluster', {
      vpc: vpc,
      defaultCapacity: 2, // Default number of EC2 instances
      version: eks.KubernetesVersion.V1_30, // Kubernetes version
      mastersRole: clusterAdminRole, // Role with admin access to the cluster
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }], // Updated Subnet Type
    });
    
    // Add Auto Scaling Group with EC2 instances
    cluster.addAutoScalingGroupCapacity('DefaultCapacity', {
      instanceType: new ec2.InstanceType('t3.medium'), // Instance type for EC2
      minCapacity: 2, // Minimum capacity of the Auto Scaling group
    });

    // Output the Cluster Name
    new cdk.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName,
    });
  }
}
