import * as aws from '@pulumi/aws';
import * as command from '@pulumi/command'
import * as pulumi from '@pulumi/pulumi';
import { getKeys } from './helpers';

const env = {
  publicKeyPath: '/home/hussain/.ssh/id_rsa.pub',
  privateKeyPath: '/home/hussain/.ssh/id_rsa',
  ecrCredentials: '',
  imageName: ''
};

const config = new pulumi.Config();
const getAvailabilityZones = aws.getAvailabilityZones();
//TODO: Create the ec2 instance of server with docker installed on it

const ec2InstanceSize = config.get("ec2InstanceSize") || "t2-micro";

const awsLinuxAmi = aws.ec2.getAmi({
  owners: ["ubuntu"],
  filters: [{
    name: "name",
    values: ["ami-0aa2b7722dc1b5612"]
  }],
  mostRecent: true
});

const { publicKey, privateKey } = getKeys(env.publicKeyPath, env.privateKeyPath)
const keyPair = new aws.ec2.KeyPair("service-keypair", {publicKey: publicKey})
// we will need a vpc to connect services together with it and give them names
const vpc = new aws.ec2.Vpc("prod-vpc", {
  enableDnsSupport: true,
  instanceTenancy: "default"
});

const subnetPublic = new aws.ec2.Subnet("prod-subnet-public", {
  vpcId: vpc.id,
  mapPublicIpOnLaunch: true,
  availabilityZone: getAvailabilityZones.then(zones => zones.names[0])
})

const ec2AllowRule = new aws.ec2.SecurityGroup("ec2-allow-rule", {
  vpcId: vpc.id,
  ingress: [
    {
      description: "SSH",
      fromPort: 22,
      toPort: 22,
      protocol: "tcp",
      cidrBlocks: ["0.0.0.0/0"]
    },
  ],
  egress: [{
    fromPort: 0,
    toPort: 0,
    protocol: "-1" // all
  }],
  tags: {
    name: "allow ssh in, and anything else out"
  }
});



const serviceInstance = new aws.ec2.Instance("consumer-instance", {
  ami: awsLinuxAmi.then(awsLinuxAmi => awsLinuxAmi.id),
  instanceType: ec2InstanceSize,
  subnetId: subnetPublic.id,
  vpcSecurityGroupIds: [ec2AllowRule.id],
  keyName: keyPair.id,
  tags: {
    name: "service-instance-consumer"
  }
})

const elasticIp = new aws.ec2.Eip("consumer-eip", { instance: serviceInstance.id });

const createCmd = 
`(sudo apt-get remove docker docker-engine docker.io containerd runc)
(sudo apt-get update)
(sudo apt-get install ca-certificates curl gnupg)
(install -m 0755 -d /etc/apt/keyrings)
(curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg chmod a+r /etc/apt/keyrings/docker.gpg)
(echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null)
(sudo apt-get update)
(sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y)
(sudo groupadd docker)
(sudo usermod -aG docker ubuntu)
(newgrp docker)
(sudo systemctl enable docker.service)
(sudo systemctl enable containerd.service)`


const installDockerCmd = new command.remote.Command("installDockerCmd", {
  connection: {
    host: elasticIp.publicIp,
    port: 22,
    user: "ubuntu",
    privateKey
  },
  create: createCmd
})