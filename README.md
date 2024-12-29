# Alchemy Testnet Transaction

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  ###### Check out the badges hosted by [shields.io](https://shields.io/)

 [Deployed Heroku Link](https://alchemy-testnet-tx-0841d3990122.herokuapp.com/)
  
  ## Description
  *A web app for sending testnet tokens for various supported testnet network, with receipt and transaction history (10 inound and 10 outbound)*

  ***

  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Author](#author)

  ***

  ## Installation

  ~~***This project is hosted on a heroku eco-dyno, when it is not being actively used it requires a bit extra start up time. This can be mitigated by upgrading to the next tier on heroku.***~~
  
  [Deployed Heroku Link](https://alchemy-testnet-tx-0841d3990122.herokuapp.com/search)
  
  If you would like to host a version of it yourself, please follow these instructions:

  > to install both the client and server side dependencies: `npm i`

  > start the server: `npm start`

  > to concurrently start server and client react code w/ hotreload: `npm run develop`


  ***This deployed project currently uses a wallet address's secret key set in the .env. (this will be for the address where the testnet tokens are from) If hosting a standalone instance, please ensure both Alchemy API key and secret key are availble in .env***

  > **If you would like to host a heroku version of it privately**, make sure you have heroku CLI installed, and at the root of the project run `heroku create app_name`. After we confirmed that it has been deployed. Navigate to your heroku project page and ensure that all of your env var is set.
  >
  > ![envvar](/client/src/assets/envvar.png)
  >


  ***
  ## Usage

  Utilizing Alchemy SDK, we are able to query wallet balance, specific transactions and send transactions:
 
  > *You are able to connect your browser extension wallets that utilizes the [EIPS-6963](https://eips.ethereum.org/EIPS/eip-6963) which helps avoid conflict and improves user experience.*


  > **Wallet Balance and History `/api/balance`**
  > *`alchemy.core.getBalance()`*
  > - *network* (based on Alchemy SDK instance)
  > - *address* (from env var: `SECRET_KEY`)
  >
  > We are first instantiating a new Alchemy SDK instance for each supported network iteratively, then using `alchemy.core.getBalance()` with our wallet address to return our Ether balance for each network respectively.
  >
  > *within this project, we are using our `Secret_Key` set in our environment variale, and using Alchemy SDK's `Wallet` helper to help us access our address hash without hardcoding it*
  >
  > ![balanceRoute](/client/src/assets/balance.png)

  > **Sending Transaction `/api/send/:net/:to`**
  > *`alchemy.core.sendTransaction()`*
  > - *network (translated to chainID)*
  > - *receiving address*
  > - *gasLimit*
  > - *maxPriorityFeePerGas* & *maxFeePerGas* from *`alchemy.core.getFeeData()`*
  > - *nonce* from *`alchemy.core.getTransactionCount()` optinoal set to pending*
  > - *value*
  >
  > We are first using `alchemy.core.getTransactionCount()` to get our nonce, and `alchemy.core.getFeeData()` for our maxFee/PriorityFee per Gas. After we gathered all the required parameters, we then use SDK's Wallet helper `signTransaction(tx)` to sign our transaction before sending it with `alchemy.core.sendTransaction(rawTx)`.
  >
  > *Once the transaction is sent, it will live in the mempool, it automatically return a transaction hash, but this hash has yet to be mined and will not show up on any of the scanner until it is officially mined.*
  >
  > ![sendTx](/client/src/assets/tx.png)


  > **Receipts `/api/receipt/:net/:hash`**
  > *`alchemy.transact.waitForTransaction()`*
  > - *network*
  > - *Transaction Hash*
  >
  > After we received the transaction hash from `sendTranasaction` we use `waitForTransaction` to return a receipt response after it had successfully mined.
  >
  > ![receipt](/client/src/assets/receipt.png)

  > **Transaction History `/api/transactions`**
  > *`alchemy.core.getAssetTransfers`*
  > - *network*
  > - *toAddress* / *fromAddressZ*
  > - *excludeZeroValue* (**true**/false)
  > - *category* `[external]`
  > - *maxCount*
  > - *withMetadata* (**true**/false)
  >
  > Since we want to show both inbound and outbound transaction history, we are calling `getAssetTransfers` twice. Due to ease of displaying info, I had set our maxCount to 10.
  >
  > ![params](/client/src/assets/param.png)
  > ![historyFetch](/client/src/assets/fetch.png)

  
  ***

  ***
  ## License

  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  ***
  ## Author
  *Mari Ma*

  [<img src="https://res.cloudinary.com/dbjhly3lm/image/upload//h_50/v1682488301/personal%20assets/logo_github_icon_143196_phgakv.png" alt='github' >](https://github.com/DraconMarius)
  [<img src="https://res.cloudinary.com/dbjhly3lm/image/upload/h_50/v1682488301/personal%20assets/logo_linkedin_icon_143191_nv9tim.png" alt='linkedin'>](https://www.linkedin.com/in/mari-ma-70771585/)

[Icon credit @ Anton Kalashnyk](https://icon-icons.com/users/14quJ7FM9cYdQZHidnZoM/icon-sets/)

  ***
  ## Questions
  For any questions, please reach out directly or by creating an issue.


  