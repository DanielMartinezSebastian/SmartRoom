#!/bin/bash
set -a
source .env
set +a
node check-bucket.js
