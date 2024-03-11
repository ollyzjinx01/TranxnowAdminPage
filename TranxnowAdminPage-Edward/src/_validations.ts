import * as Yup from "yup";

export const createGroupingSchema = Yup.object().shape({
  groupname: Yup.string().required("Group name is required"),
  posCharges: Yup.number(),
  posChargesInPercentage: Yup.string(),
  posChargesCappedAt: Yup.number(),
  transferFeeInPercentage: Yup.string(),
  transferFeeCappedAt: Yup.number(),
  transferFee: Yup.number(),
  fundWalletFee: Yup.number(),
  fundWalletFeeInPercentage: Yup.boolean(),
  fundWalletFeeCappedAt: Yup.number(),
  mobileTransfer: Yup.string(),
});
