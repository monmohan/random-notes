AWS_Notes_StorageGatway
connect on-premise software appliance with cloud , secure integration with aws storage infrastructure
AWS storage gateway software appliance is available for download as a virtual machine image that you install on a host in your data center. Storage gateway supports either VMWare ESXi or Microsoft Hyper-V. Once you have installed your gateway and associated it with your AWS account, through the activation process, you can use the AWS Management Console to create the storage gateway option that is right for you.
File Gateway for storing plain files directly to S3. Files are stored in a S3 bucket and accessed through a NFS mount point. Nothing is stored locally. Ownership perm and timestamp are stored as object metadata associated with the file in S3. File Gateway can be connected via "direct connect/dedicated line", via internet or the whole setup may run within an amazon VPC.
Volume Gateway is for block storage (iSCSI). Two types stored volume and cached volume. Applications see virtual disk volumes which are accessible using iSCSI block protocol. they are basically hard disks and data stored is asynchronously backed up as point in time EBS snapshots in cloud. Snapshots are incremental and only changes backed up. Stored volumes provide low latency access to on-premise data and with durable backup in S3 as EBS Snapshots.
Cached volume uses S3 as primary storage while retaining the most recently accessed data locally in your storage gateway.
Tape Gateway is backup and archival solution

Before Snowball there was Import/Export and users could send portable devices, this became unmanagable because of different types of disk being sent.
Snowball
is standard data box. uses multiple layers of security , tamper resistent enclosures, 256 bit encryption and an industry standard Trusted Platform Module (TPM) with full chain of custody. Can be used for both import to S3 and export from S3
Snowball Edge is an AWS datacenter in box. Say an aircraft wants to store running data related to engine, the SBE can run lambda functions etc. and provide compute+data. Later transport to AWS for storage.
Snowmobile for Exa and petabyte of data. A trailer with container.


Data records are composed of a sequence number, partition key, and data blob, which is an immutable sequence of bytes