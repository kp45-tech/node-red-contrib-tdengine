This repositry create a custom Node-Red node for configing TDEngine server connection and execute SQL from preview node msg.payload
## Design
Use Taos data restful API to commit SQL, API call like
```
curl -H 'Authorization: Basic <TOKEN>' -d '<SQL>' <ip>:<PORT>/rest/sql/[db_name]
```

Input options:
* DB Server: Setup server connection or select a exist server
* DB Name: Database to execute SQL

Use [axios](https://axios-http.com/) to call http request

## Usage

1. Start Node-Red
2. Install TDEngine node
3. Add "taos query" node to workspace from palette 
4. Setup a TDEngine server and database name
5. Add function or other node to create SQL, put SQL into msg.payload
6. Link to "taos query" node

Full docker sample run this command
```
docker run -it -p 1880:1880 -v demo:/data --name mynodered nodered/node-red
```

