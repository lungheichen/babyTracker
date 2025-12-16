# Babytracker

## Pre-reqs

1. Make a Docker Hub account, and make an org to replace [org]
2. Have a means of making POST requests, such as with a Postman account.
   Additionally, if using vscode, use the extension for easier access.
3. Have a MongoDB account in order for production build to work. For a dev
   instance, run `sudo service mongod start`.  Check that it ran with:
   `sudo service mongod status`. If the Active shows as Failed, then follow the
   "Troubleshooting" section.
4. Create a .env file with the following variables from your MongoDB project
   These should all come from your MongoDB project, from adding an account that
   can access the data, under Security -> Database and Network Access:
   - DB_USER
   - DB_PASS
   - DB_NAME=babytracker
   - PORT=3000
5. ...

## Installation of non-image (local instance)

npm install  
npm run dev

or for the production build:  
npm start

## Production Build

### Build Docker Image

docker build -t [org]/[image] .
docker build -t phosphorgus/bt-prod-25 .

### Running the Image

docker run -e NODE_ENV=production --env-file ./.env -p 3001:3000 [org]/[image]
docker run -e NODE_ENV=production --env-file ./.env -p 3001:3000 phosphorgus/bt-prod-25

Then access the app at <http://localhost:3001>

### Stopping Docker

First, the container:  
docker stop $(docker ps -a -q --filter "ancestor=[org]/[image]")
docker stop $(docker ps -a -q --filter "ancestor=phosphorgus/bt-prod-25")

### Deleting

docker rm $(docker ps -q -a -f 'name=bt-') --force

Then the image:  
docker image rm $(docker images [org]/[image-prefix]* -q) --force
docker image rm $(docker images phosphorgus/bt-* -q) --force

where the bt- is the [image-prefix]

## Development Build

### Build Docker Images (Dev)

For the app:  
docker build -t [org]/bt-dev -f Dockerfile-dev .  
docker build -t phosphorgus/bt-dev -f Dockerfile-dev .

For the database:  
docker build -t [org]/bt-db -f Dockerfile-mongo .  
docker build -t phosphorgus/bt-db -f Dockerfile-mongo .

### Docker Compose (Dev)

docker-compose -f docker-compose-dev.yml up

### Running the Image (Dev)

docker run -e NODE_ENV=production --env-file ./.env -p 3001:3000 [org]/[image]
docker run -e NODE_ENV=production --env-file ./.env -p 3001:3000 phosphorgus/bt-dev

Then access the app at <http://localhost:3001>

### Stopping Docker (Dev)

First, the container:  
docker stop $(docker ps -a -q --filter "ancestor=[org]/[image]")
docker stop $(docker ps -a -q --filter "ancestor=phosphorgus/bt-dev")

### Deleting (Dev)

docker rm $(docker ps -q -a -f 'name=bt-') --force

Then the image:  
docker image rm $(docker images [org]/[image-prefix]* -q) --force
docker image rm $(docker images phosphorgus/bt-* -q) --force

where the bt- is the [image-prefix]

## Accessing your Local MongoDB (Dev)

With mongod service started, run the following command, making sure to replace
the pwd/password with the desired string:

```json
db.createUser(
   {
     user: "superadmin",
     pwd: "admin",
     roles: [ { role: "root", db: "admin" } ]
   }
)
```

Then run the following command:  
mongosh 'mongodb://superadmin:admin@localhost:27017/babytracker?authSource=admin'

## Troubleshooting

If your local mongod instance is failing to run, then try to remove the
following files:  
sudo rm /tmp/mongodb-27017.sock  
sudo rm /var/lib/mongodb/mongod.lock

## Updating Docker Image npm Packages

After updating package.json and stopping docker services, run the following
commands (example is for bt-dev):

docker-compose run --rm --service-ports bash npm install --save

docker image rm phosphorgus/bt-dev --force

docker build -t phosphorgus/bt-dev -f Dockerfile-dev .
