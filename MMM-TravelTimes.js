Module.register("MMM-TravelTimes", {
    defaults: {
        apiKey: "", //Required google maps API from Config
        locations: [], //Array of locations
        updateInterval: 10 * 60 * 1000 // Update every 10 minutes
    },

    start: function() {
        this.results = {};
        this.sendSocketNotification("FETCH_TRAVEL_TIMES", this.config);
        setInterval(() => {
            this.sendSocketNotification("FETCH_TRAVEL_TIMES", this.config);
        }, this.config.updateInterval);
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-TravelTimes";

        if (Object.keys(this.results).length === 0) {
            const loading = document.createElement("div");
            loading.textContent = "Loading travel times...";
            wrapper.appendChild(loading);
            return wrapper;
        }

        this.config.locations.forEach((location) => {
            const result = this.results[location.name];
            if (result) {
                const travelBox = this.createTravelBox(location.icon, result.duration, location.name, result.status);
                wrapper.appendChild(travelBox);
            }
        });

        return wrapper;
    },

    createTravelBox: function(iconClass, duration, label, status) {
        const box = document.createElement("div");
        box.className = `travel-box ${status}`;

        const icon = document.createElement("i");
        icon.className = `fa ${iconClass}`;
        box.appendChild(icon);

        const timeDiv = document.createElement("div");
        timeDiv.className = "commute-time";
        timeDiv.textContent = duration;
        box.appendChild(timeDiv);

        const labelDiv = document.createElement("div");
        labelDiv.className = "commute-label";
        labelDiv.textContent = label;
        box.appendChild(labelDiv);

        return box;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TRAVEL_TIMES_RESULT") {
            this.results = payload;
            this.updateDom();
        }
    }
});
