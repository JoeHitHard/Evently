#!/bin/sh

cd ./evently-core || exit
./gradlew clean build publishToMavenLocal
cd ..


cd ./evently-attendee || exit
./gradlew clean build
cd ..

cd ./evently-events || exit
./gradlew clean build
cd ..

docker-compose down --rmi all --volumes --remove-orphans evently-event-service evently-attendee-service
docker-compose build
docker-compose up -d
