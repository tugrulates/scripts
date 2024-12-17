# 500px

```
Usage: 500px <command> [options]

Description:

  Interact with 500px.

Options:

  -h, --help  - Show this help.  

Commands:

  discover              - Prints a list of active and high quality users on 500px.
  follows   <username>  - Prints follower information on 500px.                   
  photos    <username>  - Prints the list of photos for a 500px user.             
```

## discover

```
Usage: 500px discover

Description:

  Prints a list of active and high quality users on 500px.

Options:

  -h, --help              - Show this help.                                                                         
  --category  <category>  - Categories to filter results on.   (Values: "celebrities", "film", "journalism", "nude",
                                                               "black-and-white", "still-life", "people",           
                                                               "landscapes", "city-and-architecture", "abstract",   
                                                               "animals", "macro", "travel", "fashion",             
                                                               "commercial", "concert", "sport", "nature",          
                                                               "performing-arts", "family", "street", "underwater", 
                                                               "food", "fine-art", "wedding", "transportation",     
                                                               "aerial", "urban-exploration", "night", "boudoir",   
                                                               "other")                                             
  --json                  - Output the list of users as JSON.                                                       

Examples:

  500px discover                                 Prints a list of users with high scored photos.
  500px discover --filter food                   Finds food photographers.                      
  500px discover --filter macro --filter animals Either category.                               
  500px discover --json | jq                     Query users as JSON.                           
```

## follows

```
Usage: 500px follows <username>

Description:

  Prints follower information on 500px.

Options:

  -h, --help  - Show this help.                           
  --json      - Output the follower information as JSON.  

Examples:

  500px follows                                            Prints follow counts.                             
  500px follows --follows                                  Follow users who follow.                          
  500px follows --unfollow                                 Unfollow users who dont' follow.                  
  500px follows --follow --unfollow                        Matches both lists.                               
  500px follows --json                                     Outputs JSON of follower information.             
  500px follows --json | jq                                Query JSON for follower information.              
  500px follows --json | jq '.dontFollowBack[].username'   List users who are followed but don't follow back.
  500px follows --json | jq '.notFollowingBack[].username' List users who follow but are not followed back.  
```

## photos

```
Usage: 500px photos <username>

Description:

  Prints the list of photos for a 500px user.

Options:

  -h, --help  - Show this help.                        
  --json      - Output the photo information as JSON.  

Examples:

  500px photos <username>             Prints the list of photos for a user.
  500px photos <username> --json | jq Query photos as JSON.                
```
