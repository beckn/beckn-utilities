#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $SCRIPT_DIR/get_container_details.sh

login_url="http://$1:4030/login?name=root&password=root&_LOGIN=Login"
subscribe_url="http://$1:4030/bg/subscribe"
cookie_file="cookies.txt"

register_gw() {

# Step 1: Perform login and save the session cookies to a file
curl --cookie-jar $cookie_file --request POST $login_url

curl --request GET  --cookie $cookie_file $subscribe_url
rm -rf $cookie_file 
}

if [[ $(uname -s) == 'Darwin' ]]; then
    ip=localhost
elif [[ $(systemd-detect-virt) == 'wsl' ]]; then
    ip=$(hostname -I | awk '{print $1}')
else
    ip=$(get_container_ip gateway)
fi

if [[ $1 ]]; then
    if [[ $1 == https://* ]]; then
    login_url="$1/login?name=root&password=root&_LOGIN=Login"
    subscribe_url="$1/bg/subscribe"
else
    register_gw $ip
fi 
