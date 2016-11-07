#!/bin/bash -e

pushd node_modules
  rm -f ./zazen
  ln -s ../src ./zazen
popd
