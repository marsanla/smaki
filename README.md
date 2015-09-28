# Smaki JSON

Interact with json object like a database

## Installation

```bash
$ npm install smaki
```

## Basic usage

```javascript
var Smaki = require('smaki');

var json = {
    "a": 1,
    "b": 2
};

var smaki = new Smaki(json);
```

## API

#### Compress
Compress and minify the json:
```javascript
smaki.compress();
// => a|b^1|2^^$0|2|1|3]
```

#### Uncompress
Uncompress a minified json:
```javascript
smaki.uncompress();
```

#### Get
Get value:
```javascript
smaki.get(key);
```

#### Get Objects
Get objects:
```javascript
smaki.getObjects([key], [value], [objects]);
```

#### Get Paths
Get paths:
```javascript
smaki.getObjects([key], [val], [obj], [stringify], [path]);
```

#### Get Values
Get values:
```javascript
smaki.getValues(key, [obj]);
```

#### Get Keys
Get keys:
```javascript
smaki.getKeys(value, [obj]);
```

#### Delete
Delete objects:
```javascript
smaki.deleteObject(key, [value], [obj]);
```

#### Update
Update objects:
```javascript
smaki.updateObject(key, value, [oldValue], [obj]);
```


## License

Licensed under the Apache License, Version 2.0
(<http://www.apache.org/licenses/LICENSE-2.0>)

- - -
EJS Embedded JavaScript templates copyright 2112
mde@fleegix.org.


