/**
 * Defined Global App Variable
 */

if (!window.App) window.App = App = {
    criteria: {
        query: {},
        sort: {},
        page: 1
    }
};


/**
 * Init ServantSDK
 */

$(document).ready(function() {

    Servant.initialize({
        application_client_id: '2zGFpD8pmKhj8TFn'
    }, function(status) {
        console.log("Servant SDK initialized with a status of: ", status);
        // Initialize app based on whether an AccessToken has been provided
        if (status === 'no_token') return App.initializeNoToken();
        if (status === 'has_token') return App.initializeHasToken();
    });

});


/**
 * Application Functions
 */
App.initializeNoToken = function() {
    console.log("Your applications has been initialized, but you do not have a Servant Access Token...");
    // Show connect button
    $('#connect-button-container').show();
};

App.initializeHasToken = function() {
    console.log("Your applications has been initialized, and you have a Servant Access Token...");
    // Change Greeting
    $('#greeting').text('Loading...');
    // Load user & user's servants
    App.loadUserAndServants(function() {
        // If user has no servants, warn them.
        if (!App.servants.length) alert('You must have at least one servant with data on it to use this application');
        // Set servant
        Servant.setServant(App.servants[0]);
        // Load User's Contacts
        App.loadContacts(function() {
            // Change Greeting
            $('#greeting').text('Here is a simple example of showing a contact on your servant...');
            // Show contacts
            $('#contacts-container').show();
            swipeContacts();
            // Render the first contact to the container
            return App.renderContact(App.contacts);

        });
    });
};

App.loadUserAndServants = function(callback) {
    Servant.getUserAndServants(function(response) {
        // Save data to global app variable
        App.user = response.user;
        App.servants = response.servants;
        // Callback
        if (callback) return callback();
    }, function(error) {
        console.log(error);
    });
};

App.loadContacts = function(callback) {
    // Fetch contacts
    Servant.queryArchetypes('contact', App.criteria, function(response) {
        // Save data to global app variable
        App.contacts = response.records;
        // Increment page number in our query criteria.  Next time we call the function, the next page will be fetched.
        App.criteria.page++;
        // Callback
        if (callback) return callback();
    }, function(error) {
        console.log(error);
    });
};

App.renderContact = function(contact) {
    // Create a string of the html
    for(i = 0; i < App.contacts.length; i++) {
        var html = '<div class="contact">';
        if (contact[i].images.length) html = html + '<img class="image" src="' + contact[i].images[0].resolution_medium + '">';
        html = html + '<p class="full-name">' + contact[i].full_name + '</p>';
        if (contact[i].email_addresses.length) html = html + '<p class="email">' + contact[i].email_addresses[0].email_address + '</p>';
        if (contact[i].phone_numbers.length) html = html + '<p class="phone-number">' + contact[i].phone_numbers[0].phone_number + '</p>';
        html = html + '</div>';
        // Append to contacts container
        $('.swipe-wrap').append(html);
    }
};


 //ALL JOE CODE HERE

 function swipeContacts (){

    var elem = document.getElementById('slider');
    window.slider = new Swipe(elem, {
        startSlide: 0,
        speed: 400,
        auto: 3000,
        draggable: true,
        continuous: true,
        disableScroll: true
    });
};


// End