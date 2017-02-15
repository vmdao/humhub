/**
 * This module provides an api for handling content objects e.g. Posts, Polls...
 *
 * @type undefined|Function
 */

humhub.module('space', function (module, require, $) {
    var client = require('client');
    var additions = require('ui.additions');
    var event = require('event');
    var modal = require('modal');
    
    // Current space options (guid, image)
    var options;
    
    var isSpacePage = function() {
        return $('.space-layout-container').length > 0;
    };
    
    var setSpace = function(spaceOptions, pjax) {
        if(!module.options || module.options.guid !== spaceOptions.guid) {
            module.options = spaceOptions;
            if(pjax) {
                event.trigger('humhub:space:changed', $.extend({}, module.options));
            }
        }
    };
    
    var guid = function() {
        return (options) ? options.guid : null;
    };

    var enableModule = function (evt) {
        client.post(evt).then(function (response) {
            if (response.success) {
                additions.switchButtons(evt.$trigger, evt.$trigger.siblings('.disable'));
                evt.$trigger.siblings('.moduleConfigure').fadeIn('fast');
            }
        }).catch(function(err) {
            module.log.error(err, true);
        });
    };

    var disableModule = function (evt) {
        client.post(evt).then(function (response) {
            if (response.success) {
                additions.switchButtons(evt.$trigger, evt.$trigger.siblings('.enable'));
                evt.$trigger.siblings('.moduleConfigure').fadeOut('fast');
            }
        }).catch(function(err) {
            module.log.error(err, true);
        });
    };
    
    var archive = function(evt) {
        client.post(evt).then(function(response) {
            if(response.success) {
                additions.switchButtons(evt.$trigger, evt.$trigger.siblings('.unarchive'));
                module.log.success('success.archived');
                event.trigger('humhub:space:archived', response.space);
            }
        }).catch(function(err) {
            module.log.error(err, true);
        });
    };
    
    var unarchive = function(evt) {
        client.post(evt).then(function(response) {
            if(response.success) {
                additions.switchButtons(evt.$trigger, evt.$trigger.siblings('.archive'));
                module.log.success('success.unarchived');

                event.trigger('humhub:space:unarchived', response.space);
            }
        }).catch(function(err) {
            module.log.error(err, true);
        });
    };
    
    var init = function() {
        if(!module.isSpacePage()) {
            module.options = undefined;
        }
    };

    module.export({
        init: init,
        initOnPjaxLoad: true,
        guid: guid,
        archive : archive,
        unarchive : unarchive,
        isSpacePage: isSpacePage,
        setSpace: setSpace,
        enableModule: enableModule,
        disableModule: disableModule
    });
});