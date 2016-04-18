# ServoyJenkinsBuildConfig
ServoyJenkinsBuildConfig provides the required build files and related utilities to setup a software factory to build, test and deploy [Servoy](http://servoy.com) solutions using Jenkins

This configuration provides the following functionality:
- Export Servoy solutions to .servoy files
- Run the UnitTests contained in the .servoy file
- Record Code Coverage during running of UnitTests (using [Istanbul](https://github.com/gotwarlost/istanbul))
- Provide Code Analytics (using [Plato](https://github.com/es-analysis/plato))
- Pushing exported Servoy solutions (.servoy files) to (remote) Servoy Application Servers

# Getting started


## Requirements
- Servoy Application Server
- NodeJS + 
- Jenkins + ANT

## Required Modifications after installation
### Jenkins Authentication
- Jenkins memory
- Jenkins CSP settings
- logging adjustments
- Update ESLint dependancy

## Known issues
- 

# Disclamer
The Jenkins build files in this project have their origin in [svyJenkinsConfig](https://github.com/Servoy/svyJenkinsConfig), but are not directly compatible with it. The configuration contained in this repository 
Tested only on Windows with Servoy 7.x, non-mobile client, stand-alone Jenkins and Mercurial as SCM

# Feature Requests & Bugs
Found a bug or would like to see a new feature implemented? Raise an issue in the [Issue Tracker](https://github.com/TheOrangeDots/ServoyJenkinsBuildConfig/issues)

# Contributing
Eager to fix a bug or introduce a new feature? Clone the repository and issue a pull request

# License
ServoyJenkinsBuildConfig is licensed under MIT License

