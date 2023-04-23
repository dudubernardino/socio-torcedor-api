<h3 align="center">
  Sócio Torcedor API Project
</h3>

<p align="center">An rest api for fan partner management system. 👨🏼‍💻🏟️</p>

<p align="center">
  <a href="#%EF%B8%8F-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

## 🏦 About the project

In recent years, technology has become increasingly relevant to sports. One of the areas where it is widely used is fan management, an important tool for football clubs to connect with their fans and increase revenue. However, current fan management systems face scalability, security, and innovation problems, making it difficult to manage fan programs efficiently and securely.

This project aims to propose a fan management system that solves these problems, analyze the main difficulties of the existing system, and propose technical solutions that meet the needs of fans and sports associations.

Developing efficient fan management systems is important for fan loyalty and engagement, as well as for generating recurring revenue for sports associations. Additionally, proposing solutions to the challenges of scalability, security, and innovation can benefit other companies dealing with large user bases and requiring robust and scalable systems.

## 🚀 Technologies

Technologies that I used to develop this api

- [TypeScript](https://www.typescriptlang.org/)
- [Nest.js](https://nestjs.com/)
- [TypeORM](https://typeorm.io/#/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Mercado Pago API](https://www.mercadopago.com.br/developers/pt/reference)
- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Swagger](https://swagger.io/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 💻 Getting started

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: I recommend to use docker

**Clone the project and access the folder**

```bash
$ git clone https://github.com/dudubernardino/socio-torcedor-api && cd socio-torcedor-api
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment
$ cp .env.example .env

# Create the instance of postgreSQL using docker
$ docker run --name db_postgres -e POSTGRES_USER=docker -p 5432:5432 -d postgres

# To finish, run the api service
$ yarn start:dev

# Well done, project is started!
```

## 📚 Docs

I used [swagger](https://swagger.io/) to document the API. You can use postman to test the app.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24863168-1e9bedb3-fa00-4efa-9a91-8c82f3cd39cf?action=collection%2Ffork&collection-url=entityId%3D24863168-1e9bedb3-fa00-4efa-9a91-8c82f3cd39cf%26entityType%3Dcollection%26workspaceId%3D449f39d5-fbc0-4907-b84a-8ecfc771c5f5)

## 🤔 How to contribute

**Make a fork of this repository**

```bash
# Fork using GitHub official command line
# If you don't have the GitHub CLI, use the web site to do that.

$ gh repo fork dudubernardino/socio-torcedor-api
```

**Follow the steps below**

```bash
# Clone your fork
$ git clone your-fork-url && cd socio-torcedor-api

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes
$ git commit -m 'feat: My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ &nbsp;by Eduardo Bernardino 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/dudubernardino/)
