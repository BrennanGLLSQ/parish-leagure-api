
const express = require('express')
const {getBrackets, postNewBracket} = require('./src/services/dynamoHelper')
const app = express()
const port = 3001

const league_user_model = require('./leagueUserModel')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://parishmergersmadness.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/get-all-users', (req, res) => {
    league_user_model.getUser()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/testing-ec2', async (req, res) => {
  const items = await getBrackets({userName: 'aaaaa just some name', email: 'email@email.com'})
  await postNewBracket({
    userName: {S: 'test'},
    closurePicks: {L: [{N: "1"},{N: "2"},{N: "3"}]},
    openPicks: {L: [{N: "4"},{N:"5"},{N:"6"}]},
    email: {S: 'asdf@email.com'},
  })

  res.status(200).send(items)
})

app.post('/create-user', (req, res) => {
    league_user_model.createUser(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})