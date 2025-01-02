const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-TravelTimes helper started...");
    },

    fetchDirections: function(origin, destination, mode, name) {
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${this.config.apiKey}`;
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
                    const leg = data.routes[0].legs[0];
                    return {
                        name: name,
                        duration: leg.duration.text,
                        distance: leg.distance.text
                    };
                } else {
                    throw new Error(`No routes found for ${name}`);
                }
            });
    },

    socketNotificationReceived: function(notification, config) {
        if (notification === "FETCH_TRAVEL_TIMES") {
            this.config = config;

            const fetchPromises = config.locations.map(location =>
                this.fetchDirections(location.origin, location.destination, "driving", location.name)
            );

            Promise.all(fetchPromises)
                .then(results => {
                    const payload = {};
                    results.forEach(result => {
                        payload[result.name] = result;
                    });

                    this.sendSocketNotification("TRAVEL_TIMES_RESULT", payload);
                })
                .catch(error => {
                    console.error("Error fetching travel times:", error);
                });
        }
    }
});
