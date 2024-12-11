(
  "# Various scripts",
  "",
  (
    .nodes[]
    | select(.kind=="import" or .kind=="moduleDoc")
    | select(.jsDoc!=null)
    | (
      .location.filename
      | gsub(
        "^file:.*/scripts/(?<dir>[^/]+)/(?<name>[^.]+)\\.(?<ext>[^.]+)$";
        "- [" + (.dir | gsub("^(?<c>.)"; .c | ascii_upcase))
          + " " + (.name | gsub("^(?<c>.)"; .c | ascii_upcase))
          + "](#" + .dir + "-" + .name + "-" + .dir + .name + .ext +")"
        )
      )
  ),
  "",
  (
    .nodes[]
    | select(.kind=="import" or .kind=="moduleDoc")
    | select(.jsDoc!=null)
    | (
      .location.filename
      | gsub(
        "^file:.*/scripts/(?<file>(?<dir>[^/]+)/(?<name>[^.]+)\\.(?<ext>[^.]+))$";
        "## " + (.dir | gsub("^(?<c>.)"; .c | ascii_upcase))
          + " " + (.name | gsub("^(?<c>.)"; .c | ascii_upcase))
          + " ([`" + .file + "`](" + .file + "))"
        )
      ), "", .jsDoc.doc, ""
  )
)
