var Command = require('./command');

module.exports = (function () {

    class DeviceInfo extends Command {

        constructor(req, res) {

            super(req, res);
            this.commandname = "DeviceInfo";
            this.createCommandType();
        }
        createCommandType() {

            this.cmdtype = {

                "RequestType": "DeviceInformation",
                "Queries": [
                    "AvailableDeviceCapacity",
                    "BluetoothMAC",
                    "BuildVersion",
                    "CarrierSettingsVersion",
                    "CurrentCarrierNetwork",
                    "CurrentMCC",
                    "CurrentMNC",
                    "DataRoamingEnabled",
                    "DeviceCapacity",
                    "DeviceName",
                    "ICCID",
                    "IMEI",
                    "IsRoaming",
                    "Model",
                    "ModelName",
                    "ModemFirmwareVersion",
                    "OSVersion",
                    "PhoneNumber",
                    "Product",
                    "ProductName",
                    "SIMCarrierNetwork",
                    "SIMMCC",
                    "SIMMNC",
                    "SerialNumber",
                    "UDID",
                    "WiFiMAC",
                    "UDID"
                ]
            };
        }

    }
    return DeviceInfo;
})();