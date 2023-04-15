import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import * as fs from "fs";

export function getKeys(publicKeyPath: string, privateKeyPath: string) {
  const publicKey = fs.readFileSync(publicKeyPath).toString();
  const privateKey = pulumi.secret(fs.readFileSync(privateKeyPath).toString());

  return { publicKey, privateKey }
}

export async function getAvailabilityZone () { 
  const azs = await aws.getAvailabilityZones();
  const availabilityZone = azs.names[0];

  return availabilityZone;
}