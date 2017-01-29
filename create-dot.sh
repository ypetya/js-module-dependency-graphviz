#!/usr/bin/env bash

create-dot.rb > test.dot
dot -Tsvg test.dot -O
chrome test.dot.svg
