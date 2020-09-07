# money-transfer-app
app for money transfer between two users

IMPORTANT: 
All these apis should be converted to POST(in real scenarios), but just for the sake and ease of TESTING easily, these apis have been built using GET.

RUN:

To run the application, 
1. clone the repo
2. run npm install
3. run npm start


URL

----------------------------------------------------------------------------------------------------
GET http://localhost:3000/users/- Use this url to get the entire users list, and balances of each account the user holds

Notice that the userId is same for both the accounts, but their accountIds are different from each other

Screenshot: 

![alt text](https://github.com/ajithprasaad/money-transfer-app/blob/master/Screenshot%20from%202020-09-07%2021-28-48.png)

Response: 
```json
{
  "_id": "5f56103af32b520ed71720a9",
  "userId": "1000134",
  "accountId": "200",
  "name": "Dave",
  "accountType": "Current Account",
  "accountBalance": 4000
},
{
  "_id": "5f56103af32b520ed71720aa",
  "userId": "1000134",
  "accountId": "201",
  "name": "Dave",
  "accountType": "Savings Account",
  "accountBalance": 15000
}
```


----------------------------------------------------------------------------------------------------
GET - http://localhost:3000/api/checkBalance?id= Use this url and input parameters for accounId(indicates one unique account that Dave holds)

For example: 

Request: http://localhost:3000/api/checkBalance?id=201 [where 201 is the accountId of, one of many accounts of Dave]

Screenshot: 

![alt text](https://github.com/ajithprasaad/money-transfer-app/blob/master/Screenshot%20from%202020-09-07%2021-28-25.png)

Response:
```json
{
  "userId": "1000134",
  "name": "Dave",
  "accountBalance": 15000,
  "totalBalance": 19000,
  "message": "Hi Dave, your total available balance is 19000"
}
```
--------------------------------------------------------------------------------------
Situation I]

GET http://localhost:3000/api/moneytransfer?from=123&to=200&amount=1500- 

Here,

from (query param)- indicates the accountId of the user whose money will be deducted [accountId- 123]
to (query param)- indicates the accountId of the user for whom, money will be credited [accountId- 200]
amount (query param)- indicates the amount that needs to be transferred between users [amount- 1500]

Screenshot: 

![alt text](https://github.com/ajithprasaad/money-transfer-app/blob/master/Screenshot%20from%202020-09-07%2021-28-38.png)


RESPONSE:
```json
{
  "creditor_balance": 2000, {Rs. 1500 was debited from accountId-"123"}
  "debtor_balance": 4000, {Rs. 1500 got credited to accountId- "200"}
  "message": "Congratulations! Amount was successfully transfered",
  "err": "None"
}
```
To verify if the transfer has been done properly, refresh the first api

***********************************
Situation II]

REQUEST: GET http://localhost:3000/api/moneytransfer?from=200&to=123&amount=500000

RESPONSE:
```json
{
  "message": "Insufficient balance or amount entered is greater than allowed limit",
  "err": "money transfer exception"
}
```
To verify if the transfer has been done properly, refresh the first api


******************************************************************

