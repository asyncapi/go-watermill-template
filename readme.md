<!--   
The good readme should be easy to navigate through, therefore remember to add `markdown-toc` to devDependencies of your template and generate a table of contents by using the following script `"generate:readme:toc": "markdown-toc -i README.md"`
-->

<!-- toc -->

- [Overview](#overview)
- [Technical requirements](#technical-requirements)
- [Specification requirements](#specification-requirements)
- [Supported protocols](#supported-protocols)
- [How to use the template](#how-to-use-the-template)
  * [CLI](#cli)
  * [Docker](#docker)
- [Template configuration](#template-configuration)
- [Custom hooks that you can disable](#custom-hooks-that-you-can-disable)
- [Development](#development)
- [Contributors](#contributors)

<!-- tocstop -->

## Overview

<!--  
The overview should explain in just a few sentences the template's purpose and its most essential features.
-->

This template generates a Go module that uses [watermill](https://github.com/ThreeDotsLabs/watermill) as the messaging middleware

## Technical requirements

<!--  
Specify what version of the Generator is your template compatible with. This information should match the information provided in the template configuration under the `generator` property.
-->

- 1.1.0 =< [Generator](https://github.com/asyncapi/generator/) < 2.0.0,
- Generator specific [requirements](https://github.com/asyncapi/generator/#requirements)

## Specification requirements

<!--  
The template might need some AsyncAPI properties that normally are optional. For example code generator might require some specific binding information for a given protocol. Even though you can provide defaults or fallbacks, you should describe in the readme what is the most optimal set of properties that the user should provide in the AsyncAPI file.
-->

The table contains information on parts of the specification required by this template to generate the proper output.

Property name | Reason | Fallback | Default
---|---|---|---
`components.schemas` | This template supports only schemas that have unique and human-readable names. Such names can also be provided if schemas are described under `components.schemas` and each schema is a separate object with its unique key. | - | -

## Supported protocols

<!--  
Specify what protocols is your code generator supporting. This information should match the information provided in the template configuration under the `supportedProtocols` property. Don't put this section in your readme if your template doesn't generate code.
-->

Currently this template supports AMQP subscribers

## How to use the template

<!--  
Make sure it is easy to try out the template and check what it generates. Instructions for CLI and Docker should be easy to use; just copy/paste to the terminal. In other words, you should always make sure to have ready to use docker-compose set up so the user can quickly check how generated code behaves.
-->

This template must be used with the AsyncAPI Generator. You can find all available options [here](https://github.com/asyncapi/generator/).

### CLI

As of this initial commit this template has been tested to generate an AMQP subscriber for the following asyncapi.yml file

```yaml
asyncapi: '2.1.0'

info:
  title: Streetlights API
  version: '1.0.0'
  description: |
    The Smartylighting Streetlights API allows you
    to remotely manage the city lights.
  license:
    name: Apache 2.0
    url: 'https://www.apache.org/licenses/LICENSE-2.0'

defaultContentType: application/json

servers:
  local:
    url: localhost:5672
    protocol: amqp
    security:
      - user-password: []

channels:
  light/measured:
    bindings:
      amqp:
        is: routingKey
        queue:
          name: light/measured
          durable: true
          exclusive: true
          autoDelete: false
          vhost: /
        bindingVersion: 0.2.0
    publish:
      summary: Inform about environmental lighting conditions for a particular streetlight.
      operationId: onLightMeasured
      message:
        name: LightMeasured
        payload:
          $id: LightMeasured
          additionalProperties: false
          type: object
          properties:
            id:
              type: integer
              minimum: 0
              description: Id of the streetlight.
            lumens:
              type: integer
              minimum: 0
              description: Light intensity measured in lumens.
            sentAt:
              type: string
              format: date-time
              description: Date and time when the message was sent.

components:
  securitySchemes:
    user-password:
      type: userPassword
```

#### Run the following command to generate a Go module

```bash
npm install -g @asyncapi/generator
# clone this repository and navigate to this repository
ag /path/to/asyncapi.yaml ./ -o /path/to/generated-code -p moduleName=your-go-module-name -p goVersion=1.17
```

There are 2 options that can be passed to the generator

1. moduleName: name of the go module to be generated
2. goVersion: version of Go to be specified in the go.mod file

#### How to use the generated code

The above code currently generates a Go module that has a AMQP subscriber.

##### Pre-requisites
To run the generated code the following needs to be installed

1. go 1.16 +
2. rabbitmq-server OR docker

##### Running the code

1. Navigate to the path where the code was generated
2. Run the following commands to download the dependencies
```bash
go mod download
go mod tidy
```
3. Currently the code does not utilize the server bindings to generate the server URI. It is currently hardcoded to point to a local instance of `rabbitmq`. It is hardcoded as `"amqp://guest:guest@localhost:5672/"` at `<generated-code>/config/server.go`. Change it as per your rabbitmq instance requirements
4. Finally to execute the code run
```bash
go run main.go
```
5. Running local instance of `rabbitmq`, navigate to it using `http://localhost:15672/` with username and password `guest`/ `guest` (These are default rabbitmq credentials). 
   FYI one can start an instance of `rabbitmq` using  `docker` as follow
   ```
   docker run -d -p 15672:15672 -p 5672:5672 rabbitmq:3-management
   ```
6. Create a queue as per the async api spec
7. Publish a message to the queue as per the async api spec
8. Check the output at the terminal where `go run main.go` was running and the published message should be printed





