Storage Notes
Disk
Disk is a direct access device. A disk consists of many flat plates called platters. Each platter is divided into concentrics circular stipes called tracks. Each track is divided into sector which are fixed size information storage space. sector size is set at disk manufacture time and can't be changed. A disk space is logically viewed as array of disk blocks. A block is set of contagious sectors on same track. When disk is formatted block size can be set.Each block is addressed by a tuple {cylinder number, track number, start sector number}

RAID stands for redundant array of inexpensive disks. Basically using multiple disks to achieve better performance and reliability.
RAID allows you to make multiple physical hard drives into one logical drive that a computer sees.

RAID 0 is called disk striping because data is striped across multiple disks. Imagine you have 3 disks, D1, D2, D3 each with capcity C GB, then the capacity of logical drive would be - 3*C GB. Now say when you write a 3 byte document, byte 1 is written to D1, byte 2 to D2 and byte 3 to D3. So you can get better r/w speed since the bytes are read/written to different disks. But if one disks fail, all data is lost since data can't be reconstructed.
So RAID 0 is higher capacity and performance but no redundancy.

RAID 1 is about disk mirroring and hence improving redundancy. It makes two disks mirror of each other (normally only two are allowed). So the capacity of logical drive is same as the capacity of one drive. The r/w performance is same as one disk or may be a little slower. RAID 1 supports replacing disks so if one disk fails, you can replace it with new disk without shutting down (called as hot swappable) and it will copy data from healthy disk to the new disk.

RAID 5 does disk striping with parity. Its like RAID 0 but if one drive fails the data is still usable. Say you have 3 disks in that case 3rd disk will duplicate first disk data and the first disk will duplicate second disk data and so on. So for N drives with C capacity each, you get (N-1)*C total capacity and one disk failure is tolerated. Terms: Size =N*C, Volume=(N-1)*C

All other RAID options are combination of above concepts
RAID 10 is basically two mirrored RAID 5 arrays. Its very expensive because say each of your RAID 5 was 3 disks, then you get capacity of 2 disks by setting up 6, but the degree of redundancy is high

Setting up RAID
Hardware RAID
You use a PCI express card, which is a hardware raid controller and hook up the disks to the card. When you boot the PC, after the BIOS setup, it shows RAID setup which allows configuration of the disks as RAID 0 etc. Computer sees these logically as one drive right at the hardware level so even an operating system can be installed on this RAID array. So even if there is a disk failure, the OS will keep running. Hardware RAID is pretty fast since it doens't use computer RAM etc. Its more expensive than Software RAID.
Software RAID
built into most operating systems. Works similar to hardware raid except one major difference, There is no redundancy for the operating system, since you need an OS before creating RAID. Basically if the disk containing OS dies, then the system can't be run. Another downside is that now OS uses computer CPU and RAM for RAID management so it can be slower than hardware RAID. SW RAID is good for storing data with redundancy.
https://www.slashroot.in/san-vs-nas-difference-between-storage-area-network-and-network-attached-storage

