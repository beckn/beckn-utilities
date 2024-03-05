#!/bin/bash
source get_container_details.sh
register_gw() {
login_url="http://$1:4030/login?name=root&password=root&_LOGIN=Login"
subscribe_url="http://$1:4030/bg/subscribe"
cookie_file="cookies.txt"

# Step 1: Perform login and save the session cookies to a file
curl --cookie-jar $cookie_file --request POST $login_url

curl --request GET  --cookie $cookie_file $subscribe_url
rm $cookie_file -rf
}

if [[ $(uname -s) == 'Darwin' ]]; then
    ip=localhost
elif [[ $(systemd-detect-virt) == 'wsl' ]]; then
    ip=$(hostname -I | awk '{print $1}')
else
    ip=$(get_container_ip gateway)
fi

register_gw $ip 
