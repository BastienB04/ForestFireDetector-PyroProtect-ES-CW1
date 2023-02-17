# PyroProtect

Internet of Things (IoT) device network that generates a probability map for the location of a fire outbreak in a specific area.
We use a Raspberry PI Zero WH with a temperature sensor, gas sensor, wind sensor and a rain sensor to read mesurements and send them to a server, which processes the data and comes up with the probability map. The server also distributes HTML files and JavaScript code for the website.

## Raspberry PI

The code for the Raspberry PI is provided in the [Sensor](/Sensors/) folder.

## Server

### Frontend

The HTML and CSS files are located in the [server](/server/) folder, while the JavaScript code that these HTML files use are located in the [server/src](/server/src/) folder.
The server runs on the [index.js](/server/index.js) file and implements a simple API to get data to and from the server.

### API

The main functionalities are:
- GET /api/cachedData: requests latest data about the sensors
- GET /api/heatMap: requests data about the probability heat map to be displayed on the overlay of the Google maps API
- GET /api/initData: requests the data necessary to initialise the heat map grid
- GET /api/getSampleRate: requests the sample rate for the Raspberry PI
- POST /api/recData: posts the sensor readings to the server
- POST /api/EmailSubmission: adds new email to the email list
- POST /api/SampleRateChange: updates the sample rate for the Raspberry PI
- POST /api/ChangePosition: updates the position of a Raspberry PI


### Data Processing

The data processing part of the code is located in [server/processing](/server/processing/) folder, written in TypeScript, and compiled into the [server/include](/server/include/) folder.
This section is structured in the following:
- Station: the parent class, which stores essential information about server readings necessary for all fire indices.
- FWIStation: a child of the Station class which implements the Canadian FWI fire index.
- StationBuilder (reffered to as stationHQ): partly an implementation of the builder design pattern, but it mainly stores instances of station along with their id, positions on the grid and their radius (which is calculated from the fire index of instances of station).
- CircleFunctions: many mathematical functions which all help to transform the fire index into a 2d array of probabilities, which is then used to display the heat map.