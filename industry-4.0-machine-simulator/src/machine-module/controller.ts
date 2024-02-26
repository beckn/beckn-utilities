import { Request, Response } from "express";
import _ from "lodash";
import { createOrderService, getOrderService } from "./service";
import { initiateMachineProcess } from "./utils";

export const confirmController = async (req: Request, res: Response) => {
  try {
    const confirmOrderResponse = await createOrderService(
      req?.body?.order_id,
      req?.body?.order_specification
    );

    if (!_.isEmpty(confirmOrderResponse) && confirmOrderResponse.order_id) {
      initiateMachineProcess(confirmOrderResponse?.order_id);
      return res.status(201).json({
        success: true,
        message: "Order Created",
        order_details: {
          order_id: confirmOrderResponse?.order_id,
          order_status: confirmOrderResponse?.status
        }
      });
    }
    return res.status(200).json({
      success: false,
      message: "Order Not Created"
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getController = async (req: Request, res: Response) => {
  try {
    const getOrderResponse = await getOrderService(req?.body?.order_id);
    return res.status(200).json({
      message: "Order Retrieved",
      data: getOrderResponse,
      success: true
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
