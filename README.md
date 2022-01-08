# Telegram Auction Bot

This bot listens to vault events and posts relevant information to Ribbon Auction Telegram group.

## Installation Guide

1. Run `yarn install`
2. Create a new `.env` file with the following variables
```
BOT_TOKEN=<Telegram Bot Token>
CHAT_ID=<Telegram Chat ID>
WEBSOCKET_URL=<Infura or Alchemy RPC URL>
RPC_URL=<Infura or Alchemy RPC URL>
```
Notes:
- Create a new bot: https://core.telegram.org/bots#3-how-do-i-create-a-bot
- Get Chat ID: https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id

## Testing:

1. Run `yarn test`
2. Testing uses past transaction hashes

## Bot Commands:

1. `/setstrike`: set the strike price (only used for ETH put for now) e.g. /setstrike ETHput 2800
2. `/getsizes`: get the estimated sizes for the auctions

## Deployment:

The bot is deployed in a VM hosted by Google Cloud Compute service. It's run via tmux.
