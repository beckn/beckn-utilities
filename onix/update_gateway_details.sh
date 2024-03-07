#!/bin/bash
source get_container_details.sh

get_details_registry() {
    # Make the curl request and store the output in a variable
    response=$(curl --location --request POST "http://$1:3030/subscribers/lookup" \
        --header 'Content-Type: application/json' \
        --data-raw '{
    "type": "LREG"
}')
    # Check if the curl command was successful (HTTP status code 2xx)
    if [ $? -eq 0 ]; then
        # Extract signing_public_key and encr_public_key using jq
        signing_public_key=$(echo "$response" | jq -r '.[0].signing_public_key')
        encr_public_key=$(echo "$response" | jq -r '.[0].encr_public_key')
        subscriber_url=$(echo "$response" | jq -r '.[0].subscriber_url')

    else
        echo "Error: Unable to fetch data from the server."
    fi
}

update_gateway_config() {
        # Print the extracted keys
        echo "Signing Public Key: $signing_public_key"
        echo "Encryption Public Key: $encr_public_key"
        echo "URL $subscriber_url"
        cp gateway_data/config/swf.properties-sample gateway_data/config/swf.properties
        config_file="gateway_data/config/swf.properties"
        
        tmp_file=$(mktemp "tempfile.XXXXXXXXXX")
        sed "s|SIGNING_PUBLIC_KEY|$signing_public_key|g; s|ENCRYPTION_PUBLIC_KEY|$encr_public_key|g; s|REGISTRY_URL|$subscriber_url|g" "$config_file" > "$tmp_file"
        #sed -i '' "s|SIGNING_PUBLIC_KEY|$signing_public_key|g; s|ENCRYPTION_PUBLIC_KEY|$encr_public_key|g; s|REGISTRY_URL|$subscriber_url|g" "$config_file"
        #sed -i "s|SIGNING_PUBLIC_KEY|$signing_public_key|g; s|ENCRYPTION_PUBLIC_KEY|$encr_public_key|g; s|REGISTRY_URL|$subscriber_url|g" "$config_file"
        mv "$tmp_file" "$config_file"
}
service_name=$1

if [[ $(uname -s) == 'Darwin' ]]; then
    ip=localhost
elif [[ $(systemd-detect-virt) == 'wsl' ]]; then
    ip=$(hostname -I | awk '{print $1}')
else
    ip=$(get_container_ip $service_name)
fi

get_details_registry $ip
update_gateway_config
