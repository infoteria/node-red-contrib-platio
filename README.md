# Platio Node for Node-RED

This node allows you to create, get, update and delete records your Plate on [Platio](https://plat.io/).

This node communicates with Platio using Platio API, so you need to know some basics about it. Please read [Platio API Documents](http://doc.plat.io/api/en/) about Platio API.


## Prepare your Plate and Platio API

1. Create your Plate on Platio Studio.
2. Add a user to your Plate. Don't forget to check [Allow API access to records and attachments].
3. Open Platio Data Console of your Plate, and log in with this user.
4. Go to the Developer page and check necessary information.


## Common configurations

### Node configurations

On each node, you can set an application and a collection you're going to use from Node-RED UI.

<dl>
  <dt>Name (`name`)</dt>
  <dd>A name of the Node.</dd>
  <dt>Application ID (`applicationId`)</dt>
  <dd>An ID of an application (Plate).</dd>
  <dt>Collection ID (`collectionId`)</dt>
  <dd>An ID of a collection.</dd>
  <dt>Authorization Header (`authorization`)</dt>
  <dd>Set your authorization token for Platio API. Go to the Developer page in Platio Data Console and generate an API token. Then, paste a token at [Authorization Header].</dd>
</dl>

### Configurations per request

You can overwrite configurations you set as described above by setting values to `msg.platio`.

```
msg.platio = {
  applicationId: 'pxxxxxxxxxxxxxxxxxxxxxxxxxx',
  collectionId: 'txxxxxxx',
  authorization: 'Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
};
```


## Error handling

When an error occurs, Platio Node reports it to Node-RED as an error. You can handle errors using catch Node.


## Nodes

## platio in

Using platio in node, you can get a specified record, or records that matches your search criteria.

In addition to the common configurations, you can configure these properties.

<dl>
  <dt>Record ID (`recordId`)</dt>
  <dd>An ID of a record to get.</dd>
  <dt>Limit (`limit`)</dt>
  <dd>The maximum number of records to get.</dd>
  <dt>Sort Key (`sortKey`)</dt>
  <dd>Sort Key. One of `column`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.</dd>
  <dt>Sort Order (`sortOrder`)</dt>
  <dd>Sort Order. `ascending` or `descending`.</dd>
  <dt>Sort Column ID (`sortColumnId`)</dt>
  <dd>An ID of a column you want to sort records by. You can specify this only when Sort Key is `column`.</dd>
  <dt>Search Expression (`search`)</dt>
  <dd>An expression to search records. See [Record Query Syntax](http://doc.plat.io/api/en/search.html) for details.</dd>
  <dt>Time Zone (`timezone`)</dt>
  <dd>Time Zone used when searching records, like `America/Los_Angeles`.</dd>
</dl>

This node retrieves a specified record and set it to `msg.payload` when you set Record ID. See [Platio API Documents](https://doc.plat.io/en/) for details about the record format.

It retrieves an array of records if you don't specify Record ID and set it to `msg.payload`.

When you set Limit, it retrieves records up to the number specified. It calls API multiple times when you set a value greater than the limit of API (100).

## platio out

Using platio out node, you can create a new record, update and delete an existing record.

In addition to the common configurations, you can configure these properties.

<dl>
  <dt>Record ID (`recordId`)</dt>
  <dd>An ID of a record to update or delete.</dd>
  <dt>Delete (`delete`)</dt>
  <dd>`true` to delete a specified record. `false` otherwise.</dd>
</dl>

This node creates a new record with values specified in `msg.payload` when you don't specify Record ID.

It updates a specified record when you specify Record ID. Values not includes in `msg.payload` will be removed.

It deletes a specified record when you specify Record ID and set Delete to `true`. `msg.payload` won't be used in this case.

Specify values to `msg.payload` in this format when you create or update a record. Consult [Platio API Documents](https://doc.plat.io/en/) for details.

```
msg.payload = {
  values: {
    cxxxxxxx: {
      type: 'Number',
      value: 20
    },
    cyyyyyyy: {
      type: 'String',
      value: 'Text'
    }
  }
};
```


## Using Platio Node in OpenBlocks

You cannot use Platio Node in Node-RED on OpenBlocks because the version of node.js is too old. Please use node-red-contrib-platio-openblocks package on OpenBlocks.
