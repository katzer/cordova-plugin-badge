# d8.js [![build status](https://secure.travis-ci.org/constantology/d8.png)](http://travis-ci.org/constantology/d8)

d8 is a date parsing and formatting micro-framework for modern JavaScript engines.

d8 formats Dates into Strings and conversley turns Strings into Dates based on [php formatting options](http://php.net/manual/en/function.date.php).

As d8 extends JavaScript's native `Date` & `Date.prototype` – the CORRECT way – there is no actual global called d8. Instead all static and instance methods are available on the native `Date` & `Date.prototype` respectively.

currently the only locales available are:

- en-GB (0.9kb gzipped)
- en-US (0.9kb gzipped)
- GR    (1.1kb gzipped) **this still needs some work as my Greek is — how you say — "hella-rusty"**

but feel free to create a locale for your specific nationality and submit a pull request! :D

## File size

- d8.js ≅ 8.8kb (gzipped)
- d8.min.js ≅ 5.2kb (minzipped)

## Dependencies

d8.js only has one dependency [m8.js](/constantology/m8).

**NOTE:**
If you are using d8 within a commonjs module, you don't need to require m8 before requiring d8 as this is done internally.

Also, since d8.js simply extends the Native Date Class, a reference to **m8 IS NOT** stored.

## browser usage

```html

   <script src="/path/to/m8/m8.js" type="text/javascript"></script>

   <script src="/path/to/d8/d8.min.js" type="text/javascript"></script>
<!-- This should now come after the actual library, since it is now possible to have use locales at once -->
   <script src="/path/to/d8/locale/en-GB.js" type="text/javascript"></script>

```

## nodejs usage

```javascript

    require( 'd8' );
    require( 'd8/locale/en-GB' ); // NOTE: This should now come after the actual library, since it is now possible to have use locales at once

 // if running in a sandboxed environment remember to:
    require( 'm8' ).x( Date/*[, Object, Array, Boolean Function]*/ ); // and/ or any other Types that require extending.

```

As mentioned above d8 extends JavaScript's native `Date` & `Date.prototype`, so when requiring d8, you don't need to assign it to a variable to use d8's features.

## Support

Tested to work with nodejs, FF4+, Safari 5+, Chrome 7+, IE9+ and Opera — with one exception: `( new Date( [] ) ).valid() )` returns `true` in Opera and false in every other browser — technically **d8** should work in any JavaScript parser that supports [ecma 5]( http://kangax.github.com/es5-compat-table/) without throwing any JavaScript errors.

## API

### Static methods

#### isLeapYear( year:String ):Boolean
Returns true if the passed **4 digit** year is a leap year.

**NOTE:** This method is located in the locale file. If your calendar system does not contain leap years, you can simply change the method to only `return false`.

#### getOrdinal( date:Number ):String
Returns the ordinal for a given date.

##### Example:

```javascript

     Date.getOrdinal( 1 );  // returns => "st"
     Date.getOrdinal( 10 ); // returns => "th"
     Date.getOrdinal( 22 ); // returns => "nd"
     Date.getOrdinal( 33 ); // returns => "rd"

```

**NOTE:** Ordinals and the `getOrdinal` This method is located in the locale file. You can simply change the `ordinal` Array to your specific language; overwrite the `getOrdinal` method or both.

#### setLeapYear( date:Date ):Void
Sets the inlcuded locale's February day count to the correct number of days, based on whether or not the date is a leap year or not.

**NOTE:** This method is located in the locale file. If your calendar system does not contain leap years, you can simply change the method to do nothing.

#### toDate( date:String, format:String ):Date
Takes a date String and a format String based on the **Date formatting and parsing options** described below and returns a – hopefully – correct and valid Date.

```javascript

    Date.toDate( 'Sunday, the 1st of January 2012', 'l, <the> jS <of> F Y' ); // returns => Date { Sun Jan 01 2012 00:00:00 GMT+0000 (GMT) }
    Date.toDate( '2012-01-01T00:00:00+00:00',        Date.formats.ISO_8601 ); // returns => Date { Sun Jan 01 2012 00:00:00 GMT+0000 (GMT) }

```

### Static properties

#### filters
An Object of all the available filters for formatting a Date.

**IMPORTANT: Don't change these unless you know what you are doing!**

#### formats
An Object containing some default date formats:
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="96">ISO_8601</td><td>Y-m-d<T>H:i:sP</td>
	<tr><td width="96">ISO_8601_SHORT</td><td>Y-m-d</td>
	<tr><td width="96">RFC_850</td><td>l, d-M-y H:i:s T</td>
	<tr><td width="96">RFC_2822</td><td>D, d M Y H:i:s O</td>
	<tr><td width="96">sortable</td><td>Y-m-d H:i:sO</td>
</table>

### Instance methods

#### adjust( interval:Object|String[, value:Number] ):Date
Your one stop shop for all Date arithmetic. Adjusts the Date based on the passed `interval`, by the passed numeric `value`.

**Note:** The method also accepts a single Object param where each key is the interval and each value is the number to adjust the Date by.

**Valid intervals are:** year, month, week, day, hr, min, sec, ms.

##### Example:

```javascript

    var date = new Date( 2012, 0, 1 ); // Date {Sun Jan 01 2012 00:00:00 GMT+0000 (GMT)}

    date.adjust( Date.DAY,   1 );      // Date {Mon Jan 02 2012 00:00:00 GMT+0000 (GMT)}
    date.adjust( Date.HOUR, -1 );      // Date {Sun Jan 01 2012 23:00:00 GMT+0000 (GMT)}
    date.adjust( {
       year : -1, month : -1, day : 24,
       hr   :  1, sec   : -1
    } );                               // Date {Sat Dec 25 2010 23:59:59 GMT+0000 (GMT)}

```

#### between( date_lower:Date, date_higher:Date ):Boolean
Checks to see if the Date instance is in between the two passed Dates.

##### Example:

```javascript

    var date = new Date( 2012, 0, 1 );

    date.between( new Date( 2011, 0, 1 ), new Date( 2013, 0, 1 ) ); // returns => true;

    date.between( new Date( 2013, 0, 1 ), new Date( 2011, 0, 1 ) ); // returns => false;

```

#### clearTime():Date
Clears the time from the Date instance.

#### clone():Date
Returns a clone of the current Date.

#### diff( [date:Date, exclude:String] ):Object
Returns an Object describing the difference between the Date instance and now — or the optionally passed Date.

The Object will contain any or all of the following properties:

<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<thead>
		<tr><th width="32">Prop</th><th width="48">Type</th><th>Description</th></tr>
	</thead>
	<tbody>
		<tr><td width="48"><code>tense</code></td><td width="48">Number</td><td>This will either be:
			<dl>
				<dt><code>-1</code></dt><dd>The Date instance is less than now or the passed Date, i.e. in the past</dd>
				<dt><code>0</code></dt><dd>The Date instance is equal to now or the passed Date, i.e. in the present.<br /><strong>NOTE:</strong> If <code>tense</code> is <code>0</code> then the Object will most probably have no other properties, except <code>value</code>, which will be zero.</dd>
				<dt><code>1</code></dt><dd>The Date instance is greater than now or the passed Date,  i.e. in the future</dd>
			</dl>
			<strong>NOTE:</strong> To make the <code>diff</code> Object's values easier to work with all other properties will be positive Numbers. You should use the <code>tense</code> property as your reference for the <code>diff</code> being in the past, present or future.
		</td></tr>
		<tr><td width="48"><code>value</code></td><td width="48">Number</td><td>The — absolute — number of milliseconds difference between the two Dates.</td></tr>
		<tr><td width="48"><code>years</code></td><td width="48">Number</td><td>The number of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>months</code></td><td width="48">Number</td><td>The months of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>weeks</code></td><td width="48">Number</td><td>The weeks of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>days</code></td><td width="48">Number</td><td>The days of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>hours</code></td><td width="48">Number</td><td>The hours of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>minutes</code></td><td width="48">Number</td><td>The minutes of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>seconds</code></td><td width="48">Number</td><td>The seconds of years the Date instance is ahead or behind the passed Date.</td></tr>
		<tr><td width="48"><code>milliseconds</code></td><td width="48">Number</td><td>The milliseconds of years the Date instance is ahead or behind the passed Date.</td></tr>
	</tbody>
</table>

**NOTE:** If any property — other than `tense` & `value` — is zero it will be omitted from the `diff` Object.


##### Example:

```javascript

     ( new Date( 2012, 0, 1 ) ).diff( new Date( 2012, 0, 1 ) )             // returns => { tense :  0 }

     ( new Date( 2012, 0, 1 ) ).diff( new Date( 2012, 0, 2 ) )             // returns => { tense : -1, value : 86400000,    days  : 1 }

     ( new Date( 2012, 0, 2 ) ).diff( new Date( 2012, 0, 1 ) )             // returns => { tense :  1, value : 86400000,    days  : 1 }

     ( new Date( 2012, 0, 1 ) ).diff( new Date( 2010, 9, 8, 7, 6, 5, 4 ) ) // returns => { tense :  1, value : 38858034996, years : 1, months : 2, weeks : 3, days : 3, hours : 17, minutes : 53, seconds : 54, ms : 995 }

```

**NOTE:** You can supply a **space delimited** String defining which properties you want to exclude from the result and `diff` will either pass the current calculation to the next time unit or, if there are none will round off — up if over .5 or down if less, uses `Math.round` to figure this out — to the previous time unit.

Exclusion codes:
- `-` will exclude the time unit from the `diff` Object.
- `+` will include the time unit in the `diff` Object. **Note:** this is the same as not including the time unit in the `exclusions` String.
- `>` will exclude all time units from this time unit down from the `diff` Object.

##### Example with exclusions:

```javascript

     ( new Date( 2012, 0, 1 ) ).diff( new Date( 2012, 0, 2 ), '-days' )                              // returns => { tense : -1, value : 86400000,    hours  : 24 }

     ( new Date( 2012, 0, 2 ) ).diff( new Date( 2012, 0, 1 ), '-days' )                              // returns => { tense :  1, value : 86400000,    hours  : 24 }

     ( new Date( 2012, 0, 1 ) ).diff( new Date( 2010, 9, 8, 7, 6, 5, 4 ), '-years -weeks >minutes' ) // returns => { tense :  1, value : 38858034996, months : 14, days : 29, hours : 18 }

```

#### format( format:String ):String
Returns a string representation of the Date instance, based on the passed format. See the [Date formatting and parsing options](#date-formatting-and-parsing-options) below.

##### Example:

```javascript

    ( new Date( 2012, 0, 1 ) ).format( 'c' );                   // returns => "2012-01-01T00:00:00.000Z"
 // which is a short hand format for:
    ( new Date( 2012, 0, 1 ) ).format( 'Y-m-d<T>H:i:s.u<Z>' );  // returns => "2012-01-01T00:00:00.000Z"

    ( new Date( 2012, 0, 1 ) ).format( 'l, <the> nS <of> F Y' ) // returns => "Sunday, the 1st of January 2012"

```

You can use predefined formats found in `Date.formats`. **Hint:** You can do:

```javascript

    console.dir( Date.formats );

```

within your browser's JavaScript console to see a list of available formats.

Previously used formats are also cached to save the overhead of having to create a `new Function` everytime you want to format a date.

#### getDayOfYear():Number
Returns the zero based day of the year.

#### getFirstOfTheMonth():Date
Returns a Date instance of the first day of this Date instance's month.

#### getGMTOffset( [colon:Boolean] ):String
Returns the Date instances offset from GMT.

#### getISODay():Number
Returns the ISO day of the week.

#### getISODaysInYear():Number
Returns the ISO number of days in the year.

#### getISOFirstMondayOfYear():Date
Returns the ISO first Monday of the year.

#### getISOWeek():Number
Returns the ISO week of the year

#### getISOWeeksInYear():Number
Returns the number of weeks in the ISO year.

#### getLastOfTheMonth():Date
Returns a Date instance of the last day of this Date instance's month.

#### getWeek():Number
Returns the week of the year, based on the `dayOfYear` divided by 7.

##### Example:

```javascript

    ( new Date( 2012, 0, 1 ) ).getWeek();   // returns => 0
    ( new Date( 2012, 2, 13 ) ).getWeek();  // returns => 10
    ( new Date( 2012, 11, 31 ) ).getWeek(); // returns => 52

```

#### isDST():Boolean
Returns true if the Date instance is within daylight savings time.

#### isLeapYear():Boolean
Returns true if the Date instance is a leap year.

#### lexicalize( [now:Date, format:String] ):String
Returns a String representation of the difference between the date instance and now, or the passed `Date`.

#### Available formats
The default format is `approx`, however this can be over-written by changing the **locale** file and/ or by passing in the desired format to the method.

<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="96">approx</td><td>Will return an approximate difference. e.g. about 2 days ago; almost 1 and a half years from now.</td>
	<tr><td width="96">exact</td><td>Will return the exact difference, e.g. 2 days 3 hours and 5 minutes ago; 1 year, 4 months, 2 weeks, 1 day, 5 hours, 3 minutes and 7 seconds from now.</td>
</table>

##### Example:

```javascript

	var date = new Date( 2012, 0, 1 );

	date.clone().adjust( { hr : -3, day : -2 } ).lexicalize( date, 'approx' ); // returns => "just over 2 days ago"
	date.clone().adjust( { hr : -3, day : -2 } ).lexicalize( date, 'exact' );  // returns => "2 days and 3 hours ago"

	date.lexicalize( date.clone().adjust( { hr : -6, day : -2 } ), 'approx' ); // returns => "almost 2 and a half days from now"
	date.lexicalize( date.clone().adjust( { hr : -6, day : -2 } ), 'exact' );  // returns => "2 days and 6 hours from now"

```

#### setWeek():Number(UnixTimeStamp)
Sets the week of the year from the 1st January.

##### Example:

```javascript

    new Date( ( new Date( 2012, 0, 1 ) ).setWeek( 17 ) ); // returns => Date {Sun Apr 29 2012 00:00:00 GMT+0100 (BST)}

    ( new Date( 2012, 2, 13 ) ).setWeek( 17 );            // returns => 1335654000000 same as above

    ( new Date( 2012, 11, 31 ) ).setWeek( 17 );           // returns => 1335654000000

```

#### timezone():String
Returns the JavaScript engine's Date.prototype.toString() timezone abbreviation.

## Date formatting and parsing options

### escaping characters

If you want to escape characters that are used by the Date parser you can wrap them between &lt;&gt;.

#### Example:

```javascript

    ( new Date( 2012, 0, 1 ) ).format( 'l, <the> jS <of> F Y' ); // returns => "Sunday, the 1st of January 2012"

```

### day
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">d</td><td>Day of the month, 2 digits with leading zeros</td></tr>
	<tr><td width="32">D</td><td>A textual representation of a day, three letters</td></tr>
	<tr><td width="32">j</td><td>Day of the month without leading zeros</td></tr>
	<tr><td width="32">l</td><td>A full textual representation of the day of the week</td></tr>
	<tr><td width="32">N</td><td>ISO-8601 numeric representation of the day of the week</td></tr>
	<tr><td width="32">S</td><td>English ordinal suffix for the day of the month, 2 characters</td></tr>
	<tr><td width="32">w</td><td>Numeric representation of the day of the week</td></tr>
	<tr><td width="32">z</td><td>The day of the year (starting from 0)</td></tr>
</table>
### week
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">W</td><td>ISO-8601 week number of year, weeks starting on Monday</td></tr>
</table>
### month
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">F</td><td>A full textual representation of a month</td></tr>
	<tr><td width="32">m</td><td>Numeric representation of a month, with leading zeros</td></tr>
	<tr><td width="32">M</td><td>A short textual representation of a month, three letters</td></tr>
	<tr><td width="32">n</td><td>Numeric representation of a month, without leading zeros</td></tr>
	<tr><td width="32">t</td><td>Number of days in the given month</td></tr>
</table>
### year
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">L</td><td>Whether it's a leap year</td></tr>
	<tr><td width="32">o</td><td>ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.</td></tr>
	<tr><td width="32">Y</td><td>A full numeric representation of a year, 4 digits</td></tr>
	<tr><td width="32">y</td><td>A two digit representation of a year</td></tr>
</table>
### time
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">a</td><td>Lowercase Ante meridiem and Post meridiem</td></tr>
	<tr><td width="32">A</td><td>Uppercase Ante meridiem and Post meridiem</td></tr>
	<tr><td width="32">g</td><td>12-hour format of an hour without leading zeros</td></tr>
	<tr><td width="32">G</td><td>24-hour format of an hour without leading zeros</td></tr>
	<tr><td width="32">h</td><td>12-hour format of an hour with leading zeros</td></tr>
	<tr><td width="32">H</td><td>24-hour format of an hour with leading zeros</td></tr>
	<tr><td width="32">i</td><td>Minutes with leading zeros</td></tr>
	<tr><td width="32">s</td><td>Seconds, with leading zeros</td></tr>
	<tr><td width="32">u</td><td>Milliseconds</td></tr>
</table>
### timezone
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">O</td><td>Difference to Greenwich time (GMT) in hours</td></tr>
	<tr><td width="32">P</td><td>Difference to Greenwich time (GMT) with colon between hours and minutes</td></tr>
	<tr><td width="32">T</td><td>Timezone abbreviation</td></tr>
	<tr><td width="32">Z</td><td>Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.</td></tr>
</table>
### full date/time
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">c</td><td>ISO 8601 date</td></tr>
	<tr><td width="32">r</td><td>RFC 2822 formatted date</td></tr>
	<tr><td width="32">U</td><td>Seconds since the Unix Epoch January 1 1970 00:00:00 GMT</td></tr>
</table>
### custom
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td width="32">e</td><td>this is a convenience for `date.lexicalize( 'exact' );`</td></tr>
	<tr><td width="32">x</td><td>this is a convenience for `date.lexicalize( 'approx' );`</td></tr>
</table>

## License

(The MIT License)

Copyright &copy; 2012 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
