import { RefundRule } from "./RefundRule";

export class NoRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return totalPrice
  }
}