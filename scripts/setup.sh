#!/bin/bash

LAVALINK_VERSION="4.0.7"
YT_PLUGIN_VERSION="1.5.2"

TEMPLATE="scripts/application_template.yml"
createApplicationConfig() {
  printf 'Set a password for Lavalink server: '
  read -r answer

  sed -e "s/YT_VER/${YT_PLUGIN_VERSION}/g" -e "s/_PASSWORD_/$answer/g" $TEMPLATE > application.yml
}

if [ -f "lavalink/Lavalink.jar" ]
then
    if [ "${LAVALINK_VERSION}" != "$(cat lavalink/version.txt)" ] ;then
      downloadLavalink
    else
        echo "Latest Compatible lavalink version is presented."
    fi
else
    downloadLavalink
fi

createApplicationConfig

echo "Successfully setup lavalink deps."
echo "Try yarn lavalink to start the server."

downloadLavalink () {
  echo "Downloading compatible lavalink (${LAVALINK_VERSION})"
  mkdir lavalink
  wget -O lavalink/Lavalink.jar "https://github.com/lavalink-devs/Lavalink/releases/download/${LAVALINK_VERSION}/Lavalink.jar"
  echo "${LAVALINK_VERSION}" > lavalink/version.txt
  chmod +x lavalink/Lavalink.jar
}