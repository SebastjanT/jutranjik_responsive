# jutranjik_responsive
Creation of complex responsive email messages

## Table of contents

* [Configuration](#configuration)
  * [ENV variables](#env-variables)
* [Usage](#usage)

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


## Usage

Examples of different ways to utilise the system.
