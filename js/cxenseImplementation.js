// ADD AS JAVASCRIPT FILE

function cxense(configuration) {
    return this.init(configuration);
}

cxense.prototype = {

    configuration: {
        interestPersistedQueryId: '',
        interestCategories: [],
        interestsNumber: 1,
        minWeight: 0,
        dmpPersistedQueryId: 'b1ee6f2efe52cb046d7ae20682d3e216ddb950dc'
    },

    init: function(configuration) {
        $.extend(this.configuration, configuration);
        return this;
    },

    load: function() {
        function onCxReady() {

            if (typeof JSON == 'undefined') {
                window.console && console.log('JSON is not supported! Aborting..');
                return;
            }

            var
            // timeout
                cxProfileTimeout = cX.getCookie('cx_profile_timeout'),
            // profile data in cookie
                cookieStr = cX.getCookie('cx_profile_data'),
            // Timeout for user data: 5 minutes.
                cookieTimeout = 5 * 1000 * 60,
            // persisted query for getting user profile categories
                interestPersistedQueryId = cxProfileConfiguration.interestPersistedQueryId,
            // persisted query for getting dmp segments
                dmpPersistedQueryId = cxProfileConfiguration.dmpPersistedQueryId,
                cookieLiveTime = cxProfileTimeout ? Math.floor((new Date().getTime() - cxProfileTimeout) / 1000 / 60) : +cxProfileTimeout;

            window.console && console.log('Cookie life time: ' + cookieLiveTime + ' minutes');

            if (cookieStr && cookieStr != 'undefined' && cxProfileTimeout &&
                (new Date().getTime() - cxProfileTimeout < cookieTimeout) ) {
                window.console && console.log('found user data in cookie.');
                return;
            }

            if (interestPersistedQueryId) {
                window.console && console.log('Call cX API for user profile.');
                var url = 'https://api.cxense.com/persisted/execute'
                    + '?persisted=' + encodeURIComponent(interestPersistedQueryId)
                    + '&callback={{callback}}'
                    + '&json=' + encodeURIComponent(JSON.stringify( { id: cX.getUserId() } ));
                cX.jsonpRequest(url, onCxGotUserProfileData);
            } else if (dmpPersistedQueryId) {
                window.console && console.log('Call cX API for dmp segments.');
                cX.getUserSegmentIds( {
                    persistedQueryId: dmpPersistedQueryId,
                    callback: onCxGotDmpSegments
                } );
            } else {
                window.console && console.error('Missed configuration.');
                return ;
            }

            cX.setCookie('cx_profile_timeout', new Date().getTime(), cookieTimeout);
        }

        function onCxGotDmpSegments(segments) {

            if (!segments || !segments.length) {
                window.console && console.log('No DMP segments received!');
                return;
            }

            var
            // Object with data to be saved in cookie
                cookieObj = {},
            // JSON string with cookieObj
                cookieStr = '',
            // Timeout for user data: 5 minutes.
                cookieTimeout = 5 * 1000 * 60;


            cookieObj['CxenseSegments'] = segments;

            // get JSON string from the result
            cookieStr = JSON.stringify(cookieObj);
            // set a cookie
            cX.setCookie('cx_profile_data', cookieStr, cookieTimeout);
        }


        // This function gets the user profile when loaded:
        function onCxGotUserProfileData(data) {

            if (!data || !data.response || !data.response.profile || !data.response.profile.length) {
                window.console && console.log('No user profile received!');
                return;
            }

            var
            // set of user interests
                filteredCategories = {},
            // Object with data to be saved in cookie
                cookieObj = {},
            // JSON string with cookieObj
                cookieStr = '',
            // Timeout for user data: 5 minutes.
                cookieTimeout = 5 * 1000 * 60,
            // Interest category names
                interestCategories = cxProfileConfiguration.interestCategories,
            // Number of interests to send
                interestsNumber = +cxProfileConfiguration.interestsNumber,
            // Minimal item weight
                minWeight = +cxProfileConfiguration.minWeight,
            // intermediate variables
                profileNode, item, groupNode, groupName, weight;

            // filter categories
            for (var i=0; i<data.response.profile.length; i++) {
                profileNode = data.response.profile[i];
                item = profileNode.item;
                if ( item.indexOf('/') >= 0 ) {
                    // not top-level category
                    continue;
                }
                for (var j = 0; j < profileNode.groups.length; j++) {
                    groupNode = profileNode.groups[j];
                    groupName = groupNode.group;
                    weight = groupNode.weight;
                    for (var k in interestCategories) {
                        if (groupName == interestCategories[k]) {
                            if (!filteredCategories[groupName]) { filteredCategories[groupName] = [] }
                            filteredCategories[groupName].push( { name: item, weight: weight } );
                        }
                    }
                }
            }

            // check filtered categories and get items to send
            for (var categoryName in filteredCategories) {
                var items = filteredCategories[categoryName];
                // sort by weight asc
                items.sort(function(a,b){ return b.weight - a.weight });
                // check whether to send all categories
                if (interestsNumber === 0) {
                    interestsNumber = items.length;
                }
                cookieObj[categoryName] = [];
                // get items to be sent
                for (var i = 0; i < interestsNumber; i++) {
                    // check min weight
                    if (!items[i] || minWeight && Math.floor(items[i].weight*100) < minWeight) {
                        continue;
                    }
                    cookieObj[categoryName].push(items[i].name);
                }
            }

            // get JSON string from the result
            cookieStr = JSON.stringify(cookieObj);
            // set a cookie
            cX.setCookie('cx_profile_data', cookieStr, cookieTimeout);
        }

        var cX = cX || {}; cX.callQueue = cX.callQueue || [];
        cX.callQueue.push(['invoke', onCxReady]);
    }
};


// FRONTEND