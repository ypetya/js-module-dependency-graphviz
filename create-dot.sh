#!/usr/bin/env bash

create-dot-by-directory-structure.rb > test.dot
dot -Tsvg test.dot -O
#chrome test.dot.svg

