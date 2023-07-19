# My Wallet <img src=https://github.com/renatainacio/mywallet-front/blob/main/public/banknotes-24.png>
An app to track personal income and expenses

# Overview
<img src=https://github.com/renatainacio/mywallet-front/blob/main/public/My-Wallet.gif>

Try it out at: https://mywallet-alpha.vercel.app/

# About
This app allows users to register their income and expenses daily, making it easier to control their cash flow.

# EndPoints
## Users

|  HTTP Method | Route  | Description  |
|---|---|---|
| POST  | /cadastro  | sign up  |
| POST  | /  | sign in  |
| GET  | /user  | get user details  |

## Transactions
|  HTTP Method | Route  | Description  |
|---|---|---|
| POST  | /nova-transacao/:type  | add new income or expense |
| GET  | /transacoes  | get all transactions from a given user  |
| DELETE  | /transacoes/:id  | delete the transaction with the given id  |
| PUT  | /transacoes/:id  | edit the transaction with the given id  |

# Technologies
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
	![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
 	![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

# Related Projects
This is a Full Stack project. You can check the Front End repository <a href="https://github.com/renatainacio/mywallet-front"> here</a>.
