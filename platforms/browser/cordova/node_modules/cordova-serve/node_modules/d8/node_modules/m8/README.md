# m8.js [![build status](https://secure.travis-ci.org/constantology/m8.png)](http://travis-ci.org/constantology/m8)

m8 (mate) is a small utility library – for modern JavaScript engines – you might find useful or just plain annoying.

m8 provides a set of basic functionality I tend to write over and over in each of my projects, so I just abstracted it out into its own library!

## A note on the archticture
The bulk of the `m8` API, lives under the `m8` namespace. There are a few extensions to JavaScript Natives.

The reason being: some methods/ properties make more sense being assigned to a specific Type. These are extended correctly, using `Object.defineProperty` and are non-enumerable.

They will not break any standard functionality – e.g. `for ... in` loops – and they will not overwrite any existing functionality with the same name – though it is possible if you want to.

### Extending into the future
[Common JS Modules 1.1.1](http://wiki.commonjs.org/wiki/Modules/1.1.1) [notes on extending native prototypes from a module](http://wiki.commonjs.org/wiki/Modules/Natives) contains a [proposal for explicit native use in modules](http://wiki.commonjs.org/wiki/Modules/ProposalForNativeExtension).

In essence: future commonjs modules could potentially be sandboxed from the rest of the environment they're running in. So the behaviour of extending native Types could become unpredictable.

m8 **attempts** to future proof itself by implementing functionality similar to that defined in the [example of how to extend prototypes using a commonjs module](https://gist.github.com/268543) included in the proposal.

#### m8.x( [Type1:Mixed, Type2:Mixed, ..., TypeN:Mixed] ):m8 and m8.x.cache( Type:String, extensisons:Function ):m8
These two methods work in tandem to allow you to store any extensions for a particular Type – Native or otherwise, using `m8.x.cache` – and then extend Types as and when needed – using `m8.x`.

##### Example:
Suppose we have a module called `foo` with the following code:

```javascript

// require m8
    var m8 = require( 'm8' );

// extend foo module's natives if sandboxed.
// IMPORTANT: if the module IS NOT sandboxed, the natives in foo will have already been extended when m8 was required
//            m8 keeps track of this and will only attempt to apply any newly added extensions.
    m8.x( Object, Array, Boolean, Function );

// caching new extensions for Array. won't actually extend anything at this point.
     m8.x.cache( 'Array', function( Type ) { // <= notice 'Array' is a String, NOT the actual Array Function
       m8.def( Type, m8.describe( function() {
          /** some static method **/
       }, 'w' ) );

       m8.defs( Type.prototype, {
          doSomething     : function() { /** do something **/ },
          doSomethingElse : function() { /** do something else **/ }
       }, 'w' );
    } );

// only extends foo module's Array! since it is the only Type to have more extensions added.
    m8.x( Object, Array, Boolean, Function ); // no danger and no pointless iterations either.

    module.exports = {
      extend : function() {
         m8.x.apply( m8, arguments );
       }
    };

```

We can then require `foo` from another module and pass it any Types we want to extend:

```javascript

// extend this module's natives if sandboxed.
    require( 'foo' ).extend( Object, Array, Boolean, Function );

// do all the stuff "JavaScript: The Good Parts" tells you not to do here, coz you're an animal!

```

## Support

Tested to work with nodejs, FF4+, Safari 5+, Chrome 7+, IE9+. Should technically work in any browser that supports [ecma 5]( http://kangax.github.com/es5-compat-table/) without throwing any JavaScript errors.

## API

### m8( item:Mixed ):Mixed
m8 itself is a Function which returns the the first parameter passed to it.

#### Example

```javascript

    m8( true );            // returns => true

    m8( 'foo' );           // returns => "foo"

    m8( { foo : 'bar' } ); // returns => { "foo" : "bar" }

```

### m8.bless( namespace:String[, context:Object] ):Object
Creates an Object representation of the passed `namespace` String and returns it.

If a `context` Object is given, the Object tree created will be added to the `context` Object, otherwise it will be added to the global namespace.

**NOTE:** If any existing Objects with the same name already exist, they will **NOT** be replaced and any child Objects will be appended to them.

#### Example:

```javascript

// m8.ENV == 'browser'
    m8.bless( 'foo.bar' );       // creates => global.foo.bar

// you can now do:
    foo.bar.Something = function() {};

    m8.bless( 'foo.bar', m8 );   // creates => m8.foo.bar

    var bar = m8.bless( 'foo.bar' );

    bar === foo.bar              // returns => true

```

**IMPORTANT:** When using `m8.bless` within a commonjs module: if you want your namespace Object to be assigned to the correct `module.exports`, then you should always pass the `module` instance as the context (`ctx`) of your namespace.

#### Example:

```javascript

// m8.ENV == 'commonjs'

// inside my_commonjs_module.js
    m8.bless( 'foo.bar', module );            // creates => module.exports.foo.bar

// you can now do:
    module.exports.foo.bar.Something = function() {};

// if you want to include "exports" in your namespace, you can do so by placing a carat (^) at the start of the String
    m8.bless( '^exports.foo.bar', module ); // creates => module.exports.foo.bar

// otherwise, you will end up creating an extra exports Object, e.g:
    m8.bless( 'exports.foo.bar', module ); // creates => module.exports.exports.foo.bar

// alternatively, you can also do:
    m8.bless( 'foo.bar', module.exports ); // creates => module.exports.foo.bar

```

### m8.coerce( item:Mixed ):Mixed
Attempts to coerce primitive values "trapped" in Strings, into their real types.

#### Example:

```javascript

    m8.coerce( 'false' );       // returns false

    m8.coerce( 'null' );        // returns null

    m8.coerce( 'true' );        // returns true

    m8.coerce( 'undefined' );   // returns undefined

    m8.coerce( 'NaN' );         // returns NaN

    m8.coerce( '0001' );        // returns 1

    m8.coerce( '0012' );        // returns 12

    m8.coerce( '0123' );        // returns 123

    m8.coerce( '123.4' );       // returns 123.4

    m8.coerce( '123.45' );      // returns 123.45

    m8.coerce( '123.456' );     // returns 123.456

    m8.coerce( '123.456.789' ); // returns "123.456.789"

```

### m8.copy( target:Object, source:Object[, no_overwrite:Boolean] ):Object
Copies the properties – accessible via `Object.keys` – from the `source` Object to the `target` Object and returns the `target` Object.

#### Example:

```javascript

    var foo = { one : 1, two : 2, three : 3 },
        bar = m8.copy( {}, foo );

    bar          // returns => { "one" : 1, "two" : 2, "three" : 3 }

    foo === bar  // returns => false

    m8.copy( foo, { three : 3.3, four : 4 }, true ); // returns => { "one" : 1, "two" : 2, "three" : 3, "four" : 4 }

```

### m8.def( item:Mixed, name:String, descriptor:Object[, overwrite:Boolean, debug:Boolean]] ):m8
Shortened version of [Object.defineProperty](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty) with some extra options.

<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td>item</td><td>The item to define a property on.</td></tr>
	<tr><td>name</td><td>The name of the property you are defining.</td></tr>
	<tr><td>descriptor</td><td>The property descriptor for the new/ modified property.</td></tr>
	<tr><td>overwrite</td><td>Whether or not to attempt overwriting the new property if it exists.</td></tr>
	<tr><td>debug</td><td>Whether or not to throw an error if the property already exists.</td></tr>
</table>

The last two – optional – parameters are handy for extending JavaScript Natives without risking collisions with native/ other implementations.

#### Example:

```javascript

    m8.def( Object, 'greet', m8.describe( function( name ) { return 'Hello ' + name + '!'; }, 'w' ) );

    Object.greet( 'world' ); // returns => "Hello world!"

    delete Object.greet;     // returns => false; Object.greet is not configurable

```

### m8.defs( item:Mixed, descriptors:Object, mode:String|Object[, overwrite:Boolean, debug:Boolean]] ):m8
Similar to `m8.def` except `m8.defs` allows you to define multiple properties at once.

**NOTE:** Calls `m8.def` internally.

<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td>item</td><td>The item to define the properties on.</td></tr>
	<tr><td>descriptors</td><td>An Object of properties apply to the item. Each of the <code>descriptors</code> key/ value pairs become the property name and value on the item. This can be a property descriptor, partial descriptor or just the value you want to assign.</td></tr>
	<tr><td>mode</td><td>The permissions to apply to each property descriptor in the <code>descriptors</code> Object. See <code>m8.describe</code> directly below and <code>m8.modes</code> to find out more about this.</td></tr>
	<tr><td>overwrite</td><td>Whether or not to attempt overwriting the new property if it exists.</td></tr>
	<tr><td>debug</td><td>Whether or not to throw an error if the property already exists.</td></tr>
</table>

The last two – optional – parameters are handy for extending JavaScript Natives without risking collisions with native/ other implementations.

#### Example:

```javascript

    m8.defs( Object, {
       accessor : { get : function() { return this.__accessor; }, set : function( a ) { this.__accessor = a; } },
       global   : { value : window },
       greeting : function( name ) { return 'Hello ' + name + '!'; }
    }, 'w' ) );
/**
    IMPORTANT TO NOTE: Accessors do not alllow the "writable" attribute to even be present in their descriptor Object.
                      see: https://plus.google.com/117400647045355298632/posts/YTX1wMry8M2
                      m8.def handles this internally, so if a "get" or "set" accessor Function is in the descriptor, the
                      "writable" attribute will be removed from the descriptor, if it exists.
**/

    Object.accessor = 'foo'; // returns => 'foo'
    Object.accessor;         // returns => 'foo'

    Object.global === window // returns => true
    Object.greet( 'world' ); // returns => "Hello world!"

    delete Object.greet;     // returns => false; Object.greet is not configurable

```

### m8.describe( value:Mixed[, mode:Object|String] ):Object
When using [Object.defineProperty](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty) en masse, your property descriptors can really start to bulk out your codebase.

Using `m8.describe` in combination with `m8.modes` can significantly reduce the amount of superfluous code you need to write. Especially when working with verbose property names like: `configurable`, `enumerable` & `writeable`.

When `value` is an Object `m8.describe` assumes you are passing it a property descriptor you want to assign modes to.

#### Example:

```javascript

    m8.describe( {
       get : function() { ... },
       set : function() { ... }
    }, 'cw' );

    /*  returns => {
        configurable : true,
        enumerable   : false,
        get          : function() { ... },
        set          : function() { ... },
        writable     : true // NOTE: this property is illegal in an accessor descriptor. however, m8.def will handle this internally saving you tears
    } */

```

When `value` is anything but an Object, it is assigned to the `value` property of the property descriptor.

#### Example:

```javascript

    m8.describe( function() { ... }, m8.modes.c );

    /* returns => {
        configurable : true,
        enumerable   : false,
        value        : function() { ... },
        writeable    : false
    } */

```

See `m8.modes` below for a list of available property descriptors.

### m8.description( item:Object, property:String ):Object
Shortened version for [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor).

### m8.empty( value:Mixed ):Boolean
Returns `true` if the passed `value` does not exist (see `exist` below), is an empty Array, Object, String or any other enumerable type.

#### Example:

```javascript

    m8.empty( undefined );    // returns => true

    m8.empty( null );         // returns => true

    m8.empty( '' );           // returns => true

    m8.empty( [] );           // returns => true

    m8.empty( {} );           // returns => true

    m8.empty( ' ' );          // returns => false

    m8.empty( [1] );          // returns => false

    m8.empty( { 0 : null } ); // returns => false

```

### m8.exists( value:Mixed ):Boolean
Returns `false` if the passed `value` is `undefined` , `NaN` or `null`, returns `true` otherwise.

#### Example:

```javascript

    m8.exists( undefined ); // returns => false

    m8.exists( NaN );       // returns => false

    m8.exists( null );      // returns => false

    m8.exists( 0 );         // returns => true

    m8.exists( false );     // returns => true

    m8.exists( {} );        // returns => true

```

### m8.expose( library:Object[, name:String, module:Module] ):library
Generic method to standardise exposing your library package to either the global namespace or a commonjs module.

Internally resolves any conflict between the `library` to be exposed and an existing Object with the same `name`.

If the `library` already has a `__name__` property then the `name` parameter may be omitted.

If the `library` is not going to be used as a commonjs module then the `module` parameter may be omitted.

#### Example:

```javascript

    // browser based version
    ;!function() {

      var my_library = { /* you awesome library api here */ };

      m8.expose( my_library, 'foo' );

    }();

    m8.type( foo )   // returns => "library"

    foo.__name__     // returns => "foo"

    m8.expose( m8, foo );

    foo.m8 === m8    // returns => true

    m8.expose( m8, 'bar', foo );
 
    foo.bar === m8   // returns => true

    foo.bar.__name__ // returns => "m8"

```

```javascript

    // commonjs based version
    var m8         = require( 'm8' ),
        my_library = { /* you awesome library api here */ };

    m8.expose( my_library, 'foo', module );

    m8.type( foo );  // returns => 'library'

    foo.__name__;    // returns => 'foo'

```

### m8.format( tpl:String, arg1:String[, arg2:String, ..., argN:String] ):String
Replaces the – zero indexed – numeric tokens in the String with the passed parameters.

If a token does not have a value, an empty String is used in its place.

**NOTE:** `format` calls `gsub` internally.

#### Example:

```javascript

    m8.format( '{0} {1} {2} {3}', 'lorem', 'ipsum', 'dolor' ) // returns => "lorem ipsum dolor "

```

### m8.got( object:Object, key:String ):Boolean
Returns `true` if `object` contains `key` based on the `in` operator.

Any type passed to `m8.got` is cast as an Object before checking it contains a specific key. So using `m8.got` instead of simply using the `in` operator can help reduce the chance of error in your code.

```javascript

    var foo = { one : 1, two : 2, three : 3 };

    m8.got( foo, 'one' );      // returns => true

    m8.got( foo, 'four' );     // returns => false

    m8.got( foo, '__type__' ); // returns => true

```

### m8.gsub( tpl:String, dictionary:String[]|String{}[, pattern:RegExp] ):String
Replaces the tokens in the String with the values of the corresponding properties from the passed `dictionary` Object.

Also accepts an optional second parameter allowing you to define your own token matching `pattern`.

If a token does not have a value, an empty String is used in its place.

#### Example:

```javascript

    m8.gsub( '{one} {two} {three} {four}', { one : 'lorem', two : 'ipsum', three : 'dolor' } ) // returns => "lorem ipsum dolor "

```

### m8.guid():String
Generates a guid/uuid, the code for this was adapted from [this gist](https://gist.github.com/2295777).

```javascript

	m8.guid(); // returns something like => "286cb768-df10-4466-aabf-f5cb4ba406a2"

```

### m8.has( object:Object, key:String ):Boolean
Shortened version of `Object.prototype.hasOwnProperty.call`.

#### Example:

```javascript

    var foo = { one : 1, two : 2, three : 3 };

    m8.has( foo, 'one' );      // returns => true

    m8.has( foo, 'four' );     // returns => false

    m8.has( foo, '__type__' ); // returns => false

```

### m8.id( item:Mixed[, prefix:String] ):String
Returns the `id` property of the passed item – item can be an Object, HTMLElement, "JavaScript Class" instance, etc...

If an `id` does not exist on the passed `item`, the item is assigned an auto-generated `id` and the value is returned.

If a `prefix` is supplied then it is used as the prefix for the `id` – if not `anon` is used as the `prefix`.

An internal counter that is automatically incremented is appended to the end of the `prefix` and is separated from the prefix by a hyphen.

#### Example:

```javascript

    var foo = { id   : 'foo' },
       bar = { name : 'bar' },
       yum = { nam  : 'yum' };

    m8.id( foo );         // returns => "foo"

    m8.id( bar );         // returns => "anon-1000"

    m8.id( yum, 'yum' );  // returns => "yum-1001"

```

### m8.iter( item:Mixed ):Boolean
Returns `true` if the passed item can be iterated over.

### m8.len( item:Mixed ):Number
Tries the returns the `length` property of the passed `item`.

#### Example:

```javascript

    m8.len( { one : 1, two : 2, three : 3 } ); // returns => 3

    m8.len( [1, 2, 3] );                       // returns => 3

    m8.len( 'foobar' );                        // returns => 6

    m8.len( { one : 1, two : 2, three : 3 } ) === Object.keys( { one : 1, two : 2, three : 3 } ).length
    // returns => true

```

### m8.merge( target:Array|Object, source:Array|Object ):Boolean
Performs a "deep copy" of all the properties in `source` to `target`, so that `target` does not reference any child Arrays and/ or Objects that belong to `source`.

### m8.nativeType( item:Mixed ):String (alias: m8.ntype)
Returns the native `type` of the passed item. For normalised types use `m8.type`.

**Note:** All types are **always** in lowercase.

#### Example:

```javascript

    m8.nativeType( null );                                   // returns => "null"

    m8.nativeType( undefined );                              // returns => "undefined"

    m8.nativeType( [] );                                     // returns => "array"

    m8.nativeType( true );                                   // returns => "boolean"

    m8.nativeType( new Date() );                             // returns => "date"

    m8.nativeType( function() {} );                          // returns => "function"

    m8.nativeType( 0 );                                      // returns => "number"

    m8.type( { enumerable : true, get : function() {} } );   // returns => "object"

    m8.type( m8.description( window, 'document' ) );         // returns => "object"

    m8.nativeType( {} );                                     // returns => "object"

    m8.nativeType( Object.create( null ) );                  // returns => "object"

    m8.nativeType( /.*/ );                                   // returns => "regexp"

    m8.nativeType( '' );                                     // returns => "string"

    m8.nativeType( document.createElement( 'div' ) );        // returns => "htmldivelement"

    m8.nativeType( document.querySelectorAll( 'div' ) );     // returns => "htmlcollection" | "nodelist"

    m8.nativeType( document.getElementsByTagName( 'div' ) ); // returns => "htmlcollection" | "nodelist"

    m8.nativeType( global );                                 // returns => "global"

    m8.nativeType( window );                                 // returns => "global" | "window"

```

### m8.noop():void
An empty Function that returns nothing.

### m8.nativeType( item:Mixed ):String (alias: m8.ntype)
Returns the native `type` of the passed item. For normalised types use `m8.type`.

**Note:** All types are **always** in lowercase.

#### Example:

```javascript

    m8.nativeType( null );                                       // returns => "null"

    m8.nativeType( undefined );                                  // returns => "undefined"

    m8.nativeType( [] );                                         // returns => "array"

    m8.nativeType( true );                                       // returns => "boolean"

    m8.nativeType( new Date() );                                 // returns => "date"

    m8.nativeType( function() {} );                              // returns => "function"

    m8.nativeType( 0 );                                          // returns => "number"

    m8.nativeType( { enumerable : true, get : function() {} } ); // returns => "object"

    m8.nativeType( m8.description( window, 'document' ) );       // returns => "object"

    m8.nativeType( {} );                                         // returns => "object"

    m8.nativeType( Object.create( null ) );                      // returns => "object"

    m8.nativeType( /.*/ );                                       // returns => "regexp"

    m8.nativeType( '' );                                         // returns => "string"

    m8.nativeType( document.createElement( 'div' ) );            // returns => "htmldivelement"

    m8.nativeType( document.querySelectorAll( 'div' ) );         // returns => "htmlcollection" | "nodelist"

    m8.nativeType( document.getElementsByTagName( 'div' ) );     // returns => "htmlcollection" | "nodelist"

    m8.nativeType( global );                                     // returns => "global"

    m8.nativeType( window );                                     // returns => "global" | "window"

```

### m8.obj( [props:Obejct] ):Object
Creates an empty Object using `Object.create( null )`, the Object has no constructor and executing `Object.getPrototypeOf` on the empty Object instance will return `null` rather than `Object.prototype`.

Optionally pass an Object whose properties you want copied to the empty Object instance.

### m8.ptype( item:Mixed ):String
Returns the native `type` of the passed item's `__proto__`.

**Note:** All types are **always** in lowercase.

#### Example:

```javascript

    m8.ptype( null );                                   // returns => "object"

    m8.ptype( undefined );                              // returns => "object"

    m8.ptype( [] );                                     // returns => "array"

    m8.ptype( true );                                   // returns => "boolean"

    m8.ptype( new Date() );                             // returns => "date"

    m8.ptype( function() {} );                          // returns => "function"

    m8.ptype( 0 );                                      // returns => "number"

    m8.ptype( {} );                                     // returns => "object"

    m8.ptype( Object.create( null ) );                  // returns => "null"

    m8.ptype( /.*/ );                                   // returns => "regexp"

    m8.ptype( '' );                                     // returns => "string"

    m8.ptype( document.createElement( 'div' ) );        // returns => "object"         <- WebKit
                                                        // | "xpc_..._jsclass"         <- FireFox
                                                        // | "htmldivelementprototype" <- MSIE >= 9

    m8.ptype( document.querySelectorAll( 'div' ) );     // returns => "object"         <- WebKit
                                                        // | "xpc_..._jsclass"         <- FireFox
                                                        // | "htmlcollectionprototype" <- MSIE >= 9

    m8.ptype( document.getElementsByTagName( 'div' ) ); // returns => "object"         <- WebKit
                                                        // | "xpc_..._jsclass"         <- FireFox
                                                        // | "nodelistprototype"       <- MSIE >= 9

    m8.ptype( global );                                 // returns => "object"         <- WebKit
                                                        // | "xpc_..._jsclass"         <- FireFox
                                                        // | "windowprototype"         <- MSIE >= 9

    m8.ptype( window );                                 // returns => "object"         <- WebKit
                                                        // | "xpc_..._jsclass"         <- FireFox
                                                        // | "windowprototype"         <- MSIE >= 9 (I like the MSIE ones the best!)

```

### m8.range( begin:Number|String, end:Number|String ):Array
Returns an Array starting at `begin` where each value is incremented by `1` until `end` is reached.

#### Example:

```javascript

    m8.range(  1,   10 );  // returns => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    m8.range( 20, 1000 );  // returns => [20, 21, 22, ..., 1000]

    m8.range( 'A', 'z' );  // returns => ['A', 'B', 'C', ..., 'x', 'y', 'z']
    m8.range( 'α', 'ω' ); // returns => ['α', 'β', 'γ', ..., 'χ', 'ψ', 'ω']

```

**NOTE:** Only the first character will be incremented in a `String` range.

## m8.remove( item:Array, value_or_index1:Number|Mixed|Number[]|Mixed[][, value_or_index2:Number|Mixed, ..., value_or_indexN:Number|Mixed] ):item
## m8.remove( item:Object, property1:String|String[][, property2:String, ..., propertyN:String] ):item
Removes items from the passed Array or Object and returns the passed Array or Object.

If removing items from an Array, you can either pass the index of the item you want to remove or the item itself.
If removing items from an Object, you simply pass the key of the item you want to remove.

#### Example:

```javascript

    var foo_arr = ['one', 'two', 'three'],
       foo_obj = { one : 1, two : 2, three : 3 };

    m8.remove( foo_arr, 'one', 'three' );   // returns => ['two']

    m8.remove( foo_arr, ['one', 'three'] ); // same as above

    m8.remove( foo_arr, 0, 2 );             // same as above

    m8.remove( foo_arr, [0, 2] );           // same as above

    m8.remove( foo_obj, 'one', 'three' );   // returns => { two : 2 }

    m8.remove( foo_obj, ['one', 'three'] ); // same as above

```

### m8.tostr( item:Mixed ):String
Shortened version of `Object.prototype.toString.call`.

### m8.type( item:Mixed ):String
Returns the normalised `type` of the passed item.

**Note:** All types are **always** in lowercase.

#### Example:

```javascript

    m8.type( null );                                       // returns => false

    m8.type( undefined );                                  // returns => false

    m8.type( [] );                                         // returns => "array"

    m8.type( true );                                       // returns => "boolean"

    m8.type( new Date() );                                 // returns => "date"

    m8.type( { enumerable : true, get : function() {} } ); // returns => "descriptor"

    m8.type( m8.description( window, 'document' ) );       // returns => "descriptor"

    m8.type( function() {} );                              // returns => "function"

    m8.type( 0 );                                          // returns => "number"

    m8.type( NaN );                                        // returns => "nan"

    m8.type( Object.create( null ) );                      // returns => "nullobject"

    m8.type( {} );                                         // returns => "object"

    m8.type( /.*/ );                                       // returns => "regexp"

    m8.type( '' );                                         // returns => "string"

    m8.type( document.createElement( 'div' ) );            // returns => "htmlelement"

    m8.type( document.querySelectorAll( 'div' ) );         // returns => "htmlcollection"

    m8.type( document.getElementsByTagName( 'div' ) );     // returns => "htmlcollection"

    m8.type( global );                                     // returns => "global"

    m8.type( window );                                     // returns => "global"

```

### m8.update( target:Array|Object, source:Array|Object ):Boolean
Performs a "deep copy" of all the properties in `source` **that are not already contained in** `target`, so that `target` does not reference any child Arrays and/ or Objects that belong to `source`.

This works similarly to `m8.merge` except that existing properties are not overwritten.

## static properties

### m8.ENV:String
Internally `m8` tries to figure out what environment it is currrently being run in.

`m8.ENV` is a String representation of what environment `m8` is assuming it is running in.

#### Environments:
<table border="0" cellpadding="0" cellspacing="0">
	<thead><tr><th>env</th><th>description</th></tr></thead>
	<tbody>
		<tr><td><strong>browser</strong></td><td>m8 is being used within a web browser.</td></tr>
		<tr><td><strong>commonjs</strong></td><td>m8 is being used within a commonjs style architecture (e.g. nodejs).</td></tr>
		<tr><td><strong>other</strong></td><td>m8 has no idea where the fudge it is.</td></tr>
	<tbody>
</table>

### m8.global:Global
A reference to the global Object, this will be `window` in a web browser and `global` in nodejs.

m8 uses the `"use strict";` directive, so having a reference to the global Object is handy.

### m8.modes:Object
`m8.modes` is an Object containing all the variations on different permissions a property may have when assigned using `Object.defineProperty`.

See `m8.describe` above for more information on how to use `m8.modes` to create property descriptors compatible with `Object.defineProperty`.

#### Available modes are:
<table border="0" cellpadding="0" cellspacing="0">
	<thead><tr><th>mode</th><th>configurable</th><th>enumerable</th><th>writeable</th></tr></thead>
	<tbody>
		<tr><td><strong>r</strong></td><td>false</td><td>false</td><td>false</td></tr>
		<tr><td><strong>ce</strong></td><td>true</td><td>true</td><td>false</td></tr>
		<tr><td><strong>cw</strong></td><td>true</td><td>false</td><td>true</td></tr>
		<tr><td><strong>ew</strong></td><td>false</td><td>true</td><td>true</td></tr>
		<tr><td><strong>cew</strong></td><td>true</td><td>true</td><td>true</td></tr>
	<tbody>
</table>

**NOTE:** You can supply the characters for a specific mode in any order.

## Extensions to JavaScript Natives

### Array.coerce( value:Mixed[, index_from:Number[, index_to:Number]] ):Array
Attempts to coerce the passed value into and Array.

If the value cannot be coerced, an Array is returned with the value as the first and only item in the Array.

The most common Types which can be coerced into Arrays are: `HtmlCollection`/ `NodeList` and Function `Arguments`.

If a `index_from` is a valid Number, then `Array.coerce` will attempt to return a slice of the returned Array starting from the Number provided.

If a `index_to` is a valid Number, then `Array.coerce` will attempt to return a slice of the returned Array starting from the Number provided by `index_from` and ending at `index_to` provided.

#### Example:

```html

    <body>
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
    </body>

```

```javascript

    Array.coerce( document.body.children );                               // returns => [div#one, div#two, div#three]

    Array.coerce( document.body.querySelectorAll( '*' ) );                // returns => [div#one, div#two, div#three]

    Array.coerce( function( a, b, c ) { return arguments; }( 1, 2, 3 ) ); // returns => [1, 2, 3]

    Array.coerce( { one : 1, two : 2, three : 3 } );                      // returns => [{ one : 1, two : 2, three : 3 }]

    Array.coerce( [1, 2, 3, 4, 5, 6, 7], 3 );                             // returns => [4, 5, 6, 7]

    Array.coerce( [1, 2, 3, 4, 5, 6, 7], 3, 0 );                          // returns => [4, 5, 6, 7]

    Array.coerce( [1, 2, 3, 4, 5, 6, 7], 1, 3 );                          // returns => [2, 3]

    Array.coerce( [1, 2, 3, 4, 5, 6, 7], 3, 2 );                          // returns => [4, 5]

    Array.coerce( [1, 2, 3, 4, 5, 6, 7], 3, -1 );                         // returns => [4, 5, 6]

```

### Array.prototype.find( iterator:Function[, context:Object] ):Mixed
Returns the first item in the Array that returns a "truthy" value when executing the passed `iterator` function over the Array, or `null` if none is found.

#### Example:

```javascript

    [1, 2, 3, 4].find( function( value ) { return value > 2; } );                     // returns => 3

    [1, 2, 3, 4].find( function( value, index ) { return value > 2 && index > 2; } ); // returns => 4

    [1, 2, 3, 4].find( function( value ) { return value > 4; } );                     // returns => null

```

**REMEMBER:** The ACTUAL item in the Array is returned, **NOT** the `iterator`'s return value.

### Array.prototype.invoke( method:String[, arg1:Mixed, arg2:Mixed, ..., argN:Mixed] ):Array
Executes the passed `method` — **NOTE:** `method` is a String, and should be the name of `method` that exists on each item in the Array — passing any extra arguments to each method call.

#### Example:

```javascript

    ['lorem', 'ipsum', 'dolor', 'sit', 'amet'].invoke( 'toUpperCase' ); // returns => ["LOREM", "IPSUM", "DOLOR", "SIT", "AMET"]

    [1, 2, 3, 4, 5, 6, 7, 8].invoke( 'toString', 2 );                   // returns => ['1', '10', '11', '100', '101', '110', '111', '1000']

```

### Array.prototype.pluck( key:String[, compact:Boolean] ):Array
Returns a new Array where all the items are the values of the passed property `key`.

If `compact` is set to `true` then all `NaN`, `null` and `undefined` values will be omitted from the returned Array.

**NOTE:** Unlike other `pluck` implementations, this implementation has a "smarter" way to get property values, allows you to `pluck` nested Object values, as well as HTML attributes.

#### Example:

```javascript

    var data = [{ data : { value : 'foo' } }, { data : { value : 'bar' } }, {}, { value : 'blim' }, { data : { value : 'blam' } }];

// slower, has to iterate twice
    data.pluck( 'data' ).pluck( 'value' );  // returns => ["foo", "bar", undefined, undefined, "blam"]

// optimised version of the above
    data.pluck( 'data.value' );             // returns => ["foo", "bar", undefined, undefined, "blam"]

    data.pluck( 'data.value', true );       // returns => ["foo", "bar", "blam"]

```

### Boolean.coerce( value:Mixed ):Boolean
Handy for working with Booleans trapped in Strings.

Returns a normalised Boolean value for a String, Number, null or undefined.

Everything will return `true`, except for the following which all return `false`:

```javascript

    Boolean.coerce( 'false' );     Boolean.coerce(  false  );

    Boolean.coerce( '0' );         Boolean.coerce(  0  );

    Boolean.coerce( 'NaN' );       Boolean.coerce(  NaN  );

    Boolean.coerce( 'null' );      Boolean.coerce(  null  );

    Boolean.coerce( 'undefined' ); Boolean.coerce(  undefined );

    Boolean.coerce();              Boolean.coerce( '' );

```

### GET: Function.prototype.\_\_name\_\_:String
### GET: Function.prototype.\_\_name\_\_:String
Tries to return the name of a Function instance. If a function is mimicking another function, then that function's name is returned.

If no name can be resolved, then `anonymous` is returned.

### Function.prototype.mimic( fn:Function[, name:String] ):Function
Handy for working with wrapper methods, allows a function to mimics another, by over-writing its `toString` and `valueOf` methods.

The `displayName` property used by web inspector to allow assigning names to anonymous functions is also set.

If a `name` param is passed, then it is used as the `displayName`, otherwise the passes function's name is used.

#### Example:

```javascript

    function foo( a, b, c ) { ... }

    foo.__name__;                                          // returns => "foo"

    ( function( a, b, c ) { ... } ).__name__;              // returns => "anonymous"

    function bar( a, b, c ) { ... }.mimic( foo ).__name__; // returns => "foo"

```

## Object.key( object:Object, value:Mixed ):String
Returns the `object`'s property `key` for the passed `value` if `value` is a property of `object`. If not `null` is returned.

**NOTE:** `value` is determined based on the `===` operator.

#### Example:

```javascript

    var foo = { one : 1, two : 2, three : 3 };

    Object.key( foo, 2 ); // returns => "two"

    Object.key( foo, 4 ); // returns => null

```

### Object.reduce( object:Object, iterator:Function, value:Mixed ):Mixed
This is similar to [Array.reduce](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce) except that it is used on Objects instead of Arrays.

The `iterator` Function will receive 5 arguments:

<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td>previous_value</td><td>When the <code>iterator</code> Function is first called, this will be the initially supplied <code>value</code>, after which it will be previous value returned by the <code>iterator</code> Function.</td></tr>
	<tr><td>value</td><td>The value of the item currently being iterated over.</td></tr>
	<tr><td>key</td><td>The key of the item currently being iterated over.</td></tr>
	<tr><td>object</td><td>The Object being iterated over.</td></tr>
	<tr><td>index</td><td>The zero based index of the item currently being iterated over.</td></tr>
</table>

#### Example:

```javascript

// the sum of all values of the passed object
    Object.reduce( { one : 1, two : 2, three : 3 }, function( previous_value, value, key, index, object ) {
        console.log( 'previous_value : ', previous_value, ', value : ', value, ', key : ', key, ', index : ', index );
		return previous_value += value;
    }, 0 );
// logs    => previous_value : 0, value : 1, key : one,   index : 0
// logs    => previous_value : 1, value : 2, key : two,   index : 1
// logs    => previous_value : 3, value : 3, key : three, index : 2
// returns => 6

```

**NOTE:** `Object.reduce` is the only Object iterator included in `m8` because it is the most powerful.
Apart from `every` & `some` you can use `reduce` to implement the same functionality available in all other ES5 Array iterators.

This will help keep the file size down.

### Object.value( object:Object, path:String ):Mixed
Returns the property value at the specified path in an Object.

#### Example:

```javascript

    var data = { one : { two : { three : true, four : [1, 2, 3, 4] } } };

    Object.value( data, 'one' );            // returns => { two : { three : true, four : [1, 2, 3, 4] } }

    Object.value( data, 'one.two' );        // returns => { three : true, four : [1, 2, 3, 4] }

    Object.value( data, 'one.two.three' );  // returns => { three : true }

    Object.value( data, 'one.two.four' );   // returns => [1, 2, 3, 4]

    Object.value( data, 'one.two.four.2' ); // returns => 3

```

### Object.values( object:Object ):Array
Returns the `values` of the passed Object based on it's enumerable keys.

#### Example:

```javascript

    Object.values( { one : 1, two : 2, three : 3 } ); // returns => [1,2,3]

```

### GET: Object.prototype.\_\_proto\_\_:String
Some browsers — like MSIE 9 & 10 which `m8` supports — do not support the non-standard property `__proto__`.

Luckily however, they do support `Object.getPrototypeOf`, which will return the same value as `__proto__`.

`m8` conveniently wraps this call up inside the `__proto__` getter for those browsers, so you can (more) easily work with `Object` prototypes.

### GET: Object.prototype.\_\_type\_\_:String
Attempts to resolve a normalised type for any type that inherits from JavaScript's `Object.prototype`. See `m8.type` for more information.

**NOTE:** All types are **always** in lowercase

## File size

- m8.js ≅ 6.9kb (gzipped)
- m8.min.js ≅ 3.7kb (minzipped)

## License

(The MIT License)

Copyright &copy; 2012 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
