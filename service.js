/* exported skip, enable, disable */

const { Gio, GLib, Shell } = imports.gi;
const ShellDBus = imports.ui.shellDBus;

const ExtensionUtils = imports.misc.extensionUtils;
const Tour = ExtensionUtils.getCurrentExtension();
const Utils = Tour.imports.utils;

const IFACE = Utils.loadInterfaceXML('com.endlessm.tour');

var Service = class {
    constructor() {
        this._skippable = true;
        this._dbusImpl = Gio.DBusExportedObject.wrapJSObject(IFACE, this);
        this._nameId = Gio.bus_own_name_on_connection(Gio.DBus.session, 'com.endlessm.tour',
            Gio.BusNameOwnerFlags.REPLACE, null, null);

        try {
            this._dbusImpl.export(Gio.DBus.session, '/com/endlessm/tour');
        } catch (e) {
            logError(e, 'Cannot export Tour service');
            return;
        }
    }

    stop() {
        try {
            this._dbusImpl.unexport();
        } catch (e) {
            logError(e, 'Cannot unexport Tour service');
        }

        if (this._nameId != 0) {
            Gio.bus_unown_name(this._nameId);
            this._nameId = 0;
        }
    }

    HighlightRect(x, y, width, height, text, nextButton) {
        // TODO
        // This should lock the interface until click on the rect or next button
        console.log(`Rect (${x}, ${y}) ${width}x${height}, ${text}, ${nextButton}`);
    }

    HighlightCircle(x, y, radius, text, nextButton) {
        // TODO
        console.log(`Circle (${x}, ${y}) o ${radius}, ${text}, ${nextButton}`);
    }

    skip() {
        this._dbusImpl.emit_property_changed('Skip', new GLib.Variant('b', true));
    }

    get Skippable() {
        return this._skippable;
    }

    set Skippable(enabled) {
        this._skippable = enabled;
        this._dbusImpl.emit_property_changed('Skippable', new GLib.Variant('b', enabled));
    }
};

var SHELL_DBUS_SERVICE = null;

function enable() {
    SHELL_DBUS_SERVICE = new Service();
}

function disable() {
    if (SHELL_DBUS_SERVICE) {
        SHELL_DBUS_SERVICE.stop();
        SHELL_DBUS_SERVICE = null;
    }
}

function skip() {
    if (SHELL_DBUS_SERVICE) {
        SHELL_DBUS_SERVICE.skip();
    }
}
