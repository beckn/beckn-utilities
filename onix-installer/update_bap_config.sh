#!/bin/bash

source registry_entry.sh
source generate_keys.sh
source variables.sh
source get_container_details.sh


newClientFile=$(echo "$bapClientFile" | sed 's/yaml-sample/yml/')
newNetworkFile=$(echo "$bapNetworkFile" | sed 's/yaml-sample/yml/')
cp $bapClientFile $newClientFile
cp $bapNetworkFile $newNetworkFile

clientFile=$newClientFile
networkFile=$newNetworkFile

client_port=$bap_client_port
network_port=$bap_network_port



sed -i "s|BAP_NETWORK_PORT|$network_port|" $networkFile
sed -i "s|BAP_CLIENT_PORT|$client_port|" $clientFile

registry_url="http://$(get_container_ip registry):3030/subscribers"

echo "Generating public/private key pair"
get_keys
echo "Your Private Key: $private_key" 
echo "Your Public Key: $public_key"


valid_from=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
valid_until=$(date -u -d "+1 year" +"%Y-%m-%dT%H:%M:%S.%3NZ")
type=BAP


# Define an associative array for replacements
declare -A replacements=(
    ["REDIS_URL"]=$redisUrl
    ["REGISTRY_URL"]=$registry_url
    ["MONGO_USERNAME"]=$mongo_initdb_root_username
    ["MONGO_PASSWORD"]=$mongo_initdb_root_password
    ["MONGO_DB_NAME"]=$mongo_initdb_database
    ["MONOG_URL"]=$mongoUrl
    ["RABBITMQ_USERNAME"]=$rabbitmq_default_user
    ["RABBITMQ_PASSWORD"]=$rabbitmq_default_pass
    ["RABBITMQ_URL"]=$rabbitmqUrl
    ["PRIVATE_KEY"]=$private_key
    ["PUBLIC_KEY"]=$public_key
    ["BAP_SUBSCRIBER_ID"]=$bap_subscriber_id
    ["BAP_SUBSCRIBER_URL"]=$bap_subscriber_url
    ["BAP_SUBSCRIBER_ID_KEY"]=$bap_subscriber_id_key
)
echo "Configuring BAP protocol server"
# Apply replacements in both files
for file in "$clientFile" "$networkFile"; do
    for key in "${!replacements[@]}"; do
        sed -i "s|$key|${replacements[$key]}|" "$file"
    done
done

echo "Registering BPP protocol server on the registry"

create_network_participant "$registry_url" "application/json" "$bap_subscriber_id" "$bap_subscriber_id_key" "$bap_subscriber_url" "$public_key" "$public_key" "$valid_from" "$valid_until" "$type"