const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//probably want to just take a query
const getBrackets = async () => {
    const params = {
        ExpressionAttributeValues: {
            //define every attribute here so filter can be anything
        //   ':s': {N: '2'},
        //   ':e' : {N: '09'},
          ':bracketId' : {S: 'someStringId'} //ought to be a parameter given 
        },
        // KeyConditionExpression: 'bracketId = :bracketId',
        // ProjectionExpression: 'Episode, Title, Subtitle',//names of fields to retrieve
        FilterExpression: 'bracketId = :bracketId',
        TableName: 'bracket'
      }


    const items = await ddb.scan(params, (err, data) => {
            if (err) {
            console.error("Error", err);
            }}
        ).promise().then(data => {
            return data.Items
        })
    console.log(items)
    return items
}

module.exports = {getBrackets}