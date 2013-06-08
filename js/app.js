// ImpactUI
//
// Copyright (c) 2013 All Right Reserved, Jordan Ranson - http://www.jordanranson.com/
//
// This source is subject to the GNU General Public License.
// Please see the License.txt file for more information.
// All other rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.



// Impact UI
function App() {
    var app = this;
    app.panel = new Panel();
    app.components = ko.observableArray();
    app.properties = ko.observableArray();
    app.zoom = ko.observable(2);
    
    
    
    // UI panel
    function Panel() {
        var self = this;
        self.id = 0;
        self.type = "panel";
        self.display = {};
        self.display.selected = ko.observable(false);
        
        self.name = ko.observable("UI Panel");
        self.width = ko.observable(512);
        self.height = ko.observable(374);
        self.z = ko.observable(0);
    }

    // Generic UI element
    function MComponent() {
        var self = this;
        self.id = 0;
        self.type = "none";

        self.display = {};
        self.display.selected = ko.observable(false);
        
        self.name = ko.observable("Component");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.anchor = ko.observable("center-center");
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
    }

    // Label
    function MLabel() {
        var self = this;
        self.id = 0;
        self.type = "label";
        
        self.display = {};
        self.display.selected = ko.observable(false);
        
        self.name = ko.observable("Label");
        self.text = ko.observable("Label");
        self.font = ko.observable("04b03");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.width = ko.observable(32);
        self.height = ko.observable(12);
        self.lineHeight = ko.observable(1.2);
        self.anchor = ko.observable("center-center");
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
    }

    // Button
    function MButton() {
        var self = this;
        self.id = 0;
        self.type = "button";
        
        self.display = {};
        self.display.selected = ko.observable(false);
        
        self.name = ko.observable("Button");
        self.text = ko.observable("Button");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.width = ko.observable(48);
        self.height = ko.observable(16);
        self.anchor = ko.observable("center-center");
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
    }

    // Image
    function MImage() {
        var self = this;
        self.id = 0;
        self.type = "image";
        
        self.display = {};
        self.display.selected = ko.observable(false);
        
        self.name = ko.observable("Image");
        self.src = ko.observable("");
        self.x = ko.observable(0);
        self.y = ko.observable(0);
        self.z = ko.observable(0);
        self.width = ko.observable(96);
        self.height = ko.observable(96);
        self.anchor = ko.observable("center-center");
        self.originX = ko.computed(function() {
            var anchor = self.anchor().split("-")[1];
            return app.drawOffset(anchor, 0, app.panel.width());
        });
        self.originY = ko.computed(function() {
            var anchor = self.anchor().split("-")[0];
            return app.drawOffset(anchor, 0, app.panel.height(), true);
        });
    }
    
    
    
    // Initialization
    app.init = function() {
        Mousetrap.bind("del",   app.removeComponent);
    };
    
    
    // Finds the draw offset for computed observables
    app.drawOffset = function(anchor, pos, panel, direction) {
        if(direction) {
            switch(anchor) {
                case "top":
                    return Number(pos);
                case "center":
                    return Number(pos) + Number(panel) * 0.5;
                case "bottom":
                    return Number(pos) + Number(panel);
            }
        } else {
            console.log(anchor);
            switch(anchor) {
                case "left":
                    return Number(pos);
                case "center":
                    return Number(pos) + Number(panel) * 0.5;
                case "right":
                    return Number(pos) + Number(panel);
            }
        }
    };
    
    
    // Displays a modal dialog
    app.showModal = function(selector) {
        $(".overlay").fadeIn();
        $(".modal").fadeOut();
        $(selector).fadeIn();
    };
    
    
    // Hides all modal dialogs
    app.hideModals = function() {
        $(".overlay").fadeOut();
        $(".modal").fadeOut();
    };
    
    
    // Creates a new component and adds it to the list
    app.createComponent = function(type) {
        var component;
        
        switch(type) {
            case "label": component = new MLabel(); break;
            case "button": component = new MButton(); break;
            case "image": component = new MImage(); break;
            default: component = new MComponent();
        }
        
        console.log(component);
        component.panel = app.panel;
        app.addComponent(component);
    };
    
    
    // Removes a component
    app.removeComponent = function() {
        app.components.remove(function(item) {
            return item.display.selected() === true;
        });
        app.properties.removeAll();
    };
    
    
    // Add a component
    app.addComponent = function(component) {
        app.components.push(component);
        app.bindjQuery();
        
        for(var i = 0; i < app.components().length; i++) {
            app.components()[i].display.selected(false)
        }
        app.panel.display.selected(false);
        component.display.selected(true);
        app.displayProperties(component);
    };
    
    
    // jQuery crap
    app.bindjQuery = function() {
        $(".component:not(.label)").resizable({
            grid: 4 * app.zoom(),
            resize: function() {
                $(this).css("line-height", $(this).height() + "px");
            }
        });
        $(".component.label").resizable({
            grid: 4 * app.zoom()
        });
        $(".component").draggable({ 
            containment: ".editor-content", 
            scroll: false,
            grid: [ 4 * app.zoom(), 4 * app.zoom() ]
        });
        $(".components-list").sortable({
            axis: "y",
            stop: function() {
                var len = $(".components-list").length;
                $(".components-list li").each(function(i) {
                    $(this).find("input").val(i);
                    $(this).find("input").trigger("change");
                });
            }
        });
        var len = $(".components-list").length;
        $(".components-list li").each(function(i) {
            $(this).find("input").val(i);
            $(this).find("input").trigger("change");
        });
    };
    
    
    // Displays a models properties in the side bar
    app.displayProperties = function(component) {
        var model = component === false ? app.panel : component;
        var properties = [];
        var row, type, value;
        
        for (var key in model) {
            if(key !== "id" && key !== "type" && key !== "display") {
                
                if(key === "z") 
                    type = "readonly";
                else if(key === "lineHeight") 
                    type = "lineHeight";
                else if(key === "x" || key === "y" || key === "z") 
                    type = "position";
                else if(key === "width" || key === "height") 
                    type = "size";
                else if(key === "anchor")
                    type = "anchor";
                else 
                    type = "string";
                
                row = { 
                    key: key, 
                    value: model[key],
                    type: type
                };
                properties.push(row);
            }
        }
        
        app.properties(properties);
        
        // Show selected component
        app.panel.display.selected(false);
        for(var i = 0; i < app.components().length; i++) {
            app.components()[i].display.selected(false);
        }
        model.display.selected(true);
    };
    
    
    app.init();
}


// On page ready
$(function() {
    var app = new App();
    ko.applyBindings(app);
    
    $(".panel")
    .draggable({ 
        scroll: false
    });
});