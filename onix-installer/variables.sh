#!/bin/bash

#Colour Code
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
NC=$(tput sgr0)


#Comman Variables with Default values
mongo_initdb_root_username="beckn"
mongo_initdb_root_password="beckn123"
mongo_initdb_database="protocol_server"
mongoUrl="mongoDB:27017"

rabbitmq_default_user="beckn"
rabbitmq_default_pass="beckn123"
rabbitmqUrl="rabbitmq"

redisUrl="redis"

registry_url="https://registry:3030/subscribers"

public_key="KKHOpMKQCbJHzjme+CPKI3HQxIhzKMpcLLRGMhzf7rk="
private_key="W7HkCMPWvxv6/jWqHlyUI4vWX8704+rN3kCwBGIA7rcooc6kwpAJskfOOZ74I8ojcdDEiHMoylwstEYyHN/uuQ=="

#BAP varibales. 

bapClientFile="./protocol-server-data/bap-client.yaml-sample"
bapNetworkFile="./protocol-server-data/bap-network.yaml-sample"

bap_client_port=5001
bap_network_port=5002

bap_subscriber_id="bap-network"
bap_subscriber_id_key="bap-network-key"
bap_subscriber_url="http://bap-network:5002"


#BPP varibales. 

bppClientFile="./protocol-server-data/bpp-client.yaml-sample"
bppNetworkFile="./protocol-server-data/bpp-network.yaml-sample"

bpp_client_port=6001
bpp_network_port=6002

bpp_subscriber_id="bpp-network"
bpp_subscriber_id_key="bpp-network-key"
bpp_subscriber_url="http://bpp-network:5002"
webhook_url="http://sandbox-webhook:3005"