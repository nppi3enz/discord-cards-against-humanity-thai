# Cards Against Humanity for Discord

This is a simple concept of a [Cards Against Humanity](https://cardsagainsthumanity.com/) game implemented on Discord.
**This is still a work in progress!**

## Requirements

To self-host this bot you'll need the following:

* [git](https://git-scm.com/)
* [node.js](https://nodejs.org/en/)

For developers, the project has an ESLint rules file, to use this on VSCode, it is required to have the [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Installation

In order to self-host this bot, first you'll need to clone this repository.

    git clone https://github.com/greencoast-studios/discord-cards-against-humanity.git
  
Then, rename the file `./src/config/settings.json.example` to `./src/config/settings.json` and edit the file with your own Discord Token and the prefix you wish to use. If you don't have a discord token yet, you can see a guide on how to create it [here](https://github.com/moonstar-x/discord-downtime-notifier/wiki).

Install the dependencies with:

    npm install
  
And run the bot with:

    npm start

## Usage

For development, run the following command:

    npm run dev

For running tests, run:

    npm test

To view debug messages, run:

    npm run debug

## Authors

This bot was made by [moonstar-x](https://github.com/moonstar-x), [tanb01](https://github.com/tanb01) and [m4ddabs](https://github.com/m4ddabs) of [Greencoast Studios](https://github.com/greencoast-studios).
