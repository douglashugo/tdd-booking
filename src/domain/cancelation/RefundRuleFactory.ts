import { FullRefund } from "./FullRefund";
import { NoRefund } from "./NoRefund";
import { PartialRefund } from "./PartialRefund";
import { RefundRule } from "./RefundRule";

export class RefundRuleFactory {
  static getRefundRule(daysUntilCheckIn: number): RefundRule {
    if (daysUntilCheckIn > 7) {
      return new FullRefund()
    } else if (daysUntilCheckIn >= 1) {
      return new PartialRefund()
    }

    return new NoRefund()
  }
}