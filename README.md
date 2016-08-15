[![CircleCI](https://circleci.com/gh/byavv/fm-tracker.svg?style=svg)](https://circleci.com/gh/byavv/fm-tracker)

## Microservice tracker for [funny-market](https://github.com/byavv/funny-market) project

### Features: 
- [rabbitmq](https://www.rabbitmq.com/) messaging via [wascally](https://github.com/LeanKit-Labs/wascally)
- [etcd](https://github.com/coreos/etcd) self-registration via [etcd-registry](https://github.com/mafintosh/etcd-registry)

### Usage

    npm install -g nodemon 
     ...
    git clone https://github.com/byavv/fm-tracker.git
    cd fm-tracker
    npm install

### Basic Commands

    npm start
    npm run dev
    npm test
    npm run clean
    npm run serve