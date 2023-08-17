#! /bin/bash
# Initialize repository labels to my liking

USAGE="Usage: $0 [REPOSITORY]"

if [[ $# > 1 ]]; then
    echo $USAGE
    exit 1
fi

if [[ $# == 1 ]]; then
    REPOSITORIES=($1)
else
    REPOSITORIES=($(gh repo list --json nameWithOwner -q .[].nameWithOwner))
fi

for repository in ${REPOSITORIES[@]}; do
    echo $repository
done
exit 0

LABELS=($(gh label -R $REPOSITORY list --json name -q .[].name))

HAS_ENHANCEMENT=false
HAS_TESTING=false
HAS_PERFORMANCE=false

for label in ${LABELS[@]}; do
    if [[ $label == "enhancement" ]]; then
        HAS_ENHANCEMENT=true
    elif [[ $label == "testing" ]]; then
        HAS_TESTING=true
    elif [[ $label == "performance" ]]; then
        HAS_PERFORMANCE=true
    fi
done

if [[ $HAS_ENHANCEMENT == true ]]; then
    gh label -R $REPOSITORY edit enhancement --name feature
fi

if [[ $HAS_PERFORMANCE == false ]]; then
    gh label -R $REPOSITORY create performance -d "Optimizations for speed or memory" --color "#D4C5F9"
fi

if [[ $HAS_TESTING == false ]]; then
    gh label -R $REPOSITORY create testing -d "Testing and coverage" --color "#C2E0C6"
fi
