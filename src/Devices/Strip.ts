import Colors from "colors";

import { AreaDefinition, ZoneDefinition, ZoneStatus } from "@mkellsy/leap";

import { Device } from "../Device";
import { DeviceInterface } from "../Interfaces/DeviceInterface";
import { DeviceType } from "../Interfaces/DeviceType";
import { Processor } from "./Processor";

export class Strip extends Device implements DeviceInterface {
    private deviceDefinition: ZoneDefinition;

    constructor (processor: Processor, area: AreaDefinition, definition: ZoneDefinition) {
        super(DeviceType.Strip, processor, area, definition);

        this.deviceDefinition = definition;
        this.log.debug(`${this.area.Name} ${Colors.green("Strip")} ${this.name}`);
    }

    public get definition(): ZoneDefinition {
        return this.deviceDefinition;
    }

    public override updateStatus(status: ZoneStatus): void {
        this.deviceState = {
            state: status?.SwitchedLevel || status?.Level != null ? status.Level > 0 ? "On" : "Off" : "Unknown",
            availability: status?.Availability || "Unknown",
            level: status?.Level,
        }

        this.log.debug(`${this.area.Name} ${this.name} ${Colors.green(this.status.state)}`);
    }
}
