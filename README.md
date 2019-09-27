# Simple dev-server for simple websites

```
$ dev-server --port 4000 path/to/public-root
```

Serves files from the directory. Will inject a websocket client into HTML pages,
and trigger a reload when any file that has previously been loaded through the
webserver is changed.

# Thanks

This is mostly a repackaging of previous work done by other people. Listed in
alphabetical order.

- [Alex J. Burke](https://github.com/alexjeffburke)
- [Andreas Lind](https://github.com/papandreou)
- [Peter Müller](https://github.com/munter)
