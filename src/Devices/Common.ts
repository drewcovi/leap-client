import * as Logger from "js-logger";

import { Action, Address, Area, Button, Capability, Device, DeviceState, DeviceType } from "@mkellsy/hap-device";

import Colors from "colors";

import { EventEmitter } from "@mkellsy/event-emitter";
import { Processor } from "./Processor/Processor";

/**
 * Defines common functionallity for a device.
 */
export abstract class Common<STATE extends DeviceState> extends EventEmitter<{
    Action: (device: Device, button: Button, action: Action) => void;
    Update: (device: Device, state: STATE) => void;
}> {
    protected processor: Processor;
    protected state: STATE;
    protected initialized: boolean = false;
    protected fields: Map<string, Capability> = new Map();

    private logger: Logger.ILogger;

    private deviceName: string;
    private deviceAddress: string;
    private deviceArea: Area;
    private deviceType: DeviceType;

    /**
     * Creates a base device object.
     *
     * ```
     * class Fan extends Common {
     *     constructor(id: string, connection: Connection, name: string) {
     *         super(DeviceType.Fan, connection, { id, name, "Fan" });
     *
     *         // Device specific code
     *     }
     * }
     * ```
     *
     * @param type The device type.
     * @param processor The current processor for this device.
     * @param area The area the device belongs to.
     * @param definition Device address definition.
     * @param state The device's initial state.
     */
    constructor(
        type: DeviceType,
        processor: Processor,
        area: Area,
        definition: { href: string; Name: string },
        state: STATE,
    ) {
        super();

        this.processor = processor;
        this.deviceAddress = definition.href;
        this.deviceName = definition.Name;
        this.deviceArea = area;
        this.deviceType = type;

        this.logger = Logger.get(`Device ${Colors.dim(this.id)}`);
        this.state = state;
    }

    /**
     * The device's manufacturer.
     *
     * @returns The manufacturer.
     */
    public get manufacturer(): string {
        return "Lutron Electronics Co., Inc";
    }

    /**
     * The device's unique identifier.
     *
     * @returns The device id.
     */
    public get id(): string {
        return `LEAP-${this.processor.id}-${DeviceType[this.deviceType].toUpperCase()}-${this.deviceAddress?.split("/")[2]}`;
    }

    /**
     * The device's configured name.
     *
     * @returns The device's configured name.
     */
    public get name(): string {
        return this.deviceName;
    }

    /**
     * The device's configured room.
     *
     * @returns The device's configured room.
     */
    public get room(): string {
        return this.area.Name;
    }

    /**
     * The devices capibilities. This is a map of the fields that can be set
     * or read.
     *
     * @returns The device's capabilities.
     */
    public get capabilities(): { [key: string]: Capability } {
        return Object.fromEntries(this.fields);
    }

    /**
     * A logger for the device. This will automatically print the devices name,
     * room and id.
     *
     * @returns A reference to the logger assigned to this device.
     */
    public get log(): Logger.ILogger {
        return this.logger;
    }

    /**
     * The href address of the device.
     *
     * @returns The device's href address.
     */
    public get address(): Address {
        return { href: this.deviceAddress };
    }

    /**
     * The device type.
     *
     * @returns The device type.
     */
    public get type(): DeviceType {
        return this.deviceType;
    }

    /**
     * The area the device is in.
     *
     * @returns The device's area.
     */
    public get area(): Area {
        return this.deviceArea;
    }

    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    public get status(): STATE {
        return this.state;
    }
}
