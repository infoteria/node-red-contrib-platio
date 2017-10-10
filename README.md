Platio Node for Node-RED
========================

This node allows you to create, get, update and delete records in your Plate on [Platio](https://plat.io/).

This node communicates with Platio using Platio API, so you need to know some basics about it. Please read [Platio API Documents](http://doc.plat.io/api/en/) about Platio API.

##### OpenBlocks

Try [node-red-contrib-platio-openblocks](https://github.com/infoteria/node-red-contrib-platio-openblocks) package to use Platio Node for Node-RED on a platform using old node.js like OpenBlocks.


Prepare your Plate and Platio API
---------------------------------

1. Create your Plate on Platio Studio.
2. Add a user to your Plate. Don't forget to check [Allow API access to records and attachments].
3. Open Platio Data Console of your Plate, and log in with this user.
4. Go to the Developer page and check necessary information.


Common configurations
---------------------

### Node configurations

On each node, you can set an application and a collection you're going to use from Node-RED UI.

<dl>
  <dt>Name (<code>name</code>)</dt>
  <dd>A name of the Node.</dd>
  <dt>Application ID (<code>applicationId</code>)</dt>
  <dd>An ID of an application (Plate).</dd>
  <dt>Collection ID (<code>collectionId</code>)</dt>
  <dd>An ID of a collection.</dd>
  <dt>Authorization Header (<code>authorization</code>)</dt>
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


Error handling
--------------

When an error occurs, Platio Node reports it to Node-RED as an error. You can handle errors using catch Node.


Nodes
-----

### platio in

Using platio in node, you can get a specified record, or records that matches your search criteria.

In addition to the common configurations, you can configure these properties.

<dl>
  <dt>Record ID (<code>recordId</code>)</dt>
  <dd>An ID of a record to get.</dd>
  <dt>Limit (<code>limit</code>)</dt>
  <dd>The maximum number of records to get.</dd>
  <dt>Sort Key (<code>sortKey</code>)</dt>
  <dd>Sort Key. One of <code>column</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>createdBy</code>, <code>updatedBy</code>.</dd>
  <dt>Sort Order (<code>sortOrder</code>)</dt>
  <dd>Sort Order. <code>ascending</code> or <code>descending</code>.</dd>
  <dt>Sort Column ID (<code>sortColumnId</code>)</dt>
  <dd>An ID of a column you want to sort records by. You can specify this only when Sort Key is <code>column</code>.</dd>
  <dt>Search Expression (<code>search</code>)</dt>
  <dd>An expression to search records. See <a href="http://doc.plat.io/api/en/search.html">Record Query Syntax</a> for details.</dd>
  <dt>Time Zone (<code>timezone</code>)</dt>
  <dd>Time Zone used when searching records, like <code>America/Los_Angeles</code>.</dd>
</dl>

This node retrieves a specified record and set it to `msg.payload` when you set Record ID. See [Platio API Documents](https://doc.plat.io/en/) for details about the record format.

It retrieves an array of records if you don't specify Record ID and set it to `msg.payload`.

When you set Limit, it retrieves records up to the number specified. It calls API multiple times when you set a value greater than the limit of API (100).

### platio out

Using platio out node, you can create a new record, update and delete an existing record.

In addition to the common configurations, you can configure these properties.

<dl>
  <dt>Record ID (<code>recordId</code>)</dt>
  <dd>An ID of a record to update or delete.</dd>
  <dt>Delete (<code>delete</code>)</dt>
  <dd><code>true</code> to delete a specified record. <code>false</code> otherwise.</dd>
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
