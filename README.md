Simple API-based datastore built on Node.js.

Deploy to Heroku
----------------

Set keys to .env:

	NNN=xyz

Set keys to Heroku dashboard app settings: https://dashboard.heroku.com/apps/

Run locally:

	heroku local

Deploy to Heroku:

	git push heroku master

Tail Heroku logs:

	heroku logs --tail

Call
----

Test sending JSON data with POST using Curl:

    curl -H "Content-Type: application/json" -X POST -d '{"key":"value","key2":"value2"}' 192.168.56.10:5000/post?apikey=YOUR-APIKEY

TODO
====

- Mongo indexing parameters?
- GET
- Async POST?
- Add bowerbird_time (unix time)
- Data security / input validation? (not needed because of trusted apikey users only?)


