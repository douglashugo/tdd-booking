import { RefundRule } from "./RefundRule";

export class FullRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return 0
  }
}