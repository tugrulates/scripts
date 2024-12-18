# duolingo

```
Usage: duolingo <command> [options]

Description:

  Interact with Duolingo.

Options:

  -h, --help              - Show this help.                  
  --username  <username>  - Username.                        
  --token     <token>     - JWT token.                       
  --clear                 - Clear the cached configuration.  

Commands:

  feed     - Prints and interacts with the feed.                   
  follows  - Prints and manages follower information on Duolingo.  
  league   - Prints and interacts with the current Duolingo league.

Examples:

  duolingo --username <username> --token <token> feed Configure Duolingo client.     
  duolingo --clear                                    Clear the cached configuration.
```

## feed

```
Usage: duolingo feed

Description:

  Prints and interacts with the feed.

Options:

  -h, --help              - Show this help.               
  --username  <username>  - Username.                     
  --token     <token>     - JWT token.                    
  --engage                - Engage with the feed events.  
  --json                  - Output the feed as JSON.      

Examples:

  duolingo feed             Prints the feed.         
  duolingo feed --engage    Engages with the feed.   
  duolingo feed --json | jq Query JSON over the feed.
```

## follows

```
Usage: duolingo follows

Description:

  Prints and manages follower information on Duolingo.

Options:

  -h, --help              - Show this help.                           
  --username  <username>  - Username.                                 
  --token     <token>     - JWT token.                                
  --follow                - Follow users who follow.                  
  --unfollow              - Unfollow users who don't follow.          
  --json                  - Output the follower information as JSON.  

Examples:

  duolingo follows                                            Prints follow counts.                             
  duolingo follows --follows                                  Follow users who follow.                          
  duolingo follows --unfollow                                 Unfollow users who dont' follow.                  
  duolingo follows --follow --unfollow                        Matches both lists.                               
  duolingo follows --json                                     Outputs JSON of follower information.             
  duolingo follows --json | jq                                Query JSON for follower information.              
  duolingo follows --json | jq '.dontFollowBack[].username'   List users who are followed but don't follow back.
  duolingo follows --json | jq '.notFollowingBack[].username' List users who follow but are not followed back.  
```

## league

```
Usage: duolingo league

Description:

  Prints and interacts with the current Duolingo league.

Options:

  -h, --help              - Show this help.              
  --username  <username>  - Username.                    
  --token     <token>     - JWT token.                   
  --follow                - Follow users in the league.  
  --json                  - Output the league as JSON.   

Examples:

  duolingo league             Prints the league.          
  duolingo league --follow    Follows users in the league.
  duolingo league --json | jq Query JSON over the league. 
```
