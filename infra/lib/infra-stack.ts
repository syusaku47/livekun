import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'LivekunVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'LivekunSG', {
      vpc,
      description: 'Security group for Livekun EC2',
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP',
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH',
    );

    // IAM Role for EC2
    const role = new iam.Role(this, 'LivekunEc2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    // User Data
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      '#!/bin/bash',
      'set -e',

      // Install Docker
      'yum update -y',
      'yum install -y docker git',
      'systemctl start docker',
      'systemctl enable docker',
      'usermod -a -G docker ec2-user',

      // Install Docker Compose
      'DOCKER_COMPOSE_VERSION=v2.29.1',
      'curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose',
      'chmod +x /usr/local/bin/docker-compose',

      // Clone and deploy
      'cd /home/ec2-user',
      'git clone https://github.com/syusaku47/livekun.git || true',
      'cd livekun',
      'docker-compose -f docker-compose.prod.yml up -d --build',
    );

    // EC2 Instance
    const instance = new ec2.Instance(this, 'LivekunInstance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup,
      role,
      userData,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(20, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
          }),
        },
      ],
    });

    // Key Pair (SSH接続用 - 必要に応じて)
    const keyPair = new ec2.KeyPair(this, 'LivekunKeyPair', {
      keyPairName: 'livekun-keypair',
    });
    instance.instance.keyName = keyPair.keyPairName;

    // Outputs
    new cdk.CfnOutput(this, 'InstancePublicIp', {
      value: instance.instancePublicIp,
      description: 'EC2 Public IP',
    });

    new cdk.CfnOutput(this, 'InstancePublicDnsName', {
      value: instance.instancePublicDnsName,
      description: 'EC2 Public DNS',
    });

    new cdk.CfnOutput(this, 'SshCommand', {
      value: `ssh -i livekun-keypair.pem ec2-user@${instance.instancePublicIp}`,
      description: 'SSH Command',
    });
  }
}
