#!/bin/bash
source variables.sh
source get_container_details.sh

# Function to start a specific service inside docker-compose file
start_container(){
    #ignore orphaned containers warning
    export COMPOSE_IGNORE_ORPHANS=1
    docker-compose -f docker-compose-v2.yml up -d $1
}

# Function to start the MongoDB, Redis, and RabbitMQ Services
start_support_services(){
    #ignore orphaned containers warning
    export COMPOSE_IGNORE_ORPHANS=1
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

# Function to install Beckn Gateway and Beckn Registry
install_gateway_and_registry(){
    echo "${GREEN}................Installing Registry service................${NC}"
    start_container registry
    sleep 10
    echo "Registry installation successful"

    ./update_gateway_details.sh registry
    echo "${GREEN}................Installing Gateway service................${NC}"
    start_container gateway
    echo "Registering Gateway in the registry"
    sleep 5
    ./register_gateway.sh
    echo "Gateway installation successful"
}

# Function to install BAP Protocol Server
install_bap_protocol_server(){
    start_support_services
    echo "${GREEN}................Installing Protocol Server for BAP................${NC}"
    
    read -p "Enter BAP Subscriber ID: " bap_subscriber_id
    read -p "Enter BAP Subscriber Key: " bap_subscriber_id_key
    read -p "Enter BAP Subscriber URL: " bap_subscriber_url
    # Ask the user if they want to change the registry_url
    read -p "Do you want to change the registry_url? (Press Enter to accept default: $registry_url): " custom_registry_url
    registry_url=${custom_registry_url:-$registry_url}

    ./update_bap_config.sh

    sleep 10
    start_container "bap-client"
    start_container "bap-network"
    sleep 10
    echo "Protocol server BAP installation successful"
}

# Function to install BPP Protocol Server with BPP Sandbox
install_bpp_protocol_server_with_sandbox(){
    echo "${GREEN}................Installing Sandbox................${NC}"
    start_container "sandbox-api"
    sleep 5
    echo "Sandbox installation successful"

    echo "${GREEN}................Installing Webhook................${NC}"
    start_container "sandbox-webhook"
    sleep
    echo "Webhook installation successful"

    echo "${GREEN}................Installing Protocol Server for BPP................${NC}"
    
    read -p "Enter BAP Subscriber ID: " bap_subscriber_id
    read -p "Enter BAP Subscriber Key: " bap_subscriber_id_key
    read -p "Enter BAP Subscriber URL: " bap_subscriber_url
    # Ask the user if they want to change the registry_url
    read -p "Do you want to change the registry_url? (Press Enter to accept default: $registry_url): " custom_registry_url
    registry_url=${custom_registry_url:-$registry_url}

    ./update_bpp_config.sh

    sleep 10
    start_container "bpp-client"
    start_container "bpp-network"
    sleep 10
    echo "Protocol server BPP installation successful"
}

# Function to install BPP Protocol Server without Sandbox
install_bpp_protocol_server(){
    echo "${GREEN}................Installing Protocol Server for BPP................${NC}"
    
    read -p "Enter BAP Subscriber ID: " bap_subscriber_id
    read -p "Enter BAP Subscriber Key: " bap_subscriber_id_key
    read -p "Enter BAP Subscriber URL: " bap_subscriber_url
    read -p "Enter Webhook URL: " webhook_url
    
    # Ask the user if they want to change the registry_url
    read -p "Do you want to change the registry_url? (Press Enter to accept default: $registry_url): " custom_registry_url
    registry_url=${custom_registry_url:-$registry_url}

    ./update_bpp_config.sh

    sleep 10
    start_container "bpp-client"
    start_container "bpp-network"
    sleep 10
    echo "Protocol server BPP installation successful"
}

# Main script starts here

echo "Welcome to ONIX Installer"
read -p "Do you want to install all the components on the local system? (Y/n): " install_all

if [[ $install_all =~ ^[Yy]$ ]]; then
    # Install and bring up everything
    install_gateway_and_registry
    start_support_services
    install_bap_protocol_server
    install_bpp_protocol_server_with_sandbox
else
    # User selects specific components to install
    echo "Please select the components that you want to install"
    echo "1. Beckn Gateway & Beckn Registry"
    echo "2. BAP Protocol Server"
    echo "3. BPP Protocol Server with BPP Sandbox"
    echo "4. BPP Protocol Server"
    echo "5. Exit"
    
    read -p "Enter your choice (1-5): " user_choice

    case $user_choice in
        1)
            install_gateway_and_registry
            ;;
        2)
            install_bap_protocol_server
            ;;
        3)
            install_bpp_protocol_server_with_sandbox
            ;;
        4)
            install_bpp_protocol_server
            ;;
        5)
            echo "Exiting ONIX Installer"
            exit 0
            ;;
        *)
            echo "Invalid choice. Exiting ONIX Installer."
            exit 1
            ;;
    esac
fi
