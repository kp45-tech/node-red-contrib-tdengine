Use Taos data restful API to commit SQL, API call like "curl -H 'Authorization: Basic <TOKEN>' -d '<SQL>' <ip>:<PORT>/rest/sql/[db_name]"

Input options:
* DB Server: Server config selector
* DB Name: Database to execute SQL
* SQL: SQL statement, SQL combine and process in pre-step

use node-fetch to call http request