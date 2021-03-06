/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var constants = require('ripple/constants'),
    event = require('ripple/event'),
    devices = require('ripple/devices'),
    ui = require('ripple/ui'),
    utils = require('ripple/utils'),
    isDialogVisible = false,
    visibleDialogArgs,
    _self;

function closeDialog() {
    var buttonsDiv = document.getElementById("dialog-buttons"),
        messageDiv = document.getElementById("dialog-message");

    ui.hideOverlay("dialog-window", function (dialog) {
        buttonsDiv.innerHTML = "";
        messageDiv.innerHTML = "";
        isDialogVisible = false;
    });
}

event.on("LayoutChanged", function () {
    if (isDialogVisible) {
        closeDialog();
        //Used to resize dialog on orientation change
        _self.ask(visibleDialogArgs);
    }
});

_self = {

    ask: function (args, post, baton) {
        if (!args) {
            throw ("No arguments provided");
        } else if (!args.buttons || !args.message) {
            throw ("Invalid arguments");
        }
        baton.take();
        visibleDialogArgs = args;

        ui.showOverlay("dialog-window", function (dialog) {
            var container = document.getElementById(constants.COMMON.VIEWPORT_CONTAINER),
                height = window.getComputedStyle(container, null).getPropertyValue("height"),
                width = window.getComputedStyle(container, null).getPropertyValue("width"),
                buttonsDiv = document.getElementById("dialog-buttons"),
                messageDiv = document.getElementById("dialog-message");

            if (!messageDiv || !buttonsDiv) {
                return;
            }

            dialog.setAttribute("style", "display:-webkit-box;height:" + height + "; width:" + width + ";");
            messageDiv.innerHTML = args.message;
            isDialogVisible = true;

            args.buttons.forEach(function (button) {
                var buttonElement = utils.createElement("input", {
                    "type": "button",
                    "value": button
                });
                buttonElement.addEventListener("click", function () {
                    var buttonIndex = args.buttons.indexOf(button);
                    closeDialog();
                    baton.pass({code: 1, data: buttonIndex});
                });
                buttonsDiv.appendChild(buttonElement);
            });
        }, true);
    }
};

module.exports = _self;
