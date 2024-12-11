(
  "# Various scripts",
  "",
  (.nodes[]
  | select(.kind=="import" or .kind=="moduleDoc")
  | select(.jsDoc!=null)
  | (.location.filename | sub("^file:.*/scripts/"; "## `") | sub("$"; "`")), "", .jsDoc.doc, "")
)
