const AWS = require('aws-sdk')
const {v4: uuidV4} = require('uuid')
AWS.config.update({region: 'us-east-1'});

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

//bracket items:
//[
//   {
//     userName: { S: 'aaaaa just some name' },
//     closurePicks: { L: [Array] },
//     openPicks: { L: [Array] },
//     bracketId: { S: 'someStringId' },
//     email: { S: 'email@email.com' }
//   }
// ]


//only allow querying of string attributes for now
const buildExpressionAttributeValues = (queryValues) => {
    return Object.entries(queryValues).map(([key, value]) => {
        return {
            [`:${key}`] : {S: value}
        }
    }).reduce((acc, curr) => {
        return {...acc, ...curr}
    }, {})
}

const buildFilter = (queryValues) => {
    const entries = Object.entries(queryValues)
    return entries.reduce((acc, curr, index) => {
        const key = curr[0]
        let queryString = `${key} = :${key}`
        if(index < entries.length - 1){
            queryString = queryString + ' and ' 
        }
        return acc + queryString
    }, '')
}

//probably want to just take a query
const getBrackets = async (queryValues) => {
    const params = {
        ExpressionAttributeValues: buildExpressionAttributeValues(queryValues),
        FilterExpression: buildFilter(queryValues),
        TableName: 'bracket'
      }
    const items = await ddb.scan(params, (err, data) => {
            if (err) {
            console.error("Error", err);
            }}
        ).promise().then(data => {
            return data.Items
        })
    return items
}

const postNewBracket = async (item) => {

    const params = {
        TableName: "bracket",
        Item: {
            ...item,
            bracketId: {S: uuidV4()},
        }
    }

    console.log(params.Item.bracketId)

    await ddb.putItem(params, (err, data) =>{
        if(err) {
            console.error("Error", err)
        }
    })



}

module.exports = {getBrackets, postNewBracket}