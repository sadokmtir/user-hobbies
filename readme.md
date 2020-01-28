# user-hobbies


**To run the app just type `npm i`and then `docker-compose up`**

The backend will run on: http://localhost:4000/. You can always change it
from the docker-compose file.

Some Notes:
* To make node start after mongo is up I used the `wait-for.sh` source: https://github.com/Eficode/wait-for
* I used mongo-express just to as a ui client for mongodb
* swagger is within this backend app, as there were no specification if I could 
just move it out, otherwise I would create a separate container for it
* Only unit tests delivered with this solution, if I would have more time I could add integration tests

**To sum up, a lot of things could be added as well to improve this solution, some of them like I mentioned already
in the notes with the code, I could also improve the application security, e.g. adding role based user for this app 
to access the mongo, not as root, (credentials not in plain like here), we could add https but I would say not here but in a front nginx server as a proxy.**


#### PS: Please at the end give some technical feedback to this solution, as I invested my private time on it, I would like to get valuable feedback for my code/solution, Thanks !                                