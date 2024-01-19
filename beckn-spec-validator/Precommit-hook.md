## Introduction

- This document provides instructions on how to use the beckn-spec-validator as a pre-commit hook.

- The [beckn-spec-validator](README.md) allows spec and sample writers to validate their specs and samples. As explained in the linked document, it requires command line options specifying the nature, target and reference for validation. This changes from one file to another. Therefore we cannot use a single command to act as a pre-commit hook. Actually creating a pre-commit hook out of it is unweildy. However if there is a strong requirement, this document describes the process on how to configure a pre-commit hook to test the specs and samples.

- This document describes actions to be performed by two roles of developers. **Owner** is the person who wants to configure the hooks for a repository. **Developers** are people who modify the spec/sample and whose work will be checked by the hooks before commit.

## Prerequisites

- Both the **owners** and **developers** need to have node installed on their system.

## Configuring pre-commit hooks (owners)

- In your repo, have the following script and call it `pre-commit.sample`. You can have it in a folder called `scripts` in the root path. (If you change the paths, please change it similarly in the second script below).
- In the file, add calls to `run_verify_command` for every file that you need to be checked.If you add new spec or sample, you need to modify this file and run the `setup-precommit.sh` file listed below again.
- If you have existing precommit hooks, add that content to the file above after the `git stash pop -q ` line.

```
#!/bin/sh

# pre-commit.sample

run_verify_command () {
    command=$1
    if
        eval $1
    then
        return 0
    else
        echo "*****Spec validation has failed for following command******"
        echo "$command"
        echo "*****Commit has been aborted******"
        git stash pop -q
        exit 1
    fi
}



git stash -q --keep-index

# Add one line per file that needs to be checked
run_verify_command "beckn-spec-validator -b api/meta/build/meta.yaml -v false"
run_verify_command "beckn-spec-validator -b api/transaction/build/transaction.yaml -v false"
run_verify_command "beckn-spec-validator -b api/registry/build/registry.yaml -v false"

git stash pop -q
exit 0
```

- In the same folder where you have this file, have another file called `setup-precommit.sh` with the following contents and make it executable.

```
#!/bin/sh
cp pre-commit.sample ../.git/hooks/pre-commit && chmod +x ../.git/hooks/pre-commit && echo "hook copied"
```

- Install the beckn-spec-validator `npm install -g beckn-spec-validator`
- In the scripts folder, run the command `./setup-precommit`. The precommit hooks will be setup and everytime you try to commit the files specified in the file above will be checked.

## Configuring pre-commit hooks (developers)

- Install the beckn-spec-validator `npm install -g beckn-spec-validator`
- In the scripts folder, run the command `./setup-precommit`. The precommit hooks will be setup and everytime you try to commit the files specified in the file above will be checked.
