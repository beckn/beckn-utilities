import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
export const StatusChart = {
  1: "ASSEMBLY PROCESS STARTED",
  2: "PROCESS HAS STARTED FOR BOX NUMBER 1234",
  3: "PALET IS SUCCESSFULLY MOVED TO THE HANDLING PROCESS",
  4: "HANDLING PROCESS HAS STARTED",
  5: "HANDLING PROCESS HAS SUCCESSFULLY COMPLETED",
  6: "LID PRESSING PROCESS HAS STARTED",
  7: "LID PRESSING PROCESS HAS SUCCESSFULLY COMPLETED",
  8: "THE ASSEMBLED BOX IS SUCCESSFULLY STORED IN THE PALLET STORAGE",
  9: "CONTAINER IS SUCCESSFULLY ASSEMBLED",
  10: "THE ORDER IS SUCCESSFULLY COMPLETED",
};
export enum StatusEnum {
  ASSEMBLY_PROCESS_STARTED = 1,
  PROCESS_HAS_STARTED_FOR_BOX_NUMBER_1234 = 2,
  PALET_IS_SUCCESSFULLY_MOVED_TO_THE_HANDLING_PROCESS = 3,
  HANDLING_PROCESS_HAS_STARTED = 4,
  HANDLING_PROCESS_HAS_SUCCESSFULLY_COMPLETED = 5,
  LID_PRESSING_PROCESS_HAS_STARTED = 6,
  LID_PRESSING_PROCESS_HAS_SUCCESSFULLY_COMPLETED = 7,
  THE_ASSEMBLED_BOX_IS_SUCCESSFULLY_STORED_IN_THE_PALLET_STORAGE = 8,
  CONTAINER_IS_SUCCESSFULLY_ASSEMBLED = 9,
  THE_ORDER_IS_SUCCESSFULLY_COMPLETED = 10,
}

interface DocResult<T> {
  _doc: T;
}

interface IMachineOrder extends DocResult<IMachineOrder> {
  order_id: string;
  current_update: string;
  last_update: string;
  order_specification: any;
  status: StatusEnum;
}

const MachineOrderSchema = {
  order_id: { type: String, unique: true, required: true },
  current_update: { type: String, required: true, default: "" },
  last_update: { type: String, required: false, default: "" },
  order_specification: { type: Object, default: {} },
  status: {
    type: Number,
    enum: StatusEnum,
    default: StatusEnum.ASSEMBLY_PROCESS_STARTED,
  },
};

const MachineOrderModel = model<IMachineOrder>(
  "machine_order",
  new Schema<IMachineOrder>(MachineOrderSchema)
);

export { IMachineOrder, MachineOrderModel };
