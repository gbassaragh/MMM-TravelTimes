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
    box.style.display = "flex"; // Arrange elements in a row
    box.style.alignItems = "center"; // Center elements vertically
    box.style.marginBottom = "5px"; // Add spacing between rows

    const icon = document.createElement("i");
    icon.className = `fa ${iconClass}`;
    icon.style.marginRight = "10px"; // Space between icon and text
    box.appendChild(icon);

    const textDiv = document.createElement("div");
    textDiv.style.display = "flex";
    textDiv.style.flexDirection = "row"; // Align text side-by-side
    textDiv.style.justifyContent = "space-between"; // Space out text

    const timeSpan = document.createElement("span");
    timeSpan.className = "commute-time";
    timeSpan.textContent = duration;
    timeSpan.style.marginRight = "10px"; // Space between time and label
    textDiv.appendChild(timeSpan);

    const labelSpan = document.createElement("span");
    labelSpan.className = "commute-label";
    labelSpan.textContent = label;
    textDiv.appendChild(labelSpan);

    box.appendChild(textDiv);

    return box;
}


    socketNotificationReceived: function(notification, payload) {
        if (notification === "TRAVEL_TIMES_RESULT") {
            this.results = payload;
            this.updateDom();
        }
    }
});
