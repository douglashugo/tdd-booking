import { RefundRuleFactory } from "./RefundRuleFactory";
import { FullRefund } from "./FullRefund";
import { PartialRefund } from "./PartialRefund";
import { NoRefund } from "./NoRefund";

describe("RefundRuleFactory", () => {
  it("should return FullRefund when the booking is canceled with more than 7 days of advance", () => {
    const rule = RefundRuleFactory.getRefundRule(8);
    expect(rule).toBeInstanceOf(FullRefund);
  });

  it("should return PartialRefund when the booking is canceled between 1 and 7 days of advance", () => {
    const rule = RefundRuleFactory.getRefundRule(7);
    expect(rule).toBeInstanceOf(PartialRefund);
  });

  it("should return NoRefund when the booking is canceled with less than 1 day of advance", () => {
    const rule = RefundRuleFactory.getRefundRule(0);
    expect(rule).toBeInstanceOf(NoRefund);
  });
});
