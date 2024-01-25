import Colors from "colors";

import { Address, Area } from "@mkellsy/leap";
import { EventEmitter } from "@mkellsy/event-emitter";

import { DeviceDefinition } from "./Interfaces/DeviceDefinition";
import { DeviceInterface } from "./Interfaces/DeviceInterface";
import { DeviceResponse } from "./Interfaces/DeviceResponse";
import { DeviceState } from "./Interfaces/DeviceState";
import { DeviceType } from "./Interfaces/DeviceType";
import { Log, Logger } from "./Logger";
import { Processor } from "./Devices/Processor";

export class Device extends EventEmitter<{
    Update: (response: DeviceResponse) => void;
}> implements DeviceInterface {
    protected processor: Processor;
    protected state: DeviceState;

    private logger: Log;
    private definition: DeviceDefinition;

    constructor(
        type: DeviceType,
        processor: Processor,
        area: Area,
        definition: { href: string; Name: string }
    ) {
        super();

        this.processor = processor;

        this.definition = {
            href: definition.href,
            name: definition.Name,
            area,
            type,
        };

        this.logger = Logger.get(`Device ${Colors.dim(this.id)}`);
        this.state = { state: "Unknown" };
    }

    public get id(): string {
        return `LEAP-${this.processor.id}-${DeviceType[this.definition.type].toUpperCase()}-${this.definition.href.split("/")[2]}`;
    }

    public get name(): string {
        return this.definition.name;
    }

    public get log(): Log {
        return this.logger;
    }

    public get address(): Address {
        return { href: this.definition.href };
    }

    public get type(): DeviceType {
        return this.definition.type;
    }

    public get area(): Area {
        return this.definition.area;
    }

    public get status(): DeviceState {
        return this.state;
    }

    public update(_status: unknown): void {
        this.state = { state: "Unknown" };
    }
}
