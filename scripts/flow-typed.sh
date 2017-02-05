#!/bin/bash

readonly FLOW_TYPED=./node_modules/.bin/flow-typed
readonly JEST_VSN=$(cat package.json | jq -r '.devDependencies.jest')

${FLOW_TYPED} install jest@${JEST_VSN}
