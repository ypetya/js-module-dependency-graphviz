#!/usr/bin/env bash

START="${1:? param missing - filename in current directory}"
DEPTH="${2?param missing - depth}"

node display.js "$START" "$DEPTH" > "$1".dot
dot -Tsvg "$1".dot -O

echo "chrome $1.dot.svg"
