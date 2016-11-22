#!/bin/bash -e

pushd node_modules
  rm -f ./zazen
  ln -s ../lib ./zazen
popd
