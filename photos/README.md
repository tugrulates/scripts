# photos

```
Usage: photos [photos...]

Description:

  Manage photos.

Options:

  -h, --help  - Show this help.
  --copy      - Copy the EXIF from source jpg file to other jpg files.
  --json      - Output the EXIF information as JSON.

Examples:

  photos                    Lists for all photos under current directory.
  photos [directory] --json Data for a photo with all sizes.
  photos [file.jpg] --json  Data for a single size file.
  photos [directory] --copy Copy EXIF data to all sizes.
```
