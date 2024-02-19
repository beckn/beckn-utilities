#!/bin/bash

source registry_entry.sh
source generate_keys.sh
source variables.sh
source get_container_details.sh


newClientFile=$(echo "$bppClientFile" | sed 's/yaml-sample/yml/')
newNetworkFile=$(echo "$bppNetworkFile" | sed 's/yaml-sample/yml/')

cp $bppClientFile $newClientFile
cp $bppNetworkFile $newNetworkFile

echo "$newClientFile $newNetworkFile"

clientFile=$newClientFile
networkFile=$newNetworkFile

client_port=$bpp_client_port
network_port=$bpp_network_port

sed -i "s|BPP_NETWORK_PORT|$network_port|" $networkFile
sed -i "s|BPP_CLIENT_PORT|$client_port|" $clientFile

registry_url="http://$(get_container_ip registry):3030/subscribers"
echo "$registry_url"

echo "Generating public/private key pair"
get_keys
#echo "Your Private Key: $private_key" 
#echo "Your Public Key: $public_key"


valid_from=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
valid_until=$(date -u -d "+1 year" +"%Y-%m-%dT%H:%M:%S.%3NZ")
type=BPP


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
    ["BPP_SUBSCRIBER_URL"]=$bpp_subscriber_url
    ["BPP_SUBSCRIBER_ID"]=$bpp_subscriber_id
    ["BPP_SUBSCRIBER_ID_KEY"]=$bpp_subscriber_id_key
    ["WEBHOOK_URL"]=$webhook_url
)
echo "Configuring BPP protocol server"
# Apply replacements in both files
for file in "$clientFile" "$networkFile"; do
    for key in "${!replacements[@]}"; do
        sed -i "s|$key|${replacements[$key]}|" "$file"
    done
done

echo "Registering BPP protocol server on the registry"

create_network_participant "$registry_url" "application/json" "$bpp_subscriber_id" "$bpp_subscriber_id_key" "$bpp_subscriber_url" "$public_key" "$public_key" "$valid_from" "$valid_until" "$type"