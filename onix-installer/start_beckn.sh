#!/bin/bash
source variables.sh

#below function will start specifice service inside docker-compose file
start_container(){
    echo "$1"
    docker-compose up -d $1

}

#below function will start the MongoDB, Redis and RabbitMQ Services. 
start_support_services(){
    echo "${GREEN}................Installing MongoDB................${NC}"
    docker-compose -f docker-compose-app.yml up -d mongo_db
    echo "MongoDB installation successful"

    echo "${GREEN}................Installing RabbitMQ................${NC}"
    docker-compose -f docker-compose-app.yml up -d queue_service
    echo "RabbitMQ installation successful"

    echo "${GREEN}................Installing Redis................${NC}"
    docker-compose -f docker-compose-app.yml up -d redis_db
    echo "Redis installation successful"
}

echo "${GREEN}................Installing required packages................${NC}"
./package_manager.sh
echo "Package Installation is done"

echo "${GREEN}................Installing Registry service................${NC}"
start_container registry
sleep 10
echo "Registry installation successful"

./update_gateway_details.sh registry
echo "${GREEN}................Installing Gateway service................${NC}"
start_container gateway
echo "Registering Gateway in the registry"
sleep 5
echo "Gateway installation successful"

#Start the MongoDB, Redis and RabbitMQ Services.
start_support_services
sleep 10

echo "${GREEN}................Installing Protocol Server for BAP................${NC}"
./update_bap_config.sh
sleep 10
start_container "bap-client"
start_container "bap-network"
sleep 10
echo "Protocol server BAP installation successful"

echo "${GREEN}................Installing Sandbox................${NC}"
start_container "sandbox-api"
sleep 5
echo "Sandbox installation successful"

echo "${GREEN}................Installing Webhook................${NC}"
start_container "sandbox-webhook"
sleep
echo "Webhook installation successful"

echo "${GREEN}................Installing Protocol Server for BPP................${NC}"
./update_bpp_config.sh
sleep 10
start_container "bpp-client"
start_container "bpp-network"
sleep 10
echo "Protocol server BPP installation successful"

echo "Please find below details of protocol server"
# echo "BAP_SUBSCRIBER_ID: $bap_subscriber_id"
# echo "BAP_SUBSCRIBER_ID_KEY: $bap_subscriber_id_key"
# echo "BAP_SUBSCRIBER_URL: $bap_subscriber_url"


# echo "BPP_SUBSCRIBER_ID: $bpp_subscriber_id"
# echo "BPP_SUBSCRIBER_ID_KEY: $bpp_subscriber_id_key"
# echo "BPP_SUBSCRIBER_URL: $bpp_subscriber_url"