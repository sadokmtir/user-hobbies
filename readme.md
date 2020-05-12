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
