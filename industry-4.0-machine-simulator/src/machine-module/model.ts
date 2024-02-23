import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
export const StatusChart = {
  1: "COMPONENT_INSPECTION",
  2: "PRE_ASSEMBLY_PREPARATION",
  3: "SUB_ASSEMBLY_STAGE_1",
  4: "SUB_ASSEMBLY_STAGE_2",
  5: "MAIN_ASSEMBLY",
  6: "QUALITY_CONTROL_CHECK_1",
  7: "INTEGRATION_OF_ELECTRONICS",
  8: "FINAL_ASSEMBLY",
  9: "QUALITY_CONTROL_CHECK_2",
  10: "PACKAGING_AND_SHIPPING_PREPARATION"
};
export enum StatusEnum {
  COMPONENT_INSPECTION = 1,
  PRE_ASSEMBLY_PREPARATION = 2,
  SUB_ASSEMBLY_STAGE_1 = 3,
  SUB_ASSEMBLY_STAGE_2 = 4,
  MAIN_ASSEMBLY = 5,
  QUALITY_CONTROL_CHECK_1 = 6,
  INTEGRATION_OF_ELECTRONICS = 7,
  FINAL_ASSEMBLY = 8,
  QUALITY_CONTROL_CHECK_2 = 9,
  PACKAGING_AND_SHIPPING_PREPARATION = 10
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
    default: StatusEnum.COMPONENT_INSPECTION
  }
};

const MachineOrderModel = model<IMachineOrder>(
  "machine_order",
  new Schema<IMachineOrder>(MachineOrderSchema)
);

export { IMachineOrder, MachineOrderModel };
