"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./components/app.component");
var app_token_1 = require("./app.token");
var platform = null;
var promises = [];
var moduleClass = /** @class */ (function () {
    function DynamicModule() {
    }
    return DynamicModule;
}());
var componentClass = /** @class */ (function () {
    function DynamicComponent() {
    }
    return DynamicComponent;
}());

var getModule = function (declarations, entryComponents, bootstrap, data, moduleMetadata) {
    var moduleMeta = {
        declarations: [declarations[0]].concat((moduleMetadata.declarations || [])),
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule].concat((moduleMetadata.imports || [])),
        providers: [{ provide: app_token_1.STORY, useValue: __assign({}, data) }].concat((moduleMetadata.providers || [])),
        entryComponents: entryComponents.concat((moduleMetadata.entryComponents || [])),
        schemas: (moduleMetadata.schemas || []).slice(),
        bootstrap: bootstrap.slice(),
    };
    return core_1.NgModule(moduleMeta)(moduleClass);
};
var createComponentFromTemplate = function (template, styles) {
    return core_1.Component({
        template: template,
        styles: styles,
    })(componentClass);
};
var initModule = function (storyFn) {
    var storyObj = storyFn();
    var component = storyObj.component, template = storyObj.template, props = storyObj.props, styles = storyObj.styles, _a = storyObj.moduleMetadata, moduleMetadata = _a === void 0 ? {} : _a;
    var AnnotatedComponent = template ? createComponentFromTemplate(template, styles) : component;
    var story = {
        component: AnnotatedComponent,
        props: props,
    };
    return getModule([app_component_1.AppComponent, AnnotatedComponent], [AnnotatedComponent], [app_component_1.AppComponent], story, moduleMetadata);
};
var staticRoot = document.getElementById('root');
var insertDynamicRoot = function () {
    var app = document.createElement('storybook-dynamic-app-root');
    staticRoot.appendChild(app);
};
var draw = function (newModule) {
    if (!platform) {
        insertDynamicRoot();
        try {
            core_1.enableProdMode();
        }
        catch (e) { }
        platform = platform_browser_dynamic_1.platformBrowserDynamic();
        promises.push(platform.bootstrapModule(newModule));
    }
    else {
        Promise.all(promises).then(function (modules) {
            modules.forEach(function (mod) { return mod.destroy(); });
            insertDynamicRoot();
            promises = [];
            promises.push(platform.bootstrapModule(newModule));
        });
    }
};
exports.renderNgApp = function (storyFn) {
    draw(initModule(storyFn));
};
