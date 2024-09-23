# Release Notes

### Objective
ONIX - Open Network In A Box, is a utility designed to effortlessly set up all BECKN components on a machine using a one-click installer. This tool serves as a valuable resource for developers and network participants eager to explore BECKN protocols or join open networks supported by the BECKN protocol. By simplifying the installation process, ONIX streamlines the onboarding experience.

Experience the convenience and efficiency of ONIX as you embark on your journey with BECKN protocols and open networks.


| Version | Release Date |
|---------|--------------|
| v0.2.0    | 2024-03-01   |
| v0.2.0   | 2024-02-16   |



## ONIX Version 0.2.0 (2024-03-01)

### New Features
- This release focuses on enabling the installation of individual components with user-provided configurations.
- It extends support to the Windows operating system, specifically Windows 10.
- Additionally, it now supports the Mac operating system.

This release is specifically designed to facilitate the deployment of individual components, offering users the flexibility to customize configurations. Furthermore, it ensures seamless compatibility with both Windows and Mac operating systems.

For a comprehensive summary of the features, refer [here](https://github.com/beckn/beckn-utilities/milestone/1?closed=1)


### Enhancements
- Support for Windows operating system.
- Support for Mac operating system.
- Can be used to install specific components with custom configuration.

### Bug Fixes
- None

### Known Issues
- None

### Limitations
- The current installer is tested only for Linux (Ubuntu) / Windows (windows 10) / Mac, it might support other flavors also.
- The current version supports only vertical scaling, horizontal scaling (ECS / EKS) is planned for an upcoming release
- When installing individual components, registration with the registry has to be done manually, this is explicitly done to avoid confusion and to prevent the network from incorrect or wrong registrations.


### Upcoming Version
- Support for horizontal scaling using Elastic Kubernetes Cluster.

### Release Date
- 2024-03-01
