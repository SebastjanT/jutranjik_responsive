# jutranjik_responsive
Creation of complex responsive Jutranjik email messages

## Table of contents

* [Configuration](#configuration)
  * [ENV variables](#env-variables)
  * [Nginx](#nginx)
* [Usage and installation](#usage-and-installation)
  * [Docker](#docker)
    * [Volume setup](#volume-setup)
    * [Get the image from DockerHub](#get-the-image-from-dockerhub)
    * [Create a local image](#create-a-local-image)
    * [Run the container](#run-the-container)
  * [Intended operation](#intended-operation)

## Configuration

The configuration options and files required for intended operation of the system.

### ENV variables

The system accepts the following ENV variables:

| Name              | Example             | Description             |
| ----------------- | ------------------- | ----------------------- |
| `PORT`            | `4000`              | The port where the system listens |
| `NODE_ENV`        | `development`       | The environment that the system is ran in |
| `PG_CRON`         | `0 8 * * *`         | The cron-style scheduling for the periodicGeneration task |
| `TZ`              | `Europe/Ljubljana`  | The timezone that is used in the Date function |
| `DATA_API`        | `someurl \| development` | The url of the news data api or the value development, to use predefined data for testing |
| `GENERATOR`       | `Maizzle \| mjml`    | The generator used by the periodicGeneration task
| `SEND`            | `false`             | The periodicGeneration task setting for triggering sending the generated email
| `NODEMAILER_FROM` |                     | The from email address used for sending the emails
| `NODAMAILER_TO`   |                     | The backup email address that is used when the maillist couldn't be retrieved
| `INSIGHT`         | `127.0.0.1`         | The comma separated list of ip addresses that are allowed access to enhanced features

### Nginx

Nginx is used to handle ssl termination, statically serve the frontend, generated emails and reverse proxy requests to the backend.

Here is an example of the nginx server block (without the ssl configuration or the server_name):

```
root /var/www/html;
index index.html;

location / {
        try_files $uri $uri/ =404;
}

location /generations/ {
        alias /var/lib/docker/volumes/jutranjik_responsive_data/_data/generations/;
        try_files $uri =404;
}

location /graphql/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header X-Insight $remote_addr;
}

```


## Usage and installation

Examples of different ways to utilise and set up the system.

### Docker

The system is meant to be run in a Docker container for easier deployment across multiple systems. Bellow you can find all the instructions needed to run the system.

The system is expected to be reverse proxied by nginx, which in term also handles ssl termination.

#### **Volume setup**

The application is designed to use a Docker volume for storing data, such as logs, the database and generated emails.

Example of volume creation:

```
docker volume create jutranjik_responsive_data
```

#### **Get the image from DockerHub**

To get the lates Docker image of the system from DockerHub run the following command:

```
docker pull st1925/jutranjik_responsive:tagname
```

#### **Create a local image**

If you wish you can build the Docker image locally.

Example of the build command:

```
docker build --tag jutranjik_responsive .
```

#### **Run the container**

Here is an example command to run the container as intended:

```
docker run -dp 127.0.0.1:4000:4000 -v jutranjik_responsive_data:/app/data --env-file ./.env --name jutranjik_responsive --init st1925/jutranjik_responsive:tagname
```

### Intended operation

The system's main function is periodic generation and distribution of complex responsive html emails of the Jutranjik newsletter.

Depending on your [env configuration](#env-variables), a scheduled task runs, generating, saving and sending the email.

The data required is intended to be retrieved from an API that is separate from this system.

The generated Jutranjik newsletter can then also be viewed in the browser, statically served by nginx.
