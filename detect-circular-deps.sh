#!/usr/bin/env bash

START="${1? param missing - filename}"
DEPTH="${2? param missing - depth}"
AMD_ROOT="${3? param missing - AMD_ROOT}"

_bash_source_DIR="${BASH_SOURCE%/*}"

node "$_bash_source_DIR/"detectCircularDependencies.js "$START" "$DEPTH" "$AMD_ROOT"

