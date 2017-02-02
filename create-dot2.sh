#!/usr/bin/env bash

create-dot-following-deps.rb "${1:? param missing - filename in current directory}" "${2?param missing - depth}" > "$1".dot
dot -Tsvg "$1".dot -O

echo "chrome $1.dot.svg"

