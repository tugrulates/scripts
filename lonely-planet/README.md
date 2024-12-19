# lonely-planet

```
Usage: lonely-planet [keywords...]

Description:

  Explores data from Lonely Planet.

Options:

  -h, --help                  - Show this help.                                  
  --endpoint      <endpoint>  - Typesense endpoint for Lonely Planet.            
  --token         <token>     - Typesense token for Lonely Planet.               
  --destinations              - Include destinations in the results.             
  --attractions               - Include attractions in the results.              
  --stories                   - Include stories in the results.                  
  --json                      - Output the search results as concatenated JSON.  

Examples:

  lonely-planet big sur                                Search destinations for 'big sur'.
  lonely-planet --attractions amsterdam                Search attractions.               
  lonely-planet --stories amsterdam                    Search stories.                   
  lonely-planet --destinations --attractions --stories All.                              
  lonely-planet --json | jq                            Stream destinations as json.      
```
