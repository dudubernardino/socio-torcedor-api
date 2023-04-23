#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install wget postgresql-client -y
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy