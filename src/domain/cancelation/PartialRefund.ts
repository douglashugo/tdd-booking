import { RefundRule } from "./RefundRule";

export class PartialRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return totalPrice *= 0.5
  }
}