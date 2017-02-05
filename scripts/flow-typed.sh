#!/bin/bash -xe

readonly FLOW_TYPED=./node_modules/.bin/flow-typed
readonly JEST_VSN=$(./scripts/get-dep-ver.js jest)

${FLOW_TYPED} install jest@${JEST_VSN}
