# photos ([jsr.io](https://jsr.io/@tugrulates/photos))

## CLI

Run `photos` after installation, or run `deno run -A @tugrulates/photos` without
installation.

### Examples

Lists for all photos under current directory.

```sh
photos
```

Data for a photo with all sizes.

```sh
photos [directory] --json
```

Data for a single size file.

```sh
photos [file.jpg] --json
```

Copy EXIF data to all sizes.

```sh
photos [directory] --copy
```

## Functions

### [`getData`](https://jsr.io/@tugrulates/photos/doc/~/getData)

Returns the data for a photo or a single file.

### [`copyExif`](https://jsr.io/@tugrulates/photos/doc/~/copyExif)

Copies the EXIF data from source.jpg to all other jpg files.

### [`isPhotoDirectory`](https://jsr.io/@tugrulates/photos/doc/~/isPhotoDirectory)

Returns true if the directory contains a source photo.

### [`getFiles`](https://jsr.io/@tugrulates/photos/doc/~/getFiles)

Returns a list of all JPG files in the directory.

### [`allPhotos`](https://jsr.io/@tugrulates/photos/doc/~/allPhotos)

Returns a list of all photo directories under cwd.
