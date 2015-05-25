#ghostshot


A PhantomJS 2 snapshot app for modern, responsive HTML5 websites. Most of the HTMl5,CSS3 goodies are supported, including embedded web fonts, flexbox and even edge technologies like web components.



## Install

```
$ npm install ghostshot -g 
```

*the app currently only supports Mac OS X 10.10(yosemite)*


## Usage

The easiest use of the app is to simply specify the url as a parameter.

This will generate 6 default responsive resolutions, starting from 480x320 up to 5120x2880.

```sh
$ ghostshot <url>

```

## Supported output formats
- `png`
- `jpg`
- `pdf`
- `gif`

*GIF may be unreliable. PDF may be unreliable for some HTML5 technologies. PNG is the recommended format*

## Options
##### `--r`

Colon delimited resolutions.

```sh
$ ghostshot mywebsite.com --r 800x600:1024x768
```

##### `--f`

The output file format. PNG,JPG,PDF,GIF

```sh
$ ghostshot mywebsite.com --f .jpg
```

##### `--o`

Output path

```sh
$ ghostshot mywebsite.com/contact --o ./images
```

##### `--d`

Delay screenshot capture. The default is 2000(ms)

```sh
$ ghostshot mywebsite.com/about --d 3000
```

##### `--h`

The max height. This value will be overriden by a resolution height if it is greater than the specified max height parameter.

```sh
$ ghostshot mywebsite.com --h 1000
```

##### `-v`, `--version`

Outputs the program version

```sh
$ ghostshot --version
```

##### `--help`

Outputs help info

```sh
$ ghostshot --help
```


## Examples

```sh
# Resolutions with a max height
$ ghostshot mywebsite.com --r 1024x768:1920x1080 --h 1080

# Write output to images subdirectory within current working directory. Write the format as jpg and the base file name as "img."
$ ghostshot mywebsite.com --o ./images/img.jpg

# Identical to the above, but the base file names instead will be "mywebsite"
$ ghostshot mywebsite.com --o ./images --f .jpg

# Writes mywebsite_contact_1920x1080.jpg with a height of 1080px to the "contact" subdirectory in the current working directory. NOTE: output directories will be automatically vreated if they do not exist.
$ ghostshot mywebsite.com/contact --r 1920x1080 --h 1080 --o ./contact --f .jpg

# Writes index.png with a delay of 5000(ms) to the "help" subdirectory in the current working directory
$ ghostshot https://mysecuresite.com/help --o ./help/index.png --r 1920x1080 --d 5000


```




## TODO

An immediate task will be to support windows, linux and older versions of Mac OS X.





## License

MIT © [S. Francis](https://github.com/tachyon1337)
