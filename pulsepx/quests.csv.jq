(
  [
    "Link",
    "Title",
    "Photo Title",
    "Date",
    "Category",
    "Skill Level",
    "Rank",
    "Entries",
    "Integral",
    "Top Integral",
    "Prize"
  ],
  (
    .[]
    | . as $quest
    | .myEntries[]
    | [
        "https://pulsepx.com/quests/ended/details/"+$quest.id,
        $quest.title,
        .photo.title,
        $quest.awaitingPrizeEndTime,
        (
          $quest.category
          | sub("^NONE$"; "")
          | sub("^ANIMALS$"; "Animals")
          | sub("^FINE_ART$"; "Fine Art")
          | sub("^LANDSCAPE$"; "Landscapes")
          | sub("^MINIMALISM$"; "Fine Art")
          | sub("^NATURE$"; "Nature")
          | sub("^PEOPLE$"; "People")
          | sub("^STILL_LIFE$"; "Still Life")
          | sub("^URBAN$"; "City and Architecture")
        ),
        (
          $quest.skillLevel
          | sub("^NONE$"; "")
          | sub("^PROFESSIONAL$"; "A")
          | sub("^AMATEUR$"; "B")
          | sub("^BEGINNER$"; "C")
        ),
        .rank,
        $quest.totalEntries,
        .integral,
        $quest.topEntries[0].integral,
        (
          .awards[]
          | select(.type=="TOKEN")
          | .description
          | tonumber
        )
      ]
  )
)
| @csv
