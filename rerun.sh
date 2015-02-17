#!/bin/bash

log=server.log
while true
do
  echo "Start server at `date`" | tee -a $log
  node server/server.js 2>&1 | tee -a $log
  sleep 3
done
