(
  [
    "Link",
    "Title",
    "Date",
    "Views",
    "Likes",
    "Pulse"
  ],
  (
    .[]
    | [
        "https://www.500px.com"+.canonicalPath,
        .name,
        .uploadedAt,
        .timesViewed,
        .likedByUsers.totalCount,
        .pulse.highest
      ]
  )
)
| @csv
